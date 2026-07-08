import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { LOOKBOOK_SLIDES } from "../data/media";
import { handleImageError, imageUrl } from "../lib/images";

export function LookbookCarousel() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Auto-advance
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="relative bg-[#1C1C1C] overflow-hidden" aria-label="Lookbook slideshow">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" role="list">
          {LOOKBOOK_SLIDES.map((slide, i) => (
            <div
              key={slide.label}
              role="listitem"
              aria-label={slide.label}
              className="relative flex-[0_0_100%] min-h-[520px]"
              style={{ height: "70svh" }}
            >
              <img
                src={imageUrl(slide.image.src, "w=1600&h=1000&fit=crop&auto=format")}
                alt={slide.image.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/20 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-12 md:bottom-16 left-6 md:left-16 right-6 md:right-16">
                <p
                  style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
                  className="text-[#C9A96E] text-xs uppercase mb-2"
                >
                  {slide.sub}
                </p>
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[#FAF8F5] text-4xl md:text-6xl lg:text-7xl leading-tight"
                >
                  {slide.label}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls — safe-zone aware: right-3 on mobile, right-16 on desktop */}
      <div className="absolute bottom-6 right-3 md:bottom-8 md:right-16 flex items-center gap-2 md:gap-3" role="group" aria-label="Carousel controls">
        {/* Dot indicators */}
        <div className="flex gap-1.5 mr-2" role="group" aria-label="Go to slide">
          {LOOKBOOK_SLIDES.map((slide, i) => (
            <button
              type="button"
              key={slide.label}
              aria-current={selectedIndex === i ? "true" : undefined}
              aria-label={`Show slide ${i + 1} of ${LOOKBOOK_SLIDES.length}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`transition-all duration-300 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                selectedIndex === i ? "bg-[#C9A96E] w-6 h-1.5" : "bg-white/40 w-1.5 h-1.5"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next slide"
          className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Vertical "View Collection" label — desktop */}
      <button
        type="button"
        onClick={() => navigate("/shop")}
        className="absolute top-1/2 right-6 md:right-16 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
        aria-label="View collection"
      >
        <div className="w-px h-16 bg-white/30 group-hover:bg-[#C9A96E] transition-colors" aria-hidden="true" />
        <span
          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em", writingMode: "vertical-rl" }}
          className="text-white/60 text-[10px] uppercase group-hover:text-[#C9A96E] transition-colors"
          aria-hidden="true"
        >
          View Collection
        </span>
      </button>
    </section>
  );
}
