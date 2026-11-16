// Product card. Two designs:
//   variant="home"    → "New arrivals" grid: Main.dc.html (desktop) / Mobile-Home.dc.html (<768px)
//   variant="listing" → Category.dc.html (desktop) / Category-Mobile.dc.html (<768px): no stock icon,
//                       and no fabric line on mobile.
// Mobile, both variants: tighter badge, no MRP, stock text without icon.
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import Icon from './Icon.jsx';
import { inr, stockLabel, toneText } from '../lib/format.js';

// Grid cards are ~25vw on desktop, 50vw on mobile; used only when the API supplies p.srcSet.
const SIZES = '(min-width: 768px) 25vw, 50vw';

function ProductCard({ product: p, variant = 'home' }) {
  if (variant === 'listing') return <ListingCard p={p} />;
  const stock = stockLabel(p.stock);
  const shortLine = p.line.split(' · ')[0];
  return (
    <Link to={`/product/${p.id}`} className="vs-card flex flex-col text-brown no-underline">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream">
        <img className="vs-card-img w-full h-full object-cover block bg-cream" src={p.img} srcSet={p.srcSet} sizes={SIZES} alt={p.alt} loading="lazy" decoding="async"
          style={{ objectPosition: p.pos }} />
        {p.badge ? (
          <Badge kind={p.badge} className="absolute top-2 left-2 py-[3px] px-2 md:top-3 md:left-3 md:z-10 md:py-1 md:px-2.5" />
        ) : null}
      </div>
      <div className="flex flex-col md:gap-1.5 md:pt-4">
        <span className="pt-3 md:pt-0 text-[16px] leading-[1.4] font-medium">{p.name}</span>
        <span className="pt-1 md:pt-0 text-[14px] leading-[1.5] text-taupe-deep">
          <span className="md:hidden">{shortLine}</span>
          <span className="hidden md:inline">{p.line}</span>
        </span>
        <span className="flex items-baseline gap-2 pt-1.5 md:pt-0.5">
          <span className="text-[17px] leading-[1.3] font-medium">{inr(p.price)}</span>
          {p.mrp ? <span className="hidden md:inline text-[14px] text-taupe-deep line-through">{inr(p.mrp)}</span> : null}
        </span>
        <span className={`flex items-center gap-1.5 pt-1 md:pt-0 text-[14px] ${toneText[stock.tone]}`}>
          <Icon name="check" size={16} className="hidden md:block" />
          {stock.text}
        </span>
      </div>
    </Link>
  );
}

function ListingCard({ p }) {
  const stock = stockLabel(p.stock);
  return (
    <Link to={`/product/${p.id}`} className="vs-card flex flex-col text-brown no-underline">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream">
        <img className="vs-card-img w-full h-full object-cover block bg-cream" src={p.img} srcSet={p.srcSet} sizes={SIZES} alt={p.alt} loading="lazy" decoding="async"
          style={{ objectPosition: p.pos }} />
        {p.badge ? (
          <Badge kind={p.badge} className="absolute top-2 left-2 py-[3px] px-2 md:top-3 md:left-3 md:py-1 md:px-2.5" />
        ) : null}
      </div>
      <span className="pt-3 md:pt-4 text-[16px] leading-[1.4] font-medium">{p.name}</span>
      <span className="hidden md:block pt-1 text-[14px] leading-[1.5] text-taupe-deep">{p.line}</span>
      <span className="flex items-baseline gap-2 pt-1.5">
        <span className="text-[17px] leading-[1.3] font-medium">{inr(p.price)}</span>
        {p.mrp ? <span className="hidden md:inline text-[14px] text-taupe-deep line-through">{inr(p.mrp)}</span> : null}
      </span>
      <span className={`pt-1 text-[14px] ${toneText[stock.tone]}`}>{stock.text}</span>
    </Link>
  );
}

export default memo(ProductCard);
