import { useInfiniteQuery } from "@tanstack/react-query";
import {
    ChevronDown,
    PackageCheck,
    ShoppingBag,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import PremiumLoader from "../../components/PremiumLoader";
import { getImageFromId, useDelayedLoader } from "../../data/util";
import { apiCall } from "../../serice/api";

const PRODUCT_LIMIT = 24;

const SORT_OPTIONS = [
    {
        label: "Recently Added",
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

export default function SoldProducts() {
    const [sort, setSort] = useState("latest");

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        params.set("limit", String(PRODUCT_LIMIT));
        params.set("hideOutOfStock", "false");
        params.set("sort", sort);

        return params.toString();
    }, [sort]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isRefetching,
        error,
    } = useInfiniteQuery({
        queryKey: ["sold-products", queryString],
        queryFn: ({ pageParam = 1 }) =>
            apiCall(`/api/products?page=${pageParam}&${queryString}`),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage?.pagination?.hasMore) {
                return Number(lastPage.pagination.page) + 1;
            }

            return undefined;
        },
    });

    const allLoadedProducts = useMemo(() => {
        return (
            data?.pages?.flatMap((page) => page?.data || []) || []
        );
    }, [data]);

    const soldProducts = useMemo(() => {
        return allLoadedProducts.filter((product) => {
            const stock = Number(product?.stock ?? 0);

            return stock <= 0;
        });
    }, [allLoadedProducts]);

    const totalProductsChecked =
        data?.pages?.[0]?.pagination?.totalProducts || 0;

    const loading = isLoading;
    const { showLoader, isExiting } = useDelayedLoader(
        loading,
        500
    );

    const loadMoreProducts = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <main className="min-h-screen bg-[#F8F3EC] text-[#181818]">
            {showLoader && (
                <PremiumLoader isExiting={isExiting} />
            )}

            <section className="px-5 pt-12 pb-8 md:pt-20 md:pb-12">
                <div className="max-w-7xl mx-auto">
                    <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
                        Product Archive
                    </p>

                    <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="font-serif text-5xl md:text-7xl leading-none">
                                Sold Sarees
                            </h1>

                            <p className="mt-5 max-w-xl text-[#6B5F54] leading-7">
                                Browse sarees that have already been sold from
                                the Pratibha Silks collection.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-[1.5rem] bg-white border border-black/5 px-5 py-4 shadow-sm min-w-[190px]">
                            <div className="h-11 w-11 shrink-0 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#9A7B4F]">
                                <ShoppingBag size={20} />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#8A8178]">
                                    Loaded Sold
                                </p>

                                <p className="mt-1 font-serif text-2xl leading-none">
                                    {soldProducts.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 pb-20">
                <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-sm text-[#6B5F54]">
                            Showing{" "}
                            <span className="font-semibold text-[#181818]">
                                {soldProducts.length}
                            </span>{" "}
                            sold sarees from{" "}
                            <span className="font-semibold text-[#181818]">
                                {allLoadedProducts.length}
                            </span>{" "}
                            loaded products
                        </p>

                        {isRefetching && !isFetchingNextPage && (
                            <p className="mt-1 text-xs text-[#9A7B4F]">
                                Refreshing sold products...
                            </p>
                        )}
                    </div>

                    <SortDropdown
                        value={sort}
                        onChange={setSort}
                    />
                </div>

                {error ? (
                    <ErrorState />
                ) : soldProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
                            {soldProducts.map((product) => (
                                <SoldProductCard
                                    key={
                                        product._id ||
                                        product.sku ||
                                        product.id
                                    }
                                    product={product}
                                />
                            ))}
                        </div>

                        <InfiniteScrollTrigger
                            hasMore={hasNextPage}
                            loading={isFetchingNextPage}
                            onLoadMore={loadMoreProducts}
                        />

                        {isFetchingNextPage && (
                            <div className="py-8 text-center">
                                <p className="text-sm text-[#6B5F54]">
                                    Loading more products...
                                </p>
                            </div>
                        )}

                        {!hasNextPage && (
                            <div className="py-12 text-center">
                                <PackageCheck
                                    size={24}
                                    className="mx-auto text-[#9A7B4F]"
                                />

                                <p className="mt-3 text-sm text-[#6B5F54]">
                                    All products have been checked.
                                </p>

                                <p className="mt-1 text-xs text-[#9A7B4F]">
                                    {totalProductsChecked} products in the
                                    collection
                                </p>
                            </div>
                        )}
                    </>
                ) : !isLoading ? (
                    <NoSoldProductsState
                        hasMore={hasNextPage}
                        loading={isFetchingNextPage}
                        onLoadMore={loadMoreProducts}
                    />
                ) : null}
            </section>
        </main>
    );
}

