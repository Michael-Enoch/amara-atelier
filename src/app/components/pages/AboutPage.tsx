import { motion } from "motion/react";
import {
  Award,
  Scissors,
  Users,
  BookOpen,
  MessageCircle,
  Instagram,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { BUSINESS, WA } from "../../config";
import { ABOUT_MEDIA } from "../../data/media";
import { handleImageError, imageUrl } from "../../lib/images";

export function AboutPage() {
  const navigate = useNavigate();
  const values = [
    {
      icon: <Award size={26} aria-hidden="true" />,
      title: "Craftsmanship",
      desc: "Every stitch is intentional. We don't mass-produce — we construct. Each piece is built from scratch with precision, care, and pride.",
    },
    {
      icon: <Scissors size={26} aria-hidden="true" />,
      title: "Bespoke First",
      desc: "We believe clothes should fit the woman — not the other way around. Every custom order starts with a conversation about you.",
    },
    {
      icon: <Users size={26} aria-hidden="true" />,
      title: "Community",
      desc: "Amara Atelier is a creative community — clients, students, and collaborators who believe in the power of fashion to transform lives.",
    },
    {
      icon: <BookOpen size={26} aria-hidden="true" />,
      title: "Education",
      desc: "Knowledge should be shared. Through our fashion classes, we're building the next generation of Nigerian fashion designers.",
    },
  ];

  const courseItems = [
    {
      title: "Sewing Fundamentals",
      level: "Beginner",
      duration: "4 weeks",
      icon: "✂️",
    },
    {
      title: "Pattern Drafting & Cutting",
      level: "Intermediate",
      duration: "6 weeks",
      icon: "📐",
    },
    {
      title: "Garment Construction",
      level: "Intermediate",
      duration: "8 weeks",
      icon: "🧵",
    },
    {
      title: "Bridal & Formal Wear",
      level: "Advanced",
      duration: "10 weeks",
      icon: "👗",
    },
    {
      title: "Fashion Business & Branding",
      level: "All levels",
      duration: "3 weeks",
      icon: "💼",
    },
    {
      title: "1-on-1 Mentorship",
      level: "All levels",
      duration: "Flexible",
      icon: "🎯",
    },
  ];

  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: "60svh", minHeight: "380px" }}
      >
        <img
          src={imageUrl(
            ABOUT_MEDIA.hero.src,
            "w=1800&h=1000&fit=crop&auto=format",
          )}
          alt={ABOUT_MEDIA.hero.alt}
          className="w-full h-full object-cover object-top"
          decoding="async"
          onError={handleImageError}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/75 via-[#1C1C1C]/40 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.3em" }}
              className="text-[#C9A96E] text-[10px] uppercase mb-4"
            >
              Port Harcourt, Nigeria
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[#FAFAF8] text-4xl md:text-6xl leading-tight mb-4"
            >
              Designer. Creator. Educator.
            </h1>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-[#FAFAF8]/75 text-sm md:text-base leading-relaxed"
            >
              Port Harcourt's leading luxury womenswear designer — crafting
              bridal gowns, bespoke pieces, and training the next generation of
              fashion designers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── DESIGNER STORY ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                letterSpacing: "0.25em",
              }}
              className="text-[#C9A96E] text-xs uppercase"
            >
              The Designer
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-foreground text-3xl md:text-5xl leading-tight"
            >
              "I don't just make clothes. I make women feel like themselves."
            </h2>
            <div
              style={{ fontFamily: "var(--font-body)" }}
              className="text-muted-foreground text-sm leading-relaxed space-y-4"
            >
              <p>
                Amara Atelier is Port Harcourt's foremost luxury womenswear
                studio — a creative force behind bridal gowns, bespoke
                commissions, and ready-to-wear pieces that dress women across
                Nigeria for their most important moments.
              </p>
              <p>
                With deep expertise in pattern-making, garment construction, and
                couture finishing, every piece that leaves the atelier is a
                reflection of the woman who commissioned it — her silhouette,
                her occasion, her vision.
              </p>
              <p>
                Beyond design, Amara Atelier is committed to education — running
                fashion classes and mentorship programs in Port Harcourt to grow
                the local fashion industry and equip the next generation of
                Nigerian designers with real skills.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                "Bridal Couture",
                "Bespoke Design",
                "Pattern Making",
                "Fashion Education",
                "Ready-to-Wear",
              ].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.1em",
                  }}
                  className="text-[10px] uppercase border border-border text-muted-foreground px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Instagram size={16} aria-hidden="true" /> @{BUSINESS.instagram}
              </a>
            </div>

            <div className="pt-1">
              <p
                style={{ fontFamily: "var(--font-display)" }}
                className="text-foreground text-xl"
              >
                Amara Atelier
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.15em",
                }}
                className="text-muted-foreground text-xs uppercase mt-0.5"
              >
                Founder, Designer & Fashion Educator · Port Harcourt
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden bg-[#E8E4DE]">
              <img
                src={imageUrl(
                  ABOUT_MEDIA.designer.src,
                  "w=800&h=1000&fit=crop&auto=format",
                )}
                alt={ABOUT_MEDIA.designer.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-[#1C1C1C] text-[#FAFAF8] p-5 w-44">
              <p
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl text-[#C9A96E]"
              >
                PHC
              </p>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-xs text-[#7A7570] uppercase tracking-widest mt-1"
              >
                Luxury Designer
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <section className="bg-[#1C1C1C] py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-[#2A2A2A]">
            {[
              { num: "500+", label: "Happy Clients" },
              { num: "PHC", label: "Based Designer" },
              { num: "Growing", label: "Student Community" },
              { num: "5★", label: "Client Rating" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center md:px-8"
              >
                <p
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[#FAFAF8] text-3xl md:text-4xl"
                >
                  {s.num}
                </p>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-[#7A7570] text-xs uppercase tracking-widest mt-1"
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FASHION ACADEMY ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:sticky md:top-28 self-start"
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.25em",
                }}
                className="text-[#C9A96E] text-xs uppercase"
              >
                Fashion Tutor
              </p>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-foreground text-3xl md:text-5xl leading-tight"
              >
                Learn to Design & Sew at the Amara Atelier Fashion Academy
              </h2>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                Whether you're a complete beginner picking up a needle for the
                first time, or an intermediate seamstress ready to level up —
                our hands-on classes in Port Harcourt will take you from raw
                fabric to finished garment.
              </p>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                Classes are kept small and intimate — you get personal
                attention, industry-standard techniques, and direct mentorship
                from our lead designer. Online options are available for
                students outside Port Harcourt.
              </p>

              <div className="space-y-2">
                {[
                  "Small class sizes (max 8 students)",
                  "Hands-on, practical learning",
                  "Certificate on completion",
                  "Online classes available",
                  "Flexible scheduling",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle
                      size={14}
                      className="text-[#C9A96E] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm text-foreground"
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={WA.academy()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-[#1ebe57] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={15} aria-hidden="true" /> Enquire About
                Classes
              </a>
            </motion.div>

            {/* Right: course grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courseItems.map((course, i) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white border border-border p-5 space-y-3 hover:border-[#C9A96E] transition-colors group"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {course.icon}
                  </span>
                  <div>
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-foreground text-base group-hover:text-[#C9A96E] transition-colors"
                    >
                      {course.title}
                    </h3>
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      {course.level} · {course.duration}
                    </p>
                  </div>
                  <a
                    href={WA.academy()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.1em",
                    }}
                    className="text-[10px] uppercase text-[#C9A96E] hover:underline underline-offset-2"
                  >
                    Enquire →
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p
            style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
            className="text-muted-foreground text-xs uppercase mb-3"
          >
            What We Stand For
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-foreground text-3xl md:text-5xl"
          >
            The Amara Principles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#F0EDE8] group-hover:bg-[#C9A96E] flex items-center justify-center text-[#C9A96E] group-hover:text-white transition-all duration-300">
                {v.icon}
              </div>
              <div className="space-y-2">
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-foreground text-xl"
                >
                  {v.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-muted-foreground text-sm leading-relaxed"
                >
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIFESTYLE GRID ──────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 h-56 md:h-80">
          {ABOUT_MEDIA.lifestyle.map((img) => (
            <div key={img.src} className="overflow-hidden bg-[#F0EDE8]">
              <img
                src={imageUrl(img.src, "w=600&h=600&fit=crop&auto=format")}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#1C1C1C] py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-5">
          <p
            style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
            className="text-[#C9A96E] text-xs uppercase"
          >
            Work With Us
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#FAFAF8] text-3xl md:text-4xl"
          >
            Ready to Create Something Beautiful?
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-[#7A7570] text-sm"
          >
            Commission a bridal gown, a bespoke piece, or enrol in our fashion
            classes. Let's talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-[#1ebe57] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <MessageCircle size={15} aria-hidden="true" /> Chat on WhatsApp
            </a>
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#9A9690] text-xs uppercase tracking-widest px-7 py-3.5 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Instagram size={15} aria-hidden="true" /> Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
