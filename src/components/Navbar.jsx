import {
  CheckCheck,
  ChevronDown,
  Fingerprint,
  IndianRupee,
  LogOut,
  Menu, MonitorSmartphone, ShoppingBag,
  ShoppingCart,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";
import LoginModal from "./Admin/Login";
import { useCart } from "./Cart/cartContext";
import { SoldModal } from "./Modal/SoldModal";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/products" },
  { label: "Heritage", to: "/saree-types" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const adminLinks = [
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Online Orders", to: "/admin/online-orders", icon: MonitorSmartphone },
  { label: "Payments", to: "/admin/payments", icon: IndianRupee },
  { label: "Sold", to: "/admin/sold", icon: CheckCheck },
];

export default function Navbar() {
  const navigate = useNavigate();
  const {
    adminCartItems,
    adminCartCount,
    publicCartCount,
    removeFromAdminCart,
    createOrder
  } = useCart();
  const { isAdmin, logout } = useAuth();

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const isLightNav = scrolled || isOpen;
  const navCartCount = isAdmin ? adminCartCount : publicCartCount;

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
        setAdminOpen(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setAdminOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const handleCartClick = () => {
    if (isAdmin) {
      setOrderModalOpen(true);
      return;
    }

    closeMenu();
    navigate("/checkout");
  };

  return (
    <>
      <nav
        className={`
          no-print fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
          ${scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.08)]" : "shadow-lg"}
        `}
        style={{
          backgroundColor: isLightNav ? "rgba(248, 243, 236, 0.94)" : "#111111",
          backdropFilter: "blur(16px)",
          color: isLightNav ? "#181818" : "#ffffff",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link to="/" onClick={closeMenu} className="flex items-center">
            <img
              width={30}
              height={30}
              src="/fevico.png"
              alt="Pratibha Silks"
              className="rounded-full"
            />
            <h1 className="ms-2 text-xl md:text-2xl">Pratibha Silks</h1>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <NavLinks
              className="hidden md:flex gap-7 items-center text-sm tracking-wide me-2"
              onClick={closeMenu}
            />

            {isAdmin && (
              <AdminDropdown
                adminOpen={adminOpen}
                setAdminOpen={setAdminOpen}
                onLinkClick={closeMenu}
                handleLogout={handleLogout}
              />
            )}

            <CartButton
              cartCount={navCartCount}
              onClick={handleCartClick}
              title={isAdmin ? "Order Cart" : "Shopping Cart"}
            />

            {!isAdmin && (
              <IconButton
                onClick={() => setLoginOpen(true)}
                title="Admin Login"
              >
                <Fingerprint size={18} strokeWidth={1.8} />
              </IconButton>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <CartButton
              cartCount={navCartCount}
              onClick={handleCartClick}
              title={isAdmin ? "Order Cart" : "Shopping Cart"}
            />

            {!isAdmin && (
              <IconButton
                onClick={() => setLoginOpen(true)}
                title="Admin Login"
              >
                <Fingerprint size={18} strokeWidth={1.8} />
              </IconButton>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="h-10 w-10 rounded-full flex items-center justify-center transition"
              style={{
                backgroundColor: isLightNav
                  ? "rgba(0,0,0,0.06)"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-out
            ${isOpen ? "max-h-[34rem] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 pb-5 pt-2 border-t border-black/10">
            <NavLinks
              className="flex flex-col gap-1"
              onClick={closeMenu}
              isMobile
            />

            {isAdmin && (
              <div className="mt-3 border-t border-black/10 pt-3">
                <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9b7a3d]">
                  Admin
                </p>

                <div className="flex flex-col gap-1">
                  {adminLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition hover:bg-black/5"
                      >
                        <Icon size={17} className="text-[#9b7a3d]" />
                        {link.label}
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex text-red-600 gap-3 px-4 py-3 items-center justify-center font-medium transition"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <SoldModal
        products={adminCartItems}
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSubmit={createOrder}
        onRemoveProduct={removeFromAdminCart}
      />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
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

function AdminDropdown({ adminOpen, setAdminOpen, onLinkClick, handleLogout }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAdminOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-[#d6b56d]/20 bg-black px-4 py-2.5 text-sm font-medium text-[#d6b56d] shadow-md transition hover:border-[#d6b56d]"
      >
        Admin
        <ChevronDown
          size={15}
          className={`transition-transform ${adminOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`
          absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-2xl
          border border-[#d6b56d]/25 bg-[#fffaf0] shadow-2xl
          transition-all duration-200
          ${adminOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
          }
        `}
      >
        {adminLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onLinkClick}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black transition hover:bg-[#f1e4cc]"
            >
              <Icon size={17} className="text-[#9b7a3d]" />
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="flex text-red-600 gap-3 px-4 py-3 items-center justify-center font-medium transition"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b56d]/25 bg-black text-[#d6b56d] shadow-md transition-all duration-200 hover:scale-105 hover:border-[#d6b56d] hover:bg-[#111]"
      title={title}
    >
      {children}
    </button>
  );
}

function CartButton({ cartCount, onClick, title }) {
  return (
    <button
      onClick={onClick}
      className="hidden relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b56d]/25 bg-black text-[#d6b56d] shadow-md transition-all duration-200 hover:scale-105 hover:border-[#d6b56d] hover:bg-[#111]"
      title={title}
    >
      <ShoppingCart size={18} />

      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#181818] px-1 text-[10px] text-white ring-2 ring-[#fffaf0]">
          {cartCount}
        </span>
      )}
    </button>
  );
}
