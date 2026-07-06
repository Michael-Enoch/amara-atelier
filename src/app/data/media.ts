import type { MediaAsset, ProductCategory } from "./types";

export interface CollectionPillar {
  key: ProductCategory;
  title: string;
  sub: string;
  cta: string;
  image: MediaAsset;
}

export interface LookbookSlide {
  image: MediaAsset;
  label: string;
  sub: string;
}

export interface Reel {
  id: number;
  thumbnail: MediaAsset;
  caption: string;
  duration: string;
  tag: ProductCategory;
}

export const HOME_MEDIA = {
  hero: {
    src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
    alt: "Elegant bridal gown - Amara Atelier, Port Harcourt luxury womenswear",
  },
  bridalFeature: {
    src: "https://images.unsplash.com/photo-1596181243306-e02a1897afb1",
    alt: "Bride in a wedding gown - Amara Atelier bridal collection Port Harcourt",
  },
  academyTeaser: {
    src: "https://images.unsplash.com/photo-1631253205802-4dcc28e54b3e",
    alt: "Fashion class in session - Amara Atelier Academy Port Harcourt",
  },
  instagram: [
    {
      src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
      alt: "Amara Atelier bridal inspiration",
    },
    {
      src: "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0",
      alt: "Amara Atelier evening couture inspiration",
    },
    {
      src: "https://images.unsplash.com/photo-1773858439833-487381cf6fd8",
      alt: "Amara Atelier ready-to-wear inspiration",
    },
    {
      src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
      alt: "Amara Atelier bridal atelier inspiration",
    },
    {
      src: "https://images.unsplash.com/photo-1692643364142-8478eeb45a4b",
      alt: "Amara Atelier red gown inspiration",
    },
    {
      src: "https://images.unsplash.com/photo-1773858440890-2100b53e1125",
      alt: "Amara Atelier ivory dress inspiration",
    },
  ],
} as const;

export const ABOUT_MEDIA = {
  hero: {
    src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
    alt: "Amara Atelier - Port Harcourt fashion designer",
  },
  designer: {
    src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
    alt: "Amara Atelier bridal atelier",
  },
  lifestyle: [
    {
      src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
      alt: "Atelier lifestyle 1",
    },
    {
      src: "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0",
      alt: "Atelier lifestyle 2",
    },
    {
      src: "https://images.unsplash.com/photo-1773858439833-487381cf6fd8",
      alt: "Atelier lifestyle 3",
    },
    {
      src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
      alt: "Atelier lifestyle 4",
    },
  ],
} as const;

export const COLLECTION_PILLARS: readonly CollectionPillar[] = [
  {
    key: "Bridals",
    title: "Bridals",
    sub: "Your dream gown, crafted to perfection",
    cta: "Book Bridal Consultation",
    image: {
      src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
      alt: "Bridals collection - Amara Atelier",
    },
  },
  {
    key: "Bespoke",
    title: "Bespoke",
    sub: "Tailored entirely to your vision",
    cta: "Request Custom Order",
    image: {
      src: "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0",
      alt: "Bespoke collection - Amara Atelier",
    },
  },
  {
    key: "Ready-to-Wear",
    title: "Ready-to-Wear",
    sub: "Luxury pieces, available now",
    cta: "Shop the Collection",
    image: {
      src: "https://images.unsplash.com/photo-1773858439833-487381cf6fd8",
      alt: "Ready-to-Wear collection - Amara Atelier",
    },
  },
] as const;

export const LOOKBOOK_SLIDES: readonly LookbookSlide[] = [
  {
    image: {
      src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
      alt: "The Bridal Edit - Amara Atelier",
    },
    label: "The Bridal Edit",
    sub: "Bridal Collection 2025",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0",
      alt: "Evening Couture - Amara Atelier",
    },
    label: "Evening Couture",
    sub: "Bespoke - Made for You",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1773858439833-487381cf6fd8",
      alt: "Port Harcourt Luxe - Amara Atelier",
    },
    label: "Port Harcourt Luxe",
    sub: "Ready-to-Wear Collection",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
      alt: "The Altar Moment - Amara Atelier",
    },
    label: "The Altar Moment",
    sub: "Bridal - Cathedral Series",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1692643364142-8478eeb45a4b",
      alt: "Bold and Sculpted - Amara Atelier",
    },
    label: "Bold & Sculpted",
    sub: "Ready-to-Wear 2025",
  },
] as const;

export const REELS: readonly Reel[] = [
  {
    id: 1,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1622277430358-f4d134452e2e",
      alt: "The Perfect Bridal Reveal",
    },
    caption: "The Perfect Bridal Reveal",
    duration: "0:48",
    tag: "Bridals",
  },
  {
    id: 2,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0",
      alt: "Behind the Seams - Bespoke Fitting Day",
    },
    caption: "Behind the Seams - Bespoke Fitting Day",
    duration: "1:12",
    tag: "Bespoke",
  },
  {
    id: 3,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1773858439833-487381cf6fd8",
      alt: "New Collection Drop",
    },
    caption: "New Collection Drop",
    duration: "0:32",
    tag: "Ready-to-Wear",
  },
  {
    id: 4,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1549416878-b9ca95e26903",
      alt: "Cathedral Train Magic",
    },
    caption: "Cathedral Train Magic",
    duration: "0:55",
    tag: "Bridals",
  },
  {
    id: 5,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1692643364142-8478eeb45a4b",
      alt: "Styling Session - The Red Gown",
    },
    caption: "Styling Session - The Red Gown",
    duration: "0:44",
    tag: "Ready-to-Wear",
  },
  {
    id: 6,
    thumbnail: {
      src: "https://images.unsplash.com/photo-1758900727792-e411697fc0a7",
      alt: "Aso-ebi Custom Order",
    },
    caption: "Aso-ebi Custom Order",
    duration: "1:04",
    tag: "Bespoke",
  },
] as const;
