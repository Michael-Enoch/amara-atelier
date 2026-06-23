# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript storefront for a fashion brand. Application code lives in `src/app`, with the app shell in `App.tsx`, reusable UI in `components`, page-level views in `components/pages`, shared state in `context`, business settings in `config.ts`, product/media data in `data`, and small utilities in `lib` and `services`. Global styles are in `src/styles`. Static entry files are `index.html` and `src/main.tsx`. Production output is generated in `dist` and should not be edited by hand.

## Build, Test, and Development Commands
Use npm for this repository.

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the local Vite dev server.
- `npm run typecheck` runs TypeScript with `--noEmit`.
- `npm run build` creates the production bundle in `dist`.
- `npm run preview` serves the production build locally.

Run `npm run typecheck` and `npm run build` before finishing changes.

## Coding Style & Naming Conventions
Use TypeScript, React function components, and the existing Tailwind utility style. Prefer two-space indentation, double quotes, named exports for reusable modules, and PascalCase component files such as `ProductCard.tsx`. Keep shared data in `src/app/data` and runtime business values in `src/app/config.ts`. Avoid unnecessary `any`, preserve responsive behavior, and keep accessibility attributes intact. External links must use `rel="noopener noreferrer"`; WhatsApp messages must be URL encoded.

## Testing Guidelines
There is currently no automated test runner configured. For now, validate changes with `npm run typecheck`, `npm run build`, and manual checks in the browser for the affected routes, including `/#/`, `/#/shop`, and product detail pages. If tests are added later, colocate them near the feature or under a clear `tests` directory and document the new command here.

## Commit & Pull Request Guidelines
Recent commits use short, imperative summaries such as `fix: changed favicon` and `Prepare fashion storefront for Vercel production`. Keep commits focused and describe user-visible impact. Pull requests should include a concise summary, linked issue when relevant, screenshots for UI changes, commands run, and any required environment or deployment notes.

## Security & Configuration Tips
Do not commit `.env` files or private credentials. Use `.env.example` for safe placeholders and update `VITE_WHATSAPP_NUMBER`, Instagram values, and product data before launch. Do not add Supabase, payments, customer login, or a backend unless explicitly requested. Placeholder images and catalog data must remain easy to replace and must not be presented as verified real inventory.
