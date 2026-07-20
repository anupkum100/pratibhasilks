import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function LuxurySortSelect({ value, onChange, SORT_OPTIONS }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption =
        SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleSelect(optionValue) {
        onChange(optionValue);
        setIsOpen(false);
    }

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="
          flex w-full items-center justify-between gap-3
          rounded-full border border-[#D8C8A8]
          bg-gradient-to-r from-[#FFFDF8] via-white to-[#FCF8EF]
          px-5 py-1.5
          text-left text-sm font-medium text-[#3A2C1A]
          shadow-[0_4px_18px_rgba(154,123,79,0.12)]
          outline-none transition-all duration-200
          hover:border-[#B8945F]
          hover:shadow-[0_8px_24px_rgba(154,123,79,0.18)]
          focus:border-[#9A7B4F]
          focus:ring-4 focus:ring-[#9A7B4F]/15
          
        "
            >
                <span className="min-w-0 truncate">
                    <span className="text-[#8A7455]">Sort:</span>{" "}
                    {selectedOption?.label}
                </span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9A7B4F]/10">
                    <ChevronDown
                        size={17}
                        className={`text-[#9A7B4F] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </span>
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    aria-label="Sort products"
                    className="
            absolute left-0 right-0 z-50 mt-2
            max-h-72 overflow-y-auto
            rounded-[24px] border border-[#D8C8A8]/80
            bg-[#FFFEFB] p-2
            shadow-[0_18px_50px_rgba(63,45,20,0.18)]
            backdrop-blur-xl
          "
                >
                    {SORT_OPTIONS.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelect(option.value)}
                                className={`
                  flex w-full items-center justify-between gap-3
                  rounded-2xl px-4 py-3
                  text-left text-sm
                  transition-colors duration-150
                  ${isSelected
                                        ? "bg-[#9A7B4F] font-semibold text-white"
                                        : "text-[#3A2C1A] hover:bg-[#F4EBDD]"
                                    }
                `}
                            >
                                <span className="truncate">{option.label}</span>

                                {isSelected && <Check size={17} className="shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}