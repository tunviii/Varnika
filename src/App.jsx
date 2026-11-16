import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import { PageLoading } from './components/PageStatus.jsx';

// Route-level code splitting (rule bundle-dynamic-imports → React.lazy in a Vite SPA).
const Home = lazy(() => import('./pages/Home.jsx'));
const Category = lazy(() => import('./pages/Category.jsx'));
const Product = lazy(() => import('./pages/Product.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const AdminProducts = lazy(() => import('./pages/AdminProducts.jsx'));
const AdminAddProduct = lazy(() => import('./pages/AdminAddProduct.jsx'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout.jsx'));

// Screen → route map (design file → URL)
//   Main / Mobile-Home          → /
//   Category / Category-Mobile  → /sarees   (?c=<category>&q=<search>)
//   Product                     → /product/:id
//   Cart                        → /cart
//   Checkout                    → /checkout
//   Admin-Products              → /admin/products
//   Admin-Add-Product           → /admin/products/new
export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<StoreLayout variant="home" />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<StoreLayout variant="store" />}>
            <Route path="/sarees" element={<Category />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route element={<AdminLayout account />}><Route path="/admin/products" element={<AdminProducts />} /></Route>
          <Route element={<AdminLayout />}><Route path="/admin/products/new" element={<AdminAddProduct />} /></Route>
        </Routes>
      </Suspense>
    </>
  );
}
