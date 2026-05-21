import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  
  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])];
  const [selectedImage, setSelectedImage] = useState(0);

  const discount = product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-20 px-5 grid md:grid-cols-2 gap-10">
      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ border: '4px solid var(--color-primary)' }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={selectedImage}
              src={allImages[selectedImage]} 
              alt={`${product.name} - View ${selectedImage + 1}`}
              className="w-full h-[500px] object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>
        
        {/* Thumbnail Images */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedImage === index 
                    ? 'ring-4 scale-105' 
                    : 'ring-2 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  ringColor: selectedImage === index ? 'var(--color-primary)' : undefined 
                }}
              >
                <img 
                  src={img} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-5xl mb-5" style={{ color: 'var(--color-primary)' }}>{product.name}</h1>
        <div className="mb-6">
          {product.offerPrice ? (
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>₹ {product.offerPrice}</p>
              <p className="text-xl text-gray-500 line-through">₹ {product.price}</p>
              <span className="text-gray-800 px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--color-accent)' }}>
                {discount}% OFF
              </span>
            </div>
          ) : (
            <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>₹ {product.price}</p>
          )}
        </div>
        <p className="mb-6 text-gray-600">
          Crafted with luxurious fabric and detailed craftsmanship inspired by Indian traditions.
        </p>
        
        {/* Image Counter */}
        {allImages.length > 1 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing image {selectedImage + 1} of {allImages.length}
          </p>
        )}

        <button 
          className="text-white px-8 py-4 rounded-xl transition-opacity hover:opacity-90 font-semibold"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
