import { ShieldCheck, Truck } from "lucide-react";
import { getImageFromId } from "../../data/util";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function OrderSummary({ product, shippingCharge = 0 }) {
  const sellingPrice = Number(product?.offerPrice) > 0 && Number(product.offerPrice) < Number(product.price)
    ? Number(product.offerPrice)
    : Number(product?.price || 0);
  const total = sellingPrice + Number(shippingCharge || 0);

  return (
    <aside className="luxury-card sticky top-24 overflow-hidden">
      <div className="gradient-luxury-dark p-6 text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#D8B46A]">Your Selection</p>
        <h2 className="mt-3 font-serif text-3xl">Order Summary</h2>
      </div>
      <div className="p-6">
        <div className="flex gap-4">
          <div className="h-32 w-24 overflow-hidden rounded-2xl bg-[#F8F3EC]">
            {product?.mainImageId ? (
              <img src={getImageFromId(product.mainImageId)} alt={product.name} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-2xl leading-tight">{product?.name}</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#9A7B4F]">SKU {product?.sku}</p>
            <p className="mt-4 text-lg font-semibold">{money(sellingPrice)}</p>
          </div>
        </div>
        <div className="my-6 h-px bg-black/10" />
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-[#6B5F54]">Subtotal</span><span>{money(sellingPrice)}</span></div>
          <div className="flex justify-between"><span className="text-[#6B5F54]">Shipping</span><span>{shippingCharge ? money(shippingCharge) : "Free"}</span></div>
          <div className="flex justify-between border-t border-black/10 pt-4 text-lg font-semibold"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <div className="mt-6 space-y-3 rounded-2xl bg-[#F8F3EC] p-4 text-xs text-[#6B5F54]">
          <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#9A7B4F]" /> Secure payment verification</p>
          <p className="flex items-center gap-2"><Truck size={16} className="text-[#9A7B4F]" /> Carefully packed saree delivery</p>
        </div>
      </div>
    </aside>
  );
}
