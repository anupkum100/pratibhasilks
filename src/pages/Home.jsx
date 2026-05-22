import { useRef } from "react";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/Swiper";
import { products } from "../data/products";

export default function Home() {
  const heroRef = useRef(null);

  return (
    <div>
      <HeroCarousel />

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
