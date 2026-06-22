import { Check } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { PremiumOptionWrap } from "./PremiumOptionWrap";

export function PremiumFilterPanel({
    filters,
    filterOptions,
    expandedSections,
    activeFilterCount,
    toggleFilter,
    toggleSection,
    clearFilters,
    toggleOutOfStock,
}) {
    return (
        <div className="bg-white rounded-[2rem] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                        Filters
                    </p>

                    <h3 className="font-serif text-3xl mt-1">
                        Refine
                    </h3>
                </div>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-[#9A7B4F] underline underline-offset-4"
                    >
                        Clear
                    </button>
                )}
            </div>

            <FilterSection
                title="Colours"
                sectionKey="colors"
                expanded={expandedSections.colors}
                onToggle={toggleSection}
            >
                <PremiumOptionWrap>
                    {(filterOptions.colors || []).map((color) => {
                        const selected = filters.colors.includes(color.name);

                        return (
                            <button
                                type="button"
                                key={color.name}
                                onClick={() => toggleFilter("colors", color.name)}
                                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${selected
                                    ? "border-[#181818] bg-[#181818] text-white"
                                    : "border-black/10 bg-[#F8F3EC] text-[#6B5F54]"
                                    }`}
                            >
                                <span
                                    className="h-4 w-4 rounded-full border border-black/10"
                                    style={{
                                        backgroundColor: color.hex || "#cccccc",
                                    }}
                                />

                                {color.name}

                                {selected && <Check size={12} />}
                            </button>
                        );
                    })}
                </PremiumOptionWrap>
            </FilterSection>

            <FilterSection
                title="Fabrics"
                sectionKey="fabrics"
                expanded={expandedSections.fabrics}
                onToggle={toggleSection}
            >
                <PremiumOptionWrap>
                    {(filterOptions.fabrics || []).map((fabric) => (
                        <FilterChip
                            key={fabric}
                            label={fabric}
                            selected={filters.fabrics.includes(fabric)}
                            onClick={() => toggleFilter("fabrics", fabric)}
                        />
                    ))}
                </PremiumOptionWrap>
            </FilterSection>

            <FilterSection
                title="Occasions"
                sectionKey="occasions"
                expanded={expandedSections.occasions}
                onToggle={toggleSection}
            >
                <PremiumOptionWrap>
                    {(filterOptions.occasions || []).map((occasion) => (
                        <FilterChip
                            key={occasion}
                            label={occasion}
                            selected={filters.occasions.includes(occasion)}
                            onClick={() => toggleFilter("occasions", occasion)}
                        />
                    ))}
                </PremiumOptionWrap>
            </FilterSection>

            <FilterSection
                title="Categories"
                sectionKey="categories"
                expanded={expandedSections.categories}
                onToggle={toggleSection}
            >
                <PremiumOptionWrap>
                    {(filterOptions.categories || []).map((category) => (
                        <FilterChip
                            key={category}
                            label={category}
                            selected={filters.categories.includes(category)}
                            onClick={() => toggleFilter("categories", category)}
                        />
                    ))}
                </PremiumOptionWrap>
            </FilterSection>

            <div className="pt-5">
                <button
                    type="button"
                    onClick={() => toggleOutOfStock()}
                    className="w-full flex items-center justify-between gap-4 rounded-[1.25rem] bg-[#FFFCF8] border border-[#E8DCCB] px-4 py-4 hover:bg-[#F8F3EC] transition"
                >
                    <div className="text-left">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                            Availability
                        </p>

                        <p className="text-sm mt-1 text-[#2B241D]">
                            Hide out of stock sarees
                        </p>
                    </div>

                    <span
                        className={`h-6 w-11 rounded-full p-1 transition ${filters.hideOutOfStock ? "bg-[#181818]" : "bg-[#D8CBB8]"
                            }`}
                    >
                        <span
                            className={`block h-4 w-4 rounded-full bg-white transition ${filters.hideOutOfStock ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </span>
                </button>
            </div>
        </div>
    );
}

function FilterChip({ label, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-xs border transition ${selected
                ? "bg-[#181818] text-white border-[#181818]"
                : "bg-[#F8F3EC] text-[#6B5F54] border-black/10 hover:border-[#9A7B4F]"
                }`}
        >
            {label}
        </button>
    );
}