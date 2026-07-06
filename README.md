# Amara Atelier Website

Production-ready Vite + React + TypeScript fashion showcase for a Nigerian luxury womenswear brand. The site supports bridal, bespoke, ready-to-wear browsing, wishlist/cart flows, and WhatsApp ordering.

## Tech Stack

- Vite 8
- React 18
- TypeScript
- Tailwind CSS 4
- React Router hash routing for static hosting

## Install

```bash
npm install
```

Use npm for this project. Do not use pnpm.

## Run Locally

```bash
npm run dev
```

## Production Build

```bash
npm run typecheck
npm run build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` for local overrides.

```bash
VITE_BUSINESS_NAME="Amara Atelier"
VITE_BUSINESS_LOCATION="Port Harcourt, Rivers State, Nigeria"
VITE_INSTAGRAM_HANDLE="amara_atelier"
VITE_INSTAGRAM_URL="https://www.instagram.com/amara_atelier/"
VITE_WHATSAPP_NUMBER="2348000000000"
```

Before going live, replace the placeholder WhatsApp number with the real business number in international format, digits only, for example `2348012345678`.

## Business Config

Runtime business values are read in `src/app/config.ts`. Review these before deployment:

- Business name
- Business location
- Instagram handle and URL
- WhatsApp number
- Product names, prices, categories, and real images in `src/app/data/products.ts`

## Supabase Decision

Supabase is intentionally not integrated in this build. The current site is a static showcase/shop with WhatsApp ordering, and it does not need payments, customer accounts, or a backend to run.

Future Supabase integration should use the existing product service boundary in `src/app/services/productService.ts` so UI components do not need to be rewritten. Add Supabase only when the business needs an admin-managed catalog/gallery or inquiry dashboard.

Recommended future Supabase tables:

- `products`
- `gallery_items`
- `inquiries`
- `admin_profiles`

Required future security rules:

- Enable RLS on every table.
- Public users may read only active products and published gallery items.
- Public users may insert validated inquiries only.
- Public users must not update or delete products, gallery items, inquiries, or admin data.
- Admin writes must be based on Supabase Auth plus `admin_profiles`, never frontend-only checks.
- Never expose a `service_role` key in frontend code.

No SQL migrations are included because Supabase was not integrated.

## Deployment

The app uses hash routing, so routes like `/#/shop` and `/#/product/1` work on static hosts without rewrite rules.

Vercel or Netlify settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node: 24 or another modern version supported by Vite 8

## Notes

- Online card payments are not included.
- Customer login is not included.
- `.env` is ignored by git; `.env.example` is safe to commit.
- `npm audit` should remain clean before deployment.
- The current build may warn that the main chunk is over 500 kB because the Figma-generated bundle includes a broad UI dependency set. This is a performance optimization target, not a build failure.
  