import type { SyntheticEvent } from "react";

const FALLBACK_IMAGE_SVG = `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image unavailable">
  <rect width="600" height="800" fill="#F0EDE8"/>
  <rect x="100" y="140" width="400" height="520" rx="16" fill="none" stroke="#C9A96E" stroke-width="6" opacity=".5"/>
  <path d="M150 580 260 420l80 100 60-70 50 130" fill="none" stroke="#C9A96E" stroke-width="6" stroke-linecap="round" opacity=".5"/>
  <circle cx="400" cy="260" r="40" fill="none" stroke="#C9A96E" stroke-width="6" opacity=".5"/>
  <text x="300" y="710" text-anchor="middle" fill="#7A7570" font-family="Georgia, serif" font-size="24">Amara Atelier</text>
</svg>`;

const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_IMAGE_SVG)}`;

export function imageUrl(src: string, params: string): string {
  if (src.startsWith("data:")) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}${params}`;
}

export function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = FALLBACK_IMAGE;
}
