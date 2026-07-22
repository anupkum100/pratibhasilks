import { ShoppingCart, Trash2 } from "lucide-react";

const sizeClasses = {
    card: "h-10 px-4 text-xs",
    detail: "h-12 px-7 text-sm",
};

export default function CartActionButton({
    added,
    onClick,
    size = "card",
    className = "",
}) {
    const label = added
        ? size === "card"
            ? "Remove"
            : "Remove from Cart"
        : size === "card"
            ? "Add To Cart"
            : "Add to Cart";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex w-full items-center justify-center gap-2 rounded-full
                font-medium whitespace-nowrap
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-lg
                ${sizeClasses[size] || sizeClasses.card}
                ${added
                    ? "border border-[#D8B46A]/45 bg-[#FFF9EC] text-[#7A4E1D] hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    : "border border-[#181818] bg-[#181818] text-white hover:bg-[#111111]"
                }
                ${className}
            `}
        >
            {added ? <Trash2 size={size === "card" ? 14 : 16} /> : <ShoppingCart size={size === "card" ? 15 : 17} />}
            <span className="truncate">{label}</span>
        </button>
    );
}
