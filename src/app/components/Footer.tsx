import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { BUSINESS, WA } from "../config";

const NAV_LINKS = [
  { label: "All Collections", to: "/shop" },
  { label: "Bridals", to: "/shop/Bridals" },
  { label: "Bespoke", to: "/shop/Bespoke" },
  { label: "Ready-to-Wear", to: "/shop/Ready-to-Wear" },
  { label: "About Us", to: "/about" },
] as const;

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111111] text-[#FAF8F5]" role="contentinfo">
      {/* Top gold accent line */}
      <div className="h-px bg-linear-to-r from-transparent via-[#C9A96E] to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <h2
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
                className="text-3xl uppercase"
              >
                {BUSINESS.name}
              </h2>
              <p
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.25em" }}
                className="text-[#C9A96E] text-[10px] uppercase mt-1"
              >
                Luxury Womenswear · Port Harcourt
              </p>
            </div>

            <div className="flex items-start gap-2 text-[#7A7570]">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#C9A96E]" aria-hidden="true" />
              <address style={{ fontFamily: "var(--font-body)" }} className="text-sm not-italic">
                {BUSINESS.location}
              </address>
            </div>

            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-sm leading-relaxed max-w-sm">
              Port Harcourt's premier luxury womenswear designer. Crafting bespoke gowns, bridal couture, and ready-to-wear pieces for the modern Nigerian woman.
            </p>

            <div className="flex items-center gap-1 flex-wrap">
              {["BRIDALS", "BESPOKE", "RTW"].map((tag, i) => (
                <span
                  key={tag}
                  style={{ fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}
                  className={`text-[10px] px-2.5 py-1 ${
                    i === 0
                      ? "bg-[#C9A96E]/20 text-[#C9A96E]"
                      : i === 1
                      ? "bg-[#FAF8F5]/10 text-[#FAF8F5]/70"
                      : "bg-[#2A2A2A] text-[#7A7570]"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <nav aria-label="Social media" className="flex gap-4 pt-1">
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${BUSINESS.name} on Instagram`}
                className="text-[#7A7570] hover:text-[#C9A96E] transition-colors focus-visible:outline focus-visible:outline-[#C9A96E]"
              >
                <Instagram size={19} aria-hidden="true" />
              </a>
              <a
                href={BUSINESS.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${BUSINESS.name} on WhatsApp`}
                className="text-[#7A7570] hover:text-[#C9A96E] transition-colors focus-visible:outline focus-visible:outline-[#C9A96E]"
              >
                <MessageCircle size={19} aria-hidden="true" />
              </a>
            </nav>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h3
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }}
              className="text-xs uppercase text-[#C9A96E]"
            >
              Collections
            </h3>
            <nav aria-label="Collections navigation">
              <ul className="space-y-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => navigate(l.to)}
                      className="text-[#7A7570] hover:text-[#FAF8F5] text-sm transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em" }}
              className="text-xs uppercase text-[#C9A96E]"
            >
              Work With Us
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-xs uppercase tracking-widest">
                  Bridal Consultations
                </p>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#9A9690] text-sm">
                  Book via WhatsApp for a personal session with our designer.
                </p>
              </div>
              <div className="space-y-1">
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-xs uppercase tracking-widest">
                  Bespoke Orders
                </p>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#9A9690] text-sm">
                  4–8 week turnaround · Available nationwide
                </p>
              </div>
              <a
                href={WA.general()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs px-4 py-2.5 hover:bg-[#1ebe57] transition-colors mt-1 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A96E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageCircle size={14} aria-hidden="true" /> Chat on WhatsApp
              </a>
              <p style={{ fontFamily: "var(--font-body)" }} className="text-[#4A4A46] text-xs">
                Mon–Sat · 9am–7pm WAT
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#1E1E1E] flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{ fontFamily: "var(--font-body)" }} className="text-[#7A7570] text-xs">
            © {new Date().getFullYear()} {BUSINESS.name}. {BUSINESS.location}. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-display)", letterSpacing: "0.15em" }} className="text-[#7A7570] text-xs italic">
            Crafted with precision. Worn with confidence.
          </p>
        </div>
      </div>
    </footer>
  );
}
