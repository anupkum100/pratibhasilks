import { useState, useEffect } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { filterOptions } from "../data/util";
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const [searchParams] = useSearchParams();

  const occasion = searchParams.get("occasion");
  const fabric = searchParams.get("fabric");
  const category = searchParams.get("category");

  const [filters, setFilters] = useState({
    occasions: occasion ? [occasion] : [],
    fabrics: fabric ? [fabric] : [],
    categories: category ? [category] : [],
    colors: [],
  });

  useEffect(() => {
    setFilters({
      occasions: occasion ? [occasion] : [],
      fabrics: fabric ? [fabric] : [],
      categories: category ? [category] : [],
      colors: [],
    });
  }, [searchParams])

  // const [filters, setFilters] = useState({
  //   colors: [],
  //   fabrics: [],
  //   occasions: [],
  // });

  const [showFilters, setShowFilters] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    fabrics: true,
    occasions: true,
  });

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      colors: [],
      fabrics: [],
      occasions: [],
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredProducts = products.filter((product) => {
    const colorMatch =
      filters.colors.length === 0 ||
      filters.colors.includes(product.color);

    const fabricMatch =
      filters.fabrics.length === 0 ||
      filters.fabrics.includes(product.fabric);

    const occasionMatch =
      filters.occasions.length === 0 ||
      filters.occasions.includes(product.occasion);

    return colorMatch && fabricMatch && occasionMatch;
  });

  const activeFilterCount =
    filters.colors.length +
    filters.fabrics.length +
    filters.occasions.length;

  return (
    <main className="min-h-screen bg-[#F8F3EC] text-[#181818]">
      {/* Top Editorial Header */}
      <section className="px-5 pt-12 pb-8 md:pt-20 md:pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
            Curated Collection
          </p>

          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="font-serif text-5xl md:text-7xl leading-none">
                All Sarees
              </h1>

              <p className="mt-5 max-w-xl text-[#6B5F54] leading-7">
                Explore handpicked drapes by fabric, occasion and colour —
                crafted for moments that deserve elegance.
              </p>
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="
                md:hidden
                w-full
                flex items-center justify-center gap-2
                bg-[#181818]
                text-white
                px-5 py-4
                rounded-full
                text-sm
                font-medium
                shadow-xl
              "
            >
              <SlidersHorizontal size={18} />
              Refine Collection
              {activeFilterCount > 0 && (
                <span className="bg-[#C9A86A] text-black h-6 min-w-6 px-2 rounded-full flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-[#F8F3EC] rounded-t-[2rem] max-h-[88vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#F8F3EC] z-10 px-5 py-5 border-b border-black/10 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                  Refine
                </p>
                <h2 className="font-serif text-3xl">Filters</h2>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <PremiumFilterPanel
                filters={filters}
                filterOptions={filterOptions}
                expandedSections={expandedSections}
                activeFilterCount={activeFilterCount}
                toggleFilter={toggleFilter}
                toggleSection={toggleSection}
                clearFilters={clearFilters}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-[#181818] text-white py-4 rounded-full font-medium"
              >
                Show {filteredProducts.length} Sarees
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-5 pb-20">
        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          {/* Desktop Filter */}
          <aside className="hidden md:block">
            <div className="sticky top-28">
              <PremiumFilterPanel
                filters={filters}
                filterOptions={filterOptions}
                expandedSections={expandedSections}
                activeFilterCount={activeFilterCount}
                toggleFilter={toggleFilter}
                toggleSection={toggleSection}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Product Area */}
          <div>
            {/* Toolbar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-[#6B5F54]">
                  Showing{" "}
                  <span className="text-[#181818] font-semibold">
                    {filteredProducts.length}
                  </span>{" "}
                  of {products.length} sarees
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#9A7B4F] underline underline-offset-4 w-fit"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {filters.colors.map((color) => (
                  <ActivePill
                    key={color}
                    label={color}
                    onRemove={() => toggleFilter("colors", color)}
                  />
                ))}

                {filters.fabrics.map((fabric) => (
                  <ActivePill
                    key={fabric}
                    label={fabric}
                    onRemove={() => toggleFilter("fabrics", fabric)}
                  />
                ))}

                {filters.occasions.map((occasion) => (
                  <ActivePill
                    key={occasion}
                    label={occasion}
                    onRemove={() => toggleFilter("occasions", occasion)}
                  />
                ))}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.sku || product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-10 md:p-16 text-center shadow-xl">
                <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                  No Match
                </p>

                <h3 className="font-serif text-4xl mt-3">
                  No sarees found
                </h3>

                <p className="text-[#6B5F54] mt-4">
                  Try removing some filters to discover more pieces.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-8 bg-[#181818] text-white px-8 py-4 rounded-full"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function PremiumFilterPanel({
  filters,
  filterOptions,
  expandedSections,
  activeFilterCount,
  toggleFilter,
  toggleSection,
  clearFilters,
}) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-black/5 overflow-hidden">
      <div className="p-6 border-b border-black/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
              Refine
            </p>

            <h2 className="font-serif text-3xl mt-1">
              Filters
            </h2>
          </div>

          <div className="h-11 w-11 rounded-full bg-[#F8F3EC] flex items-center justify-center">
            <Filter size={18} />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="mt-5 text-sm text-[#9A7B4F] underline underline-offset-4"
          >
            Clear all selections
          </button>
        )}
      </div>

      <div className="p-6 space-y-7">
        <FilterSection
          title="Fabric"
          sectionKey="fabrics"
          expanded={expandedSections.fabrics}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            {filterOptions.fabrics.map((fabric) => (
              <PremiumCheckbox
                key={fabric}
                label={fabric}
                checked={filters.fabrics.includes(fabric)}
                onChange={() => toggleFilter("fabrics", fabric)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Occasion"
          sectionKey="occasions"
          expanded={expandedSections.occasions}
          onToggle={toggleSection}
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.occasions.map((occasion) => {
              const active = filters.occasions.includes(occasion);

              return (
                <button
                  key={occasion}
                  onClick={() => toggleFilter("occasions", occasion)}
                  className={`
                    px-4 py-2 rounded-full text-sm transition-all border
                    ${active
                      ? "bg-[#181818] text-white border-[#181818]"
                      : "bg-[#F8F3EC] text-[#6B5F54] border-transparent hover:border-[#C9A86A]"
                    }
                  `}
                >
                  {occasion}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection
          title="Colour"
          sectionKey="colors"
          expanded={expandedSections.colors}
          onToggle={toggleSection}
        >
          <div className="flex flex-wrap gap-4">
            {filterOptions.colors.map((color) => {
              const active = filters.colors.includes(color.name);

              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => toggleFilter("colors", color.name)}
                  className={`
                    relative h-10 w-10 rounded-full transition-all
                    ${active
                      ? "ring-2 ring-[#181818] ring-offset-4 ring-offset-white scale-105"
                      : "ring-1 ring-black/10 hover:ring-[#C9A86A]"
                    }
                  `}
                  style={{
                    backgroundColor: color.hex,
                  }}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full border-2 border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  sectionKey,
  expanded,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-black/5 last:border-b-0 pb-6 last:pb-0">
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

function PremiumCheckbox({ label, checked, onChange }) {
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

function ActivePill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-2 bg-white border border-black/5 shadow-sm px-4 py-2 rounded-full text-sm text-[#6B5F54]">
      {label}

      <button
        onClick={onRemove}
        className="h-5 w-5 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#181818]"
      >
        <X size={12} />
      </button>
    </span>
  );
}