import {
    ChevronDown,
    ChevronUp,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorSelector } from "./ColorSelector";
// import { fabricCodes } from "../../data/fabricCodes";
import { MODAL_SECTIONS, PRICE_CODE_MAP } from "./constants";
import { GalleryUploader, ImageUploader } from "./ProductImages";

const emptyProduct = {
    sku: "",
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    mainImageId: "",
    stock: 1,
    fabric: "",
    blouseIncluded: true,
    otherImageIds: [],
    categories: [],
    color: "",
    colorHex: "",
    occasions: [],
    additionalInformation: ""
};

export default function ProductModal({
    isOpen,
    mode = "add",
    product,
    onClose,
    onSubmit,
    nextIndex = 1,
    filters
}) {
    const fabricCodes = filters?.fabrics
    const colors = filters?.colors

    const [form, setForm] = useState(emptyProduct);
    const [removedImageIds, setRemovedImageIds] = useState([]);

    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState("");

    const [otherImageFiles, setOtherImageFiles] = useState([]);

    const [expanded, setExpanded] = useState({
        basic: true,
        pricing: true,
        images: true,
        craft: true,
        additionalInformation: false,
    });

    useEffect(() => {
        if (mode === "edit" && product) {
            setForm({
                ...emptyProduct,
                ...product,
                otherImageIds: toArray(product.otherImageIds),
                categories: toArray(product.categories),
                occasions: toArray(product.occasions),
            });
        } else {
            setForm(emptyProduct);
        }

        setRemovedImageIds([]);
        setMainImageFile(null);
        setMainImagePreview("");
        setOtherImageFiles([]);
    }, [mode, product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUpload = (file, fieldName) => {
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        if (fieldName === "mainImageId") {
            if (form.mainImageId) {
                setRemovedImageIds((prev) =>
                    uniqueArray([...prev, form.mainImageId])
                );
            }

            if (mainImagePreview) {
                URL.revokeObjectURL(mainImagePreview);
            }

            setMainImageFile(file);
            setMainImagePreview(previewUrl);

            setForm((prev) => ({
                ...prev,
                mainImageId: "",
            }));

            return;
        }

        setOtherImageFiles((prev) => [
            ...prev,
            {
                file,
                previewUrl,
            },
        ]);
    };

    const handleDeleteImage = (fieldName, imageId) => {
        if (!imageId) return;

        if (fieldName === "mainImageId") {
            if (form.mainImageId) {
                setRemovedImageIds((prev) =>
                    uniqueArray([...prev, form.mainImageId])
                );
            }

            if (mainImagePreview) {
                URL.revokeObjectURL(mainImagePreview);
            }

            setMainImageFile(null);
            setMainImagePreview("");

            setForm((prev) => ({
                ...prev,
                mainImageId: "",
            }));

            return;
        }

        const isLocalImage = String(imageId).startsWith("blob:");

        if (isLocalImage) {
            setOtherImageFiles((prev) => {
                const imageToRemove = prev.find(
                    (item) => item.previewUrl === imageId
                );

                if (imageToRemove?.previewUrl) {
                    URL.revokeObjectURL(imageToRemove.previewUrl);
                }

                return prev.filter((item) => item.previewUrl !== imageId);
            });

            return;
        }

        setRemovedImageIds((prev) => uniqueArray([...prev, imageId]));

        setForm((prev) => ({
            ...prev,
            otherImageIds: toArray(prev.otherImageIds).filter(
                (id) => id !== imageId
            ),
        }));
    };

    const toggleSection = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const productFormData = new FormData();

        productFormData.append("sku", form.sku);
        productFormData.append("name", form.name);
        productFormData.append("description", form.description || "-");
        productFormData.append("price", form.price);
        productFormData.append("offerPrice", form.offerPrice ? form.offerPrice : 0);
        productFormData.append("stock", form.stock || 1);
        productFormData.append("fabric", form.fabric);
        productFormData.append("blouseIncluded", form.blouseIncluded);
        productFormData.append("color", form.color || "");
        productFormData.append("colorHex", form.colorHex || "");
        productFormData.append("additionalInformation", form.additionalInformation || "");

        productFormData.append("mainImageId", form.mainImageId || "");
        productFormData.append(
            "otherImageIds",
            JSON.stringify(toArray(form.otherImageIds))
        );
        productFormData.append(
            "categories",
            JSON.stringify(toArray(form.categories))
        );
        productFormData.append(
            "occasions",
            JSON.stringify(toArray(form.occasions))
        );
        productFormData.append(
            "removedImageIds",
            JSON.stringify(removedImageIds)
        );

        if (mainImageFile) {
            productFormData.append("mainImage", mainImageFile);
        }

        otherImageFiles.forEach((item) => {
            productFormData.append("otherImages", item.file);
        });

        onSubmit(productFormData);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
            <div className="bg-[#F8F3EC] w-full md:max-w-5xl h-[94vh] md:h-[90vh] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                <div className="bg-[#181818] text-white px-5 md:px-7 py-5 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#D8B46A]">
                            Product Management
                        </p>

                        <h2 className="font-serif text-4xl md:text-5xl mt-2 leading-none">
                            {mode === "edit" ? "Edit Product" : "Add Product"}
                        </h2>

                        <p className="text-white/55 text-sm mt-3">
                            {form.name || "Create a beautifully detailed saree listing"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-5 md:p-7 space-y-5">
                        {MODAL_SECTIONS.map((section) => (
                            <FormSection
                                key={section.key}
                                title={section.title}
                                expanded={expanded[section.key]}
                                onToggle={() => toggleSection(section.key)}
                            >
                                {section.fields.map((field) => (
                                    <FieldRenderer
                                        key={field.name}
                                        field={field}
                                        form={form}
                                        mode={mode}
                                        onChange={handleChange}
                                        onUpload={handleUpload}
                                        onDelete={handleDeleteImage}
                                        mainImagePreview={mainImagePreview}
                                        otherImageFiles={otherImageFiles}
                                        fabricCodes={fabricCodes}
                                        colors={colors}
                                    />
                                ))}
                            </FormSection>
                        ))}

                        <div className="bg-white rounded-[1.5rem] border border-black/5 shadow-[0_12px_35px_rgba(0,0,0,0.04)] p-5">
                            <h3 className="font-serif text-3xl mb-5">
                                Product Flags
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Toggle
                                    label="Blouse Included"
                                    description="Mention blouse availability in details."
                                    name="blouseIncluded"
                                    checked={form.blouseIncluded}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t border-black/10 px-5 md:px-7 py-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 md:flex-none px-5 py-3 rounded-full border border-black/10 text-sm font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#181818] text-white text-sm font-medium"
                        >
                            {mode === "edit" ? "Update Product" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FieldRenderer({
    field,
    form,
    mode,
    onChange,
    onUpload,
    onDelete,
    mainImagePreview,
    otherImageFiles,
    fabricCodes,
    colors
}) {
    const commonProps = {
        name: field.name,
        label: field.label + (field.required ? "*" : ""),
        value: form[field.name] ?? "",
        onChange,
        disabled: field.disabled || (mode === "edit" && field.name === "sku"),
        required: field.required,
        type: field.type,
        textarea: field.textarea,
        placeholder: field.placeholder || `Enter ${field.label}`,
        className:
            field.textarea ||
                field.name === "description" ||
                field.imageUpload ||
                field.multiImageUpload
                ? "md:col-span-2"
                : "",
    };
    if (field.name === "color") {
        return <ColorSelector form={form} onChange={onChange} colors={colors} />;
    }

    if (field.imageUpload) {
        const imageId = mainImagePreview || form.mainImageId;

        return (
            <ImageUploader
                label={field.label}
                imageId={imageId}
                onUpload={(file) => onUpload(file, field.name)}
                onDelete={() => onDelete("mainImageId", imageId)}
                useRef={useRef}
            />
        );
    }

    if (field.multiImageUpload) {
        const imageIds = [
            ...toArray(form.otherImageIds),
            ...otherImageFiles.map((item) => item.previewUrl),
        ];

        return (
            <GalleryUploader
                label={field.label}
                imageIds={imageIds}
                onUpload={(file) => onUpload(file, field.name)}
                onDelete={(imageId) => onDelete("otherImageIds", imageId)}
                useRef={useRef}
            />
        );
    }

    if (field.customSelect) {
        return (
            <CustomSelect
                label={field.label}
                name={field.name}
                value={form[field.name] ?? ""}
                options={getOptionsForField(field.name, fabricCodes)}
                onChange={onChange}
                required={field.required}
            />
        );
    }

    return <Field {...commonProps} />;
}

function CustomSelect({ label, name, value, options, onChange, required }) {
    const [customMode, setCustomMode] = useState(
        value && !options.includes(value)
    );

    return (
        <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                {label + (required ? "*" : "")}
            </span>

            {!customMode ? (
                <div className="flex gap-2">
                    <select
                        required={required}
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        className="h-12 flex-1 rounded-2xl border border-black/10 bg-[#F8F3EC] px-4 text-sm outline-none focus:border-[#9A7B4F] focus:bg-white"
                    >
                        <option value="">Select {label}</option>

                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setCustomMode(true)}
                        className="px-6 py-3 rounded-full bg-[#181818] text-white text-sm font-medium"
                    >
                        Custom
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        placeholder={`Enter custom ${label}`}
                        className="h-12 flex-1 rounded-2xl border border-black/10 bg-[#F8F3EC] px-4 text-sm outline-none focus:border-[#9A7B4F] focus:bg-white"
                    />

                    <button
                        type="button"
                        onClick={() => setCustomMode(false)}
                        className="h-12 px-4 rounded-2xl border border-black/10 text-xs"
                    >
                        List
                    </button>
                </div>
            )}
        </label>
    );
}

function FormSection({ title, expanded, onToggle, children }) {
    return (
        <section className="bg-white rounded-[1.5rem] border border-black/5 shadow-[0_12px_35px_rgba(0,0,0,0.04)] overflow-visible relative">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center justify-between"
            >
                <h3 className="font-serif text-3xl leading-none">{title}</h3>

                <span className="h-9 w-9 rounded-full bg-[#F8F3EC] flex items-center justify-center">
                    {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </span>
            </button>

            {expanded && (
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children}
                </div>
            )}
        </section>
    );
}

function Field({
    label,
    type = "text",
    textarea = false,
    className = "",
    ...props
}) {
    const baseClass =
        "w-full rounded-2xl border border-black/10 bg-[#F8F3EC] px-4 text-sm outline-none transition focus:border-[#9A7B4F] focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <label className={`flex flex-col gap-2 ${className}`}>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                {label}
            </span>

            {textarea ? (
                <textarea
                    {...props}
                    className={`${baseClass} min-h-[110px] py-3 resize-none`}
                />
            ) : (
                <input type={type} {...props} className={`${baseClass} h-12`} />
            )}
        </label>
    );
}

function Toggle({ label, description, checked, onChange, name }) {
    return (
        <label className="flex items-center justify-between gap-4 bg-[#F8F3EC] rounded-2xl p-4 cursor-pointer">
            <div>
                <p className="text-sm font-medium text-[#181818]">{label}</p>

                <p className="text-xs text-[#6B5F54] mt-1 leading-5">
                    {description}
                </p>
            </div>

            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />

            <span
                className={`h-7 w-12 rounded-full p-1 transition ${checked ? "bg-[#181818]" : "bg-black/15"
                    }`}
            >
                <span
                    className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </span>
        </label>
    );
}

function getOptionsForField(fieldName, fabricCodes) {
    if (fieldName === "fabric") {
        return fabricCodes.map((item) => item);
    }

    return dropdownOptions[fieldName] || [];
}

function toArray(value) {
    if (Array.isArray(value)) return value;

    return value
        ? String(value)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
}

function uniqueArray(value = []) {
    return [...new Set(value.filter(Boolean))];
}