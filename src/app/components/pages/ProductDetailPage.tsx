import { useRef, useState } from "react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import {
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  ShoppingBag,
  Calendar,
  Ruler,
  Palette,
  Sparkles,
  Truck,
  MapPin,
  Scissors,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useParams, useNavigate } from "react-router";
import { ProductCard } from "../ProductCard";
import { useShop } from "../../context/ShopContext";
import { WA } from "../../config";
import {
  getProductById,
  getProductsByCategory,
} from "../../services/productService";
import { handleImageError, imageUrl } from "../../lib/images";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const BODY_FONT = { fontFamily: "var(--font-body)" };
const DISPLAY_FONT = { fontFamily: "var(--font-display)" };

const CONSULTATION_STEPS = [
  {
    icon: <MessageCircle size={15} aria-hidden="true" />,
    title: "WhatsApp Consult",
    desc: "Share your vision, occasion & budget",
  },
  {
    icon: <Ruler size={15} aria-hidden="true" />,
    title: "Measurements",
    desc: "In-person or remote sizing session",
  },
  {
    icon: <Palette size={15} aria-hidden="true" />,
    title: "Design Approval",
    desc: "Sketch & fabric samples before we cut",
  },
  {
    icon: <Sparkles size={15} aria-hidden="true" />,
    title: "Delivery",
    desc: "Handcrafted & delivered to you",
  },
];

type Product = NonNullable<ReturnType<typeof getProductById>>;
type Navigate = ReturnType<typeof useNavigate>;

type ProductFlags = {
  isBridal: boolean;
  isBespoke: boolean;
  isRTW: boolean;
};

type Badge = {
  icon: ReactNode;
  text: string;
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  const product = getCurrentProduct(location.pathname, id);

  if (!product) {
    return <ProductNotFound navigate={navigate} />;
  }

  return (
    <ProductDetailContent
      key={product.id}
      product={product}
      navigate={navigate}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      isWishlisted={isWishlisted}
    />
  );
}

type ProductDetailContentProps = {
  product: Product;
  navigate: Navigate;
  addToCart: (product: Product, size: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: number) => boolean;
};

function ProductDetailContent({
  product,
  navigate,
  addToCart,
  toggleWishlist,
  isWishlisted,
}: ProductDetailContentProps) {
  const flags = getProductFlags(product);
  const images = getProductImages(product);
  const related = getRelatedProducts(product);
  const wishlisted = isWishlisted(product.id);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const sizeGuideRef = useRef<HTMLDivElement>(null);

  const waHref = getWhatsAppHref(product, flags, selectedSize);
  const whatsappLabel = getWhatsAppLabel(flags);

  const handleAddToCart = () => {
    if (!selectedSize) {
      openSizeGuideWithError({
        setSizeGuideOpen,
        setSizeError,
        sizeGuideRef,
        sizeSectionRef,
      });
      return;
    }

    addToCart(product, selectedSize);
    showAddedToCartMessage(setAddedToCart);
  };

  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      <Breadcrumb product={product} navigate={navigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <ProductGallery
            product={product}
            flags={flags}
            images={images}
            activeImg={activeImg}
            setActiveImg={setActiveImg}
          />

          <ProductInfo
            product={product}
            flags={flags}
            wishlisted={wishlisted}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            addedToCart={addedToCart}
            sizeError={sizeError}
            setSizeError={setSizeError}
            sizeGuideOpen={sizeGuideOpen}
            setSizeGuideOpen={setSizeGuideOpen}
            sizeSectionRef={sizeSectionRef}
            sizeGuideRef={sizeGuideRef}
            waHref={waHref}
            whatsappLabel={whatsappLabel}
            handleAddToCart={handleAddToCart}
            toggleWishlist={toggleWishlist}
          />
        </div>
      </main>

      <RelatedProducts product={product} related={related} navigate={navigate} />

      <StickyMobileBar
        flags={flags}
        waHref={waHref}
        whatsappLabel={whatsappLabel}
        addedToCart={addedToCart}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}

type ProductInfoProps = {
  product: Product;
  flags: ProductFlags;
  wishlisted: boolean;
  selectedSize: string | null;
  setSelectedSize: Dispatch<SetStateAction<string | null>>;
  addedToCart: boolean;
  sizeError: boolean;
  setSizeError: Dispatch<SetStateAction<boolean>>;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: Dispatch<SetStateAction<boolean>>;
  sizeSectionRef: RefObject<HTMLDivElement>;
  sizeGuideRef: RefObject<HTMLDivElement>;
  waHref: string;
  whatsappLabel: string;
  handleAddToCart: () => void;
  toggleWishlist: (product: Product) => void;
};

function ProductInfo({
  product,
  flags,
  wishlisted,
  selectedSize,
  setSelectedSize,
  addedToCart,
  sizeError,
  setSizeError,
  sizeGuideOpen,
  setSizeGuideOpen,
  sizeSectionRef,
  sizeGuideRef,
  waHref,
  whatsappLabel,
  handleAddToCart,
  toggleWishlist,
}: ProductInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-5 md:pt-2"
    >
      <ProductHeader product={product} flags={flags} />
      <ProductPrice product={product} flags={flags} />

      <div className="h-px bg-border" />

      <OrderSection
        flags={flags}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sizeError={sizeError}
        setSizeError={setSizeError}
        sizeGuideOpen={sizeGuideOpen}
        setSizeGuideOpen={setSizeGuideOpen}
        sizeSectionRef={sizeSectionRef}
        sizeGuideRef={sizeGuideRef}
      />

      <ProductDescription product={product} flags={flags} />

      <ProductActions
        product={product}
        flags={flags}
        wishlisted={wishlisted}
        waHref={waHref}
        whatsappLabel={whatsappLabel}
        addedToCart={addedToCart}
        handleAddToCart={handleAddToCart}
        toggleWishlist={toggleWishlist}
      />

      <TrustBadges flags={flags} />
    </motion.div>
  );
}

