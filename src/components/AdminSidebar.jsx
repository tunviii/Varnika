import { NavLink } from 'react-router-dom';

// Admin navigation (Admin-Products.dc.html / Admin-Add-Product.dc.html sidebar). Only Products has
// a design; the other sections stay `#` until they are designed.
export const adminNav = [
  { label: 'Dashboard' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders' },
  { label: 'Enquiries' },
  { label: 'Collections' },
  { label: 'Settings' },
];

const linkClass = 'flex items-center gap-3 min-h-[44px] px-3 rounded-md no-underline text-[15px] font-medium text-brown hover:text-brown';

// NavLink without `end` is active for /admin/products and everything below it (…/new).
// activeBg: white on the cream sidebar (design); cream inside the white mobile drawer.
export function AdminNavLinks({ onNavigate, activeBg = 'bg-white' }) {
  return adminNav.map((n) =>
    n.to ? (
      <NavLink key={n.label} to={n.to} onClick={onNavigate}
        className={({ isActive }) => `${linkClass} ${isActive ? activeBg : 'bg-transparent'}`}>
        {n.label}
      </NavLink>
    ) : (
      <a key={n.label} href="#" onClick={onNavigate} className={`${linkClass} bg-transparent`}>{n.label}</a>
    ),
  );
}

// Owner block at the bottom of the sidebar (Admin-Products only). No auth exists yet.
export function AdminAccount({ className = '' }) {
  return (
    <div className={`pt-4 border-t border-champagne text-[14px] leading-[1.5] ${className}`}>
      <div className="font-medium">[Owner name]</div>
      <a href="#" className="text-[14px]">Sign out</a>
    </div>
  );
}

export const AdminBrand = (
  <div className="flex items-center gap-3">
    <img src="/images/logo.png" alt="Varnika" className="h-12 w-auto block" />
    <span className="type-eyebrow leading-[normal] text-taupe-deep">Admin</span>
  </div>
);

export default function AdminSidebar({ account = false }) {
  return (
    <aside className="hidden md:flex flex-col gap-6 grow shrink basis-[240px] max-w-[260px] bg-cream border-r border-champagne py-6 px-4 box-border">
      {AdminBrand}
      <nav aria-label="Admin" className="flex flex-col gap-1">
        <AdminNavLinks />
      </nav>
      {account ? <AdminAccount className="mt-auto" /> : null}
    </aside>
  );
}
