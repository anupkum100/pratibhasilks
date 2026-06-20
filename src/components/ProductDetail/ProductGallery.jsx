import { useState } from "react";
import { getImageFromId } from "../../data/util";

export default function ProductGallery({ productDetails }) {
    const [selectedImage, setSelectedImage] = useState(0);

    const allImageIds = [
        productDetails?.mainImageId,
        ...(productDetails?.otherImageIds || []),
    ].filter(Boolean);
    return <div className="space-y-4">
        <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
            <img
                key={selectedImage}
                // src={getImageFromId(allImageIds[selectedImage])}
                src={getImageFromId(productDetails.mainImageId ? allImageIds[selectedImage] : "no_image.png")}

                alt={`${productDetails.name} - View ${selectedImage + 1
                    }`}
                className={`w-full aspect-[3/4] ${!productDetails.mainImageId ? "object-contain p-10" : "object-cover"}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
            />
        </div>

        {allImageIds.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {allImageIds.map((imgId, index) => (
                    <button
                        key={imgId}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden transition-all ${selectedImage === index
                            ? "ring-2 ring-[#181818] ring-offset-4 ring-offset-[#F8F3EC]"
                            : "opacity-60 hover:opacity-100"
                            }`}
                    >
                        <img
                            loading="lazy"
                            src={getImageFromId(imgId)}
                            alt={`${productDetails.name} thumbnail ${index + 1
                                }`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        )}
    </div>
}