import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import CheckoutActions from "../components/checkout/CheckoutActions";
import CheckoutPaymentSection from "../components/checkout/CheckoutPaymentSection";
import DeliveryAddressSection from "../components/checkout/DeliveryAddressSection";
import OrderSummary from "../components/checkout/OrderSummary";

import {
  cancelCheckoutOrder,
  createCheckoutOrder,
  getProductBySku,
  verifyCheckoutPayment,
} from "../serice/checkoutApi";

import { calculateShipping } from "../utils/shipping";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";

const lookupPincode = async (pincode) => {
  const response = await fetch(
    `https://api.postalpincode.in/pincode/${encodeURIComponent(pincode)}`
  );

  if (!response.ok) {
    throw new Error("PIN code lookup is currently unavailable.");
  }

  const result = await response.json();
  const lookupResult = result?.[0];

  if (
    lookupResult?.Status !== "Success" ||
    !Array.isArray(lookupResult?.PostOffice) ||
    lookupResult.PostOffice.length === 0
  ) {
    throw new Error("No delivery location found for this PIN code.");
  }

  return lookupResult.PostOffice;
};

export default function CheckoutPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const quantity = 1;

  const [submitting, setSubmitting] = useState(false);
  const [cancellingReservation, setCancellingReservation] = useState(false);
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [pageError, setPageError] = useState("");
  const [showLocalities, setShowLocalities] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [manualAddressMode, setManualAddressMode] = useState(false);

  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "ONLINE",
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
      customerNotes: "",
    },
  });

  const pincode = watch("pincode");
  const city = watch("city");
  const state = watch("state");

  const normalizedPincode = String(pincode || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkout-product", sku],
    queryFn: () => getProductBySku(sku),
    enabled: Boolean(sku),
  });

  const {
    data: postOffices = [],
    isFetching: isLookingUpPincode,
    error: pincodeLookupError,
  } = useQuery({
    queryKey: ["pincode-lookup", normalizedPincode],
    queryFn: () => lookupPincode(normalizedPincode),
    enabled: normalizedPincode.length === 6,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const product = data?.data;

  useEffect(() => {
    if (
      normalizedPincode.length === 6 &&
      pincodeLookupError
    ) {
      setManualAddressMode(true);
      setShowLocalities(false);
      setSelectedLocality(null);
    }
  }, [normalizedPincode, pincodeLookupError]);

  const shippingDetails = useMemo(
    () =>
      calculateShipping({
        product,
        quantity,
        state,
        pincode: normalizedPincode,
      }),
    [product, quantity, state, normalizedPincode]
  );

  const shippingLocation = [city, state].filter(Boolean).join(", ");

  const applyLocation = (location) => {
    if (!location) return;

    const locality =
      location.Name ||
      location.Block ||
      location.Division ||
      "";

    const detectedCity =
      location.District ||
      location.Division ||
      location.Region ||
      "";

    setSelectedLocality(location);
    setManualAddressMode(false);

    setValue("addressLine2", locality, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("city", detectedCity, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("state", location.State || "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors(["pincode", "addressLine2", "city", "state"]);
    setShowLocalities(false);
  };

  const handlePincodeChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setValue("pincode", value, {
      shouldDirty: true,
      shouldValidate: value.length === 6,
    });

    setSelectedLocality(null);
    setManualAddressMode(false);
    setShowLocalities(value.length === 6);

    setValue("addressLine2", "", { shouldDirty: true });
    setValue("city", "", { shouldDirty: true });
    setValue("state", "", { shouldDirty: true });

    if (value.length < 6) {
      clearErrors("pincode");
    }
  };

  const enableManualAddress = () => {
    setManualAddressMode(true);
    setSelectedLocality(null);
    setShowLocalities(false);

    clearErrors(["addressLine2", "city", "state"]);
  };

  const validateDeliveryAddress = () => {
    if (normalizedPincode.length !== 6) {
      setError("pincode", {
        type: "validate",
        message: "Enter a valid 6-digit PIN code.",
      });
      return false;
    }

    /*
     * When the PIN API succeeds, the user should either select a returned
     * locality or explicitly switch to manual entry.
     *
     * When the API fails, manualAddressMode is enabled automatically,
     * so city/state/locality validation is handled by react-hook-form.
     */
    if (
      !manualAddressMode &&
      !pincodeLookupError &&
      postOffices.length > 0 &&
      !selectedLocality
    ) {
      setError("pincode", {
        type: "validate",
        message: "Select a locality or choose manual address entry.",
      });
      setShowLocalities(true);
      return false;
    }

    return true;
  };

  const openRazorpay = async (checkout) => {
    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      throw new Error("Payment window could not be loaded.");
    }

    const razorpay = new window.Razorpay({
      key: checkout.razorpayKeyId,
      amount: checkout.amount,
      currency: checkout.currency,
      name: "Pratibha Silks",
      description: `Order ${checkout.orderNumber}`,
      order_id: checkout.razorpayOrderId,
      prefill: {
        name: checkout.customer?.name || "",
        email: checkout.customer?.email || "",
        contact: checkout.customer?.phone || "",
      },
      theme: {
        color: "#181818",
      },
      handler: async (payment) => {
        try {
          setSubmitting(true);
          setPageError("");

          const verified = await verifyCheckoutPayment({
            internalOrderId: checkout.internalOrderId,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });

          setActiveCheckout(null);

          navigate(
            `/order-success/${verified.orderNumber}?token=${verified.publicAccessToken}`
          );
        } catch (verificationError) {
          setPageError(
            verificationError?.message ||
              "Payment was received, but verification failed. Please contact us before retrying."
          );
        } finally {
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setPageError(
            "Payment was not completed. This saree is reserved for you for a few minutes. You can retry the same payment or cancel the reservation."
          );
        },
      },
    });

    razorpay.on("payment.failed", (response) => {
      setSubmitting(false);
      setPageError(
        response.error?.description ||
          "Payment failed. You can retry while the saree remains reserved."
      );
    });

    razorpay.open();
  };

  const onSubmit = async (form) => {
    setPageError("");

    if (!validateDeliveryAddress()) return;

    setSubmitting(true);

    try {
      if (activeCheckout) {
        await openRazorpay(activeCheckout);
        return;
      }

      const checkout = await createCheckoutOrder(
        {
          sku,
          quantity,
          paymentMethod: form.paymentMethod,
          customer: {
            name: form.fullName,
            phone: form.phone,
            email: form.email,
          },
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            addressSource: manualAddressMode ? "MANUAL" : "PINCODE_API",
          },
          customerNotes: form.customerNotes,
        },
        idempotencyKey
      );

      if (!checkout) {
        throw new Error("Checkout details were not returned.");
      }

      if (checkout.paymentRequired === false) {
        navigate(
          `/order-success/${checkout.orderNumber}?token=${checkout.publicAccessToken}`
        );
        return;
      }

      if (
        checkout.paymentRequired !== true ||
        !checkout.internalOrderId ||
        !checkout.razorpayOrderId
      ) {
        throw new Error("Invalid payment details were returned.");
      }

      setActiveCheckout(checkout);
      await openRazorpay(checkout);
    } catch (err) {
      setPageError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!activeCheckout) return;

    setSubmitting(true);
    setPageError("");

    try {
      await openRazorpay(activeCheckout);
    } catch (error) {
      setPageError(
        error?.message || "Unable to reopen the payment window."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!activeCheckout) return;

    setCancellingReservation(true);
    setPageError("");

    try {
      await cancelCheckoutOrder({
        internalOrderId: activeCheckout.internalOrderId,
        publicAccessToken: activeCheckout.publicAccessToken,
      });

      setActiveCheckout(null);

      await queryClient.invalidateQueries({
        queryKey: ["checkout-product", sku],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setPageError(
        "Reservation cancelled. The saree is available again."
      );
    } catch (error) {
      setPageError(
        error?.message ||
          "Unable to cancel the reservation. It will be released automatically after expiry."
      );
    } finally {
      setCancellingReservation(false);
    }
  };

  const productIsSold =
    Number(product?.stock) <= 0 &&
    Number(product?.reservedStock || 0) <= 0 &&
    Boolean(product?.soldOrder);

  const productIsReserved =
    Number(product?.stock) <= 0 &&
    Number(product?.reservedStock || 0) > 0 &&
    !product?.soldOrder;

  const unavailableToCurrentCustomer =
    !activeCheckout && (productIsSold || productIsReserved);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] px-5 py-16">
        <div className="mx-auto max-w-6xl animate-pulse rounded-[2rem] bg-white p-12">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] px-5 py-16">
        <div className="luxury-card mx-auto max-w-2xl p-10 text-center">
          <h1 className="font-serif text-4xl">Saree unavailable</h1>
          <p className="mt-3 text-[#6B5F54]">
            {error?.message ||
              "This product is currently unavailable. Please explore our available saree collection."}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-[#181818] px-6 py-3 text-white"
          >
            View Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F3EC] px-5 py-10 md:py-16">
      <section className="mx-auto max-w-7xl">
        <Link
          to={`/product/${product.sku}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B5F54]"
        >
          <ArrowLeft size={16} />
          Back to saree
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <form
            autoComplete="on"
            onSubmit={handleSubmit(onSubmit)}
            className="luxury-card p-6 md:p-9"
          >
            <p className="luxury-eyebrow">Secure Checkout</p>
            <h1 className="mt-3 font-serif text-5xl md:text-6xl">
              Complete your order
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B5F54]">
              Enter your delivery details. Price, shipping and availability
              are revalidated securely before payment.
            </p>

            <DeliveryAddressSection
              register={register}
              errors={errors}
              normalizedPincode={normalizedPincode}
              postOffices={postOffices}
              selectedLocality={selectedLocality}
              showLocalities={showLocalities}
              isLookingUpPincode={isLookingUpPincode}
              pincodeLookupError={pincodeLookupError}
              manualAddressMode={manualAddressMode}
              onPincodeChange={handlePincodeChange}
              onToggleLocalities={() =>
                setShowLocalities((current) => !current)
              }
              onSelectLocality={applyLocation}
              onUseManualAddress={enableManualAddress}
            />

            <CheckoutPaymentSection register={register} />

            {pageError && (
              <div
                className={`mt-5 rounded-2xl p-4 text-sm ${
                  activeCheckout
                    ? "bg-amber-50 text-amber-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {pageError}
              </div>
            )}

            <CheckoutActions
              activeCheckout={activeCheckout}
              submitting={submitting}
              cancellingReservation={cancellingReservation}
              unavailableToCurrentCustomer={unavailableToCurrentCustomer}
              isLookingUpPincode={isLookingUpPincode}
              productIsSold={productIsSold}
              productIsReserved={productIsReserved}
              onRetryPayment={handleRetryPayment}
              onCancelReservation={handleCancelReservation}
            />
          </form>

          <OrderSummary
            product={product}
            quantity={quantity}
            pincode={normalizedPincode}
            shippingLocation={shippingLocation}
            shippingCharge={shippingDetails.shippingCharge}
            baseShippingCharge={shippingDetails.baseCharge}
            isFreeShipping={shippingDetails.isFreeShipping}
            isShippingLoading={isLookingUpPincode}
            canCalculateShipping={shippingDetails.canCalculate}
          />
        </div>
      </section>
    </main>
  );
}
