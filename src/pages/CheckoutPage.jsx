import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CheckoutActions from "../components/checkout/CheckoutActions";
import CheckoutPaymentSection from "../components/checkout/CheckoutPaymentSection";
import DeliveryAddressSection from "../components/checkout/DeliveryAddressSection";
import OrderSummary from "../components/checkout/OrderSummary";
import { useCart } from "../components/Cart/cartContext";
import { useDeliveryAddressForm } from "../hooks/useDeliveryAddressForm";

import {
  cancelCheckoutOrder,
  createCheckoutOrder,
  getProductBySku,
  verifyCheckoutPayment,
} from "../serice/checkoutApi";

import { calculateShipping } from "../utils/shipping";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";

const cleanupRazorpayUi = () => {
  window.setTimeout(() => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.documentElement.style.overflow = "";

    document
      .querySelectorAll(".razorpay-container")
      .forEach((container) => container.remove());
  }, 300);
};

const ACTIVE_CHECKOUT_KEY = "ps_active_checkout";

const trimText = (value) => String(value || "").trim();

const hasPositiveAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
};

const validateCheckoutResponse = (checkout) => {
  if (!checkout) {
    throw new Error("Checkout details were not returned.");
  }

  if (checkout.paymentRequired === false) {
    if (!checkout.orderNumber || !checkout.publicAccessToken) {
      throw new Error("Invalid checkout details were returned.");
    }

    return;
  }

  if (
    checkout.paymentRequired !== true ||
    !checkout.internalOrderId ||
    !checkout.orderNumber ||
    !checkout.publicAccessToken ||
    !checkout.razorpayOrderId ||
    !checkout.razorpayKeyId ||
    !checkout.currency ||
    !hasPositiveAmount(checkout.amount)
  ) {
    throw new Error("Invalid payment details were returned.");
  }
};

const validateVerifiedPayment = (verified) => {
  if (!verified?.orderNumber || !verified?.publicAccessToken) {
    throw new Error(
      "Payment was received, but order confirmation details were not returned. Please contact us before retrying."
    );
  }
};

const readStoredCheckout = () => {
  try {
    const stored = sessionStorage.getItem(ACTIVE_CHECKOUT_KEY);
    if (!stored) return null;

    const checkout = JSON.parse(stored);
    validateCheckoutResponse(checkout);

    if (
      checkout.reservationExpiresAt &&
      new Date(checkout.reservationExpiresAt).getTime() <= Date.now()
    ) {
      sessionStorage.removeItem(ACTIVE_CHECKOUT_KEY);
      return null;
    }

    return checkout.paymentRequired === true ? checkout : null;
  } catch {
    sessionStorage.removeItem(ACTIVE_CHECKOUT_KEY);
    return null;
  }
};

const storeActiveCheckout = (checkout) => {
  try {
    sessionStorage.setItem(ACTIVE_CHECKOUT_KEY, JSON.stringify(checkout));
  } catch {
    // Best-effort only; retry still works during the current page session.
  }
};

const clearStoredCheckout = () => {
  sessionStorage.removeItem(ACTIVE_CHECKOUT_KEY);
};

