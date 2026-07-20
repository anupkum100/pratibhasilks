import { useInfiniteQuery } from "@tanstack/react-query";
import {
    Banknote,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronRight,
    CircleDollarSign,
    Clipboard,
    CreditCard,
    IndianRupee,
    LoaderCircle,
    Mail,
    MapPin,
    Package,
    PackageCheck,
    Phone,
    Search,
    ShoppingBag,
    Truck,
    UserRound,
    X,
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

const ORDER_LIMIT = 20;

const unwrapApiResponse = (response, fallbackMessage) => {
    if (response?.error) {
        throw new Error(response.error.message || fallbackMessage);
    }

    return response;
};

const ORDER_STATUS_OPTIONS = [
    { label: "All Orders", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const PAYMENT_STATUS_OPTIONS = [
    { label: "All Payments", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Paid", value: "PAID" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
];

const SORT_OPTIONS = [
    { label: "Newest Orders", value: "latest" },
    { label: "Oldest Orders", value: "oldest" },
    { label: "Amount: High to Low", value: "amount_high_low" },
    { label: "Amount: Low to High", value: "amount_low_high" },
];

export default function OnlineOrders() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [sort, setSort] = useState("latest");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => window.clearTimeout(timer);
    }, [search]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        params.set("limit", String(ORDER_LIMIT));
        params.set("sort", sort);

        if (debouncedSearch) {
            params.set("search", debouncedSearch);
        }

        if (orderStatus) {
            params.set("orderStatus", orderStatus);
        }

        if (paymentStatus) {
            params.set("paymentStatus", paymentStatus);
        }

        return params.toString();
    }, [debouncedSearch, orderStatus, paymentStatus, sort]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isRefetching,
        error,
    } = useInfiniteQuery({
        queryKey: ["admin-online-orders", queryString],

        queryFn: async ({ pageParam = 1 }) =>
            unwrapApiResponse(
                await apiCall(`/api/orders/public/?page=${pageParam}&${queryString}`),
                "Failed to fetch online orders"
            ),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.pagination;

            if (pagination?.hasMore) {
                return Number(pagination.page) + 1;
            }

            return undefined;
        },
    });

    const orders = useMemo(() => {
        return (
            data?.pages?.flatMap((page) => {
                return page?.data || page?.orders || [];
            }) || []
        );
    }, [data]);

    const firstPage = data?.pages?.[0];

    const totalOrders =
        firstPage?.pagination?.totalOrders ||
        firstPage?.pagination?.totalItems ||
        firstPage?.summary?.totalOrders ||
        orders.length;

    const totalRevenue =
        firstPage?.summary?.totalRevenue ??
        orders.reduce((total, order) => {
            if (normalizeStatus(order.paymentStatus) !== "PAID") {
                return total;
            }

            return total + getOrderTotal(order);
        }, 0);

    const paidOrders =
        firstPage?.summary?.paidOrders ??
        orders.filter(
            (order) =>
                normalizeStatus(order.paymentStatus) === "PAID"
        ).length;

    const pendingOrders =
        firstPage?.summary?.pendingOrders ??
        orders.filter((order) =>
            ["PENDING", "CONFIRMED", "PROCESSING"].includes(
                normalizeStatus(order.orderStatus)
            )
        ).length;

    const { showLoader, isExiting } = useDelayedLoader(
        isLoading,
        500
    );

    const clearFilters = () => {
        setSearch("");
        setOrderStatus("");
        setPaymentStatus("");
        setSort("latest");
    };

    const hasActiveFilters =
        Boolean(search) ||
        Boolean(orderStatus) ||
        Boolean(paymentStatus) ||
        sort !== "latest";

    const loadMoreOrders = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <main className="min-h-screen bg-[#F8F3EC] text-[#181818]">
            {showLoader && (
                <PremiumLoader isExiting={isExiting} />
            )}

            <section className="px-5 pb-8 pt-12 md:pb-12 md:pt-20">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs uppercase tracking-[0.45em] text-[#9A7B4F]">
                        Commerce Administration
                    </p>

                    <div className="mt-4 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <h1 className="font-serif text-5xl leading-none md:text-7xl">
                                Online Orders
                            </h1>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6B5F54] md:text-base">
                                Review customer orders, payment information,
                                delivery addresses and purchased sarees from one
                                refined workspace.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <SummaryCard
                                icon={<ShoppingBag size={19} />}
                                label="Total Orders"
                                value={totalOrders}
                            />

                            <SummaryCard
                                icon={<CircleDollarSign size={19} />}
                                label="Paid Orders"
                                value={paidOrders}
                            />

                            <SummaryCard
                                icon={<Package size={19} />}
                                label="In Progress"
                                value={pendingOrders}
                            />

                            <SummaryCard
                                icon={<IndianRupee size={19} />}
                                label="Revenue"
                                value={formatCurrency(totalRevenue)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 pb-6">
                <div className="rounded-[1.75rem] border border-black/5 bg-white p-3 shadow-sm md:p-4">
                    <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px_230px]">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9A7B4F]"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search order, customer, phone, email or SKU..."
                                className="ps-7 w-full rounded-full border border-black/5 bg-[#F8F3EC] py-4 pl-13 pr-12 text-sm outline-none transition focus:border-[#9A7B4F]"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white"
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <LuxurySelect
                            value={orderStatus}
                            onChange={setOrderStatus}
                            options={ORDER_STATUS_OPTIONS}
                            ariaLabel="Filter by order status"
                        />

                        <LuxurySelect
                            value={paymentStatus}
                            onChange={setPaymentStatus}
                            options={PAYMENT_STATUS_OPTIONS}
                            ariaLabel="Filter by payment status"
                        />

                        <LuxurySelect
                            value={sort}
                            onChange={setSort}
                            options={SORT_OPTIONS}
                            ariaLabel="Sort orders"
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 pb-20">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-[#6B5F54]">
                            Showing{" "}
                            <span className="font-semibold text-[#181818]">
                                {orders.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-[#181818]">
                                {totalOrders}
                            </span>{" "}
                            orders
                        </p>

                        {isRefetching && !isFetchingNextPage && (
                            <p className="mt-1 text-xs text-[#9A7B4F]">
                                Refreshing order collection...
                            </p>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-fit text-sm text-[#9A7B4F] underline underline-offset-4"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {error ? (
                    <ErrorState />
                ) : orders.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <OrderCard
                                    key={
                                        order._id ||
                                        order.id ||
                                        order.orderNumber
                                    }
                                    order={order}
                                    onOpen={() => setSelectedOrder(order)}
                                />
                            ))}
                        </div>

                        <InfiniteScrollTrigger
                            hasMore={hasNextPage}
                            loading={isFetchingNextPage}
                            onLoadMore={loadMoreOrders}
                        />

                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#6B5F54]">
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />
                                Loading more orders...
                            </div>
                        )}

                        {!hasNextPage && orders.length > 0 && (
                            <div className="py-10 text-center text-sm text-[#6B5F54]">
                                You have reached the end of the order collection.
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState onClear={clearFilters} />
                )}
            </section>

            <OrderDetailsDrawer
                order={selectedOrder}
                open={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
            />
        </main>
    );
}

