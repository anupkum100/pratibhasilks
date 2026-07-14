import {
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getImageFromId } from "../../data/util";
import { FREE_SHIPPING_THRESHOLD, getSellingPrice } from "../../utils/shipping";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function OrderSummary({
  product,
  quantity = 1,
  pincode = "",
  shippingLocation = "",
  shippingCharge = 0,
  baseShippingCharge = 0,
  isFreeShipping = false,
  isShippingLoading = false,
  canCalculateShipping = false,
}) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const sellingPrice = getSellingPrice(product);
  const subtotal = sellingPrice * safeQuantity;
  const total = subtotal + Number(shippingCharge || 0);
  const amountForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD + 1 - subtotal
  );

  const shippingText = (() => {
    if (isFreeShipping) return "Free";
    if (isShippingLoading) return "Calculating...";
    if (!canCalculateShipping) return "Enter location";
    return money(shippingCharge);
  })();

  return (
    <aside className="luxury-card sticky top-24 overflow-hidden">
      <div className="gradient-luxury-dark p-6 text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#D8B46A]">
          Your Selection
        </p>
        <h2 className="mt-3 font-serif text-3xl">Order Summary</h2>
      </div>

      <div className="p-6">
        <div className="flex gap-4">
          <div className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F8F3EC]">
            {product?.mainImageId ? (
              <img
                src={getImageFromId(product.mainImageId)}
                alt={product?.name || "Selected saree"}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-2xl leading-tight">
              {product?.name}
            </h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#9A7B4F]">
              SKU {product?.sku}
            </p>
            <p className="mt-4 text-lg font-semibold">
              {money(sellingPrice)}
            </p>
          </div>
        </div>

        {(pincode || shippingLocation) && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#D8B46A]/30 bg-[#FFFDF8] p-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#9A7B4F]" />
            <div className="min-w-0 text-xs">
              <p className="font-medium text-[#3E332A]">Delivering to</p>
              <p className="mt-0.5 text-[#6B5F54]">
                {[shippingLocation, pincode].filter(Boolean).join(" - ")}
              </p>
            </div>
          </div>
        )}

        <div className="my-6 h-px bg-black/10" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B5F54]">
              Subtotal{safeQuantity > 1 ? ` (${safeQuantity} sarees)` : ""}
            </span>
            <span>{money(subtotal)}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[#6B5F54]">Shipping</span>
              {!isFreeShipping && canCalculateShipping && baseShippingCharge > 0 && (
                <p className="mt-1 text-[11px] text-[#8A7B6E]">
                  Location base charge {money(baseShippingCharge)}
                </p>
              )}
            </div>
            <span className={isFreeShipping ? "font-semibold text-emerald-700" : ""}>
              {shippingText}
            </span>
          </div>

          <div className="flex justify-between border-t border-black/10 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        {isFreeShipping ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            You have unlocked free shipping.
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-[#D8B46A]/30 bg-[#FFF9EC] p-3 text-xs text-[#765B2D]">
            Add products worth {money(amountForFreeShipping)} more to unlock free shipping.
          </div>
        )}

        <div className="mt-6 space-y-3 rounded-2xl bg-[#F8F3EC] p-4 text-xs text-[#6B5F54]">
          <p className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#9A7B4F]" />
            Secure payment verification
          </p>
          <p className="flex items-center gap-2">
            <Truck size={16} className="text-[#9A7B4F]" />
            Carefully packed saree delivery
          </p>
        </div>
      </div>
    </aside>
  );
}
