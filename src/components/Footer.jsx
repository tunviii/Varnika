import { Link } from 'react-router-dom';
import SmartLink from './SmartLink.jsx';
import { store } from '../config.js';
import { footerShop, footerHelp, mobileFooterLinks } from '../data/navigation.js';

const year = 2026;

// variant="full"   → Main.dc.html / Mobile-Home.dc.html footer
// variant="simple" → Category / Product / Cart footer (Category-Mobile.dc.html on mobile)
export default function Footer({ variant = 'simple' }) {
  return variant === 'full' ? <FullFooter /> : <SimpleFooter />;
}

function SimpleFooter() {
  return (
    <footer className="bg-cream border-t border-solid border-champagne">
      <div className="hidden md:flex max-w-lg mx-auto p-8 flex-wrap justify-between gap-2 text-[14px] text-taupe-deep">
        <span>© {year} Varnika Sarees</span>
        <span>{store.phone}</span>
      </div>
      <div className="md:hidden py-6 px-4 text-[13px] text-taupe-deep">© {year} Varnika Sarees · {store.phone}</div>
    </footer>
  );
}

const colHead = 'text-[15px] font-medium text-brown';

function FullFooter() {
  return (
    <footer className="bg-cream border-t border-solid border-champagne">
      {/* Desktop */}
      <div className="hidden md:grid max-w-lg mx-auto pt-16 px-8 pb-8 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8 gap-y-10">
        <div className="flex flex-col gap-4">
          <img src="/images/logo-with-tagline.png" alt="Varnika, where tradition meets timeless style" loading="lazy" decoding="async" className="h-28 w-auto self-start block" />
          <p className="m-0 text-[14px] leading-[1.5] text-taupe-deep">A family saree boutique. Order on WhatsApp.</p>
        </div>
        <div className="flex flex-col gap-3 text-[14px] leading-[1.5]">
          <span className={colHead}>Shop</span>
          {footerShop.map((l) => <Link key={l.label} to={l.to} className="text-brown">{l.label}</Link>)}
        </div>
        <div className="flex flex-col gap-3 text-[14px] leading-[1.5]">
          <span className={colHead}>Help</span>
          {footerHelp.map((label) => <a key={label} href="#" className="text-brown">{label}</a>)}
        </div>
        <div className="flex flex-col gap-3 text-[14px] leading-[1.5]">
          <span className={colHead}>Contact us</span>
          <span>{store.phone}</span>
          <a href="#" className="text-brown">Instagram</a>
        </div>
      </div>
      <div className="hidden md:flex max-w-lg mx-auto pt-6 px-8 pb-8 border-t border-solid border-champagne flex-wrap justify-between gap-2 text-[13px] leading-[1.4] text-taupe-deep">
        <span>© {year} Varnika Sarees</span>
        <span>Privacy policy · Terms of sale</span>
      </div>

      {/* Mobile */}
      <div className="md:hidden pt-10 px-4 pb-8 flex flex-col gap-6">
        <img src="/images/logo-with-tagline.png" alt="Varnika, where tradition meets timeless style" loading="lazy" decoding="async" className="h-24 w-auto self-start block" />
        <div className="grid grid-cols-2 gap-x-4">
          {mobileFooterLinks.map((l) => (
            <SmartLink key={l.label} to={l.to} className="flex items-center min-h-11 text-brown text-[15px]">{l.label}</SmartLink>
          ))}
        </div>
        <span className="text-[13px] text-taupe-deep">© {year} Varnika Sarees</span>
      </div>
    </footer>
  );
}
