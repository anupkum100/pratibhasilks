
import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products, filterOptions } from "../data/products";

export default function Products() {
  const [filters, setFilters] = useState({
    colors: [],
    fabrics: [],
    occasions: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    fabrics: true,
    occasions: true,
  });

  // Toggle filter value
  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ colors: [], fabrics: [], occasions: [] });
  };

  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const colorMatch = filters.colors.length === 0 || filters.colors.includes(product.color);
    const fabricMatch = filters.fabrics.length === 0 || filters.fabrics.includes(product.fabric);
    const occasionMatch = filters.occasions.length === 0 || filters.occasions.includes(product.occasion);
    return colorMatch && fabricMatch && occasionMatch;
  });

  const activeFilterCount = filters.colors.length + filters.fabrics.length + filters.occasions.length;

  // Color display mapping
  const colorDisplay = {
    Red: "#DC2626",
    Green: "#16A34A",
    Maroon: "#7F1D1D",
    Golden: "#FFD700"
  };

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:px-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
        <h1 className="text-3xl md:text-5xl" style={{ color: 'var(--color-primary)' }}>All Sarees</h1>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
        >
          <Filter size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: 'var(--color-secondary)' }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Filter Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 sticky top-24">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Fabric Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('fabrics')}
                className="flex items-center justify-between w-full py-2 text-sm font-semibold"
              >
                Fabric
                {expandedSections.fabrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.fabrics && (
                <div className="flex flex-col gap-2 mt-2">
                  {filterOptions.fabrics.map(fabric => (
                    <label
                      key={fabric}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.fabrics.includes(fabric)}
                        onChange={() => toggleFilter('fabrics', fabric)}
                        className="w-4 h-4 rounded accent-[var(--color-primary)]"
                      />
                      {fabric}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Occasion Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('occasions')}
                className="flex items-center justify-between w-full py-2 text-sm font-semibold"
              >
                Occasion
                {expandedSections.occasions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.occasions && (
                <div className="flex flex-col gap-2 mt-2">
                  {filterOptions.occasions.map(occasion => (
                    <label
                      key={occasion}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.occasions.includes(occasion)}
                        onChange={() => toggleFilter('occasions', occasion)}
                        className="w-4 h-4 rounded accent-[var(--color-primary)]"
                      />
                      {occasion}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Colors Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('colors')}
                className="flex items-center justify-between w-full py-2 text-sm font-semibold"
              >
                Colors
                {expandedSections.colors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.colors && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filterOptions.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => toggleFilter('colors', color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${filters.colors.includes(color)
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorDisplay[color] }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden w-full mt-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Active Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.colors.map(color => (
                <span
                  key={color}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {color}
                  <button onClick={() => toggleFilter('colors', color)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {filters.fabrics.map(fabric => (
                <span
                  key={fabric}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  {fabric}
                  <button onClick={() => toggleFilter('fabrics', fabric)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {filters.occasions.map(occasion => (
                <span
                  key={occasion}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#333' }}
                >
                  {occasion}
                  <button onClick={() => toggleFilter('occasions', occasion)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">No products found</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
