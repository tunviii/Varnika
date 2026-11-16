// Product page API (mock). A backend replaces these with fetch() calls.
import { mock, ApiError } from './client.js';
import { products } from '../mocks/products.js';
import { buildDetails } from '../mocks/productDetails.js';

const published = () => products.filter((p) => p.status === 'published');

const find = (id) => {
  const p = published().find((x) => x.id === id);
  if (!p) throw new ApiError('Product not found', 404);
  return p;
};

// Product + its page details (subtitle, details table, gallery, about text).
export const getProductDetail = async (id) => {
  const p = find(id);
  const { relatedIds, ...details } = buildDetails(p);
  return mock({ ...p, ...details });
};

// "You may also like": pinned list if there is one, else same collection, then same fabric,
// then closest in price. Never the product itself.
export const getRelatedProducts = async (id, limit = 4) => {
  const p = find(id);
  const others = published().filter((x) => x.id !== id);
  const pinned = buildDetails(p).relatedIds;
  if (pinned) {
    const byId = new Map(others.map((x) => [x.id, x]));
    return mock(pinned.map((rid) => byId.get(rid)).filter(Boolean).slice(0, limit));
  }
  const rank = (x) => (x.collection === p.collection ? 0 : x.fabric === p.fabric ? 1 : 2);
  const sorted = others
    .map((x) => ({ x, r: rank(x), d: Math.abs(x.price - p.price) }))
    .sort((a, b) => a.r - b.r || a.d - b.d)
    .map(({ x }) => x);
  return mock(sorted.slice(0, limit));
};
