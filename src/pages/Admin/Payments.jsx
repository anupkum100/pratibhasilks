import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Edit, Plus,
    Search, Trash2
} from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryBadge } from "../../components/Payments/CategoryBadge";
import { Pagination } from "../../components/Payments/Pagination";
import { PaymentMobileCard } from "../../components/Payments/PaymentMobileCard";
import { PaymentModal } from "../../components/Payments/PaymentModal";
import { PaymentTypeBadge } from "../../components/Payments/PaymentTypeBadge";
import { SummaryCard } from "../../components/Payments/SummaryCard";
import { TableHead } from "../../components/Payments/TableHead";
import PremiumLoader from "../../components/PremiumLoader";
import { formatDate, formatMoney } from "../../data/util";
import { apiCall } from "../../serice/api";

const pageSize = 8;

const unwrapApiResponse = (response, fallbackMessage) => {
    if (response?.error) {
        throw new Error(response.error.message || fallbackMessage);
    }

    return response;
};

export default function PaymentsPage() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", pageSize);
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);

        if (search.trim()) params.set("search", search.trim());
        if (category !== "All") params.set("category", category);

        return params.toString();
    }, [search, category, sortBy, sortOrder, page]);

    const { data, isLoading, isRefetching, error } = useQuery({
        queryKey: ["payments", queryString],
        queryFn: async () =>
            unwrapApiResponse(
                await apiCall(`/api/payments?${queryString}`),
                "Failed to fetch payments"
            ),
    });

    const payments = data?.data || [];
    const pagination = data?.pagination || {};
    const summary = data?.summary || {};

    const savePaymentMutation = useMutation({
        mutationFn: async (payload) => {
            const response = payload._id
                ? await apiCall(`/api/payments/${payload._id}`, "PUT", payload)
                : await apiCall("/api/payments", "POST", payload);

            return unwrapApiResponse(response, "Failed to save payment");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            setOpenModal(false);
            setEditingPayment(null);
        },
        onError: (error) => {
            alert(error.message || "Failed to save payment");
        },
    });

    const deletePaymentMutation = useMutation({
        mutationFn: async (id) =>
            unwrapApiResponse(
                await apiCall(`/api/payments/${id}`, "DELETE"),
                "Failed to delete payment"
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error) => {
            alert(error.message || "Failed to delete payment");
        },
    });

    const handleSort = (key) => {
        setPage(1);

        if (sortBy === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortOrder("desc");
        }
    };

    const openAddModal = () => {
        setEditingPayment(null);
        setOpenModal(true);
    };

    const openEditModal = (payment) => {
        setEditingPayment(payment);
        setOpenModal(true);
    };

    const handleSavePayment = (payment) => {
        savePaymentMutation.mutate({
            ...payment,
            type: payment.type || "",
            amount: Number(payment.amount || 0),
            quantity: Number(payment.quantity || 1),
        });
    };

    const handleDeletePayment = (payment) => {
        const confirmed = window.confirm(`Delete payment "${payment.paymentType}"?`);

        if (!confirmed) return;

        deletePaymentMutation.mutate(payment._id);
    };

    return (
        <main className="min-h-screen bg-[#F8F3EC] text-[#181818] px-5 py-10 md:py-16">
            {(isLoading ||
                savePaymentMutation.isPending ||
                deletePaymentMutation.isPending) && <PremiumLoader />}

            <section className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
                            Business Ledger
                        </p>

                        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-none">
                            Payments & Procurement
                        </h1>

                        <p className="text-[#6B5F54] mt-5 max-w-2xl leading-7">
                            Track saree lots, packaging, courier, website and operational
                            expenses in one premium business ledger.
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="bg-[#181818] text-white px-6 py-4 rounded-full flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <Plus size={18} />
                        Add Payment
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    <SummaryCard
                        title="Total Spend"
                        value={formatMoney(summary.totalSpend)}
                    />
                    <SummaryCard
                        title="Inventory"
                        value={formatMoney(summary.inventorySpend)}
                    />
                    <SummaryCard
                        title="Expenses"
                        value={formatMoney(summary.expenseSpend)}
                    />
                    <SummaryCard
                        title="Transactions"
                        value={summary.transactions || 0}
                    />
                </div>

                <div className="mt-8 bg-white rounded-[2rem] p-4 md:p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
                    <div className="grid md:grid-cols-[1fr_180px_180px] gap-3">
                        <div className="flex items-center gap-3 bg-[#F8F3EC] rounded-full px-4 py-3">
                            <Search size={18} className="text-[#9A7B4F]" />

                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search type, payment type, source, paid via..."
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value);
                                setPage(1);
                            }}
                            className="bg-[#F8F3EC] rounded-full px-4 py-3 text-sm outline-none"
                        >
                            <option>All</option>
                            <option>Inventory</option>
                            <option>Expense</option>
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(event) => {
                                const [key, order] = event.target.value.split("-");
                                setSortBy(key);
                                setSortOrder(order);
                                setPage(1);
                            }}
                            className="bg-[#F8F3EC] rounded-full px-4 py-3 text-sm outline-none"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Amount High</option>
                            <option value="amount-asc">Amount Low</option>
                            <option value="type-asc">Type A-Z</option>
                            <option value="paymentType-asc">Payment Type A-Z</option>
                        </select>
                    </div>
                </div>

                {isRefetching && (
                    <p className="mt-4 text-sm text-[#9A7B4F]">
                        Refreshing payments...
                    </p>
                )}

                {error ? (
                    <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
                        <h2 className="font-serif text-3xl text-red-800">
                            Unable to load payments
                        </h2>
                        <p className="mt-2 text-sm text-red-700">
                            {error.message || "Please try again."}
                        </p>
                    </div>
                ) : (
                    <>
                <div className="hidden md:block mt-6 bg-white rounded-[2rem] overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
                    <table className="w-full text-sm">
                        <thead className="bg-[#181818] text-white">
                            <tr>
                                <TableHead label="Type" onClick={() => handleSort("type")} />
                                <TableHead label="Category" />
                                <TableHead label="Payment Type" />
                                <TableHead label="Amount" onClick={() => handleSort("amount")} />
                                <TableHead label="Qty" />
                                <TableHead label="Per Unit" />
                                <TableHead label="Source" />
                                <TableHead label="Date" onClick={() => handleSort("date")} />
                                <TableHead label="Paid Via" />
                                <TableHead label="Action" />
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className="border-b border-black/5 hover:bg-[#F8F3EC]/70 transition"
                                >
                                    <td className="p-5 font-medium">
                                        {payment.type || "-"}
                                    </td>

                                    <td className="p-5">
                                        <CategoryBadge category={payment.category} />
                                    </td>

                                    <td className="p-5">
                                        <PaymentTypeBadge
                                            paymentType={payment.paymentType || "Miscellaneous"}
                                        />
                                    </td>

                                    <td className="p-5 font-semibold">
                                        {formatMoney(payment.amount)}
                                    </td>

                                    <td className="p-5">{payment.quantity || "-"}</td>

                                    <td className="p-5">
                                        {payment.quantity
                                            ? formatMoney(payment.amount / payment.quantity)
                                            : "-"}
                                    </td>

                                    <td className="p-5">{payment.source || "-"}</td>

                                    <td className="p-5">{formatDate(payment.date)}</td>

                                    <td className="p-5">{payment.paidVia || "-"}</td>

                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(payment)}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#181818] text-white px-4 py-2 text-xs"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeletePayment(payment)}
                                                className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-4 py-2 text-xs hover:bg-red-600 hover:text-white transition"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!payments.length && (
                        <div className="p-10 text-center text-[#6B5F54]">
                            No payments found.
                        </div>
                    )}
                </div>

                <div className="md:hidden mt-6 space-y-4">
                    {payments.map((payment) => (
                        <PaymentMobileCard
                            key={payment._id}
                            payment={payment}
                            onEdit={() => openEditModal(payment)}
                            onDelete={() => handleDeletePayment(payment)}
                        />
                    ))}

                    {!payments.length && (
                        <div className="bg-white rounded-[1.75rem] p-8 text-center text-[#6B5F54] shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
                            No payments found.
                        </div>
                    )}
                </div>

                <Pagination
                    page={pagination.page || page}
                    totalPages={pagination.totalPages || 1}
                    onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                        setPage((prev) => Math.min(prev + 1, pagination.totalPages || 1))
                    }
                />
                    </>
                )}
            </section>

            <PaymentModal
                open={openModal}
                payment={editingPayment}
                onClose={() => {
                    setOpenModal(false);
                    setEditingPayment(null);
                }}
                onSubmit={handleSavePayment}
            />
        </main>
    );
}
