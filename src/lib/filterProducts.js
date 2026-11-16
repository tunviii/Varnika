import { priceOpts, sortOpts } from '../data/filters.js';

const priceById = new Map(priceOpts.map((o) => [o.id, o]));

export function applyFilters(list, f) {
  const fabrics = new Set(f.fabrics);
  const colours = new Set(f.colours);
  const priceTest = priceById.get(f.price).test;
  return list.filter((p) =>
    (!fabrics.size || fabrics.has(p.fabric)) &&
    (!colours.size || colours.has(p.colour)) &&
    priceTest(p.price) &&
    (!f.inStock || p.stock > 0));
}

export function sortProducts(list, sortId) {
  if (sortId === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
  if (sortId === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
  return list; // catalogue order = newest first
}

export const sortLabel = (id) => sortOpts.find((o) => o.id === id);

// Removable "Showing:" chips, in the design's order: fabrics, colours, price, stock.
export function activeChips(f) {
  const chips = [
    ...f.fabrics.map((v) => ({ key: `f:${v}`, label: v, remove: (s) => ({ ...s, fabrics: s.fabrics.filter((x) => x !== v) }) })),
    ...f.colours.map((v) => ({ key: `c:${v}`, label: v, remove: (s) => ({ ...s, colours: s.colours.filter((x) => x !== v) }) })),
  ];
  if (f.price !== 'any') chips.push({ key: 'price', label: priceById.get(f.price).label, remove: (s) => ({ ...s, price: 'any' }) });
  if (f.inStock) chips.push({ key: 'stock', label: 'In stock only', remove: (s) => ({ ...s, inStock: false }) });
  return chips;
}

export const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
