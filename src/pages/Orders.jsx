import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ChevronDown,
    Eye,
    PackageCheck,
    Phone,
    ReceiptText,
    Search,
    ShoppingBag,
    User,
    X,
} from "lucide-react";
import PremiumLoader from "../components/PremiumLoader";
import { apiCall } from "../serice/api";

const STATUS_OPTIONS = [
    { label: "All Orders", value: "all" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Returned", value: "RETURNED" },
];

export default function Orders() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (status !== "all") params.set("status", status);

        return params.toString();
    }, [search, status]);

    const { data, isLoading, isRefetching } = useQuery({
        queryKey: ["orders", queryString],
        queryFn: () => apiCall(`/api/orders?${queryString}`),
    });

    const orders = data?.data || [];

    const totalRevenue = useMemo(() => {
        return orders.reduce((sum, order) => sum + Number(order.totalSoldPrice || order.totalAmount || 0), 0);
    }, [orders]);

    const totalItems = useMemo(() => {
        return orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
    }, [orders]);

    return (
        <main className="min-h-screen bg-[#F8F3EC] text-[#181818] px-5 pt-12 pb-20">
            {isLoading && <PremiumLoader />}

            <section className="max-w-7xl mx-auto">
                <div className="rounded-[2.5rem] bg-gradient-to-br from-[#17130F] via-[#241B13] to-[#0F0D0B] text-white px-6 md:px-10 py-8 md:py-10 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[#D7B77A]">
                        Pratibha Silks
                    </p>

                    <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <h1 className="font-serif text-5xl md:text-7xl leading-none">
                                Orders
                            </h1>

                            <p className="mt-4 max-w-2xl text-white/65 leading-7">
                                Manage completed saree sales, buyer details, order values and product history in one elegant place.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <StatCard label="Orders" value={orders.length} />
                            <StatCard label="Sarees Sold" value={totalItems} />
                            <StatCard label="Revenue" value={`₹${totalRevenue}`} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-[2rem] bg-white border border-[#E8DCCB] p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        <div className="relative flex-1">
                            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A7B4F]" />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order no, buyer name, phone or SKU..."
                                className="w-full rounded-full border border-[#E2D5C3] bg-[#FFFCF8] pl-11 pr-4 py-3.5 text-sm outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10"
                            />
                        </div>

                        <label className="relative min-w-[220px]">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full appearance-none rounded-full border border-[#E2D5C3] bg-[#FFFCF8] px-5 py-3.5 pr-11 text-sm outline-none focus:border-[#B88A44]"
                            >
                                {STATUS_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A7B4F]" />
                        </label>
                    </div>
                </div>

                {isRefetching && (
                    <p className="mt-4 text-sm text-[#9A7B4F]">
                        Refreshing orders...
                    </p>
                )}

                <section className="mt-8">
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    onView={() => setSelectedOrder(order)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyOrders />
                    )}
                </section>
            </section>

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </main>
    );
}

