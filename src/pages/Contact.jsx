
export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-5">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-8" style={{ color: 'var(--color-primary)' }}>Contact Us</h1>
      <form className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg space-y-4 md:space-y-5" style={{ borderTop: '4px solid var(--color-accent)' }}>
        <input className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base" placeholder="Name" />
        <input className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base" placeholder="Email" />
        <textarea className="w-full border-2 border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl h-32 md:h-40 outline-none transition-colors focus:border-[var(--color-primary)] text-sm md:text-base" placeholder="Message"></textarea>
        <button 
          className="text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-opacity hover:opacity-90 font-semibold text-sm md:text-base"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
