import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Phone, Mail, Truck, ShieldCheck } from "lucide-react";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [showFaq, setShowFaq] = useState(false);
  
  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])];
  const [selectedImage, setSelectedImage] = useState(0);

  const discount = product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 md:px-5">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Image Gallery */}
        <div className="space-y-3 md:space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl" style={{ border: '3px solid var(--color-primary)' }}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedImage}
                src={allImages[selectedImage]} 
                alt={`${product.name} - View ${selectedImage + 1}`}
                className="w-full h-[300px] md:h-[500px] object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          
          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
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
          <h1 className="text-2xl md:text-4xl mb-2 md:mb-3" style={{ color: 'var(--color-primary)' }}>{product.name}</h1>
          
          {/* Availability & SKU */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
            <div>
              <span className="text-gray-500">Availability: </span>
              {product.sold ? (
                <span className="text-red-500 font-semibold">Out of stock</span>
              ) : (
                <span className="text-green-600 font-semibold">In stock</span>
              )}
            </div>
            {product.limitedStock && (
              <span className="text-orange-500 font-semibold">Only 1 left</span>
            )}
            <div>
              <span className="text-gray-500">SKU: </span>
              <span className="font-medium">{product.sku || `SKU-${product.id}00${product.id}`}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-3 md:mb-4">
            {product.offerPrice ? (
              <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>₹{product.offerPrice}</p>
                <p className="text-base md:text-xl text-gray-400 line-through">₹{product.price}</p>
                <span className="text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold" style={{ backgroundColor: 'var(--color-secondary)' }}>
                  {discount}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>₹{product.price}</p>
            )}
          </div>

          {/* Description */}
          <p className="mb-4 md:mb-6 text-gray-600 leading-relaxed text-sm md:text-base">
            {product.description || `Latest ${product.name} with ZARI border. This saree comes with PLAIN WITH BORDER SILK blouse.`}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="text-gray-600 text-sm md:text-base">Quantity:</span>
            <div className="flex items-center border-2 rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-primary)' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition-colors font-bold text-sm md:text-base"
              >
                -
              </button>
              <span className="px-3 md:px-4 py-1.5 md:py-2 border-x-2 text-sm md:text-base" style={{ borderColor: 'var(--color-primary)' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition-colors font-bold text-sm md:text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
            <button 
              disabled={product.sold}
              className={`text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-opacity font-semibold text-sm md:text-base ${product.sold ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Add to Cart
            </button>
            <button 
              disabled={product.sold}
              className={`text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-opacity font-semibold text-sm md:text-base ${product.sold ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist & FAQ */}
          <div className="flex flex-wrap gap-4 md:gap-6 mb-4 md:mb-6 text-xs md:text-sm">
            <button className="flex items-center gap-1.5 md:gap-2 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-secondary)' }}>
              <Heart size={16} className="md:w-[18px] md:h-[18px]" /> Add to Wishlist
            </button>
            <button 
              onClick={() => setShowFaq(!showFaq)}
              className="flex items-center gap-1.5 md:gap-2 hover:opacity-70 transition-opacity" 
              style={{ color: 'var(--color-primary)' }}
            >
              FAQ
            </button>
          </div>

          {/* Categories */}
          <div className="mb-4 md:mb-6">
            <span className="text-gray-500 text-xs md:text-sm">Shop more from this category: </span>
            {(product.categories || ['Sarees', 'New Arrival']).map((category, index) => (
              <span key={index}>
                <Link to="/products" className="text-xs md:text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {category}
                </Link>
                {index < (product.categories || ['Sarees', 'New Arrival']).length - 1 && (
                  <span className="text-gray-400"> , </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* More Information Table */}
        <div className="mt-8 md:mt-12 bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
          <h2 className="text-xl md:text-2xl p-3 border-b" style={{ color: 'var(--color-primary)' }}>More Information</h2>
          <div className="divide-y text-sm md:text-base">
            {[
          { label: 'Fabric', value: product.fabric },
          { label: 'Border Type', value: product.borderType },
          { label: 'Weave', value: product.weave },
          { label: 'Blouse Included', value: product.blouseIncluded ? 'Yes' : 'No' },
          { label: 'Blouse Fabric', value: product.blouseFabric },
          { label: 'Blouse Type', value: product.blouseType },
          { label: 'Size', value: product.size },
            ].filter(item => item.value).map((item, index) => (
          <div key={index} className="flex sm:flex-row">
            <div className="w-full sm:w-1/3 p-2 md:p-3 font-medium bg-gray-50">{item.label}</div>
            <div className="w-full sm:w-2/3 p-2 md:p-3 text-gray-600">{item.value}</div>
          </div>
            ))}
          </div>
        </div>

        {/* Contact & Help Section */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8">
        <h2 className="text-xl md:text-2xl mb-4 md:mb-6" style={{ color: 'var(--color-primary)' }}>Have any Queries?</h2>
        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">We're here to help! Feel free to reach out to our customer care executives</p>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <a href="tel:+919852985299" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors border">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Phone size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Contact Us</p>
              <p className="font-semibold text-sm md:text-base">+91-9852985299</p>
            </div>
          </a>
          <a href="mailto:hello@pratibhasilks.com" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors border">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
              <Mail size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Email Us</p>
              <p className="font-semibold text-sm md:text-base">hello@pratibhasilks.com</p>
            </div>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t">
          <div className="flex items-center gap-2 md:gap-3">
            <Truck size={24} className="md:w-7 md:h-7" style={{ color: 'var(--color-primary)' }} />
            <div>
              <p className="font-semibold text-sm md:text-base">Free Delivery</p>
              <p className="text-xs md:text-sm text-gray-500">On orders above ₹5000</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <ShieldCheck size={24} className="md:w-7 md:h-7" style={{ color: 'var(--color-primary)' }} />
            <div>
              <p className="font-semibold text-sm md:text-base">Payment Secured</p>
              <p className="text-xs md:text-sm text-gray-500">Safe with Our Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