export default function CheckoutPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { publicCartItems, clearPublicCart, removeFromPublicCart } = useCart();
  const isCartCheckout = !sku;

  const [submitting, setSubmitting] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  const [cancellingReservation, setCancellingReservation] = useState(false);
  const [activeCheckout, setActiveCheckout] = useState(() => readStoredCheckout());
  const [pageError, setPageError] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID()
  );
  const submitInFlightRef = useRef(false);
  const paymentFailureMessageRef = useRef("");

  const addressForm = useDeliveryAddressForm();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkout-product", sku],
    queryFn: () => getProductBySku(sku),
    enabled: Boolean(sku),
  });

  const product = data?.data;
  const cartSkus = useMemo(
    () =>
      publicCartItems
        .map((cartProduct) => cartProduct?.sku)
        .filter(Boolean),
    [publicCartItems]
  );

  const {
    data: refreshedCartProducts = [],
    isLoading: isLoadingCartProducts,
    error: cartProductsError,
  } = useQuery({
    queryKey: ["checkout-cart-products", cartSkus],
    queryFn: async () => {
      const responses = await Promise.all(
        cartSkus.map((itemSku) => getProductBySku(itemSku))
      );
      const failedResponse = responses.find((response) => response?.error);

      if (failedResponse) {
        throw new Error(
          failedResponse.error.message ||
          "One or more cart products are unavailable."
        );
      }

      return responses
        .map((response) => response?.data)
        .filter(Boolean);
    },
    enabled: isCartCheckout && cartSkus.length > 0,
  });

  const checkoutProducts = useMemo(() => {
    if (sku) return product ? [product] : [];

    return refreshedCartProducts.length ? refreshedCartProducts : publicCartItems;
  }, [publicCartItems, product, refreshedCartProducts, sku]);

  const quantity = Math.max(1, checkoutProducts.length);
  const checkoutSkus = useMemo(
    () =>
      checkoutProducts
        .map((checkoutProduct) => checkoutProduct?.sku)
        .filter(Boolean),
    [checkoutProducts]
  );

  const shippingDetails = useMemo(
    () =>
      calculateShipping({
        product: checkoutProducts[0],
        products: checkoutProducts,
        state: addressForm.state,
        pincode: addressForm.normalizedPincode,
      }),
    [checkoutProducts, addressForm.state, addressForm.normalizedPincode]
  );

  const openRazorpay = async (checkout) => {
    paymentFailureMessageRef.current = "";

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
          setIsConfirmingPayment(true);

          paymentFailureMessageRef.current = "";

          const verified = await verifyCheckoutPayment({
            internalOrderId: checkout.internalOrderId,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });
          validateVerifiedPayment(verified);

          setActiveCheckout(null);
          clearStoredCheckout();

          if (isCartCheckout) {
            clearPublicCart();
          }

          sessionStorage.removeItem("ps_checkout_address_draft");

          // navigate(
          //   `/order-success/${verified.orderNumber}#token=${encodeURIComponent(verified.publicAccessToken)}`
          // );
          // This forces a clean page load, which matches the behavior you already confirmed works after manually refreshing.
          window.location.href = `/order-success/${verified.orderNumber}#token=${encodeURIComponent(verified.publicAccessToken)}`;
        } catch (verificationError) {
          cleanupRazorpayUi();
          setPageError(
            verificationError?.message ||
            "Payment was received, but verification failed. Please contact us before retrying."
          );
        } finally {
          setSubmitting(false);
          setIsConfirmingPayment(false)
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          // cleanupRazorpayUi();
          setPageError(
            paymentFailureMessageRef.current ||
            "Payment was not completed. This saree is reserved for you for a few minutes. You can retry the same payment or cancel the reservation."
          );
        },
      },
    });

    razorpay.on("payment.failed", (response) => {
      const failureMessage =
        response.error?.description ||
        "Payment failed. You can retry while the saree remains reserved.";

      paymentFailureMessageRef.current = failureMessage;
      setSubmitting(false);
      // cleanupRazorpayUi();
      setPageError(failureMessage);
    });

    razorpay.open();
  };

  const onSubmit = async (form) => {
    if (submitInFlightRef.current) return;

    submitInFlightRef.current = true;
    setPageError("");

    if (!addressForm.validateDeliveryAddress()) {
      submitInFlightRef.current = false;
      return;
    }

    setSubmitting(true);

    try {
      if (activeCheckout) {
        await openRazorpay(activeCheckout);
        return;
      }

      const checkoutItems = checkoutSkus.map((itemSku) => ({
        sku: itemSku,
        quantity: 1,
      }));

      const checkoutPayload = {
        paymentMethod: "ONLINE",
        customer: {
          name: trimText(form.fullName),
          phone: trimText(form.phone),
          email: trimText(form.email),
        },
        shippingAddress: {
          fullName: trimText(form.fullName),
          phone: trimText(form.phone),
          addressLine1: trimText(form.addressLine1),
          addressLine2: trimText(form.addressLine2),
          landmark: trimText(form.landmark),
          city: trimText(form.city),
          state: trimText(form.state),
          pincode: trimText(form.pincode),
          addressSource: addressForm.manualAddressMode ? "MANUAL" : "PINCODE_API",
        },
        customerNotes: trimText(form.customerNotes),
      };

      if (isCartCheckout && checkoutItems.length > 1) {
        checkoutPayload.items = checkoutItems;
        checkoutPayload.orderType = "CART";
      } else {
        checkoutPayload.sku = checkoutSkus[0];
        checkoutPayload.quantity = 1;
        checkoutPayload.orderType = isCartCheckout ? "CART" : "BUY_NOW";
      }

      const checkout = await createCheckoutOrder(
        checkoutPayload,
        idempotencyKey
      );

      try {
        validateCheckoutResponse(checkout);
      } catch (validationError) {
        setIdempotencyKey(crypto.randomUUID());
        throw validationError;
      }
      if (checkout.paymentRequired === false) {
        if (isCartCheckout) {
          clearPublicCart();
        }

        sessionStorage.removeItem("ps_checkout_address_draft");
        clearStoredCheckout();

        navigate(
          `/order-success/${checkout.orderNumber}#token=${encodeURIComponent(checkout.publicAccessToken)}`
        );
        return;
      }

      setActiveCheckout(checkout);
      storeActiveCheckout(checkout);
      await openRazorpay(checkout);
    } catch (err) {
      setPageError(err?.message || "Something went wrong.");
      setIdempotencyKey(crypto.randomUUID());
    } finally {
      submitInFlightRef.current = false;
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
      clearStoredCheckout();
      setIdempotencyKey(crypto.randomUUID());

      if (sku) {
        await queryClient.invalidateQueries({
          queryKey: ["checkout-product", sku],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["checkout-cart-products"],
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

  const productIsSold = checkoutProducts.some(
    (checkoutProduct) =>
      Number(checkoutProduct?.stock) <= 0 &&
      Number(checkoutProduct?.reservedStock || 0) <= 0 &&
      Boolean(checkoutProduct?.soldOrder)
  );

  const productIsReserved = checkoutProducts.some(
    (checkoutProduct) =>
      Number(checkoutProduct?.stock) <= 0 &&
      Number(checkoutProduct?.reservedStock || 0) > 0 &&
      !checkoutProduct?.soldOrder
  );

  const unavailableToCurrentCustomer =
    !activeCheckout &&
    (checkoutProducts.length === 0 || productIsSold || productIsReserved);

  if (isLoading || isLoadingCartProducts) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] px-5 py-16">
        <div className="mx-auto max-w-6xl animate-pulse rounded-[2rem] bg-white p-12">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (
    error ||
    cartProductsError ||
    (!isCartCheckout && !product) ||
    (isCartCheckout && publicCartItems.length === 0)
  ) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] px-5 py-16">
        <div className="luxury-card mx-auto max-w-2xl p-10 text-center">
          <h1 className="font-serif text-4xl">
            {isCartCheckout
              ? cartProductsError
                ? "Cart item unavailable"
                : "Your cart is empty"
              : "Saree unavailable"}
          </h1>
          <p className="mt-3 text-[#6B5F54]">
            {isCartCheckout
              ? cartProductsError?.message ||
              "Add sarees to your cart before starting checkout."
              : error?.message ||
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

  const OrderConfirmationLoader = <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95">
    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#093C5D]" />

      <h2 className="text-lg font-semibold text-gray-900">
        Confirming your order
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Your payment was successful. Please do not close or refresh this page.
      </p>
    </div>
  </div>

  return (
    <main className="min-h-screen bg-[#F8F3EC] px-5 py-10 md:py-16">
      {isConfirmingPayment && OrderConfirmationLoader}
      <section className="mx-auto max-w-7xl">
        <Link
          to={isCartCheckout ? "/products" : `/product/${product.sku}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B5F54]"
        >
          <ArrowLeft size={16} />
          {isCartCheckout ? "Continue shopping" : "Back to saree"}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <form
            autoComplete="on"
            onSubmit={addressForm.handleSubmit(onSubmit)}
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
              register={addressForm.register}
              errors={addressForm.formState.errors}
              normalizedPincode={addressForm.normalizedPincode}
              postOffices={addressForm.postOffices}
              selectedLocality={addressForm.selectedLocality}
              showLocalities={addressForm.showLocalities}
              isLookingUpPincode={addressForm.isLookingUpPincode}
              pincodeLookupError={addressForm.pincodeLookupError}
              manualAddressMode={addressForm.manualAddressMode}
              onPincodeChange={addressForm.onPincodeChange}
              onToggleLocalities={addressForm.onToggleLocalities}
              onSelectLocality={addressForm.onSelectLocality}
              onUseManualAddress={addressForm.onUseManualAddress}
            />

            <CheckoutPaymentSection register={addressForm.register} />

            {pageError && (
              <div
                className={`mt-5 rounded-2xl p-4 text-sm ${activeCheckout
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
              isLookingUpPincode={addressForm.isLookingUpPincode}
              productIsSold={productIsSold}
              productIsReserved={productIsReserved}
              onRetryPayment={handleRetryPayment}
              onCancelReservation={handleCancelReservation}
            />
          </form>

          <OrderSummary
            product={checkoutProducts[0]}
            products={checkoutProducts}
            quantity={quantity}
            pincode={addressForm.normalizedPincode}
            shippingLocation={addressForm.shippingLocation}
            shippingCharge={shippingDetails.shippingCharge}
            baseShippingCharge={shippingDetails.baseCharge}
            isFreeShipping={shippingDetails.isFreeShipping}
            isShippingLoading={addressForm.isLookingUpPincode}
            canCalculateShipping={shippingDetails.canCalculate}
            onRemoveProduct={isCartCheckout ? removeFromPublicCart : undefined}
          />
        </div>
      </section>
    </main>
  );
}
