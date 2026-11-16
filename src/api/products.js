import { mock, ApiError } from './client.js';
import { products, collections, newArrivalIds } from '../mocks/products.js';

const published = () => products.filter((p) => p.status === 'published');

export const getProducts = () => mock(published());

export const getNewArrivals = () => {
  const byId = new Map(products.map((p) => [p.id, p]));
  return mock(newArrivalIds.map((id) => byId.get(id)).filter(Boolean));
};

export const getProduct = async (id) => {
  const p = products.find((x) => x.id === id);
  if (!p) throw new ApiError('Product not found', 404);
  return mock(p);
};

export const getCollections = () => mock(collections);