function OrderCard({ order, onOpen }) {
    const customer = getCustomer(order);
    const items = getOrderItems(order);
    const firstItem = items[0];
    const remainingItems = Math.max(0, items.length - 1);
    const address = getShippingAddress(order);

    return (
        <article
            onClick={onOpen}
            className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
            <div className="grid md:grid-cols-[150px_1fr_auto]">
                <div className="relative min-h-[190px] overflow-hidden bg-[#EEE5DA] md:min-h-full">
                    {getImageFromId(firstItem.image) ? (
                        <img
                            src={getImageFromId(firstItem.image)}
                            alt={firstItem?.name || "Ordered saree"}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full min-h-[190px] items-center justify-center text-[#9A7B4F]">
                            <PackageCheck
                                size={42}
                                strokeWidth={1.3}
                            />
                        </div>
                    )}

                    {remainingItems > 0 && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                            +{remainingItems} more
                        </span>
                    )}
                </div>

                <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                            value={order.orderStatus}
                            type="order"
                        />

                        <StatusBadge
                            value={order.paymentStatus}
                            type="payment"
                        />
                    </div>

                    <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#9A7B4F]">
                                Order Number
                            </p>

                            <h2 className="mt-1 font-serif text-2xl md:text-3xl">
                                {order.orderNumber || "Order unavailable"}
                            </h2>

                            <p className="mt-2 text-sm font-medium text-[#181818]">
                                {firstItem?.name || "Product unavailable"}
                            </p>

                            {firstItem?.sku && (
                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8A8178]">
                                    {firstItem.sku}
                                </p>
                            )}
                        </div>

                        <div className="lg:text-right">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#9A7B4F]">
                                Order Total
                            </p>

                            <p className="mt-1 font-serif text-3xl">
                                {formatCurrency(getOrderTotal(order))}
                            </p>

                            <p className="mt-1 text-xs text-[#6B5F54]">
                                {formatPaymentMethod(
                                    order.paymentMethod
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-black/8 pt-5 sm:grid-cols-2 xl:grid-cols-4">
                        <CardDetail
                            icon={<UserRound size={16} />}
                            label="Customer"
                            value={customer.name}
                        />

                        <CardDetail
                            icon={<Phone size={16} />}
                            label="Phone"
                            value={customer.phone}
                        />

                        <CardDetail
                            icon={<MapPin size={16} />}
                            label="Destination"
                            value={
                                [address.city, address.state]
                                    .filter(Boolean)
                                    .join(", ") || "Not available"
                            }
                        />

                        <CardDetail
                            icon={<CalendarDays size={16} />}
                            label="Placed On"
                            value={formatDateTime(
                                order.createdAt ||
                                order.orderDate ||
                                order.bookingDate
                            )}
                        />
                    </div>
                </div>

                <div className="hidden items-center border-l border-black/5 px-5 text-[#9A7B4F] md:flex">
                    <ChevronRight
                        size={22}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </div>
            </div>
        </article>
    );
}

function OrderDetailsDrawer({
    order,
    open,
    onClose,
}) {
    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [open, onClose]);

    if (!open || !order) return null;

    const customer = getCustomer(order);
    const address = getShippingAddress(order);
    const items = getOrderItems(order);
    const tracking = order.tracking || {};

    return (
        <div className="fixed inset-0 z-[1000]">
            <button
                type="button"
                className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-[2px]"
                onClick={onClose}
                aria-label="Close order details"
            />

            <aside className="absolute bottom-0 right-0 top-0 w-full max-w-3xl overflow-y-auto bg-[#F8F3EC] shadow-2xl">
                <div className="sticky top-0 z-20 border-b border-black/10 bg-[#F8F3EC]/95 px-5 py-5 backdrop-blur-xl md:px-8">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                                Online Order
                            </p>

                            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                                {order.orderNumber || "Order Details"}
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <StatusBadge
                                    value={order.orderStatus}
                                    type="order"
                                />

                                <StatusBadge
                                    value={order.paymentStatus}
                                    type="payment"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition hover:rotate-90"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-5 pb-12 md:p-8">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <MiniSummary
                            label="Total"
                            value={formatCurrency(
                                getOrderTotal(order)
                            )}
                        />

                        <MiniSummary
                            label="Items"
                            value={getTotalQuantity(items)}
                        />

                        <MiniSummary
                            label="Payment"
                            value={formatPaymentMethod(
                                order.paymentMethod
                            )}
                        />

                        <MiniSummary
                            label="Ordered"
                            value={formatDate(
                                order.createdAt || order.orderDate
                            )}
                        />
                    </div>

                    <LuxurySection
                        eyebrow="Customer"
                        title="Customer Information"
                        icon={<UserRound size={20} />}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InformationRow
                                label="Full Name"
                                value={customer.name}
                                copyable
                            />

                            <InformationRow
                                label="Mobile Number"
                                value={customer.phone}
                                copyable
                            />

                            <InformationRow
                                label="Email Address"
                                value={customer.email}
                                copyable
                                className="md:col-span-2"
                            />
                        </div>
                    </LuxurySection>

                    <LuxurySection
                        eyebrow="Fulfilment"
                        title="Delivery Address"
                        icon={<MapPin size={20} />}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InformationRow
                                label="Recipient"
                                value={
                                    address.fullName || customer.name
                                }
                            />

                            <InformationRow
                                label="Contact Number"
                                value={
                                    address.phone || customer.phone
                                }
                            />

                            <InformationRow
                                label="Address"
                                value={[
                                    address.addressLine1,
                                    address.addressLine2,
                                    address.landmark,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                                className="md:col-span-2"
                                copyable
                            />

                            <InformationRow
                                label="City"
                                value={address.city}
                            />

                            <InformationRow
                                label="State"
                                value={address.state}
                            />

                            <InformationRow
                                label="PIN Code"
                                value={address.pincode}
                                copyable
                            />
                        </div>
                    </LuxurySection>

                    <LuxurySection
                        eyebrow="Selection"
                        title={`Ordered ${items.length === 1 ? "Saree" : "Sarees"
                            }`}
                        icon={<ShoppingBag size={20} />}
                    >
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <OrderItem
                                    key={
                                        item._id ||
                                        item.productId ||
                                        item.sku ||
                                        index
                                    }
                                    item={item}
                                />
                            ))}
                        </div>
                    </LuxurySection>

                    <LuxurySection
                        eyebrow="Transaction"
                        title="Payment Information"
                        icon={<CreditCard size={20} />}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InformationRow
                                label="Payment Method"
                                value={formatPaymentMethod(
                                    order.paymentMethod
                                )}
                            />

                            <InformationRow
                                label="Payment Status"
                                value={formatLabel(
                                    order.paymentStatus
                                )}
                            />

                            <InformationRow
                                label="Razorpay Order ID"
                                value={
                                    order.razorpayOrderId ||
                                    order.payment?.razorpayOrderId
                                }
                                copyable
                            />

                            <InformationRow
                                label="Razorpay Payment ID"
                                value={
                                    order.razorpayPaymentId ||
                                    order.payment?.razorpayPaymentId
                                }
                                copyable
                            />

                            <InformationRow
                                label="Subtotal"
                                value={formatCurrency(
                                    getSubtotal(order, items)
                                )}
                            />

                            <InformationRow
                                label="Shipping"
                                value={formatCurrency(
                                    getShippingCharge(order)
                                )}
                            />

                            <InformationRow
                                label="Total Paid"
                                value={formatCurrency(
                                    getOrderTotal(order)
                                )}
                                className="md:col-span-2"
                                emphasized
                            />
                        </div>
                    </LuxurySection>

                    {(tracking.courier ||
                        tracking.trackingNumber ||
                        tracking.status) && (
                            <LuxurySection
                                eyebrow="Shipment"
                                title="Tracking Information"
                                icon={<Truck size={20} />}
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <InformationRow
                                        label="Courier"
                                        value={tracking.courier}
                                    />

                                    <InformationRow
                                        label="Tracking Number"
                                        value={tracking.trackingNumber}
                                        copyable
                                    />

                                    <InformationRow
                                        label="Shipment Status"
                                        value={formatLabel(
                                            tracking.status
                                        )}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </LuxurySection>
                        )}

                    {(order.customerNotes ||
                        order.comments ||
                        order.notes) && (
                            <LuxurySection
                                eyebrow="Additional Information"
                                title="Order Notes"
                                icon={<Clipboard size={20} />}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#6B5F54]">
                                    {order.customerNotes ||
                                        order.comments ||
                                        order.notes}
                                </p>
                            </LuxurySection>
                        )}
                </div>
            </aside>
        </div>
    );
}

