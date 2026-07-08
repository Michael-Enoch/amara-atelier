import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Scissors,
  Heart,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { ProductCard } from "../ProductCard";
import { BUSINESS } from "../../config";
import {
  CATALOG_CATEGORIES,
  getProductPage,
  isCatalogCategory,
} from "../../services/productService";
import type { CatalogCategory, ProductSortOption } from "../../services/productService";

const CATEGORY_META: Record<string, { icon: ReactNode; desc: string; cta: string; ctaHref: string }> = {
  Bridals: {
    icon: <Heart size={16} aria-hidden="true" />,
    desc: "Handcrafted wedding gowns designed for your most important day.",
    cta: "Book Bridal Consultation",
    ctaHref: BUSINESS.whatsappLink("Hi Amara Atelier! I'd like to book a bridal consultation."),
  },
  Bespoke: {
    icon: <Scissors size={16} aria-hidden="true" />,
    desc: "Made-to-measure pieces crafted entirely to your specifications.",
    cta: "Request Custom Order",
    ctaHref: BUSINESS.whatsappLink("Hi Amara Atelier! I'd like to request a bespoke order."),
  },
  "Ready-to-Wear": {
    icon: <Sparkles size={16} aria-hidden="true" />,
    desc: "Premium pieces ready to wear — available now for immediate order.",
    cta: "Order on WhatsApp",
    ctaHref: BUSINESS.whatsappLink("Hi Amara Atelier! I'd like to order a Ready-to-Wear piece."),
  },
};

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

const PRODUCT_PAGE_SIZE = 12;
const PRODUCT_GRID_SKELETON_ITEMS = Array.from(
  { length: PRODUCT_PAGE_SIZE },
  (_, index) => `product-grid-skeleton-${index + 1}`
);

type PaginationItem = number | `ellipsis-${number}`;

