import {
    MessageCircle, ShieldCheck,
    Sparkles, Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { PS_PHONE_WHATSAPP } from "../../data/constants";
import { normalised } from "../../data/util";
import BuyNowButton from "../BuyNowButton";
import MiniTrust from "./MiniTrust";

export function ProductInfo({ productDetails }) {

    const createWhatsappMessage = () => {
        const message = `Hello Pratibha Silks,
    
    I want to know more about this saree.
    
    Product Details:
    SKU: ${productDetails.sku}
    Product Name: ${productDetails.name}
    Price: ₹${productDetails.offerPrice || productDetails.price}
    
    Please share more details.`;

        return `https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}&text=${encodeURIComponent(
            message
        )}`;
    };

    const discount =
        productDetails?.offerPrice && productDetails?.price
            ? Math.round(
                ((productDetails.price - productDetails.offerPrice) /
                    productDetails.price) *
                100
            )
            : 0;


    return <div className="relative overflow-hidden rounded-[2rem] border border-[#E8DCCB] bg-[#FFFCF8] p-6 md:p-8">

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A46B] via-[#E8D2A8] to-[#C9A46B]" />

        <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
            {productDetails.fabric || "Premium Saree"}
        </p>

        <h1 className="font-serif text-4xl md:text-6xl leading-none mt-3">
            {normalised(productDetails?.name)}
        </h1>

        <div className="flex flex-wrap gap-3 mt-5 text-sm">
            <span className="bg-[#F8F3EC] text-[#6B5F54] px-4 py-2 rounded-full">
                SKU: {productDetails.sku}
            </span>

            {!productDetails.stock ? (
                <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full">
                    Out of Stock
                </span>
            ) : (
                productDetails.limitedStock ? (
                    <span className="bg-[#FFF4E5] text-[#A15C00] px-4 py-2 rounded-full">
                        Limited Stock
                    </span>
                ) : <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full">
                    In Stock
                </span>
            )}
        </div>

        <div className="mt-6">
            {productDetails.offerPrice ? (
                <div className="flex items-end gap-3 flex-wrap">
                    <p className="text-3xl md:text-4xl font-semibold">
                        ₹{productDetails.offerPrice}
                    </p>

                    <p className="text-lg md:text-xl text-gray-400 line-through mb-1">
                        ₹{productDetails.price}
                    </p>

                    {discount > 0 && (
                        <span className="mb-1 text-xs bg-[#181818] text-white px-3 py-1 rounded-full">
                            Save {discount}%
                        </span>
                    )}
                </div>
            ) : (
                <p className="text-3xl md:text-4xl font-semibold">
                    ₹{productDetails.price}
                </p>
            )}
        </div>

        <p className="mt-6 text-[#6B5F54] leading-7 text-sm md:text-base">
            {productDetails.description}
        </p>

        <BuyNowButton product={productDetails} className="w-full sm:w-auto" />


        {!!productDetails.stock &&
            <a
                target="_blank"
                rel="noreferrer"
                href={createWhatsappMessage()}
                className={`group mt-4 flex w-full items-center justify-center gap-3 rounded-full border px-6 py-4 text-sm md:text-base font-semibold transition-all duration-300 ${!productDetails.stock
                    ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400"
                    : "border-[#25D366]/25 bg-white text-[#181818] hover:border-[#25D366] hover:bg-[#F5FFF8] hover:-translate-y-1 hover:shadow-lg"
                    }`}
            >
                <MessageCircle
                    size={19}
                    className="text-[#25D366] transition-transform duration-300 group-hover:scale-110"
                />

                <span>Ask about this Saree</span>
            </a>}

        <div className="grid grid-cols-3 gap-3 mt-6">
            <MiniTrust
                icon={<ShieldCheck size={18} />}
                title="Authentic"
            />

            <MiniTrust
                icon={<Truck size={18} />}
                title="Delivery"
            />

            <MiniTrust
                icon={<Sparkles size={18} />}
                title="Handpicked"
            />
        </div>

        <div className="mt-10 space-y-6">

            {/* Collection Tags */}
            {productDetails?.categories?.length > 0 && (
                <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#A27B48] mb-3">
                        Collection
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {productDetails.categories.map((category) => (
                            <Link
                                key={category}
                                to="/products"
                                className="
                            px-5 py-2.5
                            rounded-full
                            bg-[#F8F3EC]
                            border border-[#E8DCCB]
                            text-[#4D4135]
                            text-sm
                            font-medium
                            transition-all
                            hover:bg-[#EFE4D3]
                            hover:border-[#D8C1A1]
                        "
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Suitable For */}
            {productDetails?.occasions?.length > 0 && (
                <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#A27B48] mb-3">
                        Perfect For
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {productDetails.occasions.map((occasion) => (
                            <Link
                                key={occasion}
                                to="/products"
                                className="
                            px-5 py-2.5
                            rounded-full
                            bg-white
                            border border-[#E8DCCB]
                            text-[#4D4135]
                            text-sm
                            font-medium
                            shadow-sm
                            transition-all
                            hover:shadow-md
                            hover:-translate-y-[1px]
                        "
                            >
                                ✦ {occasion}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
}
