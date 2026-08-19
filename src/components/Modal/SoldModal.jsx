import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Search, X, Trash2 } from "lucide-react";
import { apiCall } from "../../serice/api";

export function SoldModal({ open, product, products, onClose, onSubmit, onRemoveProduct }) {
    const [loading, setLoading] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState(null);

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
        setSelectedBuyer(null);
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
                            <BuyerAutocomplete
                                value={form.name}
                                selectedBuyer={selectedBuyer}
                                onChange={(value) => {
                                    setForm((current) => ({
                                        ...current,
                                        name: value,
                                        phone: selectedBuyer && value !== selectedBuyer.name
                                            ? ""
                                            : current.phone,
                                    }));
                                    if (selectedBuyer && value !== selectedBuyer.name) {
                                        setSelectedBuyer(null);
                                    }
                                }}
                                onSelect={(buyer) => {
                                    setSelectedBuyer(buyer);
                                    setForm((current) => ({
                                        ...current,
                                        name: buyer.name,
                                        phone: buyer.phone,
                                    }));
                                }}
                            />

                            <LuxuryInput
                                label="Buyer Phone"
                                maxLength={10}
                                placeholder="Enter phone number"
                                value={form.phone}
                                onChange={(value) => {
                                    setSelectedBuyer(null);
                                    setForm({ ...form, phone: value.replace(/\D/g, "") });
                                }}
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

function BuyerAutocomplete({ value, selectedBuyer, onChange, onSelect }) {
    const [open, setOpen] = useState(false);
    const deferredSearch = useDeferredValue(value.trim());

    const { data, isFetching } = useQuery({
        queryKey: ["buyers", deferredSearch],
        queryFn: async () => {
            const response = await apiCall(
                `/api/buyers?search=${encodeURIComponent(deferredSearch)}&limit=10`
            );
            if (response?.error) {
                throw new Error(response.error.message || "Failed to fetch buyers");
            }
            return response.data || [];
        },
        enabled: open,
        staleTime: 30_000,
    });

    const buyers = data || [];

    return (
        <div className="relative">
            <label className="text-[10px] uppercase tracking-[0.28em] text-[#9A7B4F]">
                Buyer Name
            </label>

            <div className="relative mt-2">
                <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A7B4F]"
                />
                <input
                    type="text"
                    value={value}
                    placeholder="Search or enter a new buyer"
                    autoComplete="off"
                    onFocus={() => setOpen(true)}
                    onBlur={() => window.setTimeout(() => setOpen(false), 150)}
                    onChange={(event) => {
                        onChange(event.target.value);
                        setOpen(true);
                    }}
                    className="w-full rounded-2xl border border-[#DDD0BE] bg-white py-3.5 pl-11 pr-10 text-sm text-[#1F1A14] outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10 transition"
                />
                {selectedBuyer && (
                    <Check
                        size={17}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                )}
            </div>

            {open && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#DDD0BE] bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
                    {isFetching && buyers.length === 0 ? (
                        <p className="px-3 py-3 text-xs text-[#6B5F54]">Searching buyers...</p>
                    ) : buyers.length > 0 ? (
                        buyers.map((buyer) => (
                            <button
                                key={buyer._id}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    onSelect(buyer);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left hover:bg-[#F7F0E6]"
                            >
                                <span className="min-w-0 truncate text-sm text-[#1F1A14]">
                                    {buyer.name}
                                </span>
                                <span className="shrink-0 text-xs text-[#6B5F54]">
                                    {buyer.phone}
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className="px-3 py-3 text-xs text-[#6B5F54]">
                            {value.trim()
                                ? `No existing buyer found. “${value.trim()}” will be a new buyer.`
                                : "Start typing a buyer name, or enter a new one."}
                        </p>
                    )}
                </div>
            )}
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
