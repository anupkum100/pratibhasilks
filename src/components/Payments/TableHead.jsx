import { ArrowUpDown } from "lucide-react";

export function TableHead({ label, onClick }) {
    return (
        <th className="p-5 text-left font-medium">
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2"
            >
                {label}
                {onClick && <ArrowUpDown size={14} />}
            </button>
        </th>
    );
}