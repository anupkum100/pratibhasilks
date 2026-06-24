import { useQuery } from "@tanstack/react-query";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    PackageCheck, ReceiptText,
    Search, User,
    X
} from "lucide-react";
import { useMemo, useState } from "react";
import PremiumLoader from "../components/PremiumLoader";
import { formatDate, formatMoney } from "../data/util";
import { apiCall } from "../serice/api";

const STATUS_OPTIONS = [
    { label: "All Orders", value: "all" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Returned", value: "RETURNED" },
];

const PAGE_SIZE = 8;

export default function Orders() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(1);

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

    const totalRevenue = useMemo(
        () =>
            orders.reduce(
                (sum, order) =>
                    sum + Number(order.totalSoldPrice || order.totalAmount || 0),
                0
            ),
        [orders]
    );

    const totalItems = useMemo(
        () => orders.reduce((sum, order) => sum + (order.items?.length || 0), 0),
        [orders]
    );

    const paginatedOrders = orders.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const totalPages = Math.ceil(orders.length / PAGE_SIZE);

    return (
        <main className="min-h-screen bg-[#F8F3EC] text-[#181818] px-5 py-10 md:py-16">
            {isLoading && <PremiumLoader />}

            <section className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
                            Sales Ledger
                        </p>

                        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-none">
                            Orders
                        </h1>

                        <p className="text-[#6B5F54] mt-5 max-w-2xl leading-7">
                            Manage saree sales, buyer information, order value and product
                            history in one refined business view.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    <SummaryCard title="Orders" value={orders.length} />
                    <SummaryCard title="Sarees Sold" value={totalItems} />
                    <SummaryCard title="Revenue" value={formatMoney(totalRevenue)} />
                    <SummaryCard title="Status" value={status === "all" ? "All" : status} />
                </div>

                <div className="mt-8 bg-white rounded-[2rem] p-4 md:p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
                    <div className="grid md:grid-cols-[1fr_220px] gap-3">
                        <div className="flex items-center gap-3 bg-[#F8F3EC] rounded-full px-4 py-3">
                            <Search size={18} className="text-[#9A7B4F]" />

                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search order, buyer, phone or SKU..."
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        </div>

                        <label className="relative">
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full appearance-none bg-[#F8F3EC] rounded-full px-4 py-3 pr-11 text-sm outline-none"
                            >
                                {STATUS_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={16}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A7B4F]"
                            />
                        </label>
                    </div>
                </div>

                {isRefetching && (
                    <p className="mt-4 text-sm text-[#9A7B4F]">Refreshing orders...</p>
                )}

                {orders.length > 0 ? (
                    <>
                        <div className="hidden md:block mt-6 bg-white rounded-[2rem] overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
                            <table className="w-full text-sm">
                                <thead className="bg-[#181818] text-white">
                                    <tr>
                                        <TableHead label="Order" />
                                        <TableHead label="Buyer" />
                                        <TableHead label="Phone" />
                                        <TableHead label="Items" />
                                        <TableHead label="Amount" />
                                        <TableHead label="Status" />
                                        <TableHead label="Date" />
                                        <TableHead label="Action" />
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedOrders.map((order) => (
                                        <OrderRow
                                            key={order._id}
                                            order={order}
                                            onView={() => setSelectedOrder(order)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden mt-6 space-y-4">
                            {paginatedOrders.map((order) => (
                                <OrderMobileCard
                                    key={order._id}
                                    order={order}
                                    onView={() => setSelectedOrder(order)}
                                />
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
                            onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        />
                    </>
                ) : (
                    <div className="mt-8">
                        <EmptyOrders />
                    </div>
                )}
            </section>

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </main>
    );
}

function OrderRow({ order, onView }) {
    const amount = order.totalSoldPrice || order.totalAmount || 0;
    const buyerName = order.buyer?.name || "—";
    const buyerPhone = order.buyer?.phone || "—";

    return (
        <tr className="border-b border-black/5 hover:bg-[#F8F3EC]/70 transition">
            <td className="p-5 font-medium">
                <span className="rounded-full bg-[#181818] text-white px-3 py-1 text-xs">
                    {order.orderNo || order.orderSku || order._id}
                </span>
            </td>

            <td className="p-5 font-serif text-xl">{buyerName}</td>

            <td className="p-5 text-[#6B5F54]">{buyerPhone}</td>

            <td className="p-5">{order.items?.length || 0}</td>

            <td className="p-5 font-semibold">{formatMoney(amount)}</td>

            <td className="p-5">
                <StatusBadge status={order.status} />
            </td>

            <td className="p-5 text-[#6B5F54]">
                {formatDate(order.soldAt || order.createdAt)}
            </td>

            <td className="p-5">
                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex items-center gap-2 rounded-full bg-[#181818] text-white px-4 py-2 text-xs"
                >
                    <Eye size={14} />
                    View
                </button>
            </td>
        </tr>
    );
}

function OrderMobileCard({ order, onView }) {
    const amount = order.totalSoldPrice || order.totalAmount || 0;
    const buyerName = order.buyer?.name || "—";
    const buyerPhone = order.buyer?.phone || "—";

    return (
        <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
            <div className="flex justify-between gap-4">
                <div>
                    <StatusBadge status={order.status} />

                    <h3 className="font-serif text-3xl mt-3 leading-none">
                        {buyerName}
                    </h3>

                    <p className="text-xs text-[#6B5F54] mt-2">
                        {order.orderNo || order.orderSku || order._id}
                    </p>
                </div>

                <p className="font-serif text-3xl">{formatMoney(amount)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                <MobileMeta label="Phone" value={buyerPhone} />
                <MobileMeta label="Items" value={`${order.items?.length || 0} saree(s)`} />
                <MobileMeta
                    label="Date"
                    value={formatDate(order.soldAt || order.createdAt)}
                />
                <MobileMeta
                    label="SKUs"
                    value={(order.items || [])
                        .slice(0, 2)
                        .map((item) => item.sku)
                        .join(", ") || "—"}
                />
            </div>

            <button
                type="button"
                onClick={onView}
                className="mt-5 w-full bg-[#181818] text-white rounded-full py-3 text-sm flex items-center justify-center gap-2"
            >
                <Eye size={16} />
                View Details
            </button>
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
                    <div className="relative bg-[#181818] text-white px-5 sm:px-8 py-6">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                        >
                            <X size={18} />
                        </button>

                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D7B77A]">
                            Order Details
                        </p>

                        <h2 className="font-serif text-3xl sm:text-4xl mt-2 pr-10">
                            {order.orderNo || order.orderSku || order._id}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                            <StatusBadge status={order.status} dark />
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white/75">
                                {formatDate(order.soldAt || order.createdAt)}
                            </span>
                            <span className="rounded-full bg-[#D7B77A] text-[#1A120B] px-3 py-1 font-semibold">
                                {formatMoney(amount)}
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
                                subValue={`Total ${formatMoney(amount)}`}
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
                                                <PriceBox
                                                    label="Listed"
                                                    value={item.listedPrice || item.price}
                                                />
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
                            className="w-full rounded-full bg-[#181818] text-white py-3.5 text-sm hover:bg-black transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] border border-black/5">
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9A7B4F]">
                {title}
            </p>

            <p className="font-serif text-3xl md:text-4xl mt-3">{value}</p>
        </div>
    );
}

function TableHead({ label }) {
    return <th className="p-5 text-left font-medium">{label}</th>;
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
        <span
            className={`rounded-full border px-3 py-1 text-xs ${styles[status] || styles.COMPLETED
                }`}
        >
            {status || "COMPLETED"}
        </span>
    );
}

function InfoCard({ icon, label, value, subValue }) {
    return (
        <div className="rounded-[1.5rem] bg-white border border-[#E8DCCB] p-5">
            <div className="flex items-center gap-2 text-[#9A7B4F]">
                {icon}
                <p className="text-[10px] uppercase tracking-[0.28em]">{label}</p>
            </div>

            <p className="mt-3 font-serif text-2xl text-[#1F1A14]">{value}</p>

            <p className="mt-1 text-sm text-[#6B5F54]">{subValue}</p>
        </div>
    );
}

function PriceBox({ label, value, dark = false }) {
    return (
        <div
            className={`rounded-2xl px-4 py-3 ${dark ? "bg-[#181818] text-white" : "bg-[#F8F3EC] text-[#181818]"
                }`}
        >
            <p
                className={`text-[9px] uppercase tracking-[0.22em] ${dark ? "text-[#D7B77A]" : "text-[#9A7B4F]"
                    }`}
            >
                {label}
            </p>

            <p className="mt-1 font-semibold">{formatMoney(value || 0)}</p>
        </div>
    );
}

function MobileMeta({ label, value }) {
    return (
        <div className="bg-[#F8F3EC] rounded-2xl p-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7B4F]">
                {label}
            </p>

            <p className="mt-1 text-[#181818] font-medium break-words">{value}</p>
        </div>
    );
}

function Pagination({ page, totalPages, onPrev, onNext }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-8">
            <button
                onClick={onPrev}
                disabled={page === 1}
                className="h-11 w-11 rounded-full bg-white disabled:opacity-40 flex items-center justify-center shadow-md"
            >
                <ChevronLeft size={18} />
            </button>

            <p className="text-sm text-[#6B5F54]">
                Page <span className="text-[#181818] font-medium">{page}</span> of{" "}
                {totalPages}
            </p>

            <button
                onClick={onNext}
                disabled={page === totalPages}
                className="h-11 w-11 rounded-full bg-white disabled:opacity-40 flex items-center justify-center shadow-md"
            >
                <ChevronRight size={18} />
            </button>
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

            <h3 className="font-serif text-4xl mt-3">No sales recorded yet</h3>

            <p className="text-[#6B5F54] mt-4">
                Once sarees are marked as sold, orders will appear here.
            </p>
        </div>
    );
}