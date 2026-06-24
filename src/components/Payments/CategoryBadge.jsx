export function CategoryBadge({ category }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs ${category === "Inventory"
                ? "bg-[#F8F3EC] text-[#9A7B4F]"
                : "bg-black/5 text-[#6B5F54]"
                }`}
        >
            {category}
        </span>
    );
}