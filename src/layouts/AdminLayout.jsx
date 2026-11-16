import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar, { AdminAccount, AdminBrand, AdminNavLinks } from '../components/AdminSidebar.jsx';
import Drawer from '../components/Drawer.jsx';
import Icon from '../components/Icon.jsx';

// Shared admin shell (Admin-Products.dc.html / Admin-Add-Product.dc.html): sidebar + <main>.
// Pages render only the main's children (a fragment); main is a 24px-gap column.
// `account` shows the "[Owner name] / Sign out" block, which only Admin-Products draws.
// Below 768px (no design) the sidebar becomes a top bar whose Menu button opens the Drawer.
// No authentication: the admin is reachable by URL (frontend only).
export default function AdminLayout({ account = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="font-sans text-brown bg-ivory min-h-full flex flex-wrap items-stretch">
      <AdminSidebar account={account} />

      <div className="md:hidden basis-full flex items-center justify-between gap-3 px-4 py-2 bg-cream border-b border-champagne">
        {AdminBrand}
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open admin menu" aria-expanded={menuOpen}
          className="flex items-center justify-center w-11 h-11 p-0 bg-transparent border-0 text-brown cursor-pointer">
          <Icon name="menu" />
        </button>
      </div>
      <Drawer open={menuOpen} onClose={closeMenu} title="Admin">
        <nav aria-label="Admin" className="flex flex-col gap-1">
          <AdminNavLinks onNavigate={closeMenu} activeBg="bg-cream" />
        </nav>
        {account ? <AdminAccount className="mt-6" /> : null}
      </Drawer>

      <main className="grow-[999] shrink basis-[560px] min-w-0 p-4 md:p-8 box-border flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}
