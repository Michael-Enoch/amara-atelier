import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products } from "../data/products";
import type { Product } from "../data/types";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface ShopContextValue {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQty: (productId: number, size: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const MAX_CART_QUANTITY = 99;
const CART_STORAGE_KEY = "amara-cart";
const WISHLIST_STORAGE_KEY = "amara-wishlist";
const LEGACY_CART_STORAGE_KEY = "renie-cart";
const LEGACY_WISHLIST_STORAGE_KEY = "renie-wishlist";

function clampQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) return null;
  return Math.min(value, MAX_CART_QUANTITY);
}

function isValidSize(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 20;
}

function readStorage(key: string, legacyKey?: string): unknown {
  if (typeof globalThis.localStorage === "undefined") return null;

  try {
    const raw =
      globalThis.localStorage.getItem(key) ??
      (legacyKey ? globalThis.localStorage.getItem(legacyKey) : null);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof globalThis.localStorage === "undefined") return;

  try {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures so shopping flows continue in-memory.
  }
}

function findCurrentProduct(value: unknown): Product | null {
  if (typeof value === "number") {
    return products.find((product) => product.id === value) ?? null;
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "number" ? products.find((product) => product.id === id) ?? null : null;
  }

  return null;
}

function loadCart(): CartItem[] {
  const parsed = readStorage(CART_STORAGE_KEY, LEGACY_CART_STORAGE_KEY);
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((item): CartItem[] => {
    if (typeof item !== "object" || item === null) return [];
    const record = item as { product?: unknown; size?: unknown; quantity?: unknown };
    const product = findCurrentProduct(record.product);
    const quantity = clampQuantity(record.quantity);
    if (!product || !quantity || !isValidSize(record.size)) return [];
    return [{ product, size: record.size.trim(), quantity }];
  });
}

function loadWishlist(): Product[] {
  const parsed = readStorage(WISHLIST_STORAGE_KEY, LEGACY_WISHLIST_STORAGE_KEY);
  if (!Array.isArray(parsed)) return [];

  const seen = new Set<number>();
  return parsed.flatMap((item): Product[] => {
    const product = findCurrentProduct(item);
    if (!product || seen.has(product.id)) return [];
    seen.add(product.id);
    return [product];
  });
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [wishlist, setWishlist] = useState<Product[]>(loadWishlist);

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(WISHLIST_STORAGE_KEY, wishlist);
  }, [wishlist]);

  const addToCart = useCallback((product: Product, size: string) => {
    const normalizedSize = size.trim();
    if (!isValidSize(normalizedSize)) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === normalizedSize);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === normalizedSize
            ? { ...i, quantity: Math.min(i.quantity + 1, MAX_CART_QUANTITY) }
            : i
        );
      }
      return [...prev, { product, size: normalizedSize, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  }, []);

  const updateQty = useCallback((productId: number, size: string, delta: number) => {
    if (!Number.isInteger(delta)) return;

    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId || i.size !== size) return i;
          return { ...i, quantity: Math.min(i.quantity + delta, MAX_CART_QUANTITY) };
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cart]
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartCount,
      cartTotal,
    }),
    [
      addToCart,
      cart,
      cartCount,
      cartTotal,
      clearCart,
      isWishlisted,
      removeFromCart,
      toggleWishlist,
      updateQty,
      wishlist,
    ]
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
