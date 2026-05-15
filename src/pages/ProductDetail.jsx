import { useParams } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  const discount = product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-20 px-5 grid md:grid-cols-2 gap-10">
      <img src={product.image} className="rounded-3xl shadow-xl" />
      <div>
        <h1 className="text-5xl mb-5">{product.name}</h1>
        <div className="mb-6">
          {product.offerPrice ? (
            <div className="flex items-center gap-4">
              <p className="text-3xl text-[#6D071A] font-bold">₹ {product.offerPrice}</p>
              <p className="text-xl text-gray-500 line-through">₹ {product.price}</p>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {discount}% OFF
              </span>
            </div>
          ) : (
            <p className="text-3xl text-[#6D071A] font-bold">₹ {product.price}</p>
          )}
        </div>
        <p className="mb-6">
          Crafted with luxurious fabric and detailed craftsmanship inspired by Indian traditions.
        </p>
        <button className="bg-[#6D071A] text-white px-8 py-4 rounded-xl">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
