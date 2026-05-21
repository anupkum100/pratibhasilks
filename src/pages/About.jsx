
export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-5">
      <h1 className="text-5xl mb-8" style={{ color: 'var(--color-primary)' }}>Our Heritage</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <p className="text-lg leading-8">
          Inspired by India's rich textile legacy, Pratibha Silks blends timeless elegance
          with modern sophistication.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        <div className="text-white p-8 rounded-2xl" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h3 className="text-2xl mb-4" style={{ color: 'var(--color-accent)' }}>Our Mission</h3>
          <p>To bring the finest handcrafted sarees from across India to your doorstep.</p>
        </div>
        <div className="text-white p-8 rounded-2xl" style={{ backgroundColor: 'var(--color-secondary)' }}>
          <h3 className="text-2xl mb-4" style={{ color: 'var(--color-accent)' }}>Our Vision</h3>
          <p>To preserve and promote traditional Indian weaving artistry globally.</p>
        </div>
      </div>
    </div>
  )
}
