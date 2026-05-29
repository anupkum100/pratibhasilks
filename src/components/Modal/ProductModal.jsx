import { useEffect, useState } from "react";

const emptyProduct = {
    id: "",
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    stock: "",
    mainImageId: "",
    otherImageIds: "",
    limitedStock: false,
    fabric: "",
    borderType: "",
    weave: "",
    blouseIncluded: false,
    blouseFabric: "",
    blouseType: "",
    length: "",
    categories: "",
    color: "",
    colorHex: "",
    occasion: "",
};

export default function ProductModal({
    isOpen,
    mode = "add",
    product,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(emptyProduct);

    useEffect(() => {
        if (mode === "edit" && product) {
            setForm({
                ...product,
                otherImageIds: product.otherImageIds?.join(", ") || "",
                categories: product.categories?.join(", ") || "",
            });
        } else {
            setForm(emptyProduct);
        }
    }, [mode, product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: Number(form.price),
            offerPrice: Number(form.offerPrice),
            stock: Number(form.stock || 0),
            otherImageIds: form.otherImageIds
                ? form.otherImageIds.split(",").map((x) => x.trim())
                : [],
            categories: form.categories
                ? form.categories.split(",").map((x) => x.trim())
                : [],
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
                <div className="sticky top-0 bg-[var(--color-primary)] text-white p-5 flex justify-between items-center">
                    <h2 className="text-2xl text-white">
                        {mode === "edit" ? "Edit Product" : "Add Product"}
                    </h2>

                    <button onClick={onClose} className="text-2xl">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                    <Input label="Product ID" name="id" value={form.id} onChange={handleChange} disabled={mode === "edit"} />
                    <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                    <Input label="Price" name="price" value={form.price} onChange={handleChange} type="number" />
                    <Input label="Offer Price" name="offerPrice" value={form.offerPrice} onChange={handleChange} type="number" />
                    <Input label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" />
                    <Input label="Main Image ID" name="mainImageId" value={form.mainImageId} onChange={handleChange} />
                    <Input label="Fabric" name="fabric" value={form.fabric} onChange={handleChange} />
                    <Input label="Border Type" name="borderType" value={form.borderType} onChange={handleChange} />
                    <Input label="Weave" name="weave" value={form.weave} onChange={handleChange} />
                    <Input label="Blouse Fabric" name="blouseFabric" value={form.blouseFabric} onChange={handleChange} />
                    <Input label="Blouse Type" name="blouseType" value={form.blouseType} onChange={handleChange} />
                    <Input label="Length" name="length" value={form.length} onChange={handleChange} />
                    <Input label="Color" name="color" value={form.color} onChange={handleChange} />
                    <Input label="Color Hex" name="colorHex" value={form.colorHex} onChange={handleChange} />
                    <Input label="Occasion" name="occasion" value={form.occasion} onChange={handleChange} />

                    <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
                    <Textarea label="Other Image IDs comma separated" name="otherImageIds" value={form.otherImageIds} onChange={handleChange} />
                    <Textarea label="Categories comma separated" name="categories" value={form.categories} onChange={handleChange} />

                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="limitedStock" checked={form.limitedStock} onChange={handleChange} />
                        Limited Stock
                    </label>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="blouseIncluded" checked={form.blouseIncluded} onChange={handleChange} />
                        Blouse Included
                    </label>

                    <div className="col-span-2 flex justify-end gap-3 mt-5">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border">
                            Cancel
                        </button>

                        <button type="submit" className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white">
                            {mode === "edit" ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <input {...props} className="border rounded-xl px-4 py-3" />
        </label>
    );
}

function Textarea({ label, ...props }) {
    return (
        <label className="col-span-2 flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <textarea {...props} className="border rounded-xl px-4 py-3 min-h-24" />
        </label>
    );
}