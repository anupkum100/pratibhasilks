
export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-5">
      <h1 className="text-5xl mb-8" style={{ color: 'var(--color-primary)' }}>Contact Us</h1>
      <form className="bg-white p-8 rounded-2xl shadow-lg space-y-5" style={{ borderTop: '4px solid var(--color-accent)' }}>
        <input className="w-full border-2 border-gray-200 p-4 rounded-xl outline-none transition-colors focus:border-[var(--color-primary)]" placeholder="Name" />
        <input className="w-full border-2 border-gray-200 p-4 rounded-xl outline-none transition-colors focus:border-[var(--color-primary)]" placeholder="Email" />
        <textarea className="w-full border-2 border-gray-200 p-4 rounded-xl h-40 outline-none transition-colors focus:border-[var(--color-primary)]" placeholder="Message"></textarea>
        <button 
          className="text-white px-8 py-4 rounded-xl transition-opacity hover:opacity-90 font-semibold"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
