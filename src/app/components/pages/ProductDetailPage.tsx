import { useRef, useState } from "react";
import {
  Heart, MessageCircle, ChevronLeft, ChevronRight,
  Star, Check, ShoppingBag, Calendar, Ruler, Palette, Sparkles,
  Truck, MapPin, Scissors,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useParams, useNavigate } from "react-router";
import { ProductCard } from "../ProductCard";
import { useShop } from "../../context/ShopContext";
import { WA } from "../../config";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { handleImageError, imageUrl } from "../../lib/images";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const CONSULTATION_STEPS = [
  { icon: <MessageCircle size={15} aria-hidden="true" />, title: "WhatsApp Consult", desc: "Share your vision, occasion & budget" },
  { icon: <Ruler size={15} aria-hidden="true" />, title: "Measurements", desc: "In-person or remote sizing session" },
  { icon: <Palette size={15} aria-hidden="true" />, title: "Design Approval", desc: "Sketch & fabric samples before we cut" },
  { icon: <Sparkles size={15} aria-hidden="true" />, title: "Delivery", desc: "Handcrafted & delivered to you" },
];

/**
 * This component is rendered via <ProductDetailRoute key={id} /> in App.tsx,
 * so all useState is automatically reset whenever the product ID changes —
 * no manual synchronisation needed.
 */
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const routeId = pathParts[pathParts.length - 1] ?? id;
  const productId = Number(routeId);
  const product = Number.isInteger(productId) ? getProductById(productId) : undefined;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const sizeGuideRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return (
      <div className="bg-background min-h-screen pt-16 md:pt-20">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
          <p
            style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
            className="text-[#C9A96E] text-xs uppercase"
          >
            Product Not Found
          </p>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-5xl">
            This piece is no longer available
          </h1>
          <p style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-sm leading-relaxed">
            The product link may be outdated, or the item may have been removed from the current collection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => navigate("/shop")}
              className="bg-foreground text-background text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-[#C9A96E] transition-colors cursor-pointer min-h-[48px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View Collections
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-border text-foreground text-xs uppercase tracking-widest px-7 py-3.5 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer min-h-[48px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isBridal = product.category === "Bridals";
  const isBespoke = product.category === "Bespoke";
  const isRTW = product.category === "Ready-to-Wear";

  const wishlisted = isWishlisted(product.id);

  const images = [
    imageUrl(product.image, "w=800&h=1000&fit=crop&auto=format"),
    product.hoverImage
      ? imageUrl(product.hoverImage, "w=800&h=1000&fit=crop&auto=format")
      : imageUrl(product.image, "w=800&h=1000&fit=crop&q=70&auto=format"),
    imageUrl(product.image, "w=800&h=1000&fit=crop&crop=bottom&auto=format"),
  ];

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  /* WhatsApp message — built from config helper */
  const waHref = isBridal
    ? WA.bridal(product.name, product.price)
    : isBespoke
    ? WA.bespoke(product.name, product.price)
    : WA.order(product.name, product.price, selectedSize ?? "Please specify", product.category);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeGuideOpen(true);
      setSizeError(true);
      window.setTimeout(() => {
        (sizeGuideRef.current ?? sizeSectionRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const whatsappLabel = isBridal
    ? "Book Bridal Consultation"
    : isBespoke
    ? "Start Bespoke Commission"
    : "Order on WhatsApp";

  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          <li>
            <button onClick={() => navigate("/")} className="hover:text-foreground cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]">
              Home
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li>
            <button
              onClick={() => navigate(`/shop/${product.category}`)}
              className="hover:text-foreground cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
            >
              {product.category}
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li className="text-foreground truncate max-w-[140px]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main product layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* ── Image gallery ── */}
          <div className="space-y-2">
            <div className="relative overflow-hidden bg-[#F0EDE8] aspect-[3/4]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  src={images[activeImg]}
                  alt={`${product.name} — view ${activeImg + 1}`}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                  onError={handleImageError}
                />
              </AnimatePresence>

              {/* Category badge */}
              {(isBridal || isBespoke || product.isNew) && (
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 uppercase tracking-widest ${
                      isBridal ? "bg-[#C9A96E] text-white" : "bg-[#1C1C1C] text-[#FAF8F5]"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {isBridal ? "✦ Bridal" : isBespoke ? "✦ Bespoke" : "New In"}
                  </span>
                </div>
              )}

              {/* Prev / Next */}
              <button
                onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/85 flex items-center justify-center hover:bg-white transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/85 flex items-center justify-center hover:bg-white transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>

              {/* Mobile dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden" role="tablist" aria-label="Image gallery">
                {images.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={activeImg === i}
                    aria-label={`View ${i + 1}`}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImg === i ? "bg-white w-4" : "bg-white/50 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop thumbnails */}
            <div className="hidden md:grid grid-cols-3 gap-2" role="tablist" aria-label="Image thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeImg === i}
                  aria-label={`View ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[3/4] overflow-hidden bg-[#F0EDE8] cursor-pointer transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                    activeImg === i ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product info ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-5 md:pt-2"
          >
            {/* Title */}
            <div className="space-y-2">
              <h1 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-4xl lg:text-5xl leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className="fill-[#C9A96E] text-[#C9A96E]" aria-hidden="true" />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
                  {isBridal ? "Bridal Collection" : isBespoke ? "Bespoke Commission" : "Ready-to-Wear"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {(isBridal || isBespoke) && (
                <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground uppercase tracking-widest self-end pb-1">
                  Starting from
                </span>
              )}
              <span style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-4xl">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && isRTW && (
                <>
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-lg line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-[#C9A96E] text-white text-xs px-2 py-0.5" style={{ fontFamily: "var(--font-body)" }}>
                    Save ₦{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Size selector (RTW only) OR consultation flow card (Bridal/Bespoke) */}
            {isRTW ? (
              <div ref={sizeSectionRef} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-foreground uppercase tracking-widest">
                    Select Size
                    {sizeError && (
                      <span className="ml-2 text-[#c0392b] normal-case tracking-normal text-xs" role="alert">
                        — please choose a size first
                      </span>
                    )}
                  </p>
                  <button
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-xs text-muted-foreground underline underline-offset-2 cursor-pointer hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                    onClick={() => setSizeGuideOpen((open) => !open)}
                    aria-expanded={sizeGuideOpen}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap" role="group" aria-label="Select size">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size === selectedSize ? null : size); setSizeError(false); }}
                      aria-pressed={selectedSize === size}
                      aria-label={`Size ${size}`}
                      className={`w-12 h-12 text-sm border transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : sizeError
                          ? "border-[#c0392b] text-foreground"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {sizeGuideOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div ref={sizeGuideRef} className="bg-[#F5F3EF] border border-border p-3 text-xs text-muted-foreground leading-relaxed">
                        <p style={{ fontFamily: "var(--font-body)" }}>
                          XS-XL follows standard ready-to-wear sizing. If you are between sizes, choose the larger size
                          and confirm your bust, waist, and hip measurements on WhatsApp before dispatch.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Consultation process card */
              <div className="bg-[#F5F3EF] border border-border p-4 space-y-4">
                <p
                  style={{ fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}
                  className="text-xs uppercase text-[#C9A96E]"
                >
                  {isBridal ? "Bridal Consultation Process" : "Bespoke Order Process"}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {CONSULTATION_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-6 h-6 bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.icon}
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-foreground font-medium">
                          {step.title}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)" }} className="text-[11px] text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-1 border-t border-border flex items-center gap-2">
                  <Calendar size={13} className="text-muted-foreground" aria-hidden="true" />
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground">
                    {isBridal ? "6–10 week production · Fitting included" : "4–8 week turnaround · Delivery nationwide"}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-foreground uppercase tracking-widest">
                About This {isBridal ? "Gown" : isBespoke ? "Commission" : "Piece"}
              </p>
              <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-muted-foreground leading-relaxed">
                {isBridal
                  ? `The ${product.name} is a handcrafted bridal gown built for your most important day. Every detail — silhouette, fabric weight, finishing — is designed to make you feel extraordinary from first try-on to final dance.`
                  : isBespoke
                  ? `The ${product.name} is a made-to-measure commission built entirely around your measurements, vision, and occasion. You'll work directly with the Amara Atelier designer from concept sketch to final fitting.`
                  : `The ${product.name} is a ready-to-wear luxury piece — designed in-house and available for immediate order. Crafted with premium fabric and finished to designer standards.`}
              </p>
              <ul style={{ fontFamily: "var(--font-body)" }} className="text-xs text-muted-foreground space-y-1.5">
                {(isBridal
                  ? ["Handcrafted bridal couture — not mass produced", "Custom measurements & fitting session", "Premium imported bridal fabrics", "6–10 week production timeline"]
                  : isBespoke
                  ? ["Made-to-measure from scratch", "Fabric sourcing + design sketch approval", "Personal fitting session included", "4–8 week production · Nationwide delivery"]
                  : ["Premium quality fabric — designer standard", "Available in XS–XL", "Fast nationwide delivery", "Designed & finished in Port Harcourt"]
                ).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check size={11} className="text-[#C9A96E] mt-0.5 flex-shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-1">
              {/* Primary: WhatsApp */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2.5 py-4 text-sm uppercase tracking-widest hover:bg-[#1ebe57] transition-colors min-h-[52px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={17} aria-hidden="true" />
                {whatsappLabel}
              </a>

              {/* Secondary: Add to Cart (RTW only) */}
              {isRTW && (
                <button
                  onClick={handleAddToCart}
                  aria-label={addedToCart ? "Added to cart" : "Add to cart"}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm uppercase tracking-widest transition-all cursor-pointer border min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                    addedToCart
                      ? "border-[#C9A96E] bg-[#C9A96E] text-white"
                      : "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {addedToCart
                    ? <><Check size={16} aria-hidden="true" /> Added to Cart</>
                    : <><ShoppingBag size={16} aria-hidden="true" /> Add to Cart</>}
                </button>
              )}

              {/* Tertiary: Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
                className={`w-full border py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                  wishlisted
                    ? "border-[#C9A96E] text-[#C9A96E]"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Heart size={14} className={wishlisted ? "fill-[#C9A96E]" : ""} aria-hidden="true" />
                {wishlisted ? "Saved to Favourites" : "Save to Favourites"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              {(isBridal
                ? [
                    { icon: <Sparkles size={18} aria-hidden="true" />, text: "Bridal Couture" },
                    { icon: <Ruler size={18} aria-hidden="true" />, text: "Custom Fit" },
                    { icon: <MapPin size={18} aria-hidden="true" />, text: "PHC Made" },
                  ]
                : isBespoke
                ? [
                    { icon: <Scissors size={18} aria-hidden="true" />, text: "Made-to-Measure" },
                    { icon: <Palette size={18} aria-hidden="true" />, text: "Your Design" },
                    { icon: <Truck size={18} aria-hidden="true" />, text: "Nationwide" },
                  ]
                : [
                    { icon: <Sparkles size={18} aria-hidden="true" />, text: "Premium Quality" },
                    { icon: <Truck size={18} aria-hidden="true" />, text: "Fast Delivery" },
                    { icon: <MapPin size={18} aria-hidden="true" />, text: "PHC Designed" },
                  ]
              ).map((b) => (
                <div key={b.text} className="text-center space-y-1 py-2">
                  <span className="flex h-6 items-center justify-center text-[#C9A96E]">{b.icon}</span>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-[9px] text-muted-foreground uppercase tracking-wider">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-[#F5F3EF] py-16 md:py-20" aria-label="Related products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-2xl md:text-3xl mb-8">
              More {product.category} Pieces
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={(newId) => navigate(`/product/${newId}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-[#FAF8F5] border-t border-border"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className={`p-3 ${isRTW ? "grid grid-cols-2 gap-2" : ""}`}>
          {isRTW ? (
            <>
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-1.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer min-h-[48px] ${
                  addedToCart ? "bg-[#C9A96E] text-white" : "bg-foreground text-background"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
                aria-label={addedToCart ? "Added to cart" : "Add to cart"}
              >
                {addedToCart ? <><Check size={13} aria-hidden="true" /> Added</> : <><ShoppingBag size={13} aria-hidden="true" /> Add to Cart</>}
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white flex items-center justify-center gap-1.5 py-3 text-xs uppercase tracking-wider min-h-[48px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={13} aria-hidden="true" /> WhatsApp
              </a>
            </>
          ) : (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-widest min-h-[48px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <MessageCircle size={15} aria-hidden="true" />
              {whatsappLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
