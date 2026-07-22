import { X } from "lucide-react";
import { useState, useEffect } from "react";
import {
    PAID_VIA_OPTIONS,
    PAYMENT_CATEGORY_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
    withCurrentOption,
} from "./constants";
import { Field, SelectField } from "./FormFields";

const emptyPayment = {
    type: "",
    category: "Expense",
    paymentType: "Miscellaneous",
    amount: "",
    quantity: "",
    source: "",
    paidVia: "",
    date: "",
    comment: "",
};

export function PaymentModal({ open, payment, onClose, onSubmit }) {
    const [form, setForm] = useState(emptyPayment);

    useEffect(() => {
        if (payment) {
            setForm({
                ...emptyPayment,
                ...payment,
                date: payment.date ? payment.date.slice(0, 10) : "",
            });
        } else {
            setForm(emptyPayment);
        }
    }, [payment, open]);

    if (!open) return null;

    const isEdit = Boolean(payment?._id);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-[#F8F3EC] w-full max-w-2xl rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl"
            >
                <div className="bg-[#181818] text-white px-6 py-5 flex justify-between">
                    <div>
                        <p className="text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                            {isEdit ? "Update Entry" : "New Entry"}
                        </p>

                        <h2 className="font-serif text-4xl mt-2">
                            {isEdit ? "Edit Payment" : "Add Payment"}
                        </h2>
                    </div>

                    <button type="button" onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-4">
                    <Field
                        label="Type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        placeholder="Saree Lot 5, Courier, Website..."
                    />

                    <SelectField
                        label="Category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        options={withCurrentOption(PAYMENT_CATEGORY_OPTIONS, form.category)}
                    />

                    <SelectField
                        label="Payment Type"
                        name="paymentType"
                        value={form.paymentType}
                        onChange={handleChange}
                        options={withCurrentOption(PAYMENT_TYPE_OPTIONS, form.paymentType)}
                    />

                    <Field
                        label="Amount"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        type="number"
                        required
                    />

                    <Field
                        label="Quantity"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        type="number"
                    />

                    <Field
                        label="Source / From"
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                    />

                    <SelectField
                        label="Paid Via"
                        name="paidVia"
                        value={form.paidVia}
                        onChange={handleChange}
                        options={withCurrentOption(PAID_VIA_OPTIONS, form.paidVia)}
                        placeholder="Select paid via"
                    />

                    <Field
                        label="Date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        type="date"
                    />

                    <label className="md:col-span-2 flex flex-col gap-2">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                            Comment
                        </span>

                        <textarea
                            name="comment"
                            value={form.comment}
                            onChange={handleChange}
                            className="min-h-24 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                        />
                    </label>
                </div>

                <div className="bg-white px-6 py-4 flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 md:flex-none px-5 py-3 rounded-full border border-black/10"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#181818] text-white"
                    >
                        {isEdit ? "Update Payment" : "Save Payment"}
                    </button>
                </div>
            </form>
        </div>
    );
}
