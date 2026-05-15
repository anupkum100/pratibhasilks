
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home() {
  return (
    <div>
      <section className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
      <div className="bg-black/40 p-10 rounded-3xl text-center">
        <motion.h1
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="text-6xl font-bold mb-4"
        >
        Luxury Sarees Collection
        </motion.h1>
        <p className="text-xl">Elegance woven with Indian heritage.</p>
      </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-5">
      <h2 className="text-5xl mb-10 text-center">New Arrivals</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {products.map(product => (
        <ProductCard key={product.id} product={product} />
        ))}
      </div>
      </section>
    </div>
    );
}
