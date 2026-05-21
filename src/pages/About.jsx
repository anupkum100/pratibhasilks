
export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-5">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-8" style={{ color: 'var(--color-primary)' }}>Our Heritage</h1>
      <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <p className="text-base md:text-lg leading-7 md:leading-8">
          Inspired by India's rich textile legacy, Pratibha Silks blends timeless elegance
          with modern sophistication.
        </p>
      </div>
      <div className="mt-6 md:mt-10 grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="text-white p-5 md:p-8 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h3 className="text-xl md:text-2xl mb-3 md:mb-4" style={{ color: 'var(--color-accent)' }}>Our Mission</h3>
          <p className="text-sm md:text-base">To bring the finest handcrafted sarees from across India to your doorstep.</p>
        </div>
        <div className="text-white p-5 md:p-8 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--color-secondary)' }}>
          <h3 className="text-xl md:text-2xl mb-3 md:mb-4" style={{ color: 'var(--color-accent)' }}>Our Vision</h3>
          <p className="text-sm md:text-base">To preserve and promote traditional Indian weaving artistry globally.</p>
        </div>
      </div>
    </div>
  )
}
