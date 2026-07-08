import { motion } from "motion/react";
import { MessageCircle, ChevronRight, Truck, Star, Shield, ArrowRight, Scissors, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { ProductCard } from "../ProductCard";
import { LookbookCarousel } from "../LookbookCarousel";
import { VideoReelGrid } from "../VideoReelGrid";
import { BUSINESS, WA } from "../../config";
import { COLLECTION_PILLARS, HOME_MEDIA } from "../../data/media";
import type { ProductCategory } from "../../data/types";
import { getReadyToWearBestSellers } from "../../services/productService";
import { handleImageError, imageUrl } from "../../lib/images";

const PILLAR_ICONS: Record<ProductCategory, JSX.Element> = {
  Bridals: <Heart size={20} aria-hidden="true" />,
  Bespoke: <Scissors size={20} aria-hidden="true" />,
  "Ready-to-Wear": <Sparkles size={20} aria-hidden="true" />,
};

const TRUST_ITEMS = [
  {
    icon: <MessageCircle size={22} aria-hidden="true" />,
    title: "WhatsApp Orders",
    desc: "Order and consult directly — fast, personal, no complicated checkout.",
  },
  {
    icon: <Scissors size={22} aria-hidden="true" />,
    title: "Made-to-Measure",
    desc: "Every bespoke and bridal piece is crafted specifically to fit your body.",
  },
  {
    icon: <Shield size={22} aria-hidden="true" />,
    title: "Trusted Designer",
    desc: "Port Harcourt's premier womenswear designer — quality you can feel.",
  },
  {
    icon: <Truck size={22} aria-hidden="true" />,
    title: "Nationwide Delivery",
    desc: "Bespoke and ready-to-wear pieces shipped across Nigeria.",
  },
];

const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    location: "Lagos",
    tag: "Bridals",
    text: "My wedding gown was beyond anything I imagined. Amara Atelier understood my vision perfectly — I was in tears when I first tried it on.",
    rating: 5,
  },
  {
    name: "Fatima A.",
    location: "Abuja",
    tag: "Bespoke",
    text: "I commissioned a bespoke gown for my sister's wedding. The craftsmanship, the fit, the detail — absolutely world class.",
    rating: 5,
  },
  {
    name: "Chiamaka E.",
    location: "Port Harcourt",
    tag: "Ready-to-Wear",
    text: "Ordered the Noir Midi and I got stopped three times at the event. The quality feels designer-level at a very fair price.",
    rating: 5,
  },
];

const PROCESS_STEPS = [
  { num: "01", title: "Consultation", desc: "We discuss your vision, occasion, style preferences, and measurements via WhatsApp or in-person." },
  { num: "02", title: "Design & Sourcing", desc: "Fabrics are carefully selected. A design sketch is shared for your approval before cutting begins." },
  { num: "03", title: "Fitting", desc: "You come in for a fitting session or we coordinate remotely. Adjustments are made until it's perfect." },
  { num: "04", title: "Delivery", desc: "Your finished piece is packaged with care and delivered directly to you." },
];

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"] as const;

