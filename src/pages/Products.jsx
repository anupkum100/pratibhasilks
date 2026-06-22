import {
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {
  ChevronDown, SlidersHorizontal,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PermissionRenderer from "../components/Admin/PermissionRenderer";
import { useCart } from "../components/Cart/cartContext";
import ProductModal from "../components/Modal/ProductModal";
import { SoldModal } from "../components/Modal/SoldModal";
import PremiumLoader from "../components/PremiumLoader";
import ProductCard from "../components/ProductCard";
import { PremiumFilterPanel } from "../components/ProductFilter/PremiumFilterPanel";
import { useDelayedLoader } from "../data/util";
import { apiCall } from "../serice/api";

const PRODUCT_LIMIT = 100;

const SORT_OPTIONS = [
  {
    label: "Newest Arrivals",
    value: "latest",
  },
  {
    label: "Price: Low to High",
    value: "price_low_high",
  },
  {
    label: "Price: High to Low",
    value: "price_high_low",
  },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { createOrder } = useCart();


  const occasionFromUrl = searchParams.get("occasions");
  const fabricFromUrl = searchParams.get("fabric");
  const categoryFromUrl = searchParams.get("category");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState("latest");

  const [showSoldModal, setShowSoldModal] = useState(false);

  const handleOpenSoldModal = (product) => {
    setSelectedProduct(product);
    setShowSoldModal(true);
  };


  const [filters, setFilters] = useState({
    occasions: occasionFromUrl ? [occasionFromUrl] : [],
    fabrics: fabricFromUrl ? [fabricFromUrl] : [],
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    colors: [],
    hideOutOfStock: true,
  });

  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    fabrics: true,
    occasions: true,
    categories: true,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      occasions: occasionFromUrl ? [occasionFromUrl] : [],
      fabrics: fabricFromUrl ? [fabricFromUrl] : [],
      categories: categoryFromUrl ? [categoryFromUrl] : [],
      colors: [],
      hideOutOfStock: prev.hideOutOfStock ?? true,
    }));
  }, [occasionFromUrl, fabricFromUrl, categoryFromUrl]);

  const toggleOutOfStock = () => {
    setFilters((prev) => ({
      ...prev,
      hideOutOfStock: !prev.hideOutOfStock,
    }));
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("limit", PRODUCT_LIMIT);

    if (filters.colors.length) {
      params.set("colors", filters.colors.join(","));
    }

    if (filters.fabrics.length) {
      params.set("fabrics", filters.fabrics.join(","));
    }

    if (filters.occasions.length) {
      params.set("occasions", filters.occasions.join(","));
    }

    if (filters.categories.length) {
      params.set("categories", filters.categories.join(","));
    }

    params.set("hideOutOfStock", String(filters.hideOutOfStock ?? true));

    if (sort) {
      params.set("sort", sort);
    }

    return params.toString();
  }, [filters, sort]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["products", queryString],
    queryFn: ({ pageParam = 1 }) =>
      apiCall(`/api/products?page=${pageParam}&${queryString}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasMore) {
        return lastPage.pagination.page + 1;
      }

      return undefined;
    },
  });

  const { data: filterResponse } = useQuery({
    queryKey: ["product-filters"],
    queryFn: () => apiCall("/api/products/filters"),
  });

  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data || []) || [];
  }, [data]);

  const totalProducts = data?.pages?.[0]?.pagination?.totalProducts || 0;

  const filterOptions = filterResponse?.data || {
    colors: [],
    fabrics: [],
    occasions: [],
    categories: [],
  };

  const activeFilterCount =
    filters.colors.length +
    filters.fabrics.length +
    filters.occasions.length +
    filters.categories.length;

  const loading = isLoading || submitting;
  const { showLoader, isExiting } = useDelayedLoader(loading, 500);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const toggleFilter = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter((item) => item !== value)
        : [...prev[filterKey], value],
    }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      colors: [],
      fabrics: [],
      occasions: [],
      categories: [],
      hideOutOfStock: prev.hideOutOfStock ?? true,
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProductSubmit = async (payload) => {
    setSubmitting(true);

    const isEdit = modalMode === "edit";

    const url = isEdit
      ? `/api/products/${selectedProduct._id}`
      : "/api/products";

    const res = await apiCall(url, isEdit ? "PUT" : "POST", payload);

    setSubmitting(false);

    if (res?.error) {
      alert(res?.error?.message || "Something went wrong");
      return;
    }

    setModalOpen(false);

    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product-filters"] });
  };

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Delete ${product.name}?`);
    if (!confirmDelete) return;

    setSubmitting(true);

    const res = await apiCall(`/api/products/${product._id}`, "DELETE");

    setSubmitting(false);

    if (res?.error) {
      alert(res.message || "Failed to delete product");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product-filters"] });
  };

  const loadMoreProducts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="min-h-screen bg-[#F8F3EC] text-[#181818]">
      {showLoader && <PremiumLoader isExiting={isExiting} />}

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
              className="md:hidden w-full flex items-center justify-center gap-2 bg-[#181818] text-white px-5 py-4 rounded-full text-sm font-medium shadow-xl"
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
                toggleOutOfStock={toggleOutOfStock}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-[#181818] text-white py-4 rounded-full font-medium"
              >
                Show {totalProducts} Sarees
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-5 pb-20">
        <PermissionRenderer>
          <div className="text-end">
            <button
              onClick={openAddModal}
              className="mb-2 bg-black text-white px-6 py-3 rounded-full"
            >
              + Add Product
            </button>
          </div>
        </PermissionRenderer>

        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          <aside className="hidden md:block">
            <div className="sticky top-20">
              <PremiumFilterPanel
                filters={filters}
                filterOptions={filterOptions}
                expandedSections={expandedSections}
                activeFilterCount={activeFilterCount}
                toggleFilter={toggleFilter}
                toggleSection={toggleSection}
                clearFilters={clearFilters}
                toggleOutOfStock={toggleOutOfStock}
              />
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm text-[#6B5F54]">
                  Showing{" "}
                  <span className="text-[#181818] font-semibold">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#181818] font-semibold">
                    {totalProducts}
                  </span>{" "}
                  sarees
                </p>

                {isRefetching && !isFetchingNextPage && (
                  <p className="text-xs text-[#9A7B4F] mt-1">
                    Refreshing collection...
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#9A7B4F] underline underline-offset-4 w-fit"
                  >
                    Clear all filters
                  </button>
                )}
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

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

                {filters.categories.map((category) => (
                  <ActivePill
                    key={category}
                    label={category}
                    onRemove={() => toggleFilter("categories", category)}
                  />
                ))}
              </div>
            )}

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.sku || product.id}
                      product={product}
                      onEdit={openEditModal}
                      onDelete={deleteProduct}
                      onMarkSold={handleOpenSoldModal}
                    />
                  ))}
                </div>

                <InfiniteScrollTrigger
                  hasMore={hasNextPage}
                  loading={isFetchingNextPage}
                  onLoadMore={loadMoreProducts}
                />

                {isFetchingNextPage && (
                  <div className="py-8 text-center text-sm text-[#6B5F54]">
                    Loading more sarees...
                  </div>
                )}

                {!hasNextPage && products.length > 0 && (
                  <div className="py-10 text-center text-sm text-[#6B5F54]">
                    You have reached the end of the collection.
                  </div>
                )}
              </>
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

      {/* TODO : Add permission FieldRenderer */}
      <ProductModal
        isOpen={modalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProductSubmit}
        loading={loading}
        filters={filterOptions}
        onMarkSold={handleOpenSoldModal}
      />
      <SoldModal
        open={showSoldModal}
        product={selectedProduct}
        onClose={() => setShowSoldModal(false)}
        onSubmit={createOrder}
      />
    </main>
  );
}

function SortDropdown({ value, onChange }) {
  return (
    <label className="relative block min-w-[220px]">
      <span className="sr-only">Sort Products</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-full bg-white border border-black/10 px-5 py-3 pr-11 text-sm text-[#181818] shadow-sm outline-none focus:border-[#9A7B4F]"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A7B4F] pointer-events-none"
      />
    </label>
  );
}

function InfiniteScrollTrigger({ onLoadMore, hasMore, loading }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "500px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return <div ref={ref} className="h-12 w-full" />;
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