function ProductNotFound({ navigate }: { navigate: Navigate }) {
  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <p
          style={{ ...BODY_FONT, letterSpacing: "0.25em" }}
          className="text-[#C9A96E] text-xs uppercase"
        >
          Product Not Found
        </p>

        <h1
          style={DISPLAY_FONT}
          className="text-foreground text-3xl md:text-5xl"
        >
          This piece is no longer available
        </h1>

        <p
          style={BODY_FONT}
          className="text-muted-foreground text-sm leading-relaxed"
        >
          The product link may be outdated, or the item may have been removed
          from the current collection.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => navigate("/shop")}
            className="bg-foreground text-background text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-[#C9A96E] transition-colors cursor-pointer min-h-[48px]"
            style={BODY_FONT}
          >
            View Collections
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-border text-foreground text-xs uppercase tracking-widest px-7 py-3.5 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer min-h-[48px]"
            style={BODY_FONT}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ product, navigate }: { product: Product; navigate: Navigate }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6"
    >
      <ol
        className="flex items-center gap-2 text-xs text-muted-foreground"
        style={BODY_FONT}
      >
        <li>
          <button
            onClick={() => navigate("/")}
            className="hover:text-foreground cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          >
            Home
          </button>
        </li>

        <BreadcrumbSeparator />

        <li>
          <button
            onClick={() => navigate(`/shop/${product.category}`)}
            className="hover:text-foreground cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          >
            {product.category}
          </button>
        </li>

        <BreadcrumbSeparator />

        <li className="text-foreground truncate max-w-35" aria-current="page">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}

function BreadcrumbSeparator() {
  return (
    <li aria-hidden="true">
      <ChevronRight size={12} />
    </li>
  );
}

type ProductGalleryProps = {
  product: Product;
  flags: ProductFlags;
  images: string[];
  activeImg: number;
  setActiveImg: Dispatch<SetStateAction<number>>;
};

function ProductGallery({
  product,
  flags,
  images,
  activeImg,
  setActiveImg,
}: ProductGalleryProps) {
  const showBadge = flags.isBridal || flags.isBespoke || product.isNew;

  return (
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

        {showBadge && <CategoryBadge product={product} flags={flags} />}

        <GalleryButton
          direction="previous"
          onClick={() =>
            setActiveImg((current) =>
              getPreviousImageIndex(current, images.length),
            )
          }
        />

        <GalleryButton
          direction="next"
          onClick={() =>
            setActiveImg((current) => getNextImageIndex(current, images.length))
          }
        />

        <GalleryDots images={images} activeImg={activeImg} setActiveImg={setActiveImg} />
      </div>

      <GalleryThumbnails images={images} activeImg={activeImg} setActiveImg={setActiveImg} />
    </div>
  );
}

