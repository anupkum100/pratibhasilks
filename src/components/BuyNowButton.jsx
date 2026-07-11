import { useNavigate } from "react-router-dom";

export default function BuyNowButton({ product, className = "" }) {
  const navigate = useNavigate();
  const available = Number(product?.stock || 0) > 0;
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => navigate(`/checkout/${encodeURIComponent(product.sku)}`)}
      className={`rounded-full bg-[#181818] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed ${className}`}
    >
      {available ? "Buy Now" : "Sold Out"}
    </button>
  );
}
