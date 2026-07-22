import { Edit, Trash2 } from "lucide-react";
import { formatMoney, formatDate } from "../../data/util";
import { CategoryBadge } from "./CategoryBadge";
import { MobileMeta } from "./MobileMeta";

export function PaymentMobileCard({ payment, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] border border-black/5">
            <div className="flex justify-between gap-4">
                <div>
                    <CategoryBadge category={payment.category} />

                    <h3 className="font-serif text-3xl mt-3 leading-none">
                        {payment.type || "Untitled payment"}
                    </h3>
                </div>

                <p className="font-serif text-3xl">
                    {formatMoney(payment.amount)}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-[#6B5F54]">
                <MobileMeta
                    label="Payment Type"
                    value={payment.paymentType || "Miscellaneous"}
                />
                <MobileMeta label="Source" value={payment.source || "-"} />
                <MobileMeta label="Date" value={formatDate(payment.date)} />
                <MobileMeta label="Paid Via" value={payment.paidVia || "-"} />
                <MobileMeta
                    label="Per Unit"
                    value={
                        payment.quantity
                            ? formatMoney(payment.amount / payment.quantity)
                            : "-"
                    }
                />
                <MobileMeta label="Quantity" value={payment.quantity || "-"} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                    onClick={onEdit}
                    className="bg-[#181818] text-white rounded-full py-3 text-sm flex items-center justify-center gap-2"
                >
                    <Edit size={15} />
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="bg-red-50 text-red-700 rounded-full py-3 text-sm flex items-center justify-center gap-2"
                >
                    <Trash2 size={15} />
                    Delete
                </button>
            </div>
        </div>
    );
}
