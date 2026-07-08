import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createHashRouter, RouterProvider, useParams } from "react-router";
import { ShopProvider } from "./context/ShopContext";
import { Layout } from "./components/Layout";
import "../styles/fonts.css";

// MARKER-MAKE-KIT-INVOKED

const HomePage = lazy(() =>
  import("./components/pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const ShopPage = lazy(() =>
  import("./components/pages/ShopPage").then((module) => ({ default: module.ShopPage }))
);
const ProductDetailPage = lazy(() =>
  import("./components/pages/ProductDetailPage").then((module) => ({
    default: module.ProductDetailPage,
  }))
);
const AboutPage = lazy(() =>
  import("./components/pages/AboutPage").then((module) => ({ default: module.AboutPage }))
);

const PAGE_SKELETON_ITEMS = Array.from(
  { length: 8 },
  (_, index) => `page-skeleton-${index + 1}`
);

function PageSkeleton() {
  return (
    <div className="bg-background min-h-screen pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="h-8 w-48 bg-[#E8E4DE] animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6" aria-hidden="true">
          {PAGE_SKELETON_ITEMS.map((item) => (
            <div key={item} className="space-y-2.5">
              <div className="aspect-[3/4] bg-[#F0EDE8] animate-pulse" />
              <div className="h-3 w-2/5 bg-[#E8E4DE] animate-pulse" />
              <div className="h-4 w-4/5 bg-[#E8E4DE] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

/**
 * Wrapper that forces ProductDetailPage to fully remount (reset all state)
 * when the product ID changes, by passing the ID as the React key.
 */
function ProductDetailRoute() {
  const { id } = useParams<{ id: string }>();
  return (
    <LazyPage>
      <ProductDetailPage key={id} />
    </LazyPage>
  );
}

/**
 * Hash-based routing — URLs look like /#/product/1.
 * Works on any static host (Vercel, Netlify, GitHub Pages) without
 * any server-side redirect configuration.
 */
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LazyPage><HomePage /></LazyPage> },
      { path: "shop", element: <LazyPage><ShopPage /></LazyPage> },
      { path: "shop/:category", element: <LazyPage><ShopPage /></LazyPage> },
      { path: "product/:id", element: <ProductDetailRoute /> },
      { path: "about", element: <LazyPage><AboutPage /></LazyPage> },
    ],
  },
]);

export default function App() {
  return (
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  );
}
