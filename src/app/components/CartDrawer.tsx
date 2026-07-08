import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useShop } from "../context/ShopContext";
import { formatPrice, WA } from "../config";
import { handleImageError, imageUrl } from "../lib/images";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Which tab to show when the drawer opens. Defaults to "cart". */
  defaultTab?: "cart" | "wishlist";
}

export function CartDrawer({ open, onClose, defaultTab = "cart" }: CartDrawerProps) {
  const navigate = useNavigate();
  const { cart, wishlist, removeFromCart, updateQty, clearCart, cartTotal, toggleWishlist } = useShop();
  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">(defaultTab);

  // Sync active tab whenever the drawer opens with a new defaultTab
  useEffect(() => {
    if (open) setActiveTab(defaultTab);
  }, [open, defaultTab]);

  const whatsappLines = cart
    .map((i) => `• ${i.product.name} (Size: ${i.size}) x${i.quantity} - ${formatPrice(i.product.price * i.quantity)}`)
    .join("\n");

  const goToProduct = (id: number) => {
    navigate(`/product/${id}`);
    onClose();
  };

  const goToShop = () => {
    navigate("/shop");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-[#1C1C1C]/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeTab === "cart" ? "Shopping cart" : "Saved items"}
            className="fixed top-0 right-0 bottom-0 z-70 w-full max-w-sm bg-[#FAF8F5] flex flex-col shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex gap-1" role="group" aria-label="Drawer section">
                {(["cart", "wishlist"] as const).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    aria-pressed={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {tab === "cart"
                      ? `Cart (${cart.reduce((s, i) => s + i.quantity, 0)})`
                      : `Saved (${wishlist.length})`}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-2 -mr-1 min-w-11 min-h-11 flex items-center justify-center"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "cart" ? (
                cart.length === 0 ? (
                  /* Empty cart */
                  <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-12 text-center">
                    <ShoppingBag size={48} className="text-muted-foreground/25" aria-hidden="true" />
                    <p style={{ fontFamily: "var(--font-display)" }} className="text-xl text-foreground">
                      Your cart is empty
                    </p>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground">
                      Browse our collections and add pieces you love.
                    </p>
                    <button
                      type="button"
                      onClick={goToShop}
                      className="mt-2 bg-foreground text-background text-xs uppercase tracking-widest px-6 py-3 cursor-pointer hover:bg-[#C9A96E] transition-colors min-h-[44px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  /* Cart items */
                  <div className="divide-y divide-border">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-4">
                        <button
                          type="button"
                          onClick={() => goToProduct(item.product.id)}
                          className="w-16 h-20 flex-shrink-0 overflow-hidden bg-[#F0EDE8] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                          aria-label={`View ${item.product.name}`}
                        >
                          <img
                            src={imageUrl(item.product.image, "w=128&h=160&fit=crop&auto=format")}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={handleImageError}
                          />
                        </button>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-sm leading-snug line-clamp-2">
                            {item.product.name}
                          </p>
                          <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                          <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-foreground">
                            ₦{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.product.id, item.size, -1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground transition-colors cursor-pointer"
                            >
                              <Minus size={12} aria-hidden="true" />
                            </button>
                            <output
                              style={{ fontFamily: "var(--font-body)" }}
                              className="text-sm w-5 text-center"
                              aria-live="polite"
                              aria-label={`Quantity: ${item.quantity}`}
                            >
                              {item.quantity}
                            </output>
                            <button
                              type="button"
                              onClick={() => updateQty(item.product.id, item.size, 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground transition-colors cursor-pointer"
                            >
                              <Plus size={12} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              aria-label={`Remove ${item.product.name} from cart`}
                              className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
                            >
                              <Trash2 size={15} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Wishlist */
                wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-12 text-center">
                    <Heart size={48} className="text-muted-foreground/25" aria-hidden="true" />
                    <p style={{ fontFamily: "var(--font-display)" }} className="text-xl text-foreground">
                      No saved items
                    </p>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground">
                      Tap the heart icon on any product to save it here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {wishlist.map((product) => (
                      <div key={product.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => goToProduct(product.id)}
                          className="w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                          aria-label={`View ${product.name}`}
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-[#F0EDE8]">
                            <img
                              src={imageUrl(product.image, "w=300&h=400&fit=crop&auto=format")}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                              onError={handleImageError}
                            />
                          </div>
                          <p style={{ fontFamily: "var(--font-display)" }} className="text-sm text-foreground mt-1.5 truncate">
                            {product.name}
                          </p>
                          <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
                            ₦{product.price.toLocaleString()}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          aria-label={`Remove ${product.name} from saved items`}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer hover:bg-white transition-colors"
                        >
                          <X size={13} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* ── Footer — cart only ── */}
            {activeTab === "cart" && cart.length > 0 && (
              <div
                className="border-t border-border p-5 space-y-3 bg-[#FAF8F5] flex-shrink-0"
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground uppercase tracking-widest">
                    Total
                  </span>
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-xl text-foreground">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <a
                  href={WA.cart(whatsappLines, cartTotal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-widest hover:bg-[#1ebe57] transition-colors min-h-[52px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <MessageCircle size={17} aria-hidden="true" /> Order via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-center py-2 min-h-[36px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