function getPaginationItems(currentPage: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b);

  return sortedPages.flatMap((page, index): PaginationItem[] => {
    const previous = sortedPages[index - 1];
    if (previous && page - previous > 1) {
      return [`ellipsis-${page}`, page];
    }
    return [page];
  });
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6" aria-hidden="true">
      {PRODUCT_GRID_SKELETON_ITEMS.map((item) => (
        <div key={item} className="space-y-2.5">
          <div className="aspect-[3/4] bg-[#F0EDE8] animate-pulse" />
          <div className="h-3 w-2/5 bg-[#E8E4DE] animate-pulse" />
          <div className="h-4 w-4/5 bg-[#E8E4DE] animate-pulse" />
          <div className="h-3 w-1/3 bg-[#E8E4DE] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ShopPage() {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<ProductSortOption>("newest");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);

  /**
   * Active category is derived from the URL param.
   * The URL is the single source of truth — clicking a tab updates the URL,
   * which causes this component to re-read from params.
   */
  const activeCategory: CatalogCategory = isCatalogCategory(urlCategory) ? urlCategory : "All";

  const handleCategoryChange = (cat: CatalogCategory) => {
    if (cat === "All") {
      navigate("/shop");
    } else {
      navigate(`/shop/${cat}`);
    }
  };

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      productGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleViewDetails = useCallback((id: number) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  useEffect(() => {
    if (urlCategory && !isCatalogCategory(urlCategory)) {
      navigate("/shop", { replace: true });
    }
  }, [navigate, urlCategory]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortBy]);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  const deferredCategory = useDeferredValue(activeCategory);
  const deferredSortBy = useDeferredValue(sortBy);
  const deferredPage = useDeferredValue(page);
  const isCatalogPending =
    deferredCategory !== activeCategory || deferredSortBy !== sortBy || deferredPage !== page;
  const catalogPage = useMemo(
    () =>
      getProductPage({
        category: deferredCategory,
        sortBy: deferredSortBy,
        page: deferredPage,
        pageSize: PRODUCT_PAGE_SIZE,
      }),
    [deferredCategory, deferredPage, deferredSortBy]
  );
  const paginationItems = useMemo(
    () => getPaginationItems(catalogPage.page, catalogPage.pageCount),
    [catalogPage.page, catalogPage.pageCount]
  );

  const meta = activeCategory !== "All" ? CATEGORY_META[activeCategory] : null;

  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      {/* ── Dark page header ── */}
      <div className="bg-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
              className="text-[#C9A96E] text-xs uppercase mb-2"
            >
              Amara Atelier · Port Harcourt
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[#FAF8F5] text-4xl md:text-6xl"
            >
              {activeCategory === "All" ? "All Collections" : activeCategory}
            </h1>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-sm mt-2">
              {catalogPage.total} {catalogPage.total === 1 ? "piece" : "pieces"}
            </p>
          </motion.div>
        </div>

        {/* Category tabs — inner overflow-x-auto so only tabs scroll, not the page */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center overflow-x-auto scrollbar-hide"
          role="group"
          aria-label="Filter by category"
        >
          {CATALOG_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              aria-pressed={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-5 py-3.5 text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                activeCategory === cat
                  ? "border-[#C9A96E] text-[#FAF8F5]"
                  : "border-transparent text-[#7A7570] hover:text-[#FAF8F5]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>{/* end bg-[#1C1C1C] */}

      {/* Category banner */}
      <AnimatePresence>
        {meta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#F5F3EF] border-b border-border overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#C9A96E]">
                {meta.icon}
                <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground">
                  {meta.desc}
                </p>
              </div>
              <a
                href={meta.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white text-xs uppercase tracking-widest px-4 py-2.5 hover:bg-[#1ebe57] transition-colors min-h-[40px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={13} aria-hidden="true" /> {meta.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort + result count bar */}
      <div className="border-b border-border sticky top-16 md:top-20 z-30 backdrop-blur-sm bg-[#FAF8F5]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
            {catalogPage.total} {catalogPage.total === 1 ? "result" : "results"}
            {activeCategory !== "All" && (
              <button
                type="button"
                onClick={() => handleCategoryChange("All")}
                aria-label="Clear category filter"
                className="ml-2 inline-flex items-center gap-1 text-[#C9A96E] hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={10} aria-hidden="true" /> Clear
              </button>
            )}
          </p>

          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              aria-controls={sortOpen ? "shop-sort-menu" : undefined}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] min-h-[36px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  id="shop-sort-menu"
                  role="menu"
                  aria-label="Sort options"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-white border border-border shadow-lg min-w-[180px] z-50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt.value} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={sortBy === opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-xs cursor-pointer transition-colors min-h-[44px] ${
                          sortBy === opt.value
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-muted"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div ref={productGridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {isCatalogPending ? (
          <ProductGridSkeleton />
        ) : catalogPage.total === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-muted-foreground">
              No pieces found
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange("All")}
              className="text-sm text-[#C9A96E] underline underline-offset-4 cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View all collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {catalogPage.items.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                loading={index < 4 ? "eager" : "lazy"}
              />
            ))}
          </div>
        )}

        {!isCatalogPending && catalogPage.pageCount > 1 && (
          <nav className="mt-10 flex flex-col items-center gap-3" aria-label="Product pagination">
            <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
              Page {catalogPage.page} of {catalogPage.pageCount}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(catalogPage.page - 1)}
                disabled={catalogPage.page <= 1}
                aria-label="Previous products page"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              {paginationItems.map((item) =>
                typeof item === "number" ? (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handlePageChange(item)}
                    aria-current={catalogPage.page === item ? "page" : undefined}
                    className={`min-w-10 h-10 px-3 border text-xs transition-colors cursor-pointer ${
                      catalogPage.page === item
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="w-7 text-center text-muted-foreground" aria-hidden="true">
                    ...
                  </span>
                )
              )}
              <button
                type="button"
                onClick={() => handlePageChange(catalogPage.page + 1)}
                disabled={catalogPage.page >= catalogPage.pageCount}
                aria-label="Next products page"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Bespoke upsell CTA — shown when not already browsing Bespoke */}
      {activeCategory !== "Bespoke" && (
        <section className="bg-[#1C1C1C] py-14">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
            <p
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }}
              className="text-[#C9A96E] text-xs uppercase"
            >
              Can't find exactly what you want?
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[#FAF8F5] text-2xl md:text-3xl"
            >
              Commission a Bespoke Piece
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-sm leading-relaxed">
              Every woman is unique. We create pieces built entirely around you — your measurements, your vision, your occasion.
            </p>
            <a
              href={BUSINESS.whatsappLink("Hi Amara Atelier! I'd like to commission a bespoke piece.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-[#1ebe57] transition-colors mt-2 min-h-[48px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <MessageCircle size={15} aria-hidden="true" /> Start a Bespoke Order
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
