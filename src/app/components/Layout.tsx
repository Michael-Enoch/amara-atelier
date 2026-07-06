import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";
import { MessageCircle } from "lucide-react";
import { BUSINESS } from "../config";
import { lockBodyScroll } from "../lib/bodyScrollLock";

export function Layout() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<"cart" | "wishlist">("cart");

  // Scroll to top and close overlays on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setSearchOpen(false);
    setCartOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!searchOpen && !cartOpen) return;
    return lockBodyScroll();
  }, [searchOpen, cartOpen]);

  const openCart = () => {
    setCartTab("cart");
    setSearchOpen(false);
    setCartOpen(true);
  };

  const openWishlist = () => {
    setCartTab("wishlist");
    setSearchOpen(false);
    setCartOpen(true);
  };

  const openSearch = () => {
    setCartOpen(false);
    setSearchOpen(true);
  };

  const isOverlayOpen = searchOpen || cartOpen;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "var(--font-body)" }}>
      <Navbar
        onOpenSearch={openSearch}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
      />

      <main>
        <Outlet />
      </main>

      <Footer />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        defaultTab={cartTab}
      />

      {/* Floating WhatsApp CTA — desktop only, hides when overlays are open */}
      <a
        href={BUSINESS.whatsappLink("Hi Amara Atelier! I'd like to browse your collections.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className={`fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 shadow-lg hover:bg-[#1ebe57] transition-all duration-300 hover:shadow-xl group ${
          isOverlayOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span
          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}
          className="text-xs uppercase max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap"
        >
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
}
