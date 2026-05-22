
import { Instagram, MessageCircleCode } from "lucide-react"
import { PS_EMAIL, PS_PHONE, PS_PHONE_WHATSAPP } from "../data/constants"

export default function Footer() {
  return (
    <footer className="text-white mt-20 p-6" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl mb-3 text-white">Pratibha Silks</h2>
          <p>Timeless heritage, handcrafted for you.</p>
        </div>
        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/pratibhasilkssarees"
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: 40, width: 40 }}
            className="flex justify-center align-center bg-white/10 p-2 rounded-full hover:bg-[#F58529] hover:text-black transition duration-300"
          >
            <Instagram size={22} color="orange" />
          </a>

          {/* <a
            href="https://www.instagram.com/pratibhasilkssarees"
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: 40, width: 40 }}
            className="flex justify-center align-center bg-white/10 p-2 rounded-full hover:bg-[#F58529] hover:text-black transition duration-300"
          >
            <Facebook size={22} />
          </a> */}

          <a
            href={`https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}&text=Hello!`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: 40, width: 40 }}
            className="flex justify-center align-center bg-white/10 p-2 rounded-full hover:bg-[#F58529] hover:text-black transition duration-300"
          >
            <MessageCircleCode size={22} color="green" />
          </a>

        </div>

        <div>
          <h3 className="text-xl mb-2" style={{ color: 'var(--color-accent)' }}>Contact Us</h3>
          <ul className="space-y-2">
            <li>📍 Pune</li>
            <li>📞  <a href={`tel:+${PS_PHONE}`}>{PS_PHONE}</a></li>
            <li>✉️ <a href={`mailto:${PS_EMAIL}`}>{PS_EMAIL}</a></li>
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
