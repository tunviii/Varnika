import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

// variant="home": announcement bar + search header + full footer (Main / Mobile-Home).
// variant="store": compact header + simple footer (Category / Product / Cart).
export default function StoreLayout({ variant = 'store' }) {
  const isHome = variant === 'home';
  return (
    <div className="font-sans text-brown bg-ivory min-h-full">
      {isHome ? <AnnouncementBar /> : null}
      <Header variant={variant} />
      <Outlet />
      <Footer variant={isHome ? 'full' : 'simple'} />
    </div>
  );
}
