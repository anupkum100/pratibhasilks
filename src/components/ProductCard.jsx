import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <img src={product.image} className="h-80 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-xl">{product.name}</h3>
        <div className="mt-2">
          {product.offerPrice ? (
            <>
              <span className="text-gray-500 line-through mr-2">₹ {product.price}</span>
              <span className="text-[#6D071A] font-bold">₹ {product.offerPrice}</span>
            </>
          ) : (
            <p className="text-[#6D071A] font-bold">₹ {product.price}</p>
          )}
        </div>
        <Link
          to={`/product/${product.id}`}
          className="inline-block mt-4 bg-[#6D071A] text-white px-4 py-2 rounded-lg"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
