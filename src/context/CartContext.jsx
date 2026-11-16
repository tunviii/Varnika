import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MAX_QTY_PER_ITEM } from '../config.js';

// Cart = [{ id, qty }]. Product details are joined in from the API where they are shown, so
// storage stays minimal (rule client-localstorage-schema) and prices are never stale.
const STORAGE_KEY = 'vs-cart:v1';

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => typeof l?.id === 'string' && Number.isInteger(l.qty) && l.qty > 0);
  } catch {
    return [];
  }
}

const clamp = (n) => Math.max(1, Math.min(MAX_QTY_PER_ITEM, n));

const CartItemsContext = createContext(null);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  // Lazy initial state: localStorage is read once (rule rerender-lazy-state-init).
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage full or blocked */ }
  }, [items]);

  // Stable actions object; every update is functional (rule rerender-functional-setstate).
  const actions = useMemo(() => ({
    add: (id, qty = 1) => setItems((cur) => {
      const found = cur.find((l) => l.id === id);
      return found
        ? cur.map((l) => (l.id === id ? { ...l, qty: clamp(l.qty + qty) } : l))
        : [...cur, { id, qty: clamp(qty) }];
    }),
    setQty: (id, qty) => setItems((cur) => cur.map((l) => (l.id === id ? { ...l, qty: clamp(qty) } : l))),
    remove: (id) => setItems((cur) => cur.filter((l) => l.id !== id)),
    clear: () => setItems([]),
  }), []);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartItemsContext.Provider value={items}>{children}</CartItemsContext.Provider>
    </CartActionsContext.Provider>
  );
}

export const useCartItems = () => useContext(CartItemsContext);
export const useCartActions = () => useContext(CartActionsContext);

// Derived, never stored (rule rerender-derived-state-no-effect).
export function useCartCount() {
  const items = useCartItems();
  return items.reduce((sum, l) => sum + l.qty, 0);
}
