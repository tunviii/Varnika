// Admin API (frontend-only mock). Mutates the in-memory catalogue in src/mocks/products.js, so new
// products also reach the storefront until the page is reloaded. No authentication: when a backend
// exists, these become authenticated fetch() calls and the shapes below stay the same.
import { mock, ApiError } from './client.js';
import { products } from '../mocks/products.js';
import { invalidate } from '../lib/useApi.js';

// Admin category for a product (the catalogue has no category field yet: every saree is silk unless
// its fabric says otherwise).
export const productCategory = (p) => p.category ?? (p.fabric === 'Cotton' ? 'Cotton sarees' : 'Silk sarees');

// Status badge rules: sold out (stock 0) → low stock (1–2) → draft → published.
export function adminStatus(p) {
  if (p.stock === 0) return 'sold-out';
  if (p.stock <= 2) return 'low-stock';
  if (p.status === 'draft') return 'draft';
  return 'published';
}

export const getAdminProducts = () =>
  mock(products.map((p) => ({ ...p, category: productCategory(p), adminStatus: adminStatus(p) })));

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const weaveCodes = { Kanjivaram: 'KJ', Banarasi: 'BN', Chanderi: 'CH', Tussar: 'TS', Paithani: 'PT' };

function nextSku(weave) {
  const code = weaveCodes[weave] ?? ((weave || 'VS').replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase() || 'XX');
  const n = products.reduce((max, p) => Math.max(max, Number(p.sku?.match(/(\d+)$/)?.[1] ?? 0)), 0) + 1;
  return `VS-${code}-${String(n).padStart(4, '0')}`;
}

/**
 * createProduct(input) → Promise<product>
 * input: {
 *   name*: string, price*: number (> 0), stock*: integer (>= 0),
 *   status: 'published' | 'draft' (default 'published'),
 *   sku?: string (generated if empty, must be unique), mrp?: number (> price),
 *   catalogue fields (as in src/mocks/products.js): fabric, line, colour, collection, img, alt, pos,
 *   thumbPos, badge?, newArrival; extras kept on the product: description, category, collections[],
 *   material, colourText, length, blouse, care, featured, photos[] …
 * }
 * Throws ApiError with `.fields = { field: message }`: 409 when only the SKU is taken, else 422.
 * Invalidates the 'products' (storefront) and 'admin' (admin list) useApi caches on success.
 */
export async function createProduct(input) {
  const fields = {};
  const name = (input.name ?? '').trim();
  const price = Number(input.price);
  const stock = Number(input.stock);
  const mrp = input.mrp === '' || input.mrp == null ? undefined : Number(input.mrp);
  const sku = (input.sku ?? '').trim() || nextSku(input.weave || input.fabric);

  if (!name) fields.name = 'Enter a product name.';
  if (!Number.isFinite(price) || price <= 0) fields.price = 'Enter a selling price in rupees, for example 12500.';
  if (mrp !== undefined && (!Number.isFinite(mrp) || mrp <= price)) fields.mrp = 'Original price must be higher than the selling price.';
  if (!Number.isInteger(stock) || stock < 0) fields.stock = 'Enter a quantity of 0 or more.';
  if (products.some((p) => p.sku.toLowerCase() === sku.toLowerCase())) fields.sku = 'This SKU is already used by another product.';
  if (Object.keys(fields).length) {
    const onlySku = Object.keys(fields).length === 1 && fields.sku;
    const err = new ApiError(onlySku ? fields.sku : 'Please fix the highlighted fields.', onlySku ? 409 : 422);
    err.fields = fields;
    throw err;
  }

  let id = slug(name) || 'product';
  if (products.some((p) => p.id === id)) id = `${id}-${slug(sku)}`;

  // Catalogue-shaped input is kept as-is (fabric, line, colour, collection, badge, photos …);
  // validated/derived fields win, defaults fill the rest.
  const product = {
    fabric: input.weave || '',
    line: '',
    colour: input.colourGroup || '',
    category: 'Silk sarees',
    img: '/images/red-kanjivaram.jpg',
    pos: '50% 50%',
    thumbPos: '50% 22%',
    ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined && v !== '')),
    // Storefront fields: `fabric` is the weave name ('Kanjivaram'), `colour` the filter colour group.
    ...(input.weave && { fabric: input.weave, material: input.material ?? input.fabric }),
    ...(input.colourGroup && { colour: input.colourGroup, colourText: input.colourText ?? input.colour }),
    line: input.line || [input.material ?? (input.weave ? input.fabric : ''), input.colourText ?? (input.colourGroup ? input.colour : '')].filter(Boolean).join(' · '),
    id, sku, name, price, stock, mrp,
    alt: input.alt || name,
    newArrival: Boolean(input.newArrival),
    status: input.status === 'draft' ? 'draft' : 'published',
  };
  if (mrp === undefined) delete product.mrp;
  products.push(product);
  invalidate('products');
  invalidate('admin');
  return mock(product);
}

export async function updateProductStatus(id, status) {
  const p = products.find((x) => x.id === id);
  if (!p) throw new ApiError('Product not found', 404);
  p.status = status === 'draft' ? 'draft' : 'published';
  invalidate('products');
  invalidate('admin');
  return mock(p);
}
