
export default function Cart() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-5">
      <h1 className="text-5xl mb-8" style={{ color: 'var(--color-primary)' }}>Shopping Cart</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
        <p className="text-gray-600">Your cart is ready for integration.</p>
        <button 
          className="mt-6 text-gray-800 px-8 py-4 rounded-xl transition-opacity hover:opacity-90 font-semibold"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
