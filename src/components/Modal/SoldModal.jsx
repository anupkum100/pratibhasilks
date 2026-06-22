import { useEffect, useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";

export function SoldModal({ open, product, products, onClose, onSubmit, onRemoveProduct }) {
    const [loading, setLoading] = useState(false);

    const orderProducts = useMemo(() => {
        if (Array.isArray(products) && products.length > 0) return products;
        if (product) return [product];
        return [];
    }, [product, products]);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        comments: "",
        items: [],
    });

    useEffect(() => {
        if (!open) return;

        setForm({
            name: "",
            phone: "",
            comments: "",
            items: orderProducts.map((item) => ({
                productId: item?._id,
                sku: item?.sku,
                name: item?.name,
                listedPrice: Number(item?.offerPrice || item?.price || 0),
                soldPrice: String(item?.offerPrice || item?.price || ""),
            })),
        });
    }, [open, orderProducts]);

    const totalListedPrice = useMemo(() => {
        return form.items.reduce((total, item) => total + Number(item.listedPrice || 0), 0);
    }, [form.items]);

    const totalSoldPrice = useMemo(() => {
        return form.items.reduce((total, item) => total + Number(item.soldPrice || 0), 0);
    }, [form.items]);

    const isDisabled = useMemo(() => {
        return (
            !form.name?.trim() ||
            !form.phone?.trim() ||
            form.items.length === 0 ||
            form.items.some((item) => !item.soldPrice)
        );
    }, [form]);

    if (!open) return null;

    const updateItemPrice = (productId, value) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.productId === productId
                    ? { ...item, soldPrice: value }
                    : item
            ),
        }));
    };

    const removeItem = (productId) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.productId !== productId),
        }));

        if (onRemoveProduct) {
            onRemoveProduct(productId);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await onSubmit({
                buyer: {
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                },
                items: form.items.map((item) => ({
                    productId: item.productId,
                    sku: item.sku,
                    name: item.name,
                    listedPrice: Number(item.listedPrice || 0),
                    soldPrice: Number(item.soldPrice || 0),
                })),
                totalListedPrice,
                totalSoldPrice,
                comments: form.comments?.trim() || "",
            });

            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/55 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-dvh flex items-start justify-center px-3 py-6 sm:px-5 sm:py-8">
                <div className="w-full max-w-[820px] rounded-[1.75rem] bg-[#FFFCF8] shadow-[0_30px_90px_rgba(0,0,0,0.28)] border border-[#E8DCCB] overflow-hidden">
                    <div className="relative px-5 sm:px-7 py-5 bg-gradient-to-br from-[#17130F] via-[#241B13] to-[#0F0D0B] text-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                        >
                            <X size={17} />
                        </button>

                        <p className="text-[10px] uppercase tracking-[0.34em] text-[#D7B77A]">
                            Order Entry
                        </p>

                        <h2 className="font-serif text-3xl sm:text-4xl mt-1">
                            {orderProducts.length > 1 ? "Create Order" : "Mark as Sold"}
                        </h2>

                        <div className="mt-4 rounded-2xl bg-white/8 border border-white/10 p-4 pr-12">
                            <p className="font-serif text-xl leading-snug">
                                {orderProducts.length > 1
                                    ? `${orderProducts.length} sarees selected`
                                    : orderProducts[0]?.name}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/75">
                                {orderProducts.length === 1 && (
                                    <>
                                        <span className="rounded-full bg-white/10 px-3 py-1">
                                            SKU: {orderProducts[0]?.sku}
                                        </span>

                                        {orderProducts[0]?.fabric && (
                                            <span className="rounded-full bg-white/10 px-3 py-1">
                                                {orderProducts[0].fabric}
                                            </span>
                                        )}

                                        {orderProducts[0]?.color && (
                                            <span className="rounded-full bg-white/10 px-3 py-1">
                                                {orderProducts[0].color}
                                            </span>
                                        )}
                                    </>
                                )}

                                <span className="rounded-full bg-[#D7B77A] text-[#1A120B] px-3 py-1 font-semibold">
                                    Listed ₹{totalListedPrice}
                                </span>

                                <span className="rounded-full bg-white/10 px-3 py-1">
                                    Selling ₹{totalSoldPrice}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-7">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <LuxuryInput
                                label="Buyer Name"
                                placeholder="Enter buyer name"
                                value={form.name}
                                onChange={(value) => setForm({ ...form, name: value })}
                            />

                            <LuxuryInput
                                label="Buyer Phone"
                                maxLength={10}
                                placeholder="Enter phone number"
                                value={form.phone}
                                onChange={(value) => setForm({ ...form, phone: value })}
                            />
                        </div>

                        <div className="mt-6">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                                Products
                            </p>

                            <div className="mt-3 space-y-3">
                                {form.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="rounded-[1.25rem] border border-[#E8DCCB] bg-white p-4"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-serif text-lg text-[#1F1A14] truncate">
                                                    {item.name}
                                                </p>

                                                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#6B5F54]">
                                                    <span>SKU: {item.sku}</span>

                                                    {item.fabric && <span>• {item.fabric}</span>}

                                                    {item.color && <span>• {item.color}</span>}

                                                    <span>• Listed ₹{item.listedPrice}</span>
                                                </div>
                                            </div>

                                            <div className="w-full sm:w-[150px]">
                                                <label className="text-[9px] uppercase tracking-[0.22em] text-[#9A7B4F]">
                                                    Selling Price
                                                </label>

                                                <input
                                                    type="number"
                                                    value={item.soldPrice}
                                                    onChange={(e) => updateItemPrice(item.productId, e.target.value)}
                                                    className="mt-1 w-full rounded-xl border border-[#DDD0BE] bg-[#FFFCF8] px-3 py-2.5 text-sm text-[#1F1A14] outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10 transition"
                                                />
                                            </div>

                                            {orderProducts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.productId)}
                                                    className="h-10 w-10 rounded-full bg-[#F7F0E6] text-[#8A5A44] hover:bg-[#EFE2D2] flex items-center justify-center transition"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-[10px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                                Comments
                            </label>

                            <textarea
                                rows={4}
                                placeholder="Payment mode, customer note, discount reason..."
                                value={form.comments}
                                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                                className="mt-2 w-full resize-none rounded-2xl border border-[#DDD0BE] bg-white px-4 py-3 text-sm text-[#1F1A14] outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10 transition"
                            />
                        </div>
                    </div>

                    <div className="px-5 sm:px-7 pb-5 sm:pb-7">
                        <div className="flex flex-col-reverse sm:flex-row gap-3 rounded-[1.5rem] bg-[#F7F0E6] border border-[#E8DCCB] p-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-full border border-[#D5C2A8] bg-white py-3 text-sm text-[#5E5247] hover:bg-[#FBF7F1] transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDisabled || loading}
                                onClick={handleSubmit}
                                className="flex-1 rounded-full bg-[#17130F] py-3 text-sm text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:bg-black transition disabled:bg-[#B7ACA0] disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-[#B7ACA0]"
                            >
                                {loading
                                    ? "Creating Order..."
                                    : "Create Order & Mark Sold"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LuxuryInput({ label, value, onChange, placeholder, type = "text", maxLength }) {
    return (
        <div>
            <label className="text-[10px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                {label}
            </label>

            <input
                maxLength={maxLength}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#DDD0BE] bg-white px-4 py-3.5 text-sm text-[#1F1A14] outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10 transition"
            />
        </div>
    );
}