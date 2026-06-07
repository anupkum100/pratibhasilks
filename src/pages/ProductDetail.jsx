import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  Truck,
  ShieldBan,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Ruler,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  PS_EMAIL,
  PS_PHONE,
  PS_PHONE_WHATSAPP,
} from "../data/constants";
import { products } from "../data/products";

import { getImageFromId } from "../data/util";
import { apiCall } from "../serice/api";

const spriteViews = [
  { label: "Full View", index: -1 },
  { label: "View 1", index: 0 },
  { label: "View 2", index: 1 },
  { label: "View 3", index: 2 },
  { label: "View 4", index: 3 },
];

export default function ProductDetail() {
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const details = [
    {
      label: "Fabric",
      key: "fabric",
    },
    {
      label: "Weave",
      key: "weave",
    },
    {
      label: "Border",
      key: "borderType",
    },
    {
      label: "Length",
      key: "length",
    },
    {
      label: "Occasion",
      key: "occasion",
    },
    {
      label: "Colour",
      key: "color",
    },
    // {
    //   label: "Blouse",
    //   value: productDetails.blouseIncluded
    //     ? `Included/${productDetails.blouseColor}`
    //     : "Not Included",
    // },
    // {
    //   label: "Collection",
    //   value: productDetails.categories?.[0],
    // },
  ].filter((item) => item.key);

  const fetchProductDetails = () => {
    setLoading(true);

    apiCall(`/api/products/${id}`).then((res) => {
      setLoading(false);
      !res.error ? setProductDetails(res.data) : setProductDetails(products.find((el => el.sku === id)));
    });
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const allImageIds = [
    productDetails?.mainImageId,
    ...(productDetails?.otherImageIds || []),
  ].filter(Boolean);

  const discount =
    productDetails?.offerPrice && productDetails?.price
      ? Math.round(
        ((productDetails.price - productDetails.offerPrice) /
          productDetails.price) *
        100
      )
      : 0;

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] flex items-center justify-center">
        <p className="text-[#6B5F54]">Loading product...</p>
      </main>
    );
  }

  if (!productDetails?.sku) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] flex justify-center items-center px-5 text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-xl max-w-lg">
          <ShieldBan
            size={64}
            className="text-red-700 mb-5 mx-auto"
          />

          <h1 className="font-serif text-4xl mb-3">
            Product not found
          </h1>

          <p className="text-[#6B5F54] leading-7">
            This product may be added in future. For now, explore our
            listed saree collection.
          </p>

          <Link
            to="/products"
            className="inline-block mt-7 bg-[#181818] text-white px-7 py-3 rounded-full"
          >
            View Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F3EC] text-[#181818]">
      <section className="max-w-7xl mx-auto px-5 pt-8 md:pt-16 pb-16">
        <div className="mb-8 text-sm text-[#6B5F54]">
          <Link to="/" className="hover:text-[#181818]">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/products" className="hover:text-[#181818]">
            Collections
          </Link>{" "}
          / <span className="text-[#181818]">{productDetails.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-start">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">

              <AnimatePresence mode="wait">
                {/* <motion.img
                  key={selectedImage}
                  src={getImageFromId(allImageIds[selectedImage])}
                  alt={`${productDetails.name} - View ${selectedImage + 1
                    }`}
                  className="w-full aspect-[3/4] object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                /> */}
                <SpriteImage
                  src={getImageFromId(productDetails.mainImageId)}
                  index={spriteViews[selectedImage].index}
                  alt={`${productDetails.name} ${spriteViews[selectedImage].label}`}
                  className="w-full aspect-[3/4]"
                />
              </AnimatePresence>
            </div>

            {spriteViews.map((view, index) => (
              <button
                key={view.label}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-24 me-2 rounded-2xl overflow-hidden ${selectedImage === index
                  ? "ring-2 ring-[#181818] ring-offset-4 ring-offset-[#F8F3EC]"
                  : "opacity-60 hover:opacity-100"
                  }`}
              >
                <SpriteImage
                  src={getImageFromId(productDetails.mainImageId)}
                  index={view.index}
                  alt={`${productDetails.name} ${view.label}`}
                  className="w-full h-full"
                />
              </button>
            ))}

            {/* {allImageIds.length > 1 && (
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
            )} */}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white rounded-[2rem] p-6 md:p-9 shadow-[0_18px_60px_rgba(0,0,0,0.08)] border border-black/5">
              <p className="text-xs tracking-[0.35em] uppercase text-[#9A7B4F]">
                {productDetails.fabric || "Premium Saree"}
              </p>

              <h1 className="font-serif text-4xl md:text-6xl leading-none mt-3">
                {productDetails.name}
              </h1>

              <div className="flex flex-wrap gap-3 mt-5 text-sm">
                <span className="bg-[#F8F3EC] text-[#6B5F54] px-4 py-2 rounded-full">
                  SKU: {productDetails.sku}
                </span>

                {productDetails.sold ? (
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

              <a
                target="_blank"
                rel="noreferrer"
                href={createWhatsappMessage()}
                className={`mt-8 w-full rounded-full py-4 text-sm md:text-base font-medium flex items-center justify-center gap-3 transition ${productDetails.sold
                  ? "bg-gray-300 text-gray-500 pointer-events-none"
                  : "bg-[#181818] text-white hover:opacity-90"
                  }`}
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>

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
            </div>

            {/* Categories */}
            <div className="mt-5 flex flex-wrap gap-2">
              {(productDetails.categories || []).map((category) => (
                <Link
                  key={category}
                  to="/products"
                  className="bg-white border border-black/5 px-4 py-2 rounded-full text-sm text-[#6B5F54] hover:text-[#181818]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <section className="mt-16">
          <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

            <div className="px-6 md:px-8 py-5 border-b border-black/5">

              <p className="text-xs uppercase tracking-[0.35em] text-[#9A7B4F]">
                Product Specifications
              </p>

              <h2 className="font-serif text-3xl mt-2">
                Details & Craftsmanship
              </h2>

            </div>

            <div className="grid md:grid-cols-2">

              {details.map((item, index) => (
                <div
                  key={item.label}
                  className="
            flex items-center justify-between
            px-6 md:px-8
            py-5
            border-b border-black/5
            md:nth-even:border-l
          "
                >
                  <div className="flex items-center gap-3">

                    <div className="h-3 w-3 rounded-full bg-[#F8F3EC]" />

                    <span className="text-[#6B5F54] text-sm md:text-base">
                      {item.label}
                    </span>

                  </div>

                  <span className="font-semibold text-[#181818] text-sm md:text-base text-right">
                    {productDetails[item.key]}
                  </span>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* Help */}
        <section className="mt-16 bg-[#181818] text-white rounded-[2rem] p-6 md:p-10">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#D8B46A]">
                Need Help?
              </p>

              <h2 className="font-serif text-4xl md:text-5xl mt-4">
                Not sure if this is the one?
              </h2>

              <p className="text-white/60 mt-5 leading-7">
                Talk to us before you buy. We can help with fabric,
                styling, occasion suitability and delivery questions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href={`tel:+${PS_PHONE}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition"
              >
                <Phone className="text-[#D8B46A]" />
                <div>
                  <p className="text-white/50 text-sm">Call Us</p>
                  <p className="font-medium">{PS_PHONE}</p>
                </div>
              </a>

              <a
                href={`mailto:${PS_EMAIL}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition"
              >
                <Mail className="text-[#D8B46A]" />
                <div>
                  <p className="text-white/50 text-sm">Email Us</p>
                  <p className="font-medium break-all">{PS_EMAIL}</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniTrust({ icon, title }) {
  return (
    <div className="bg-[#F8F3EC] rounded-2xl p-3 text-center text-[#6B5F54]">
      <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#9A7B4F]">
        {icon}
      </div>

      <p className="text-xs">{title}</p>
    </div>
  );
}

const getSpritePosition = (index) => {
  const positions = [
    "0% 0%",
    "100% 0%",
    "0% 100%",
    "100% 100%",
  ];

  return positions[index] || "0% 0%";
};

function SpriteImage({ src, index, alt, className = "" }) {
  const isOriginal = index === -1;

  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: isOriginal ? "cover" : "200% 200%",
        backgroundPosition: isOriginal
          ? "center"
          : getSpritePosition(index),
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}