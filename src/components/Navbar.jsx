import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/products" },
  { label: "Heritage", to: "/saree-types" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const isLightNav = scrolled || isOpen;

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

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        ${scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.08)]" : "shadow-lg"}
      `}
      style={{
        backgroundColor: isLightNav
          ? "rgba(248, 243, 236, 0.94)"
          : "#111111",
        backdropFilter: "blur(16px)",
        color: isLightNav ? "#181818" : "#ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            width={30}
            height={30}
            src="/fevico.png"
            alt="Pratibha Silks"
            className="rounded-full"
          />

          <h1 className="ms-2 text-xl md:text-2xl">
            Pratibha Silks
          </h1>
        </Link>

        {/* Desktop Menu */}
        <NavLinks
          className="hidden md:flex gap-7 items-center text-sm tracking-wide"
          onClick={closeMenu}
        />

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="md:hidden h-10 w-10 rounded-full flex items-center justify-center transition"
          style={{
            backgroundColor: isLightNav
              ? "rgba(0,0,0,0.06)"
              : "rgba(255,255,255,0.12)",
          }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-500 ease-out
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pb-5 pt-2 border-t border-black/10">
          <NavLinks
            className="flex flex-col gap-1"
            onClick={closeMenu}
            isMobile
          />
        </div>
      </div>
    </nav>
  );
}

function NavLinks({ className = "", onClick, isMobile = false }) {
  return (
    <div className={className}>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onClick}
          className={`
            transition-all
            ${isMobile
              ? "py-3 px-4 rounded-2xl hover:bg-black/5 text-base"
              : "hover:opacity-70"
            }
          `}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}