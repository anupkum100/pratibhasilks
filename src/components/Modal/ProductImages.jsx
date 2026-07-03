import {
    ImagePlus,
    Loader2,
    Trash2
} from "lucide-react";
import { getImageFromId } from "../../data/util";

export function ImageUploader({ label, imageId, onUpload, useRef }) {
    const inputRef = useRef(null);

    const imageUrl = imageId ? getImageFromId(imageId) : "";

    return (
        <div className="flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                    {label}
                </span>

                {imageId && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="text-xs text-[#9A7B4F] underline underline-offset-4"
                    >
                        Change image
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="
            relative
            w-full
            min-h-[420px]
            md:min-h-[520px]
            rounded-[1.75rem]
            overflow-hidden
            bg-[#F8F3EC]
            border border-dashed border-black/20
            flex items-center justify-center
            group
          "
            >
                {imageId ? (
                    <img
                        src={imageUrl}
                        alt="Product"
                        className="
                absolute inset-0
                h-full w-full
                object-contain
                bg-[#F8F3EC]
                transition-transform duration-500
                group-hover:scale-[1.02]
              "
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="text-center px-6">
                        <div className="h-16 w-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-sm">
                            <ImagePlus className="text-[#9A7B4F]" size={34} />
                        </div>

                        <p className="font-serif text-3xl mt-5">
                            Upload main product image
                        </p>

                        <p className="text-sm text-[#6B5F54] mt-2 max-w-sm">
                            Best for model saree photos. Portrait images will be shown fully
                            without cutting the saree.
                        </p>
                    </div>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onUpload(file);
                    event.target.value = "";
                }}
            />
        </div>
    );
}

export function GalleryUploader({
    label,
    imageIds = [],
    onUpload,
    onDelete,
    useRef
}) {
    const inputRef = useRef(null);

    const handleUpload = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            onUpload(file);
        }

        event.target.value = "";
    };

    return (
        <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F54]">
                {label}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {imageIds.map((imageId) => (
                    <div
                        key={imageId}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8F3EC] border border-black/10 group"
                    >
                        <img
                            src={getImageFromId(imageId)}
                            alt="Gallery"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />

                        <button
                            type="button"
                            onClick={() => onDelete(imageId)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-md"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="
                        aspect-square
                        rounded-2xl
                        border border-dashed border-black/20
                        bg-[#F8F3EC]
                        hover:bg-[#F3E8D8]
                        transition
                        flex flex-col items-center justify-center
                        text-center
                        px-4
                        group
                    "
                >
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                        <ImagePlus className="text-[#9A7B4F]" size={26} />
                    </div>

                    <p className="mt-3 text-sm font-serif text-[#2F261D]">
                        Add new image
                    </p>

                    <p className="mt-1 text-[11px] text-[#6B5F54]">
                        Upload gallery photo
                    </p>
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
            />
        </div>
    );
}