function OrderItem({ item }) {
    const quantity = Number(item.quantity || 1);
    const sellingPrice = Number(
        item.sellingPrice ??
        item.soldPrice ??
        item.price ??
        0
    );

    const listedPrice = Number(
        item.listedPrice ??
        item.originalPrice ??
        sellingPrice
    );

    return (
        <div className="grid grid-cols-[90px_1fr] gap-4 rounded-[1.5rem] border border-black/5 bg-[#F8F3EC] p-3 md:grid-cols-[110px_1fr_auto] md:items-center">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[#EDE4D8]">
                {getImageFromId(item.image) ? (
                    <img
                        src={getImageFromId(item.image)}
                        alt={item.name || "Ordered saree"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[#9A7B4F]">
                        <Package size={28} />
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F]">
                    {item.sku || "SKU unavailable"}
                </p>

                <h4 className="mt-1 font-serif text-xl">
                    {item.name || "Unnamed Saree"}
                </h4>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6B5F54]">
                    <span>Quantity: {quantity}</span>

                    {item.fabric && (
                        <span>Fabric: {item.fabric}</span>
                    )}

                    {item.color && (
                        <span>Colour: {item.color}</span>
                    )}
                </div>
            </div>

            <div className="col-span-2 border-t border-black/8 pt-3 text-right md:col-span-1 md:border-0 md:pt-0">
                {listedPrice > sellingPrice && (
                    <p className="text-xs text-[#8A8178] line-through">
                        {formatCurrency(listedPrice * quantity)}
                    </p>
                )}

                <p className="mt-1 font-serif text-2xl">
                    {formatCurrency(sellingPrice * quantity)}
                </p>
            </div>
        </div>
    );
}

function LuxurySection({
    eyebrow,
    title,
    icon,
    children,
}) {
    return (
        <section className="rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-4 border-b border-black/8 pb-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
                    {icon}
                </span>

                <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9A7B4F]">
                        {eyebrow}
                    </p>

                    <h3 className="mt-1 font-serif text-2xl">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="mt-5">{children}</div>
        </section>
    );
}

function InformationRow({
    label,
    value,
    copyable = false,
    emphasized = false,
    className = "",
}) {
    return (
        <div
            className={`rounded-2xl bg-[#F8F3EC] p-4 ${className}`}
        >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A7B4F]">
                {label}
            </p>

            <div className="mt-2 flex items-start justify-between gap-3">
                <p
                    className={`min-w-0 break-words ${emphasized
                        ? "font-serif text-2xl"
                        : "text-sm font-medium leading-6"
                        }`}
                >
                    {value || "Not available"}
                </p>

                {copyable && value && (
                    <CopyButton value={String(value)} />
                )}
            </div>
        </div>
    );
}

function CopyButton({ value }) {
    const [copied, setCopied] = useState(false);
    const resetTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            window.clearTimeout(resetTimerRef.current);
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);

            window.clearTimeout(resetTimerRef.current);
            resetTimerRef.current = window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#9A7B4F] shadow-sm transition hover:text-[#181818]"
            aria-label="Copy value"
        >
            {copied ? (
                <Check size={14} />
            ) : (
                <Clipboard size={14} />
            )}
        </button>
    );
}