function SoldProductCard({ product }) {
    const sellingPrice = Number(
        product?.offerPrice || product?.price || 0
    );

    const originalPrice = Number(product?.price || 0);

    const hasOfferPrice =
        Number(product?.offerPrice || 0) > 0 &&
        Number(product.offerPrice) < originalPrice;

    return (
        <article className="group overflow-hidden rounded-[1.75rem] bg-white border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EFE7DC]">
                {product?.mainImageId ? (
                    <img
                        src={getImageFromId(product.mainImageId)}
                        alt={product?.name || "Sold saree"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-[#9A7B4F]">
                        <PackageCheck
                            size={42}
                            strokeWidth={1.3}
                        />

                        <p className="mt-3 text-xs uppercase tracking-[0.24em]">
                            Image unavailable
                        </p>
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-5 pt-20 pb-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/75">
                        {product?.sku || "SKU unavailable"}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl leading-tight text-white">
                        {product?.name || "Unnamed Saree"}
                    </h2>
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F]">
                            Selling Price
                        </p>

                        <p className="mt-1 font-serif text-2xl">
                            {formatCurrency(sellingPrice)}
                        </p>
                    </div>

                    {hasOfferPrice && (
                        <p className="mt-5 text-sm text-[#8A8178] line-through">
                            {formatCurrency(originalPrice)}
                        </p>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-black/8 pt-5">
                    <ProductInformation
                        label="Colour"
                        value={product?.color}
                    />

                    <ProductInformation
                        label="Fabric"
                        value={product?.fabric}
                    />

                </div>

                {Array.isArray(product?.categories) &&
                    product.categories.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {product.categories
                                .slice(0, 3)
                                .map((category) => (
                                    <span
                                        key={category}
                                        className="rounded-full bg-[#F8F3EC] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#6B5F54]"
                                    >
                                        {category}
                                    </span>
                                ))}
                        </div>
                    )}
            </div>
        </article>
    );
}

function ProductInformation({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A7B4F]">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-medium text-[#3F3933]">
                {value || "Not available"}
            </p>
        </div>
    );
}

function SortDropdown({ value, onChange }) {
    return (
        <label className="relative block w-full sm:w-auto sm:min-w-[225px]">
            <span className="sr-only">
                Sort sold products
            </span>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="w-full appearance-none rounded-full bg-white border border-black/10 px-5 py-3.5 pr-11 text-sm text-[#181818] shadow-sm outline-none focus:border-[#9A7B4F]"
            >
                {SORT_OPTIONS.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        Sort: {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A7B4F]"
            />
        </label>
    );
}

function InfiniteScrollTrigger({
    onLoadMore,
    hasMore,
    loading,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!hasMore || loading) return undefined;

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

        const currentElement = ref.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, onLoadMore]);

    return <div ref={ref} className="h-12 w-full" />;
}

function NoSoldProductsState({
    hasMore,
    loading,
    onLoadMore,
}) {
    return (
        <div className="rounded-[2rem] bg-white p-10 md:p-16 text-center shadow-sm border border-black/5">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#9A7B4F]">
                <PackageCheck
                    size={31}
                    strokeWidth={1.4}
                />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                Sold Collection
            </p>

            <h3 className="mt-3 font-serif text-4xl">
                No sold sarees loaded
            </h3>

            <p className="mx-auto mt-4 max-w-md text-[#6B5F54]">
                The currently loaded product pages do not contain any
                out-of-stock products.
            </p>

            {hasMore && (
                <button
                    type="button"
                    disabled={loading}
                    onClick={onLoadMore}
                    className="mt-8 rounded-full bg-[#181818] px-8 py-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Loading Products..."
                        : "Check More Products"}
                </button>
            )}
        </div>
    );
}

function ErrorState() {
    return (
        <div className="rounded-[2rem] bg-white p-10 md:p-16 text-center shadow-sm border border-black/5">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#9A7B4F]">
                <PackageCheck
                    size={30}
                    strokeWidth={1.4}
                />
            </div>

            <h3 className="mt-6 font-serif text-4xl">
                Unable to load sold sarees
            </h3>

            <p className="mt-4 text-[#6B5F54]">
                Please refresh the page and try again.
            </p>
        </div>
    );
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}