
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-5">
      <h1 className="text-5xl mb-10" style={{ color: 'var(--color-primary)' }}>All Sarees</h1>
      <div className="grid md:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
