export function SelectField({ label, options, placeholder = "", ...props }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                {label}
            </span>

            <select
                {...props}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
            >
                {placeholder && (
                    <option value="">
                        {placeholder}
                    </option>
                )}

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function Field({ label, ...props }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                {label}
            </span>

            <input
                {...props}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
            />
        </label>
    );
}
