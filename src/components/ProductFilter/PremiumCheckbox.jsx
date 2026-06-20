export function PremiumCheckbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span
                className={`text-sm transition ${checked
                    ? "text-[#181818] font-medium"
                    : "text-[#6B5F54] group-hover:text-[#181818]"
                    }`}
            >
                {label}
            </span>

            <span
                className={`
            h-5 w-5 rounded-full border flex items-center justify-center transition
            ${checked
                        ? "bg-[#181818] border-[#181818]"
                        : "border-black/20 group-hover:border-[#C9A86A]"
                    }
          `}
            >
                {checked && (
                    <span className="h-2 w-2 rounded-full bg-[#C9A86A]" />
                )}
            </span>

            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
        </label>
    );
}