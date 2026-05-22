
export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-5">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-8" style={{ color: 'var(--color-primary)' }}>Our Heritage</h1>
      <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <p className="text-base md:text-lg leading-7 md:leading-8">
          Rooted in the timeless traditions of Indian craftsmanship,
          Pratibha Silks celebrates the beauty of handwoven artistry
          passed down through generations. Every saree reflects the
          richness of India’s textile heritage while embracing the
          elegance of modern fashion.
        </p>
      </div>
      <div className="mt-6 md:mt-10 grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="text-white p-5 md:p-8 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--color-primary)' }}>
          <h3 className="text-xl md:text-2xl mb-3 md:mb-4" style={{ color: 'var(--color-accent)' }}>Our Mission</h3>
          <p className="text-sm md:text-base">We are dedicated to bringing authentic handcrafted sarees
            from skilled artisans across India directly to women who
            value elegance, tradition, and quality. Our mission is to
            create timeless collections that make every occasion feel
            extraordinary.</p>
        </div>
        <div className="text-white p-5 md:p-8 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--color-secondary)' }}>
          <h3 className="text-xl md:text-2xl mb-3 md:mb-4" style={{ color: 'var(--color-accent)' }}>Our Vision</h3>
          <p className="text-sm md:text-base">Our vision is to preserve and promote India’s weaving legacy
            on a global stage by empowering traditional artisans and
            showcasing the elegance of Indian sarees to the world through
            modern luxury experiences.</p>
        </div>
      </div>
    </div>
  )
}
