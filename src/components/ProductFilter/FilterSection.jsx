import {
    ChevronDown,
    ChevronUp
} from "lucide-react";

export function FilterSection({
    title,
    sectionKey,
    expanded,
    onToggle,
    children,
}) {
    return (
        <div className="border-b border-black/5 last:border-b-0 pb-6 last:pb-0 mt-2">
            <button
                onClick={() => onToggle(sectionKey)}
                className="w-full flex items-center justify-between"
            >
                <span className="font-serif text-2xl">
                    {title}
                </span>

                <span className="h-8 w-8 rounded-full bg-[#F8F3EC] flex items-center justify-center">
                    {expanded ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </span>
            </button>

            {expanded && <div className="mt-5">{children}</div>}
        </div>
    );
}