function OrderCard({ order, onView }) {
    const amount = order.totalSoldPrice || order.totalAmount || 0;
    const buyerName = order.buyer?.name || "—";
    const buyerPhone = order.buyer?.phone || "—";

    return (
        <div className="rounded-[2rem] bg-white border border-[#E8DCCB] p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)] transition">
            <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#17130F] text-white px-3 py-1 text-xs">
                            {order.orderNo || order.orderSku || order._id}
                        </span>

                        <StatusBadge status={order.status} />

                        <span className="text-xs text-[#8A7A68]">
                            {formatDate(order.soldAt || order.createdAt)}
                        </span>
                    </div>

                    <h3 className="font-serif text-2xl mt-3 text-[#1F1A14]">
                        {buyerName}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#6B5F54]">
                        <span className="flex items-center gap-1.5">
                            <Phone size={14} />
                            {buyerPhone}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <ShoppingBag size={14} />
                            {order.items?.length || 0} item(s)
                        </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(order.items || []).slice(0, 3).map((item) => (
                            <span
                                key={item.productId || item.sku}
                                className="rounded-full bg-[#F8F3EC] border border-[#E8DCCB] px-3 py-1 text-xs text-[#6B5F54]"
                            >
                                {item.sku}
                            </span>
                        ))}

                        {(order.items || []).length > 3 && (
                            <span className="rounded-full bg-[#F8F3EC] border border-[#E8DCCB] px-3 py-1 text-xs text-[#6B5F54]">
                                +{order.items.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex xl:flex-col items-center xl:items-end justify-between gap-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                            Order Value
                        </p>

                        <p className="text-3xl font-semibold text-[#181818]">
                            ₹{amount}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17130F] px-5 py-3 text-sm text-white hover:bg-black transition"
                    >
                        <Eye size={16} />
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    const amount = order.totalSoldPrice || order.totalAmount || 0;

    return (
        <div className="fixed inset-0 z-[999] bg-black/55 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-dvh flex items-start justify-center px-3 py-6 sm:px-5 sm:py-8">
                <div className="w-full max-w-[860px] rounded-[2rem] bg-[#FFFCF8] border border-[#E8DCCB] shadow-[0_30px_90px_rgba(0,0,0,0.28)] overflow-hidden">
                    <div className="relative bg-gradient-to-br from-[#17130F] via-[#241B13] to-[#0F0D0B] text-white px-5 sm:px-8 py-6">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                        >
                            <X size={18} />
                        </button>

                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D7B77A]">
                            Order Details
                        </p>

                        <h2 className="font-serif text-3xl sm:text-4xl mt-2">
                            {order.orderNo || order.orderSku || order._id}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                            <StatusBadge status={order.status} dark />
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white/75">
                                {formatDate(order.soldAt || order.createdAt)}
                            </span>
                            <span className="rounded-full bg-[#D7B77A] text-[#1A120B] px-3 py-1 font-semibold">
                                ₹{amount}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 sm:p-8">
                        <div className="grid md:grid-cols-2 gap-4">
                            <InfoCard
                                icon={<User size={17} />}
                                label="Buyer"
                                value={order.buyer?.name || "—"}
                                subValue={order.buyer?.phone || "—"}
                            />

                            <InfoCard
                                icon={<ReceiptText size={17} />}
                                label="Order Summary"
                                value={`${order.items?.length || 0} Saree(s)`}
                                subValue={`Total ₹${amount}`}
                            />
                        </div>

                        <div className="mt-7">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F]">
                                Products
                            </p>

                            <div className="mt-3 space-y-3">
                                {(order.items || []).map((item) => (
                                    <div
                                        key={item.productId || item.sku}
                                        className="rounded-[1.5rem] bg-white border border-[#E8DCCB] p-4"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-serif text-xl text-[#1F1A14]">
                                                    {item.name}
                                                </h4>

                                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#6B5F54]">
                                                    <span>SKU: {item.sku}</span>
                                                    {item.fabric && <span>• {item.fabric}</span>}
                                                    {item.color && <span>• {item.color}</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
                                                <PriceBox label="Listed" value={item.listedPrice || item.price} />
                                                <PriceBox label="Sold" value={item.soldPrice} dark />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.comments && (
                            <div className="mt-7 rounded-[1.5rem] bg-[#F8F3EC] border border-[#E8DCCB] p-5">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F]">
                                    Comments
                                </p>

                                <p className="mt-2 text-sm leading-7 text-[#5E5247]">
                                    {order.comments}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="px-5 sm:px-8 pb-5 sm:pb-8">
                        <button
                            onClick={onClose}
                            className="w-full rounded-full bg-[#17130F] text-white py-3.5 text-sm hover:bg-black transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl bg-white/8 border border-white/10 px-4 py-3 min-w-[120px]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D7B77A]">
                {label}
            </p>

            <p className="mt-1 text-2xl font-semibold">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status = "COMPLETED", dark = false }) {
    const styles = {
        COMPLETED: dark
            ? "bg-emerald-400/15 text-emerald-200 border-emerald-300/20"
            : "bg-emerald-50 text-emerald-700 border-emerald-100",
        CANCELLED: dark
            ? "bg-red-400/15 text-red-200 border-red-300/20"
            : "bg-red-50 text-red-700 border-red-100",
        RETURNED: dark
            ? "bg-amber-400/15 text-amber-200 border-amber-300/20"
            : "bg-amber-50 text-amber-700 border-amber-100",
    };

    return (
        <span className={`rounded-full border px-3 py-1 text-xs ${styles[status] || styles.COMPLETED}`}>
            {status}
        </span>
    );
}

function InfoCard({ icon, label, value, subValue }) {
    return (
        <div className="rounded-[1.5rem] bg-white border border-[#E8DCCB] p-5">
            <div className="flex items-center gap-2 text-[#9A7B4F]">
                {icon}
                <p className="text-[10px] uppercase tracking-[0.28em]">
                    {label}
                </p>
            </div>

            <p className="mt-3 font-serif text-2xl text-[#1F1A14]">
                {value}
            </p>

            <p className="mt-1 text-sm text-[#6B5F54]">
                {subValue}
            </p>
        </div>
    );
}

function PriceBox({ label, value, dark = false }) {
    return (
        <div className={`rounded-2xl px-4 py-3 ${dark ? "bg-[#17130F] text-white" : "bg-[#F8F3EC] text-[#181818]"}`}>
            <p className={`text-[9px] uppercase tracking-[0.22em] ${dark ? "text-[#D7B77A]" : "text-[#9A7B4F]"}`}>
                {label}
            </p>

            <p className="mt-1 font-semibold">
                ₹{value || 0}
            </p>
        </div>
    );
}

function EmptyOrders() {
    return (
        <div className="rounded-[2rem] bg-white border border-[#E8DCCB] p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
            <PackageCheck size={48} className="mx-auto text-[#CBB69A]" />

            <p className="mt-5 text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                No Orders
            </p>

            <h3 className="font-serif text-4xl mt-3">
                No sales recorded yet
            </h3>

            <p className="text-[#6B5F54] mt-4">
                Once sarees are marked as sold, orders will appear here.
            </p>
        </div>
    );
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}