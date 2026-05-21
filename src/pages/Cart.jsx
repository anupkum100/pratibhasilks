
export default function Cart() {
  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-5">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-8" style={{ color: 'var(--color-primary)' }}>Shopping Cart</h1>
      <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
        <p className="text-gray-600 text-sm md:text-base">Your cart is ready for integration.</p>
        <button 
          className="mt-4 md:mt-6 text-gray-800 px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-opacity hover:opacity-90 font-semibold text-sm md:text-base"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
