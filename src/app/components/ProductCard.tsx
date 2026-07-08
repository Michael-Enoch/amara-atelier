import { memo } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useShop } from "../context/ShopContext";
import type { Product } from "../data/types";
import { handleImageError, imageUrl } from "../lib/images";

export type { Product };

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: number) => void;
  loading?: "eager" | "lazy";
}

function ProductCardComponent({
  product,
  onViewDetails,
  loading = "lazy",
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#F0EDE8] aspect-3/4">
        <button
          type="button"
          onClick={() => onViewDetails(product.id)}
          className="relative block w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          aria-label={`View details for ${product.name}`}
        >
          {/* Primary image; switches to hoverImage on desktop hover */}
          <img
            src={imageUrl(product.image, "w=600&h=800&fit=crop&auto=format")}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-0 md:group-hover:opacity-0"
            loading={loading}
            decoding="async"
            onError={handleImageError}
          />
          {product.hoverImage && (
            <img
              src={imageUrl(
                product.hoverImage,
                "w=600&h=800&fit=crop&auto=format",
              )}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
          )}

          {/* Category badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
            {product.category === "Bridals" && (
              <span
                className="bg-[#C9A96E] text-white text-[10px] px-2 py-0.5 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ✦ Bridal
              </span>
            )}
            {product.category === "Bespoke" && (
              <span
                className="bg-[#1C1C1C] text-[#FAF8F5] text-[10px] px-2 py-0.5 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ✦ Bespoke
              </span>
            )}
            {product.category === "Ready-to-Wear" && product.isNew && (
              <span
                className="bg-[#1C1C1C] text-[#FAF8F5] text-[10px] px-2 py-0.5 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                New In
              </span>
            )}
          </div>
        </button>

        {/* Wishlist button — always tappable */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
        >
          <Heart
            size={15}
            className={
              wishlisted ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#1C1C1C]"
            }
            aria-hidden="true"
          />
        </button>

        {/*
          "View Details" CTA:
          - Mobile: always visible (touch has no hover)
          - Desktop (md+): hidden by default, slides up on group-hover
        */}
        <div className="absolute inset-x-0 bottom-0 z-10 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={() => onViewDetails(product.id)}
            className="w-full bg-[#1C1C1C]/90 text-[#FAF8F5] text-xs uppercase tracking-widest py-3 hover:bg-[#1C1C1C] transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-body)" }}
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Text info below image */}
      <button
        type="button"
        className="block w-full pt-2.5 space-y-0.5 cursor-pointer text-left  focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
        onClick={() => onViewDetails(product.id)}
      >
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-[10px] text-muted-foreground uppercase tracking-widest truncate"
        >
          {product.category}
        </p>
        <p
          style={{ fontFamily: "var(--font-display)" }}
          className="text-foreground text-sm sm:text-base leading-snug line-clamp-2"
        >
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            style={{ fontFamily: "var(--font-body)" }}
            className="text-foreground text-sm"
          >
            ₦{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span
              style={{ fontFamily: "var(--font-body)" }}
              className="text-muted-foreground text-xs line-through"
            >
              ₦{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </button>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardComponent);
