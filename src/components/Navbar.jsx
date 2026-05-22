import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex">
          <img width={30} height={30} src="/fevico.png" />
          <h1 className="ms-2 text-xl md:text-2xl text-white">Pratibha Silks</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">Home</Link>
          <Link to="/products" className="hover:opacity-80 transition-opacity">Collections</Link>
          <Link to="/about" className="hover:opacity-80 transition-opacity">About</Link>
          <Link to="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
          {/* <Link to="/cart" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'var(--color-secondary)' }}><ShoppingBag /></Link> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* <Link to="/cart" className="p-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}><ShoppingBag size={20} /></Link> */}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 border-t border-white/20" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:opacity-80">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="hover:opacity-80">Collections</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:opacity-80">About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:opacity-80">Contact</Link>
        </div>
      )}
    </nav>
  );
}
