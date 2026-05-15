
export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 p-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl mb-3">Pratibha Silks</h2>
          <p>Luxury sarees inspired by Indian craftsmanship.</p>
        </div>
        <div>
          <h3 className="text-xl mb-2">Collections</h3>
          <ul className="space-y-2">
            <li>Banarasi</li>
            <li>Kanjivaram</li>
            <li>Bandhani</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl mb-2">Newsletter</h3>
          <input className="p-3 rounded text-black w-full" placeholder="Enter email" />
        </div>
      </div>
    </footer>
  )
}