function CategoryBadge({ product, flags }: { product: Product; flags: ProductFlags }) {
  const text = getCategoryBadgeText(product, flags);
  const className = flags.isBridal
    ? "bg-[#C9A96E] text-white"
    : "bg-[#1C1C1C] text-[#FAF8F5]";

  return (
    <div className="absolute top-4 left-4">
      <span
        className={`text-[10px] px-2.5 py-1 uppercase tracking-widest ${className}`}
        style={BODY_FONT}
      >
        {text}
      </span>
    </div>
  );
}

function GalleryButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";
  const positionClass = isPrevious ? "left-3" : "right-3";
  const label = isPrevious ? "Previous image" : "Next image";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 w-10 h-10 bg-white/85 flex items-center justify-center hover:bg-white transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]`}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

function GalleryDots({
  images,
  activeImg,
  setActiveImg,
}: {
  images: string[];
  activeImg: number;
  setActiveImg: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden"
      role="tablist"
      aria-label="Image gallery"
    >
      {images.map((_, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={activeImg === index}
          aria-label={`View ${index + 1}`}
          onClick={() => setActiveImg(index)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            activeImg === index ? "bg-white w-4" : "bg-white/50 w-1.5"
          }`}
        />
      ))}
    </div>
  );
}

function GalleryThumbnails({
  images,
  activeImg,
  setActiveImg,
}: {
  images: string[];
  activeImg: number;
  setActiveImg: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className="hidden md:grid grid-cols-3 gap-2"
      role="tablist"
      aria-label="Image thumbnails"
    >
      {images.map((img, index) => (
        <button
          key={`${img}-${index}`}
          role="tab"
          aria-selected={activeImg === index}
          aria-label={`View ${index + 1}`}
          onClick={() => setActiveImg(index)}
          className={`aspect-[3/4] overflow-hidden bg-[#F0EDE8] cursor-pointer transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
            activeImg === index
              ? "ring-1 ring-foreground"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          <img
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </button>
      ))}
    </div>
  );
}

function ProductHeader({ product, flags }: { product: Product; flags: ProductFlags }) {
  return (
    <div className="space-y-2">
      <h1
        style={DISPLAY_FONT}
        className="text-foreground text-3xl md:text-4xl lg:text-5xl leading-tight"
      >
        {product.name}
      </h1>

      <div className="flex items-center gap-2.5">
        <RatingStars />

        <span style={BODY_FONT} className="text-xs text-muted-foreground">
          {getCollectionLabel(flags)}
        </span>
      </div>
    </div>
  );
}

function RatingStars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className="fill-[#C9A96E] text-[#C9A96E]"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ProductPrice({ product, flags }: { product: Product; flags: ProductFlags }) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      {(flags.isBridal || flags.isBespoke) && (
        <span
          style={BODY_FONT}
          className="text-xs text-muted-foreground uppercase tracking-widest self-end pb-1"
        >
          Starting from
        </span>
      )}

      <span style={DISPLAY_FONT} className="text-foreground text-3xl md:text-4xl">
        ₦{product.price.toLocaleString()}
      </span>

      <OriginalPrice product={product} flags={flags} />
    </div>
  );
}

function OriginalPrice({ product, flags }: { product: Product; flags: ProductFlags }) {
  if (!product.originalPrice || !flags.isRTW) {
    return null;
  }

  return (
    <>
      <span style={BODY_FONT} className="text-muted-foreground text-lg line-through">
        ₦{product.originalPrice.toLocaleString()}
      </span>

      <span className="bg-[#C9A96E] text-white text-xs px-2 py-0.5" style={BODY_FONT}>
        Save ₦{(product.originalPrice - product.price).toLocaleString()}
      </span>
    </>
  );
}

type OrderSectionProps = {
  flags: ProductFlags;
  selectedSize: string | null;
  setSelectedSize: Dispatch<SetStateAction<string | null>>;
  sizeError: boolean;
  setSizeError: Dispatch<SetStateAction<boolean>>;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: Dispatch<SetStateAction<boolean>>;
  sizeSectionRef: RefObject<HTMLDivElement>;
  sizeGuideRef: RefObject<HTMLDivElement>;
};

function OrderSection(props: OrderSectionProps) {
  if (props.flags.isRTW) {
    return <SizeSelector {...props} />;
  }

  return <ConsultationProcess flags={props.flags} />;
}

function SizeSelector({
  selectedSize,
  setSelectedSize,
  sizeError,
  setSizeError,
  sizeGuideOpen,
  setSizeGuideOpen,
  sizeSectionRef,
  sizeGuideRef,
}: OrderSectionProps) {
  return (
    <div ref={sizeSectionRef} className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-(--font-body) text-sm text-foreground uppercase tracking-widest">
          Select Size
          {sizeError && (
            <span className="ml-2 text-[#c0392b] normal-case tracking-normal text-xs" role="alert">
              — please choose a size first
            </span>
          )}
        </p>

        <button
          className="font-(--font-body) text-xs text-muted-foreground underline underline-offset-2 cursor-pointer hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          onClick={() => setSizeGuideOpen((open) => !open)}
          aria-expanded={sizeGuideOpen ? "true" : "false"}
        >
          Size Guide
        </button>
      </div>

      <SizeButtons
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sizeError={sizeError}
        setSizeError={setSizeError}
      />

      <SizeGuide isOpen={sizeGuideOpen} sizeGuideRef={sizeGuideRef} />
    </div>
  );
}

type SizeButtonsProps = {
  selectedSize: string | null;
  setSelectedSize: Dispatch<SetStateAction<string | null>>;
  sizeError: boolean;
  setSizeError: Dispatch<SetStateAction<boolean>>;
};

function SizeButtons({
  selectedSize,
  setSelectedSize,
  sizeError,
  setSizeError,
}: SizeButtonsProps) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Select size">
      {SIZES.map((size) => (
        <button
          key={size}
          onClick={() => {
            setSelectedSize(size === selectedSize ? null : size);
            setSizeError(false);
          }}
          aria-pressed={selectedSize === size}
          aria-label={`Size ${size}`}
          className={`font-(--font-body) w-12 h-12 text-sm border transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${getSizeButtonClass(
            size,
            selectedSize,
            sizeError,
          )}`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

function SizeGuide({
  isOpen,
  sizeGuideRef,
}: {
  isOpen: boolean;
  sizeGuideRef: RefObject<HTMLDivElement>;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div
            ref={sizeGuideRef}
            className="bg-[#F5F3EF] border border-border p-3 text-xs text-muted-foreground leading-relaxed"
          >
            <p style={BODY_FONT}>
              XS-XL follows standard ready-to-wear sizing. If you are between
              sizes, choose the larger size and confirm your bust, waist, and
              hip measurements on WhatsApp before dispatch.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsultationProcess({ flags }: { flags: ProductFlags }) {
  return (
    <div className="bg-[#F5F3EF] border border-border p-4 space-y-4">
      <p
        style={{ ...BODY_FONT, letterSpacing: "0.15em" }}
        className="text-xs uppercase text-[#C9A96E]"
      >
        {getProcessTitle(flags)}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {CONSULTATION_STEPS.map((step) => (
          <ConsultationStep key={step.title} step={step} />
        ))}
      </div>

      <div className="pt-1 border-t border-border flex items-center gap-2">
        <Calendar size={13} className="text-muted-foreground" aria-hidden="true" />

        <span style={BODY_FONT} className="text-xs text-muted-foreground">
          {getTimelineText(flags)}
        </span>
      </div>
    </div>
  );
}

function ConsultationStep({ step }: { step: (typeof CONSULTATION_STEPS)[number] }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center flex-shrink-0 mt-0.5">
        {step.icon}
      </div>

      <div>
        <p style={BODY_FONT} className="text-xs text-foreground font-medium">
          {step.title}
        </p>

        <p style={BODY_FONT} className="text-[11px] text-muted-foreground leading-relaxed">
          {step.desc}
        </p>
      </div>
    </div>
  );
}

function ProductDescription({ product, flags }: { product: Product; flags: ProductFlags }) {
  return (
    <div className="space-y-3">
      <p style={BODY_FONT} className="text-sm text-foreground uppercase tracking-widest">
        About This {getProductNoun(flags)}
      </p>

      <p style={BODY_FONT} className="text-sm text-muted-foreground leading-relaxed">
        {getProductDescription(product, flags)}
      </p>

      <ul style={BODY_FONT} className="text-xs text-muted-foreground space-y-1.5">
        {getFeaturePoints(flags).map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check size={11} className="text-[#C9A96E] mt-0.5 flex-shrink-0" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ProductActionsProps = {
  product: Product;
  flags: ProductFlags;
  wishlisted: boolean;
  waHref: string;
  whatsappLabel: string;
  addedToCart: boolean;
  handleAddToCart: () => void;
  toggleWishlist: (product: Product) => void;
};

function ProductActions({
  product,
  flags,
  wishlisted,
  waHref,
  whatsappLabel,
  addedToCart,
  handleAddToCart,
  toggleWishlist,
}: ProductActionsProps) {
  return (
    <div className="space-y-2.5 pt-1">
      <WhatsAppButton href={waHref} label={whatsappLabel} />
      <AddToCartButton
        show={flags.isRTW}
        addedToCart={addedToCart}
        handleAddToCart={handleAddToCart}
      />
      <WishlistButton product={product} wishlisted={wishlisted} toggleWishlist={toggleWishlist} />
    </div>
  );
}

function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2.5 py-4 text-sm uppercase tracking-widest hover:bg-[#1ebe57] transition-colors min-h-[52px]"
      style={BODY_FONT}
    >
      <MessageCircle size={17} aria-hidden="true" />
      {label}
    </a>
  );
}

function AddToCartButton({
  show,
  addedToCart,
  handleAddToCart,
}: {
  show: boolean;
  addedToCart: boolean;
  handleAddToCart: () => void;
}) {
  if (!show) {
    return null;
  }

  return (
    <button
      onClick={handleAddToCart}
      aria-label={addedToCart ? "Added to cart" : "Add to cart"}
      className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm uppercase tracking-widest transition-all cursor-pointer border min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
        addedToCart
          ? "border-[#C9A96E] bg-[#C9A96E] text-white"
          : "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
      }`}
      style={BODY_FONT}
    >
      {addedToCart ? (
        <>
          <Check size={16} aria-hidden="true" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag size={16} aria-hidden="true" /> Add to Cart
        </>
      )}
    </button>
  );
}

function WishlistButton({
  product,
  wishlisted,
  toggleWishlist,
}: {
  product: Product;
  wishlisted: boolean;
  toggleWishlist: (product: Product) => void;
}) {
  return (
    <button
      onClick={() => toggleWishlist(product)}
      aria-label={
        wishlisted
          ? `Remove ${product.name} from favourites`
          : `Save ${product.name} to favourites`
      }
      className={`w-full border py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
        wishlisted
          ? "border-[#C9A96E] text-[#C9A96E]"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
      style={BODY_FONT}
    >
      <Heart
        size={14}
        className={wishlisted ? "fill-[#C9A96E]" : ""}
        aria-hidden="true"
      />
      {wishlisted ? "Saved to Favourites" : "Save to Favourites"}
    </button>
  );
}

function TrustBadges({ flags }: { flags: ProductFlags }) {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
      {getTrustBadges(flags).map((badge) => (
        <div key={badge.text} className="text-center space-y-1 py-2">
          <span className="flex h-6 items-center justify-center text-[#C9A96E]">
            {badge.icon}
          </span>

          <p style={BODY_FONT} className="text-[9px] text-muted-foreground uppercase tracking-wider">
            {badge.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function RelatedProducts({
  product,
  related,
  navigate,
}: {
  product: Product;
  related: Product[];
  navigate: Navigate;
}) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F5F3EF] py-16 md:py-20" aria-label="Related products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 style={DISPLAY_FONT} className="text-foreground text-2xl md:text-3xl mb-8">
          More {product.category} Pieces
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onViewDetails={(newId) => navigate(`/product/${newId}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type StickyMobileBarProps = {
  flags: ProductFlags;
  waHref: string;
  whatsappLabel: string;
  addedToCart: boolean;
  handleAddToCart: () => void;
};

function StickyMobileBar({
  flags,
  waHref,
  whatsappLabel,
  addedToCart,
  handleAddToCart,
}: StickyMobileBarProps) {
  if (!flags.isRTW) {
    return (
      <MobileBarWrapper>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-widest min-h-[48px]"
          style={BODY_FONT}
        >
          <MessageCircle size={15} aria-hidden="true" />
          {whatsappLabel}
        </a>
      </MobileBarWrapper>
    );
  }

  return (
    <MobileBarWrapper isGrid>
      <button
        onClick={handleAddToCart}
        className={`flex items-center justify-center gap-1.5 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer min-h-[48px] ${
          addedToCart ? "bg-[#C9A96E] text-white" : "bg-foreground text-background"
        }`}
        style={BODY_FONT}
        aria-label={addedToCart ? "Added to cart" : "Add to cart"}
      >
        {addedToCart ? (
          <>
            <Check size={13} aria-hidden="true" /> Added
          </>
        ) : (
          <>
            <ShoppingBag size={13} aria-hidden="true" /> Add to Cart
          </>
        )}
      </button>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white flex items-center justify-center gap-1.5 py-3 text-xs uppercase tracking-wider min-h-[48px]"
        style={BODY_FONT}
      >
        <MessageCircle size={13} aria-hidden="true" /> WhatsApp
      </a>
    </MobileBarWrapper>
  );
}

function MobileBarWrapper({
  children,
  isGrid = false,
}: {
  children: ReactNode;
  isGrid?: boolean;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-[#FAF8F5] border-t border-border"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className={`p-3 ${isGrid ? "grid grid-cols-2 gap-2" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function getCurrentProduct(pathname: string, id?: string) {
  const routeId = pathname.split("/").filter(Boolean).slice(-1)[0] ?? id;
  const productId = Number(routeId);

  if (!Number.isInteger(productId)) {
    return undefined;
  }

  return getProductById(productId);
}

function getProductFlags(product: Product): ProductFlags {
  return {
    isBridal: product.category === "Bridals",
    isBespoke: product.category === "Bespoke",
    isRTW: product.category === "Ready-to-Wear",
  };
}

function getProductImages(product: Product) {
  return [
    imageUrl(product.image, "w=800&h=1000&fit=crop&auto=format"),
    getSecondaryImage(product),
    imageUrl(product.image, "w=800&h=1000&fit=crop&crop=bottom&auto=format"),
  ];
}

function getSecondaryImage(product: Product) {
  if (product.hoverImage) {
    return imageUrl(product.hoverImage, "w=800&h=1000&fit=crop&auto=format");
  }

  return imageUrl(product.image, "w=800&h=1000&fit=crop&q=70&auto=format");
}

function getRelatedProducts(product: Product) {
  return getProductsByCategory(product.category)
    .filter((item) => item.id !== product.id)
    .slice(0, 4);
}

function getWhatsAppHref(
  product: Product,
  flags: ProductFlags,
  selectedSize: string | null,
) {
  if (flags.isBridal) {
    return WA.bridal(product.name, product.price);
  }

  if (flags.isBespoke) {
    return WA.bespoke(product.name, product.price);
  }

  return WA.order(
    product.name,
    product.price,
    selectedSize ?? "Please specify",
    product.category,
  );
}

function getWhatsAppLabel(flags: ProductFlags) {
  if (flags.isBridal) {
    return "Book Bridal Consultation";
  }

  if (flags.isBespoke) {
    return "Start Bespoke Commission";
  }

  return "Order on WhatsApp";
}

function getCategoryBadgeText(product: Product, flags: ProductFlags) {
  if (flags.isBridal) {
    return "✦ Bridal";
  }

  if (flags.isBespoke) {
    return "✦ Bespoke";
  }

  if (product.isNew) {
    return "New In";
  }

  return "";
}

function getCollectionLabel(flags: ProductFlags) {
  if (flags.isBridal) {
    return "Bridal Collection";
  }

  if (flags.isBespoke) {
    return "Bespoke Commission";
  }

  return "Ready-to-Wear";
}

function getProcessTitle(flags: ProductFlags) {
  if (flags.isBridal) {
    return "Bridal Consultation Process";
  }

  return "Bespoke Order Process";
}

function getTimelineText(flags: ProductFlags) {
  if (flags.isBridal) {
    return "6–10 week production · Fitting included";
  }

  return "4–8 week turnaround · Delivery nationwide";
}

function getProductNoun(flags: ProductFlags) {
  if (flags.isBridal) {
    return "Gown";
  }

  if (flags.isBespoke) {
    return "Commission";
  }

  return "Piece";
}

function getProductDescription(product: Product, flags: ProductFlags) {
  if (flags.isBridal) {
    return `The ${product.name} is a handcrafted bridal gown built for your most important day. Every detail — silhouette, fabric weight, finishing — is designed to make you feel extraordinary from first try-on to final dance.`;
  }

  if (flags.isBespoke) {
    return `The ${product.name} is a made-to-measure commission built entirely around your measurements, vision, and occasion. You'll work directly with the Amara Atelier designer from concept sketch to final fitting.`;
  }

  return `The ${product.name} is a ready-to-wear luxury piece — designed in-house and available for immediate order. Crafted with premium fabric and finished to designer standards.`;
}

function getFeaturePoints(flags: ProductFlags) {
  if (flags.isBridal) {
    return [
      "Handcrafted bridal couture — not mass produced",
      "Custom measurements & fitting session",
      "Premium imported bridal fabrics",
      "6–10 week production timeline",
    ];
  }

  if (flags.isBespoke) {
    return [
      "Made-to-measure from scratch",
      "Fabric sourcing + design sketch approval",
      "Personal fitting session included",
      "4–8 week production · Nationwide delivery",
    ];
  }

  return [
    "Premium quality fabric — designer standard",
    "Available in XS–XL",
    "Fast nationwide delivery",
    "Designed & finished in Port Harcourt",
  ];
}

function getTrustBadges(flags: ProductFlags): Badge[] {
  if (flags.isBridal) {
    return [
      {
        icon: <Sparkles size={18} aria-hidden="true" />,
        text: "Bridal Couture",
      },
      {
        icon: <Ruler size={18} aria-hidden="true" />,
        text: "Custom Fit",
      },
      {
        icon: <MapPin size={18} aria-hidden="true" />,
        text: "PHC Made",
      },
    ];
  }

  if (flags.isBespoke) {
    return [
      {
        icon: <Scissors size={18} aria-hidden="true" />,
        text: "Made-to-Measure",
      },
      {
        icon: <Palette size={18} aria-hidden="true" />,
        text: "Your Design",
      },
      {
        icon: <Truck size={18} aria-hidden="true" />,
        text: "Nationwide",
      },
    ];
  }

  return [
    {
      icon: <Sparkles size={18} aria-hidden="true" />,
      text: "Premium Quality",
    },
    {
      icon: <Truck size={18} aria-hidden="true" />,
      text: "Fast Delivery",
    },
    {
      icon: <MapPin size={18} aria-hidden="true" />,
      text: "PHC Designed",
    },
  ];
}

function getSizeButtonClass(
  size: string,
  selectedSize: string | null,
  sizeError: boolean,
) {
  if (selectedSize === size) {
    return "border-foreground bg-foreground text-background";
  }

  if (sizeError) {
    return "border-[#c0392b] text-foreground";
  }

  return "border-border text-foreground hover:border-foreground";
}

function getPreviousImageIndex(currentIndex: number, totalImages: number) {
  return (currentIndex - 1 + totalImages) % totalImages;
}

function getNextImageIndex(currentIndex: number, totalImages: number) {
  return (currentIndex + 1) % totalImages;
}

function openSizeGuideWithError({
  setSizeGuideOpen,
  setSizeError,
  sizeGuideRef,
  sizeSectionRef,
}: {
  setSizeGuideOpen: Dispatch<SetStateAction<boolean>>;
  setSizeError: Dispatch<SetStateAction<boolean>>;
  sizeGuideRef: RefObject<HTMLDivElement | null>;
  sizeSectionRef: RefObject<HTMLDivElement | null>;
}) {
  setSizeGuideOpen(true);
  setSizeError(true);

  window.setTimeout(() => {
    const target = sizeGuideRef.current ?? sizeSectionRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 0);

  window.setTimeout(() => setSizeError(false), 2500);
}

function showAddedToCartMessage(
  setAddedToCart: Dispatch<SetStateAction<boolean>>,
) {
  setAddedToCart(true);
  window.setTimeout(() => setAddedToCart(false), 2500);
}
