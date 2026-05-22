import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const images = [
    `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_14_54_PM_z9pvkv.png`,
    `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/IMG_4574_ycdz7j.jpg`,
    `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_19_14_PM_bd2asn.png`,
    // "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div>
      <section
        ref={heroRef}
        className="h-[20vh] sm:h-[70vh] md:h-[80vh] relative flex items-center justify-center md:justify-end text-white overflow-hidden"
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url('${image}')`,
              y: backgroundY,
            }}
          />
        ))}
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white scale-125" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-10 sm:py-16 md:py-20 px-4 sm:px-5">
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 md:mb-10 text-center">
          <span style={{ color: "var(--color-primary)" }}>New</span>{" "}
          <span style={{ color: "var(--color-secondary)" }}>Arrivals</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-2 sm:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-5">
          <div className="text-center p-2 sm:p-6">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              Premium Quality
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Handpicked finest silk and fabrics
            </p>
          </div>
          <div className="text-center p-2 sm:p-6">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="text-xl sm:text-2xl">🎁</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              Free Shipping
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              On orders above ₹5000
            </p>
          </div>
          <div className="text-center p-2 sm:p-6 sm:col-span-2 md:col-span-1">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              <span className="text-xl sm:text-2xl">💎</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              Authentic Designs
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Traditional Indian craftsmanship
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
