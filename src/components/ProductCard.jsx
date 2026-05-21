import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  // Flag badge configuration
  const getBadge = () => {
    if (product.sold) {
      return { text: "Sold Out", bgColor: "var(--color-secondary)", textColor: "#fff" };
    }
    if (product.lastChance) {
      return { text: "Last Chance!", bgColor: "var(--color-accent)", textColor: "#333" };
    }
    if (product.limitedStock) {
      return { text: "Limited Stock", bgColor: "var(--color-primary)", textColor: "#fff" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <motion.div 
      whileHover={{ y: product.sold ? 0 : -5 }} 
      className={`bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[var(--color-primary)] transition-all relative ${product.sold ? 'opacity-75' : ''}`}
    >
      {/* Badge */}
      {badge && (
        <div 
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md"
          style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
        >
          {badge.text}
        </div>
      )}

      {/* Sold overlay */}
      {product.sold && (
        <div className="absolute inset-0 bg-black/30 z-[5] flex items-center justify-center">
          <span className="text-white text-2xl font-bold rotate-[-15deg] bg-black/50 px-6 py-2 rounded">
            SOLD
          </span>
        </div>
      )}

      <img 
        src={product.image} 
        className={`h-60 md:h-80 w-full object-cover ${product.sold ? 'grayscale' : ''}`} 
        alt={product.name}
      />
      <div className="p-3 md:p-4">
        <h3 className="text-base md:text-xl">{product.name}</h3>
        <div className="mt-2">
          {product.offerPrice ? (
            <>
              <span className="text-gray-500 line-through mr-2 text-sm md:text-base">₹ {product.price}</span>
              <span className="font-bold text-sm md:text-base" style={{ color: 'var(--color-secondary)' }}>₹ {product.offerPrice}</span>
            </>
          ) : (
            <p className="font-bold text-sm md:text-base" style={{ color: 'var(--color-secondary)' }}>₹ {product.price}</p>
          )}
        </div>
        
        {product.sold ? (
          <button 
            disabled
            className="inline-block mt-3 md:mt-4 px-2 md:px-4 py-1 rounded-lg bg-gray-400 text-white cursor-not-allowed text-sm md:text-base"
          >
            Sold Out
          </button>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="inline-block mt-3 md:mt-4 text-white px-2 md:px-4 py-1 rounded-lg transition-colors hover:opacity-90 text-sm md:text-base"
            style={{ backgroundColor: 'var(--color-primary)', fontSize: 12 }}
          >
            View Details
          </Link>
        )}
      </div>
    </motion.div>
  );
}
