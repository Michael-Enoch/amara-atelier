import { useState } from "react";
import { Play, Volume2, Instagram } from "lucide-react";
import { motion } from "motion/react";
import { BUSINESS } from "../config";
import { REELS } from "../data/media";
import { handleImageError, imageUrl } from "../lib/images";

const tagColors: Record<string, string> = {
  Bridals: "bg-[#C9A96E]/30 text-[#C9A96E]",
  Bespoke: "bg-white/20 text-white",
  "Ready-to-Wear": "bg-white/20 text-white",
};

export function VideoReelGrid() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <p
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
              className="text-muted-foreground text-xs uppercase mb-2"
            >
              Reels & Slideshows
            </p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-foreground text-3xl md:text-4xl">
              Watch & Be Inspired
            </h2>
          </div>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start md:self-auto"
            style={{ fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}
          >
            <Instagram size={16} aria-hidden="true" /> @{BUSINESS.instagram}
          </a>
        </motion.div>

        {/* Clean uniform grid — 2 cols mobile, 3 cols desktop, all same aspect */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {REELS.map((reel, i) => (
            <motion.a
              key={reel.id}
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative group overflow-hidden bg-[#2A2A2A] cursor-pointer aspect-9/14"
              onMouseEnter={() => setHoveredId(reel.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={imageUrl(reel.thumbnail.src, "w=500&h=780&fit=crop&auto=format")}
                alt={reel.thumbnail.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#1C1C1C]/80 via-transparent to-transparent" aria-hidden="true" />

              {/* Dark hover overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 bg-[#1C1C1C]/30 ${
                hoveredId === reel.id ? "opacity-100" : "opacity-0"
              }`} aria-hidden="true" />

              {/* Play button — centred, always present at reduced opacity, full on hover */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-11 h-11 bg-white/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  hoveredId === reel.id ? "scale-110 bg-white/95" : "scale-90 opacity-70"
                }`}>
                  <Play size={16} className="text-[#1C1C1C] ml-0.5" fill="#1C1C1C" aria-hidden="true" />
                </div>
              </div>

              {/* Caption at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-[#FAFAF8] text-xs leading-snug mb-1.5 line-clamp-2"
                >
                  {reel.caption}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 ${tagColors[reel.tag] || "bg-white/20 text-white"}`}
                    style={{ fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}
                  >
                    {reel.tag}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-[#FAFAF8]/60 text-[9px] flex items-center gap-1"
                  >
                    <Volume2 size={8} aria-hidden="true" /> {reel.duration}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-foreground text-xs uppercase tracking-widest px-6 py-3 hover:bg-foreground hover:text-background transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Instagram size={14} aria-hidden="true" /> Follow for More on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
