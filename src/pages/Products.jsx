
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:px-5">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-10" style={{ color: 'var(--color-primary)' }}>All Sarees</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
