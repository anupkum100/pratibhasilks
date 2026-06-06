import {
  Instagram,
  MessageCircleCode,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  PS_EMAIL,
  PS_PHONE,
  PS_PHONE_WHATSAPP,
} from "../data/constants";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white overflow-hidden">

      {/* Luxury CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b border-white/10">

        <p className="text-xs tracking-[0.45em] uppercase text-[#C9A86A] mb-4">
          Pratibha Silks
        </p>

        <h2 className="font-serif text-4xl md:text-7xl leading-none max-w-4xl">
          Sarees chosen with emotion,
          <br />
          not algorithms.
        </h2>

        <p className="text-white/60 mt-8 max-w-xl text-lg">
          Handpicked drapes crafted to make every occasion
          feel unforgettable.
        </p>

      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>

          <h3 className="font-serif text-3xl">
            Pratibha Silks
          </h3>

          <p className="mt-5 text-white/60 leading-7">
            Celebrating India's weaving heritage through
            thoughtfully curated sarees for every occasion.
          </p>

        </div>

        {/* Collections */}
        <div>

          <h4 className="uppercase tracking-[0.25em] text-xs text-[#C9A86A] mb-5">
            Collections
          </h4>

          <ul className="space-y-3 text-white/70">
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/products?fabric=Pure Silk"><span>Pure Silk</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/products?fabric=Mul Cotton"><span>Cotton</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/products?occasion=Work"><span>Office Wear</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/products?occasion=Festive"><span>Festive</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/products?arrival=New"><span>New Arrivals</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
          </ul>

        </div>

        {/* Customer Care */}
        <div>

          <h4 className="uppercase tracking-[0.25em] text-xs text-[#C9A86A] mb-5">
            Customer Care
          </h4>

          <ul className="space-y-3 text-white/70">
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/shipping-policy"><span>Shipping Policy</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/returns-exchanges"><span>Returns & Exchanges</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/track-order"><span>Track Order</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/invoice-verification"><span>Invoice Verification</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
            <li><Link className="group flex items-center gap-2 hover:text-white transition-all" to="/faq"><span>FAQ</span> <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span></Link></li>
          </ul>

        </div>

        {/* Contact */}
        <div>

          <h4 className="uppercase tracking-[0.25em] text-xs text-[#C9A86A] mb-5">
            Connect
          </h4>

          <div className="space-y-4 text-white/70">

            <p>Pune, Maharashtra</p>

            <a
              href={`tel:+${PS_PHONE}`}
              className="block hover:text-white"
            >
              {PS_PHONE}
            </a>

            <a
              href={`mailto:${PS_EMAIL}`}
              className="block hover:text-white"
            >
              {PS_EMAIL}
            </a>

            <p>Mon – Sat · 10 AM – 8 PM</p>

          </div>

          {/* Social */}
          <div className="flex gap-4 mt-8">

            <a
              href="https://www.instagram.com/pratibhasilkssarees"
              target="_blank"
              rel="noopener noreferrer"
              className="
                h-12 w-12
                rounded-full
                border border-white/10
                flex items-center justify-center
                hover:bg-white
                hover:text-black
                transition-all
              "
            >
              <Instagram size={20} />
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=${PS_PHONE_WHATSAPP}&text=Hello!`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                h-12 w-12
                rounded-full
                border border-white/10
                flex items-center justify-center
                hover:bg-white
                hover:text-black
                transition-all
              "
            >
              <MessageCircleCode size={20} />
            </a>

          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-white/40 text-sm">
            © 2026 Pratibha Silks. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm text-white/40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="flex items-center gap-1">
              Made in India
              <ArrowUpRight size={14} />
            </span>
          </div>

        </div>

      </div>

    </footer>
  );
}