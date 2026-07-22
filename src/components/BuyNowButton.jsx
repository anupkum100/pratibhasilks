import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuyNowButton({ product, className = "" }) {
  const navigate = useNavigate();

  const available = Number(product?.stock || 0) > 0;

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/checkout/${encodeURIComponent(product.sku)}`)
      }
      className={`group relative overflow-hidden rounded-full bg-[#181818] px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] ${className}`}
    >
      {/* Gold Shine */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute -left-20 top-0 h-full w-12 rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-[120%]" />
      </span>

      {/* Gold Border */}
      <span className="absolute inset-0 rounded-full border border-[#C9A86A]/40 group-hover:border-[#C9A86A]" />

      <span className="relative flex items-center justify-center gap-2">
        Order Now
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}