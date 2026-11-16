import { useMemo } from 'react';
import { useCartItems } from '../context/CartContext.jsx';
import { getProducts } from '../api/products.js';
import { useApi } from './useApi.js';

// Cart items ({ id, qty }) joined with product data from the API. Shared by Cart and Checkout.
// Totals are derived here, never stored (rule rerender-derived-state-no-effect).
// Items whose product no longer exists are dropped from the lines.
export function useCartLines() {
  const items = useCartItems();
  const { data: products, error, loading } = useApi('products', getProducts);

  return useMemo(() => {
    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    const lines = [];
    let count = 0;
    let subtotal = 0;
    for (const it of items) {
      const p = byId.get(it.id);
      if (!p) continue;
      const lineTotal = p.price * it.qty;
      lines.push({ ...p, qty: it.qty, lineTotal });
      count += it.qty;
      subtotal += lineTotal;
    }
    return { lines, count, subtotal, loading, error };
  }, [items, products, loading, error]);
}
