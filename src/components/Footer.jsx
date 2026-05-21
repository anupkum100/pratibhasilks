
export default function Footer() {
  return (
    <footer className="text-white mt-20 p-10" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
      <div>
      <h2 className="text-2xl mb-3 text-white">Pratibha Silks</h2>
      <p>Timeless heritage, handcrafted for you.</p>
      </div>
      <div>
      <h3 className="text-xl mb-2" style={{ color: 'var(--color-accent)' }}>Collections</h3>
      <ul className="space-y-2">
      <li className="hover:opacity-80 cursor-pointer transition-opacity">Banarasi</li>
      <li className="hover:opacity-80 cursor-pointer transition-opacity">Kanjivaram</li>
      <li className="hover:opacity-80 cursor-pointer transition-opacity">Bandhani</li>
      </ul>
      </div>
      <div>
      <h3 className="text-xl mb-2" style={{ color: 'var(--color-accent)' }}>Contact Us</h3>
      <ul className="space-y-2">
      <li>📍 123 Silk Street, Varanasi, UP 221001</li>
      <li>📞 +91 98765 43210</li>
      <li>✉️ info@pratibhasilks.com</li>
      <li>🕐 Mon-Sat: 10AM - 8PM</li>
      </ul>
      </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/20 text-center">
      <p className="text-sm">© 2026 Pratibha Silks. Crafted with ❤️ in India</p>
      </div>
    </footer>
    )
}
