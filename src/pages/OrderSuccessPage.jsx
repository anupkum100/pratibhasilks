import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3, Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getImageFromId } from "../data/util";
import { getPublicOrder } from "../serice/checkoutApi";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatText = (value) => {
  if (!value) return "Not available";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

function StatusBadge({ children, type = "success" }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    neutral: "border-stone-200 bg-stone-50 text-stone-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles[type]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7B4F]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A18A72]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-[#302A25]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-order", orderNumber, token],
    queryFn: () => getPublicOrder(orderNumber, token),
    enabled: Boolean(orderNumber && token),
    retry: 1,
  });

  const order = data?.order;

  const customer = order?.customer || order?.buyer || {};
  const shippingAddress = order?.shippingAddress || {};
  const items = order?.items || [];

  const subtotal =
    order?.subtotal ??
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.totalPrice ??
          item.soldPrice * (item.quantity || 1) ??
          item.price * (item.quantity || 1) ??
          0
        ),
      0
    );

  const discount = Number(order?.discountAmount || order?.discount || 0);
  const shippingCharge = Number(
    order?.shippingAmount || order?.shippingCharge || 0
  );

  const totalAmount = Number(
    order?.totalAmount ??
    order?.totalSoldPrice ??
    subtotal - discount + shippingCharge
  );

  if (!orderNumber || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F3EC] px-5 py-16">
        <section className="w-full max-w-xl rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-[0_25px_80px_rgba(38,27,18,0.12)]">
          <ReceiptText className="mx-auto text-[#9A7B4F]" size={46} />

          <h1 className="mt-5 font-serif text-3xl text-[#241F1B]">
            Invalid order link
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71665C]">
            The order number or secure access token is missing from this link.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#181818] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Continue shopping
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F3EC] px-4 py-8 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D8B46A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#093C5D]/10 blur-3xl" />

      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_35px_100px_rgba(51,37,26,0.15)] sm:rounded-[2.5rem]">
        <header className="relative overflow-hidden bg-[#171411] px-6 py-10 text-center text-white sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,180,106,0.18),transparent_48%)]" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D8B46A]/40 bg-[#D8B46A]/10 shadow-[0_0_50px_rgba(216,180,106,0.15)]">
              <CheckCircle2 className="text-[#E3C37F]" size={44} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[#D8B46A]">
              <Sparkles size={14} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em]">
                Pratibha Silks
              </p>
              <Sparkles size={14} />
            </div>

            <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">
              Your order is confirmed
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Thank you for shopping with us. Your saree has been reserved and
              our team will prepare it carefully for dispatch.
            </p>

            {order && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <StatusBadge>
                  {formatText(order.orderStatus || "Confirmed")}
                </StatusBadge>

                <StatusBadge
                  type={
                    String(order.paymentStatus).toLowerCase() === "paid"
                      ? "success"
                      : "warning"
                  }
                >
                  {formatText(order.paymentStatus || "Received")}
                </StatusBadge>
              </div>
            )}
          </div>
        </header>

        <div className="p-5 sm:p-8 md:p-10">
          {isLoading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E6D7C4] border-t-[#9A7B4F]" />

              <h2 className="mt-5 font-serif text-2xl text-[#302A25]">
                Confirming your order
              </h2>

              <p className="mt-2 text-sm text-[#71665C]">
                Please do not refresh or close this page.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
              <h2 className="font-serif text-2xl text-red-800">
                We could not load your order
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Please verify the order link and try again."}
              </p>
            </div>
          )}

          {order && (
            <div className="space-y-7">
              <section className="grid overflow-hidden rounded-3xl border border-[#EDE4DA] bg-[#FCF9F5] sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-b border-[#EDE4DA] p-5 sm:border-r lg:border-b-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                    Order number
                  </p>
                  <p className="mt-2 break-words text-base font-bold text-[#302A25]">
                    {order.orderNumber}
                  </p>
                </div>

                <div className="border-b border-[#EDE4DA] p-5 lg:border-b-0 lg:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                    Order date
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#302A25]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="border-b border-[#EDE4DA] p-5 sm:border-b-0 sm:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                    Payment method
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#302A25]">
                    {formatText(order.paymentMethod)}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                    Order total
                  </p>
                  <p className="mt-2 font-serif text-2xl font-bold text-[#302A25]">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </section>

              <div className="grid gap-7 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-7">
                  <section className="rounded-3xl border border-[#EDE4DA] bg-white p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7B4F]">
                        <ShoppingBag size={21} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                          Order summary
                        </p>
                        <h2 className="font-serif text-2xl text-[#302A25]">
                          Your selected saree
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 divide-y divide-[#EEE5DB]">
                      {items.length > 0 ? (
                        items.map((item, index) => {
                          const quantity = Number(item.quantity || 1);
                          const unitPrice = Number(
                            item.soldPrice ??
                            item.price ??
                            item.offerPrice ??
                            item.listedPrice ??
                            0
                          );

                          const imageUrl =
                            item.image ||
                            item.imageUrl ||
                            item.mainImageUrl ||
                            item.mainImage;

                          return (
                            <article
                              key={item._id || item.productId || item.sku || index}
                              className="flex gap-4 py-5 first:pt-0 last:pb-0"
                            >
                              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F4EEE7]">
                                {imageUrl ? (
                                  <img
                                    src={getImageFromId(imageUrl)}
                                    alt={item.name || "Saree"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[#B59A76]">
                                    <ShoppingBag size={25} />
                                  </div>
                                )}
                              </div>

                              <div className="flex min-w-0 flex-1 justify-between gap-3">
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-[#302A25]">
                                    {item.name || "Pratibha Silks Saree"}
                                  </h3>

                                  {item.sku && (
                                    <p className="mt-1 text-xs uppercase tracking-wider text-[#948476]">
                                      SKU: {item.sku}
                                    </p>
                                  )}

                                  <p className="mt-3 text-sm text-[#71665C]">
                                    Quantity: {quantity}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-bold text-[#302A25]">
                                  {formatCurrency(unitPrice * quantity)}
                                </p>
                              </div>
                            </article>
                          );
                        })
                      ) : (
                        <p className="py-4 text-sm text-[#71665C]">
                          Product details will be available in your order
                          confirmation.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[#EDE4DA] bg-white p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <UserRound className="text-[#9A7B4F]" size={21} />
                        <h2 className="font-serif text-xl text-[#302A25]">
                          Customer details
                        </h2>
                      </div>

                      <div className="mt-5 space-y-5">
                        <DetailItem
                          icon={UserRound}
                          label="Full name"
                          value={customer.name || customer.fullName}
                        />

                        <DetailItem
                          icon={Phone}
                          label="Phone"
                          value={customer.phone}
                        />

                        <DetailItem
                          icon={Mail}
                          label="Email"
                          value={customer.email}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#EDE4DA] bg-white p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-[#9A7B4F]" size={21} />
                        <h2 className="font-serif text-xl text-[#302A25]">
                          Delivery address
                        </h2>
                      </div>

                      <div className="mt-5 flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7B4F]">
                          <Home size={17} />
                        </div>

                        <address className="text-sm not-italic leading-6 text-[#5F554D]">
                          {shippingAddress.fullName && (
                            <strong className="block text-[#302A25]">
                              {shippingAddress.fullName}
                            </strong>
                          )}

                          {shippingAddress.addressLine1 && (
                            <span className="block">
                              {shippingAddress.addressLine1}
                            </span>
                          )}

                          {shippingAddress.addressLine2 && (
                            <span className="block">
                              {shippingAddress.addressLine2}
                            </span>
                          )}

                          {shippingAddress.landmark && (
                            <span className="block">
                              Landmark: {shippingAddress.landmark}
                            </span>
                          )}

                          {(shippingAddress.city ||
                            shippingAddress.state ||
                            shippingAddress.pincode) && (
                              <span className="block">
                                {[
                                  shippingAddress.city,
                                  shippingAddress.state,
                                  shippingAddress.pincode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            )}

                          {!shippingAddress.addressLine1 && (
                            <span>Address details not available.</span>
                          )}
                        </address>
                      </div>
                    </div>
                  </section>

                  {order.customerNotes && (
                    <section className="rounded-3xl border border-[#E7D8C6] bg-[#FBF7F1] p-5 sm:p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                        Order instructions
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5F554D]">
                        {order.customerNotes}
                      </p>
                    </section>
                  )}
                </div>

                <aside className="space-y-7">
                  <section className="rounded-3xl bg-[#181512] p-6 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <ReceiptText className="text-[#D8B46A]" size={22} />
                      <h2 className="font-serif text-2xl">Payment summary</h2>
                    </div>

                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex justify-between gap-4 text-white/70">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between gap-4 text-emerald-300">
                          <span>Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between gap-4 text-white/70">
                        <span>Shipping</span>
                        <span>
                          {shippingCharge > 0
                            ? formatCurrency(shippingCharge)
                            : "Free"}
                        </span>
                      </div>

                      <div className="border-t border-white/15 pt-4">
                        <div className="flex items-end justify-between gap-4">
                          <span className="font-semibold">Total paid</span>
                          <span className="font-serif text-3xl text-[#E2C078]">
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.paymentId && (
                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                          Payment reference
                        </p>
                        <p className="mt-1 break-all text-xs text-white/80">
                          {order.paymentId}
                        </p>
                      </div>
                    )}
                  </section>

                  <section className="rounded-3xl border border-[#EDE4DA] bg-[#FCF9F5] p-6">
                    <div className="flex items-center gap-3">
                      <PackageCheck className="text-[#9A7B4F]" size={23} />
                      <h2 className="font-serif text-2xl text-[#302A25]">
                        What happens next?
                      </h2>
                    </div>

                    <div className="relative mt-6 space-y-6">
                      <div className="absolute bottom-4 left-[17px] top-4 w-px bg-[#DDD0C1]" />

                      <div className="relative flex gap-4">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9A7B4F] text-white">
                          <BadgeCheck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#302A25]">
                            Order confirmed
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#71665C]">
                            Your order and payment details have been recorded.
                          </p>
                        </div>
                      </div>

                      <div className="relative flex gap-4">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D7C8B8] bg-white text-[#9A7B4F]">
                          <PackageCheck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#302A25]">
                            Quality check and packing
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#71665C]">
                            Your saree will be inspected and packed carefully.
                          </p>
                        </div>
                      </div>

                      <div className="relative flex gap-4">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D7C8B8] bg-white text-[#9A7B4F]">
                          <Truck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#302A25]">
                            Dispatch and tracking
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#71665C]">
                            Tracking information will be shared after dispatch.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#EDE4DA] bg-white p-6">
                    <div className="flex items-start gap-3">
                      <Clock3
                        className="mt-0.5 shrink-0 text-[#9A7B4F]"
                        size={21}
                      />

                      <div>
                        <h3 className="font-serif text-xl text-[#302A25]">
                          Need assistance?
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#71665C]">
                          Keep your order number handy when contacting our team
                          regarding delivery or order updates.
                        </p>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>

              <section className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-[#E7D8C6] bg-gradient-to-r from-[#FBF7F1] to-[#F5EBDD] p-6 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A7B4F]">
                    Continue exploring
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-[#302A25]">
                    Discover more timeless sarees
                  </h2>
                </div>

                <Link
                  to="/products"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#181818] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Continue shopping
                  <ArrowRight size={16} />
                </Link>
              </section>

              <p className="text-center text-xs leading-5 text-[#948476]">
                Please save this page or take a screenshot of your order details
                for future reference.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}