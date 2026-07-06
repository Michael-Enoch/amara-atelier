import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import type { Product } from "../data/types";
import { getBestSellers, searchProducts } from "../services/productService";
import { handleImageError, imageUrl } from "../lib/images";
import { BUSINESS } from "../config";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_FILTERS = ["Bridals", "Bespoke", "Ready-to-Wear", "New In"] as const;

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results: Product[] =
    query.trim().length < 1
      ? []
      : searchProducts(query);

  const trending = getBestSellers(4);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSelect = (id: number) => {
    navigate(`/product/${id}`);
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
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-[#1C1C1C]/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed top-0 left-0 right-0 z-[70] bg-[#FAF8F5] shadow-xl"
          >
            {/* Input row */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-3 h-16 md:h-20 border-b border-border">
                <Search size={20} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <label htmlFor="search-input" className="sr-only">
                  Search {BUSINESS.name}
                </label>
                <input
                  id="search-input"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bridals, bespoke, gowns…"
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
                  style={{ fontFamily: "var(--font-body)" }}
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-2 ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Results area */}
            <div
              className="max-w-4xl mx-auto px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto"
              role="region"
              aria-live="polite"
              aria-label="Search results"
            >
              {query.trim().length >= 1 ? (
                results.length > 0 ? (
                  <div>
                    <p
                      style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }}
                      className="text-xs text-muted-foreground uppercase mb-4"
                    >
                      {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                    </p>
                    <ul className="space-y-1">
                      {results.map((p) => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleSelect(p.id)}
                            className="w-full flex items-center gap-4 p-3 hover:bg-[#F5F3EF] transition-colors group cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                          >
                            <div className="w-14 h-16 flex-shrink-0 overflow-hidden bg-[#F0EDE8]">
                              <img
                                src={imageUrl(p.image, "w=120&h=160&fit=crop&auto=format")}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={handleImageError}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontFamily: "var(--font-body)" }} className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                {p.category}
                              </p>
                              <p style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-base truncate">
                                {p.name}
                              </p>
                              <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-foreground">
                                ₦{p.price.toLocaleString()}
                              </p>
                            </div>
                            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p style={{ fontFamily: "var(--font-display)" }} className="text-xl text-foreground mb-2">
                      No results for "{query}"
                    </p>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground">
                      Try "Bridals", "Bespoke", or "Ready-to-Wear"
                    </p>
                  </div>
                )
              ) : (
                /* Default state: trending + quick filters */
                <div>
                  <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }} className="text-xs text-muted-foreground uppercase mb-4">
                    Trending Now
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {trending.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className="group text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                        aria-label={`View ${p.name}`}
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#F0EDE8] mb-2">
                          <img
                            src={imageUrl(p.image, "w=300&h=400&fit=crop&auto=format")}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                            onError={handleImageError}
                          />
                        </div>
                        <p style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-sm truncate">
                          {p.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-xs">
                          ₦{p.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Quick filter chips */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }} className="text-xs text-muted-foreground uppercase mb-3">
                      Browse by category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_FILTERS.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setQuery(cat)}
                          className="text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] min-h-[36px]"
                          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