function StatusBadge({ value, type }) {
    const normalized = normalizeStatus(value);

    const styles = {
        PAID: "bg-emerald-100 text-emerald-800",
        PENDING: "bg-amber-100 text-amber-800",
        FAILED: "bg-red-100 text-red-800",
        REFUNDED: "bg-purple-100 text-purple-800",

        CONFIRMED: "bg-blue-100 text-blue-800",
        PROCESSING: "bg-amber-100 text-amber-800",
        SHIPPED: "bg-indigo-100 text-indigo-800",
        DELIVERED: "bg-emerald-100 text-emerald-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    const fallback =
        type === "payment"
            ? "bg-[#F2EADD] text-[#7A5C2E]"
            : "bg-black/10 text-[#181818]";

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${styles[normalized] || fallback
                }`}
        >
            {formatLabel(value) || "Unknown"}
        </span>
    );
}

function SummaryCard({ icon, label, value }) {
    return (
        <div className="min-w-0 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7B4F]">
                {icon}
            </div>

            <p className="mt-4 text-[9px] uppercase tracking-[0.17em] text-[#8A8178]">
                {label}
            </p>

            <p className="mt-1 truncate font-serif text-xl md:text-2xl">
                {value}
            </p>
        </div>
    );
}

function MiniSummary({ label, value }) {
    return (
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#9A7B4F]">
                {label}
            </p>

            <p className="mt-2 truncate font-serif text-xl">
                {value || "—"}
            </p>
        </div>
    );
}

function CardDetail({ icon, label, value }) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 text-[#9A7B4F]">
                {icon}
            </span>

            <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.17em] text-[#9A7B4F]">
                    {label}
                </p>

                <p className="mt-1 truncate text-xs font-medium">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}

function LuxurySelect({
    value,
    onChange,
    options,
    ariaLabel,
}) {
    return (
        <label className="relative block">
            <span className="sr-only">{ariaLabel}</span>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="w-full appearance-none rounded-full border border-black/10 bg-white px-5 py-4 pr-11 text-sm outline-none transition focus:border-[#9A7B4F]"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9A7B4F]"
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
        if (!hasMore || loading) {
            return undefined;
        }

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

        const element = ref.current;

        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore]);

    return <div ref={ref} className="h-12" />;
}

function EmptyState({ onClear }) {
    return (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm md:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7B4F]">
                <ShoppingBag
                    size={30}
                    strokeWidth={1.4}
                />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                Order Collection
            </p>

            <h3 className="mt-3 font-serif text-4xl">
                No orders found
            </h3>

            <p className="mt-4 text-[#6B5F54]">
                Try changing the search or status filters.
            </p>

            <button
                type="button"
                onClick={onClear}
                className="mt-8 rounded-full bg-[#181818] px-8 py-4 text-sm font-medium text-white"
            >
                Clear Filters
            </button>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm md:p-16">
            <p className="text-xs uppercase tracking-[0.35em] text-red-600">
                Unable to Load
            </p>

            <h3 className="mt-3 font-serif text-4xl">
                Orders could not be loaded
            </h3>

            <p className="mt-4 text-[#6B5F54]">
                Refresh the page and try again.
            </p>
        </div>
    );
}

function getCustomer(order) {
    return {
        name:
            order?.customer?.name ||
            order?.buyer?.name ||
            order?.customerName ||
            "Not available",

        phone:
            order?.customer?.phone ||
            order?.buyer?.phone ||
            order?.phone ||
            "Not available",

        email:
            order?.customer?.email ||
            order?.buyer?.email ||
            order?.email ||
            "Not available",
    };
}

function getShippingAddress(order) {
    return (
        order?.shippingAddress ||
        order?.deliveryAddress ||
        order?.address ||
        {}
    );
}

function getOrderItems(order) {
    return Array.isArray(order?.items)
        ? order.items
        : [];
}

function getOrderTotal(order) {
    return Number(
        order?.totalAmount ??
        order?.totalSoldPrice ??
        order?.orderAmount ??
        order?.amount ??
        0
    );
}

function getSubtotal(order, items) {
    if (
        order?.subtotal !== undefined &&
        order?.subtotal !== null
    ) {
        return Number(order.subtotal);
    }

    return items.reduce((total, item) => {
        const quantity = Number(item.quantity || 1);

        const sellingPrice = Number(
            item.sellingPrice ??
            item.soldPrice ??
            item.price ??
            0
        );

        return total + sellingPrice * quantity;
    }, 0);
}

function getShippingCharge(order) {
    return Number(
        order?.shippingCharge ??
        order?.deliveryCharge ??
        0
    );
}

function getTotalQuantity(items) {
    return items.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );
}

function normalizeStatus(value) {
    return String(value || "")
        .trim()
        .replaceAll("-", "_")
        .replaceAll(" ", "_")
        .toUpperCase();
}

function formatLabel(value) {
    if (!value) return "";

    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
}

function formatPaymentMethod(value) {
    const normalized = normalizeStatus(value);

    const labels = {
        ONLINE: "Online Payment",
        RAZORPAY: "Razorpay",
        CASH: "Cash",
        UPI: "UPI",
        BANK_TRANSFER: "Bank Transfer",
    };

    return labels[normalized] || formatLabel(value) || "Not available";
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatDateTime(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}
