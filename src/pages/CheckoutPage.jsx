import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, LockKeyhole } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckoutField from "../components/checkout/CheckoutField";
import OrderSummary from "../components/checkout/OrderSummary";
import { createCheckoutOrder, getProductBySku, verifyCheckoutPayment } from "../serice/checkoutApi";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";

export default function CheckoutPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      paymentMethod: "ONLINE",
      fullName: "Anup",
      phone: "9999999999",
      addressLine1: "R7 Life Republic",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057"

    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout-product", sku],
    queryFn: () => getProductBySku(sku),
    enabled: Boolean(sku),
  });

  const product = data?.data

  const onSubmit = async (form) => {
    setSubmitting(true);
    setPageError("");
    try {
      const checkout = await createCheckoutOrder({
        sku,
        quantity: 1,
        paymentMethod: form.paymentMethod,
        customer: { name: form.fullName, phone: form.phone, email: form.email },
        shippingAddress: {
          fullName: form.fullName, phone: form.phone, addressLine1: form.addressLine1,
          addressLine2: form.addressLine2, landmark: form.landmark, city: form.city,
          state: form.state, pincode: form.pincode,
        },
        customerNotes: form.customerNotes,
      }, idempotencyKey);

      // if (!checkout.paymentRequired) {
      //   navigate(`/order-success/${checkout.orderNumber}?token=${checkout.publicAccessToken}`);
      //   return;
      // }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment window could not be loaded.");

      const razorpay = new window.Razorpay({
        key: checkout.razorpayKeyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Pratibha Silks",
        description: `Order ${checkout.orderNumber}`,
        order_id: checkout.razorpayOrderId,
        prefill: { name: checkout.customer.name, email: checkout.customer.email || "", contact: checkout.customer.phone },
        theme: { color: "#181818" },
        handler: async (payment) => {
          const verified = await verifyCheckoutPayment({
            internalOrderId: checkout.internalOrderId,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });
          navigate(`/order-success/${verified.orderNumber}?token=${verified.publicAccessToken}`);
        },
        modal: { ondismiss: () => setPageError("Payment was not completed. Your saree remains reserved for a few minutes.") },
      });
      razorpay.on("payment.failed", (response) => setPageError(response.error?.description || "Payment failed."));
      razorpay.open();
    } catch (err) {
      setPageError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <main className="min-h-screen bg-[#F8F3EC] px-5 py-16"><div className="mx-auto max-w-6xl animate-pulse rounded-[2rem] bg-white p-12">Loading checkout...</div></main>;
  if (error || !product) return <main className="min-h-screen bg-[#F8F3EC] px-5 py-16"><div className="mx-auto max-w-2xl luxury-card p-10 text-center"><h1 className="font-serif text-4xl">Saree unavailable</h1><p className="mt-3 text-[#6B5F54]">{error?.message || "This saree could not be loaded."}</p><Link to="/products" className="mt-6 inline-block rounded-full bg-[#181818] px-6 py-3 text-white">Browse sarees</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#F8F3EC] px-5 py-10 md:py-16">
      <section className="mx-auto max-w-7xl">
        <Link to={`/product/${product._id || product.id}`} className="inline-flex items-center gap-2 text-sm text-[#6B5F54]"><ArrowLeft size={16} /> Back to saree</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <form onSubmit={handleSubmit(onSubmit)} className="luxury-card p-6 md:p-9">
            <p className="luxury-eyebrow">Secure Checkout</p>
            <h1 className="mt-3 font-serif text-5xl md:text-6xl">Complete your order</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B5F54]">Enter your delivery details. Price and availability are revalidated securely by our server.</p>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              <CheckoutField
                label="Full Name"
                placeholder="Enter your full name"
                required
                error={errors.fullName?.message}
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
              <CheckoutField label="Mobile number" inputMode="numeric" error={errors.phone?.message} {...register("phone", { required: "Mobile is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid Indian mobile number" } })} />
              <CheckoutField label="Email (optional)" type="email" className="md:col-span-2" error={errors.email?.message} {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
              <CheckoutField label="Address line 1" className="md:col-span-2" error={errors.addressLine1?.message} {...register("addressLine1", { required: "Address is required" })} />
              <CheckoutField label="Address line 2" {...register("addressLine2")} />
              <CheckoutField label="Landmark" {...register("landmark")} />
              <CheckoutField label="PIN code" inputMode="numeric" error={errors.pincode?.message} {...register("pincode", { required: "PIN code is required", pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit PIN code" } })} />
              <CheckoutField label="City" error={errors.city?.message} {...register("city", { required: "City is required" })} />
              <CheckoutField label="State" className="md:col-span-2" error={errors.state?.message} {...register("state", { required: "State is required" })} />
              <CheckoutField label="Order note (optional)" as="textarea" rows={3} className="md:col-span-2" {...register("customerNotes")} />
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-[#9A7B4F]/20 bg-[#FFFDF9] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B5F54]">Payment method</p>
              <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-2xl border border-black/10 p-4">
                <input type="radio" value="ONLINE" {...register("paymentMethod")} />
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-white"><CreditCard size={18} /></span>
                <span><strong className="block text-sm">Pay securely online</strong><small className="text-[#6B5F54]">UPI, cards and supported payment options</small></span>
              </label>
            </div>

            {pageError && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{pageError}</div>}
            <button type="submit"
              // disabled={submitting || Number(product.stock) <= 0}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#181818] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5">
              <LockKeyhole size={17} /> {submitting ? "Preparing secure payment..." : Number(product.stock) > 0 ? "Proceed to secure payment" : "Sold out"}
            </button>
          </form>
          <OrderSummary product={product} shippingCharge={0} />
        </div>
      </section>
    </main>
  );
}
