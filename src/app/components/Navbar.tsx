import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { useShop } from "../context/ShopContext";
import { WA } from "../config";
import { lockBodyScroll } from "../lib/bodyScrollLock";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const NAV_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "Bridals", to: "/shop/Bridals" },
  { label: "Bespoke", to: "/shop/Bespoke" },
  { label: "Academy", to: "/about" },
  { label: "About", to: "/about" },
] as const;

const MOBILE_LINKS = [
  { label: "Home", to: "/" },
  { label: "Bridals", to: "/shop/Bridals" },
  { label: "Bespoke", to: "/shop/Bespoke" },
  { label: "Ready-to-Wear", to: "/shop/Ready-to-Wear" },
  { label: "Academy", to: "/about" },
  { label: "About", to: "/about" },
] as const;

export function Navbar({ onOpenSearch, onOpenCart, onOpenWishlist }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, wishlist } = useShop();

  useEffect(() => {
    const getScrollTop = () =>
      Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
    const handler = () => setScrolled(getScrollTop() > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    document.body.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      document.body.removeEventListener("scroll", handler);
    };
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    return lockBodyScroll();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const isHomeAtTop = location.pathname === "/" && !scrolled && !menuOpen;
  const useSolidHeader = !isHomeAtTop;

  const isActiveLink = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useSolidHeader
            ? "bg-white shadow-[0_1px_12px_rgba(0,0,0,0.07)] border-b border-[#F0EDE8]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex flex-col items-start leading-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-2"
              aria-label="Amara Atelier — go to home"
            >
              <span
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
                className={`text-xl md:text-2xl uppercase transition-colors ${isHomeAtTop ? "text-[#FAF8F5]" : "text-foreground"}`}
              >
                Amara
              </span>
              <span
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.3em" }}
                className={`text-[9px] uppercase transition-colors ${isHomeAtTop ? "text-[#C9A96E]" : "text-muted-foreground"}`}
              >
                Fashion · PHC
              </span>
            </button>

            {/* Desktop Nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-9">
              {NAV_LINKS.map((l) => (
                <button
                  type="button"
                  key={l.label}
                  onClick={() => navigate(l.to)}
                  className={`text-[11px] uppercase tracking-widest transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-2 ${
                    isActiveLink(l.to)
                        ? isHomeAtTop
                          ? "text-[#FAF8F5] border-b border-[#FAF8F5]/60 pb-0.5"
                          : "text-foreground border-b border-foreground pb-0.5"
                      : isHomeAtTop
                      ? "text-[#FAF8F5]/70 hover:text-[#FAF8F5]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            {/* Icon controls */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search products"
                className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                  isHomeAtTop ? "text-[#FAF8F5]/70 hover:text-[#FAF8F5]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Search size={17} aria-hidden="true" />
              </button>

              {/* Wishlist — opens wishlist tab */}
              <button
                type="button"
                onClick={onOpenWishlist}
                aria-label={`Saved items${wishlist.length > 0 ? ` (${wishlist.length})` : ""}`}
                className={`p-2.5 min-w-[44px] min-h-[44px] relative flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                  isHomeAtTop ? "text-[#FAF8F5]/70 hover:text-[#FAF8F5]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart size={17} aria-hidden="true" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#C9A96E] text-white text-[9px] rounded-full flex items-center justify-center pointer-events-none" aria-hidden="true">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart — opens cart tab */}
              <button
                type="button"
                onClick={onOpenCart}
                aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className={`p-2.5 min-w-[44px] min-h-[44px] relative flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                  isHomeAtTop ? "text-[#FAF8F5]/70 hover:text-[#FAF8F5]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShoppingBag size={17} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#C9A96E] text-white text-[9px] rounded-full flex items-center justify-center pointer-events-none" aria-hidden="true">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile) */}
              <button
                type="button"
                className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                  isHomeAtTop ? "text-[#FAF8F5]/70 hover:text-[#FAF8F5]" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? "mobile-nav" : undefined}
              >
                {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-[#1C1C1C] pt-16 md:pt-20 px-6 flex flex-col overflow-y-auto"
          >
            {/* Nav links */}
            <nav aria-label="Mobile navigation">
              <div className="flex flex-col divide-y divide-[#2A2A2A]">
                {MOBILE_LINKS.map((l) => (
                  <button
                    type="button"
                    key={l.label}
                    onClick={() => navigate(l.to)}
                    className="text-2xl text-left text-[#FAF8F5] py-5 cursor-pointer flex items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {l.label}
                    <span className="text-[#C9A96E]/50 text-base" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Utility actions */}
            <div className="mt-6 flex flex-col gap-1 border-t border-[#2A2A2A] pt-4">
              <button
                type="button"
                onClick={() => { onOpenSearch(); setMenuOpen(false); }}
                className="flex items-center gap-3 text-sm text-[#7A7570] py-3 cursor-pointer hover:text-[#FAF8F5] transition-colors min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Search size={15} aria-hidden="true" /> Search
              </button>
              <button
                type="button"
                onClick={() => { onOpenCart(); setMenuOpen(false); }}
                className="flex items-center gap-3 text-sm text-[#7A7570] py-3 cursor-pointer hover:text-[#FAF8F5] transition-colors min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <ShoppingBag size={15} aria-hidden="true" /> Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </button>
              <button
                type="button"
                onClick={() => { onOpenWishlist(); setMenuOpen(false); }}
                className="flex items-center gap-3 text-sm text-[#7A7570] py-3 cursor-pointer hover:text-[#FAF8F5] transition-colors min-h-[44px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Heart size={15} aria-hidden="true" /> Saved{wishlist.length > 0 ? ` (${wishlist.length})` : ""}
              </button>
            </div>

            {/* Bottom CTA */}
            <div className="mt-auto pb-10 pt-8 border-t border-[#2A2A2A] space-y-3">
              <p
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}
                className="text-[#7A7570] text-xs uppercase"
              >
                Port Harcourt, Nigeria
              </p>
              <a
                href={WA.bridalConsult()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white text-sm px-5 py-3.5 w-full justify-center min-h-[52px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={16} aria-hidden="true" /> Book Consultation on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
