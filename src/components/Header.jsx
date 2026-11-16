import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import Drawer from './Drawer.jsx';
import SmartLink from './SmartLink.jsx';
import { useCartCount } from '../context/CartContext.jsx';
import { homeNav, storeNav } from '../data/navigation.js';

// Two header designs:
//   variant="home"  → Main.dc.html (search bar + centred nav) / Mobile-Home.dc.html
//   variant="store" → Category / Product / Cart compact header / Category-Mobile.dc.html
export default function Header({ variant = 'store' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isHome = variant === 'home';

  return (
    <>
      <header className={`bg-ivory border-b border-solid border-champagne ${isHome ? 'home px-2 pt-2 pb-4' : 'p-2'} md:p-0`}>
        <div className="md:hidden">
          <MobileBar isHome={isHome} onMenu={() => setMenuOpen(true)} />
          {isHome ? <SearchForm mobile /> : null}
        </div>
        <div className="hidden md:block">
          {isHome ? <DesktopHome /> : <DesktopStore />}
        </div>
      </header>
      <Drawer open={menuOpen} onClose={closeMenu} title="Menu">
        <nav aria-label="Menu">
          {homeNav.map((l) => (
            <SmartLink key={l.label} to={l.to} onClick={closeMenu}
              className="flex items-center min-h-12 border-b border-champagne text-brown no-underline text-[18px] leading-[1.4] font-medium">
              {l.label}
            </SmartLink>
          ))}
          <a href="#" onClick={closeMenu}
            className="flex items-center gap-2 min-h-12 text-brown no-underline text-[18px] leading-[1.4] font-medium">
            <Icon name="user" size={22} />Sign in
          </a>
        </nav>
      </Drawer>
    </>
  );
}

function useSearchSubmit() {
  const navigate = useNavigate();
  return (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q')?.toString().trim();
    navigate(q ? `/sarees?q=${encodeURIComponent(q)}` : '/sarees');
  };
}

function SearchForm({ mobile = false }) {
  const onSubmit = useSearchSubmit();
  const [params] = useSearchParams();
  const defaultQ = params.get('q') ?? '';

  if (mobile) {
    return (
      <form role="search" onSubmit={onSubmit} className="pt-2 px-2">
        <label htmlFor="m-search" className="block text-[15px] font-medium mb-2">Search sarees</label>
        <div className="flex items-center gap-2 h-[52px] px-4 bg-white border border-solid border-stone rounded-md">
          <Icon name="search" size={20} stroke="var(--taupe-deep)" />
          <input id="m-search" name="q" type="search" defaultValue={defaultQ} placeholder="Fabric, colour or occasion"
            className="flex-1 border-0 bg-transparent font-sans font-normal text-[16px] leading-[1.4] text-brown outline-none min-w-0" />
        </div>
      </form>
    );
  }
  return (
    <form role="search" onSubmit={onSubmit} className="flex-[1_1_320px] flex items-center gap-2 max-w-[560px] mx-auto">
      <label htmlFor="site-search" className="vs-sr-only">Search sarees</label>
      <div className="flex-1 flex items-center gap-2 h-12 px-4 bg-white border border-solid border-stone rounded-md">
        <Icon name="search" size={20} stroke="var(--taupe-deep)" />
        <input id="site-search" name="q" type="search" defaultValue={defaultQ} placeholder="Search by fabric, colour or occasion"
          className="flex-1 border-0 bg-transparent font-sans font-normal text-[16px] leading-[1.4] text-brown outline-none min-w-0" />
      </div>
      <button type="submit"
        className="vs-btn-primary h-12 px-5 bg-cta text-white border-0 rounded-md font-sans font-semibold text-[15px] leading-[1.2] tracking-[0.02em] cursor-pointer">
        Search
      </button>
    </form>
  );
}

const desktopAction = 'vs-nav flex items-center gap-2 h-11 px-3 text-brown no-underline text-[15px] font-medium';

function DesktopHome() {
  const count = useCartCount();
  return (
    <>
      <div className="max-w-lg mx-auto pt-5 px-8 flex flex-wrap items-center gap-6">
        <Logo />
        <SearchForm />
        <div className="flex items-center gap-2">
          <a href="#" className={desktopAction}><Icon name="user" size={22} />Sign in</a>
          <Link to="/cart" className={desktopAction}>
            <Icon name="bag" size={22} />
            Cart
            {count > 0 ? (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 box-border bg-cta text-white rounded-round text-[13px] font-semibold">{count}</span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav aria-label="Main" className="max-w-lg mx-auto pt-3 px-8">
        <div className="flex flex-wrap justify-center gap-x-8">
          {homeNav.map((l, i) => (
            // The design underlines "New arrivals" on the homepage.
            <SmartLink key={l.label} to={l.to}
              className={`vs-nav pt-3 pb-3.5 text-brown no-underline text-[15px] font-medium ${i === 0 ? 'border-b-2 border-solid border-rosewood' : ''}`}>
              {l.label}
            </SmartLink>
          ))}
        </div>
      </nav>
    </>
  );
}

function DesktopStore() {
  const count = useCartCount();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  // Product pages keep "Silk sarees" underlined, as in Product.dc.html.
  const activeC = pathname === '/sarees' ? params.get('c') : pathname.startsWith('/product') ? 'silk' : null;
  const onCart = pathname === '/cart';
  const active = 'border-b-2 border-solid border-rosewood';

  return (
    <div className="max-w-lg mx-auto py-4 px-8 flex flex-wrap items-center gap-x-8 gap-y-4">
      <Logo />
      <nav aria-label="Main" className="flex-[1_1_400px] flex flex-wrap gap-x-7 gap-y-1">
        {storeNav.map((l) => {
          const isActive = l.c && l.c === activeC;
          return (
            <SmartLink key={l.label} to={l.to} aria-current={isActive ? 'page' : undefined}
              className={`py-2.5 text-brown no-underline text-[15px] font-medium ${isActive ? active : ''}`}>
              {l.label}
            </SmartLink>
          );
        })}
      </nav>
      <div className="flex gap-1">
        <Link to="/" state={{ focusSearch: true }} className="flex items-center gap-2 h-11 px-3 text-brown no-underline text-[15px] font-medium">
          <Icon name="search" size={22} />Search
        </Link>
        <a href="#" className="flex items-center gap-2 h-11 px-3 text-brown no-underline text-[15px] font-medium">
          <Icon name="user" size={22} />Sign in
        </a>
        <Link to="/cart" aria-current={onCart ? 'page' : undefined}
          className={`flex items-center gap-2 h-11 px-3 text-brown no-underline text-[15px] font-medium ${onCart ? active : ''}`}>
          <Icon name="bag" size={22} />Cart ({count})
        </Link>
      </div>
    </div>
  );
}

const mobileBtn = 'flex flex-col items-center justify-center gap-0.5 h-14 text-brown no-underline text-[12px] font-medium';

function MobileBar({ isHome, onMenu }) {
  const count = useCartCount();
  return (
    <div className={`flex items-center justify-between ${isHome ? 'gap-1' : ''}`}>
      <button type="button" onClick={onMenu} aria-haspopup="dialog"
        className={`${mobileBtn} w-[60px] bg-transparent border-0 font-sans ${isHome ? 'leading-[1.2]' : 'leading-[normal]'} cursor-pointer`}>
        <Icon name="menu" />Menu
      </button>
      <Logo />
      <div className="flex">
        {isHome ? (
          <a href="#" className={`${mobileBtn} w-[60px]`}><Icon name="user" />Sign in</a>
        ) : (
          <Link to="/" state={{ focusSearch: true }} className={`${mobileBtn} w-[60px]`}><Icon name="search" />Search</Link>
        )}
        <Link to="/cart" className={`${mobileBtn} relative w-14`}>
          <Icon name="bag" />
          {isHome ? 'Cart' : `Cart (${count})`}
          {isHome && count > 0 ? (
            <span className="absolute top-1 right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] box-border bg-cta text-white rounded-round text-[11px] font-semibold">{count}</span>
          ) : null}
        </Link>
      </div>
    </div>
  );
}