export function HomePage() {
  const navigate = useNavigate();
  const rtw = getReadyToWearBestSellers(4);

  return (
    <div className="bg-background">
      {/* ── HERO ── */}
      <section className="relative h-screen-safe overflow-hidden" aria-label="Hero">
        <img
          src={imageUrl(HOME_MEDIA.hero.src, "w=1800&h=1100&fit=crop&auto=format")}
          alt={HOME_MEDIA.hero.alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          decoding="async"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/30 to-[#1C1C1C]/70" aria-hidden="true" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <p
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.35em" }}
                className="text-[#C9A96E] text-[11px] uppercase mb-6"
              >
                Port Harcourt · Nigeria
              </p>
              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#FAF8F5] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-5"
              >
                Amara Atelier
              </h1>
              <p
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.3em" }}
                className="text-[#FAF8F5]/70 text-xs md:text-sm uppercase mb-10"
              >
                Luxury Womenswear · Bridals · Bespoke · Ready-to-Wear
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="w-full sm:w-auto bg-[#FAF8F5] text-[#1C1C1C] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9A96E] hover:text-white transition-all duration-300 cursor-pointer min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Explore Collections
                </button>
                <a
                  href={WA.bridalConsult()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-[#FAF8F5]/50 text-[#FAF8F5] text-xs uppercase tracking-widest px-8 py-4 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <MessageCircle size={14} aria-hidden="true" /> Book Consultation
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="pb-8 flex justify-center"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-10 bg-white/30 animate-pulse" />
              <span style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }} className="text-white/40 text-[9px] uppercase">
                Scroll
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── THREE SERVICE PILLARS ── */}
      <section aria-label="Our collections">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {COLLECTION_PILLARS.map((p, i) => (
            <motion.button
              type="button"
              key={p.key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => navigate(`/shop/${p.key}`)}
              aria-label={`Browse ${p.title} — ${p.sub}`}
              className="group relative overflow-hidden aspect-[4/3] md:aspect-auto md:h-[75vh] cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-0"
            >
              <img
                src={imageUrl(p.image.src, "w=900&h=1200&fit=crop&auto=format")}
                alt={p.image.alt}
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/85 via-[#1C1C1C]/20 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-left">
                <div className="flex items-center gap-2 mb-3 text-[#C9A96E]">
                  {PILLAR_ICONS[p.key]}
                  <span style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }} className="text-[10px] uppercase">
                    {p.key}
                  </span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-3xl md:text-4xl mb-2">
                  {p.title}
                </h2>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#FAF8F5]/70 text-sm mb-5">
                  {p.sub}
                </p>
                <span
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A96E]"
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-hidden="true"
                >
                  {p.cta} <ArrowRight size={14} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── LOOKBOOK CAROUSEL ── */}
      <LookbookCarousel />

      {/* ── BESPOKE PROCESS ── */}
      <section className="py-20 md:py-28 bg-[#1C1C1C]" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-[#C9A96E] text-xs uppercase mb-3">
              The Amara Process
            </p>
            <h2 id="process-heading" style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-3xl md:text-5xl">
              How Bespoke Works
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-[#2A2A2A]">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1C1C1C] p-8 space-y-4"
              >
                <span style={{ fontFamily: "var(--font-display)" }} className="text-[#C9A96E]/40 text-5xl" aria-hidden="true">
                  {step.num}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-xl">{step.title}</h3>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={WA.bespokeConsult()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#1ebe57] transition-colors min-h-[52px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <MessageCircle size={16} aria-hidden="true" /> Start Your Bespoke Order
            </a>
          </div>
        </div>
      </section>

      {/* ── BRIDAL FEATURE ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "640px", height: "88svh" }} aria-label="Bridal collection">
        <img
          src={imageUrl(HOME_MEDIA.bridalFeature.src, "w=1800&h=1200&fit=crop&auto=format")}
          alt={HOME_MEDIA.bridalFeature.alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-[#1C1C1C]/40 to-transparent md:hidden" aria-hidden="true" />
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/60 to-transparent" aria-hidden="true" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A96E] hidden md:block" aria-hidden="true" />

        <div className="relative z-10 h-full flex items-end md:items-center pb-14 md:pb-0 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:max-w-xl"
          >
            <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.3em" }} className="text-[#C9A96E] text-[11px] uppercase mb-4">
              Bridal Collection 2025
            </p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] md:text-foreground text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-5">
              Your Perfect Wedding Gown Awaits
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#FAF8F5]/80 md:text-muted-foreground text-sm md:text-base mb-8 leading-relaxed max-w-md">
              Every bride deserves a gown that tells her story. We design and handcraft wedding dresses that fit your body, your culture, and your most important day.
            </p>

            {/* Bridal stats strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 border-l-2 border-[#C9A96E] pl-4" role="group" aria-label="Bridal highlights">
              {[
                { num: "Handcrafted", label: "Every Gown" },
                { num: "6–10", label: "Weeks Made" },
                { num: "Custom", label: "Measurements" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[#C9A96E] text-lg leading-none">
                    {s.num}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-[#FAF8F5]/60 md:text-muted-foreground text-[10px] uppercase tracking-wider mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/shop/Bridals")}
                className="w-full sm:w-auto bg-[#FAF8F5] md:bg-[#1C1C1C] text-[#1C1C1C] md:text-[#FAF8F5] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9A96E] hover:text-white transition-all duration-300 cursor-pointer min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                View Bridal Collection
              </button>
              <a
                href={WA.bridalConsult()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#1ebe57] transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={13} aria-hidden="true" /> Book Bridal Consult
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── READY-TO-WEAR PICKS ── */}
      <section className="py-20 md:py-28 bg-[#F5F3EF]" aria-labelledby="rtw-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-muted-foreground text-xs uppercase mb-2">
                Available Now
              </p>
              <h2 id="rtw-heading" style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-4xl">
                Ready-to-Wear Picks
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/shop/Ready-to-Wear")}
              className="hidden md:flex items-center gap-1.5 text-sm text-foreground hover:text-[#C9A96E] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View All <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
          {rtw.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {rtw.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-sm">
              New pieces coming soon. Follow us on Instagram for updates.
            </p>
          )}
          <div className="mt-8 text-center md:hidden">
            <button
              type="button"
              onClick={() => navigate("/shop/Ready-to-Wear")}
              className="text-sm text-foreground underline underline-offset-4 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View all pieces
            </button>
          </div>
        </div>
      </section>

      {/* ── FASHION ACADEMY TEASER ── */}
      <section aria-label="Fashion Academy">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-72 md:h-auto md:min-h-[480px] overflow-hidden bg-[#1C1C1C]">
            <img
              src={imageUrl(HOME_MEDIA.academyTeaser.src, "w=900&h=700&fit=crop&auto=format")}
              alt={HOME_MEDIA.academyTeaser.alt}
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-6 left-6">
              <span style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }} className="text-[#C9A96E] text-[10px] uppercase">
                Port Harcourt · Nigeria
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1C1C1C] px-8 md:px-12 lg:px-16 py-14 md:py-20 flex flex-col justify-center"
          >
            <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-[#C9A96E] text-[10px] uppercase mb-4">
              Fashion Tutor
            </p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
              Learn to Design & Sew at the Amara Atelier Academy
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-sm leading-relaxed mb-8">
              From beginner sewing to advanced pattern-making and bridal construction — hands-on classes in Port Harcourt that turn passion into skill. Small classes, personal mentorship, certificate on completion.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Sewing Basics", "Pattern Drafting", "Garment Construction", "Bridal Design"].map((course) => (
                <div key={course} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#C9A96E] rounded-full flex-shrink-0" aria-hidden="true" />
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-[#9A9690] text-xs">{course}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/about")}
                className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#FAF8F5] text-xs uppercase tracking-widest px-6 py-3.5 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all cursor-pointer min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                View All Courses
              </button>
              <a
                href={WA.academy()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-[#1ebe57] transition-colors min-h-[48px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={14} aria-hidden="true" /> Enquire Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEO / REELS ── */}
      <VideoReelGrid />

      {/* ── WHY RENIE O ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="why-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 id="why-heading" style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-5xl">
            Why Choose Amara Atelier
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="w-12 h-12 bg-[#F0EDE8] flex items-center justify-center mx-auto text-[#C9A96E]">
                {item.icon}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-lg">{item.title}</h3>
              <p style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#1C1C1C]" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-[#C9A96E] text-xs uppercase mb-3">
              Client Stories
            </p>
            <h2 id="testimonials-heading" style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-3xl md:text-4xl">
              Words From Our Clients
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#242424] p-7 space-y-5 border border-[#2E2E2E]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {STAR_KEYS.slice(0, t.rating).map((starKey) => (
                      <Star key={starKey} size={13} className="fill-[#C9A96E] text-[#C9A96E]" aria-hidden="true" />
                    ))}
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 bg-[#C9A96E]/20 text-[#C9A96E]"
                    style={{ fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}
                  >
                    {t.tag}
                  </span>
                </div>
                <blockquote>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-[#C8C4BE] text-sm leading-relaxed">
                    "{t.text}"
                  </p>
                </blockquote>
                <figcaption className="pt-1 border-t border-[#2E2E2E]">
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[#FAF8F5] text-base">{t.name}</p>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-xs">{t.location}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM FEED ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="instagram-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-muted-foreground text-xs uppercase mb-2">
            Daily Inspiration
          </p>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-display)" }}
            id="instagram-heading"
            className="text-foreground text-3xl md:text-4xl hover:text-[#C9A96E] transition-colors inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
          >
            @{BUSINESS.instagram}
          </a>
        </motion.div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-1.5">
          {HOME_MEDIA.instagram.map((img, i) => (
            <motion.a
              key={img.src}
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View post ${i + 1} on Instagram`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-[#F0EDE8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
            >
              <img
                src={imageUrl(img.src, "w=400&h=400&fit=crop&auto=format")}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-[#1C1C1C]/0 group-hover:bg-[#1C1C1C]/40 transition-all duration-300 flex items-center justify-center" aria-hidden="true">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-28 bg-[#F5F3EF]" aria-label="Call to action">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }} className="text-[#C9A96E] text-xs uppercase">
              Port Harcourt's Premier Designer
            </p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-5xl">
              Ready to Wear Something Extraordinary?
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-muted-foreground text-base">
              Whether it's your wedding day, a bespoke commission, or a ready-to-wear piece — we're here to make you unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="bg-[#1C1C1C] text-[#FAF8F5] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9A96E] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Shop All Collections
              </button>
              <a
                href={WA.general()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#1ebe57] transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={15} aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
