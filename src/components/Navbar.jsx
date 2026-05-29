import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      setScrolled(currentScrollY > 20);

      if (!isMobile) {
        setShowNavbar(true);
        return;
      }

      if (currentScrollY < 20) {
        setShowNavbar(true);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
        setIsOpen(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        shadow-lg
        transition-all duration-500 ease-out
        ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
      style={{
        backgroundColor: scrolled
          ? "var(--color-background)"
          : "var(--color-primary)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img
            width={30}
            height={30}
            src="/fevico.png"
            alt="Pratibha Silks"
          />

          <h1 className="ms-2 text-xl md:text-2xl">
            Pratibha Silks
          </h1>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            Home
          </Link>

          <Link to="/products" className="hover:opacity-80 transition-opacity">
            Collections
          </Link>

          <Link to="/about" className="hover:opacity-80 transition-opacity">
            About
          </Link>

          <Link to="/contact" className="hover:opacity-80 transition-opacity">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden flex flex-col gap-4 p-4 border-t border-white/20 text-white"
          style={{
            // backgroundColor: "rgba(9, 60, 93, 0.98)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setIsOpen(false)}>
            Collections
          </Link>

          <Link to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}