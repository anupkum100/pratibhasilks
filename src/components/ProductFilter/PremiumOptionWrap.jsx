import { useState } from "react";


export function PremiumOptionWrap({ children }) {
    const [expanded, setExpanded] = useState(false);

    const items = Array.isArray(children) ? children : [children];
    const visibleItems = expanded ? items : items.slice(0, 2);
    const remainingCount = Math.max(items.length - 2, 0);

    return (
        <div>
            <div className="flex flex-wrap gap-2">{visibleItems}</div>

            {remainingCount > 0 && (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-3 text-xs font-medium text-[#9A7B4F] underline underline-offset-4"
                >
                    {expanded ? "Show less" : `View ${remainingCount} more`}
                </button>
            )}
        </div>
    );
}