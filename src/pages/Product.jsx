// Design source: design-reference/screens/Product.dc.html (desktop only; <768px derived from tokens.json:
// 16px gutter, stacked columns, mobile type sizes, full-width buttons).
import { memo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Icon from '../components/Icon.jsx';
import { PageError, PageLoading } from '../components/PageStatus.jsx';
import { getProductDetail, getRelatedProducts } from '../api/productDetails.js';
import { useApi } from '../lib/useApi.js';
import { inr, stockLabel, toneText } from '../lib/format.js';
import { useCartActions, useCartItems } from '../context/CartContext.jsx';
import { MAX_QTY_PER_ITEM, whatsappHref } from '../config.js';

const h2Cls = 'font-display font-semibold text-[22px] md:text-[26px] leading-[1.2]';

export default function Product() {
  const { id } = useParams();
  // Product and related products load in parallel (rule async-parallel).
  const { data: product, error, loading } = useApi(`product:${id}`, () => getProductDetail(id));
  const related = useApi(`related:${id}`, () => getRelatedProducts(id));

  if (error) return error.status === 404 ? <NotFound /> : <PageError error={error} />;
  if (loading) return <PageLoading />;
  // key: a different product starts on its first photo with fresh feedback state.
  return <ProductView key={product.id} p={product} related={related.data} />;
}

function NotFound() {
  return (
    <main className="max-w-lg mx-auto py-20 px-4 md:px-8 text-center">
      <h1 className="m-0 type-h2">We could not find this saree</h1>
      <p className="mt-4 mb-8 text-[16px] leading-[1.6] text-taupe-deep">
        It may have sold out or the link may be wrong. Have a look at what is in the boutique now.
      </p>
      <Link to="/sarees"
        className="vs-btn-primary inline-flex items-center h-[52px] px-7 rounded-md bg-cta text-white hover:text-white no-underline text-[15px] font-semibold tracking-[0.02em]">
        Browse all sarees
      </Link>
    </main>
  );
}

function ProductView({ p, related }) {
  return (
    <main className="pt-4 px-4 pb-12 md:max-w-lg md:mx-auto md:pt-6 md:px-8 md:pb-20">
      <Breadcrumb className="pb-4 md:pb-8"
        items={[{ label: 'Home', to: '/' }, { label: 'Silk sarees', to: '/sarees?c=silk' }, { label: p.name }]} />

      <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-x-16 md:gap-y-12 md:items-start">
        <Gallery photos={p.gallery} />
        <Info p={p} />
      </div>

      {related?.length ? <Related items={related} /> : null}
    </main>
  );
}

function Gallery({ photos }) {
  const [active, setActive] = useState(0);
  const main = photos[active];
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4 md:flex-[1.15_1_480px] min-w-0">
      <div className="flex flex-row gap-3 md:flex-col md:w-[88px] md:shrink-0" role="group" aria-label="Photos">
        {photos.map((ph, i) => (
          <button key={ph.key} type="button" onClick={() => setActive(i)}
            aria-label={`Photo ${i + 1}, ${ph.label}`} aria-pressed={i === active}
            className={`w-16 md:w-auto aspect-[3/4] p-0 overflow-hidden bg-cream rounded-sm cursor-pointer border-solid ${
              i === active ? 'border-2 border-brown' : 'border border-champagne'}`}>
            <PhotoImg ph={ph} alt="" />
          </button>
        ))}
      </div>
      <div className="flex-1 min-w-0 w-full aspect-[3/4] overflow-hidden rounded-sm bg-cream">
        <PhotoImg ph={main} alt={main.alt} className="rounded-sm bg-cream" main />
      </div>
    </div>
  );
}

// Photos come from the API. `srcSet` is used when the backend supplies sized variants; thumbnails
// request the same URLs as the main image, so switching photos is instant from the browser cache.
function PhotoImg({ ph, alt, className = '', main = false }) {
  return (
    <img src={ph.img} srcSet={ph.srcSet} sizes={main ? '(min-width: 768px) 45vw, 100vw' : '88px'} alt={alt}
      fetchpriority={main ? 'high' : undefined} decoding={main ? undefined : 'async'}
      className={`w-full h-full object-cover block ${className}`}
      style={{ objectPosition: ph.pos, transform: `scale(${ph.scale})` }} />
  );
}

function Info({ p }) {
  const stock = stockLabel(p.stock);
  const soldOut = p.stock === 0;
  const enquireHref = whatsappHref(
    soldOut
      ? `Hello Varnika, is the ${p.name} (${p.sku}) coming back in stock?`
      : `Hello Varnika, I would like to know more about the ${p.name} (${p.sku}, ${inr(p.price)}).`,
  );
  return (
    <div className="flex flex-col gap-5 md:flex-[1_1_400px] md:max-w-[540px]">
      {p.badge ? <Badge kind={p.badge} className="self-start py-1 px-2.5" /> : null}
      <h1 className="m-0 type-h1">{p.name}</h1>
      <span className="text-[16px] leading-[1.5] text-taupe-deep">{p.subtitle}</span>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-[26px] leading-[1.2] font-medium">{inr(p.price)}</span>
        {p.mrp ? <span className="text-[16px] text-taupe-deep line-through">{inr(p.mrp)}</span> : null}
        <span className="text-[14px] text-taupe-deep">Inclusive of all taxes</span>
      </div>
      <span className={`flex items-center gap-2 text-[15px] font-medium ${toneText[stock.tone]}`}>
        <Icon name={stock.tone === 'success' ? 'check' : 'alert'} size={20} />
        {soldOut ? 'Sold out · message us to ask about a restock' : `${stock.text} · ships in ${p.shipsIn} working days`}
      </span>

      <div className="flex flex-col gap-3 pt-2">
        <AddToCart p={p} />
        <a href={enquireHref} target="_blank" rel="noreferrer"
          className="vs-btn-secondary flex items-center justify-center gap-2 h-14 text-brown hover:text-brown border border-solid border-stone rounded-md no-underline text-[16px] font-semibold tracking-[0.02em] box-border">
          <Icon name="whatsapp" size={20} />
          Enquire on WhatsApp
        </a>
        <span className="text-[14px] leading-[1.5] text-taupe-deep">Want to see it in daylight first? Message us and we will send a short video.</span>
      </div>

      <div className="border-t border-champagne pt-6 flex flex-col">
        <h2 className={`mt-0 mb-3 ${h2Cls}`}>Saree details</h2>
        <dl className="m-0">
          {p.details.map((d) => (
            <div key={d.k} className="grid grid-cols-[120px_minmax(0,1fr)] md:grid-cols-[140px_minmax(0,1fr)] gap-4 py-3 border-b border-champagne text-[16px] leading-[1.5]">
              <dt className="text-[15px] font-medium text-taupe-deep">{d.k}</dt>
              <dd className="m-0">{d.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className={`mt-2 mb-0 ${h2Cls}`}>About this saree</h2>
        <p className="m-0 text-[16px] leading-[1.6]">
          {p.about.map((part, i) => (typeof part === 'string' ? part : <em key={i} className="not-italic">{part.em}</em>))}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-cream rounded-md text-[14px] leading-[1.5]">
        <span className="flex gap-2"><Icon name="truck" size={20} stroke="var(--taupe-deep)" className="shrink-0" />Delivery across India</span>
        <span className="flex gap-2"><Icon name="exchange" size={20} stroke="var(--taupe-deep)" className="shrink-0" />[Returns policy, e.g. 7-day exchange]</span>
      </div>
    </div>
  );
}

// Adds one saree per click, up to the stock and the per-item limit; feedback is a polite status line.
function AddToCart({ p }) {
  const { add } = useCartActions();
  const items = useCartItems();
  const [added, setAdded] = useState(false);
  const inCart = items.find((l) => l.id === p.id)?.qty ?? 0;
  const limit = Math.min(MAX_QTY_PER_ITEM, p.stock);
  const soldOut = p.stock === 0;
  const atLimit = !soldOut && inCart >= limit;
  const disabled = soldOut || atLimit;

  const onAdd = () => {
    add(p.id, 1);
    setAdded(true);
  };

  let message = null;
  if (atLimit) {
    message = <>You have {inCart === 1 ? 'the only piece' : `all ${inCart} pieces we can reserve`} in your cart. <Link to="/cart">View cart</Link></>;
  } else if (added) {
    message = <>Added to cart ({inCart} in your cart). <Link to="/cart">View cart</Link></>;
  }

  return (
    <>
      <button type="button" onClick={onAdd} disabled={disabled}
        className={`flex items-center justify-center gap-2 h-14 p-0 border-0 rounded-md font-sans text-[16px] font-semibold tracking-[0.02em] ${
          disabled ? 'bg-champagne text-taupe-deep cursor-not-allowed' : 'vs-btn-primary bg-cta text-white cursor-pointer'}`}>
        <Icon name="bag" size={20} />
        {soldOut ? 'Sold out' : atLimit ? 'In your cart' : 'Add to cart'}
      </button>
      <span role="status" aria-live="polite" className={message ? 'text-[15px] leading-[1.5] text-success font-medium' : 'vs-sr-only'}>
        {message}
      </span>
    </>
  );
}

function Related({ items }) {
  return (
    <section className="pt-12 md:pt-20">
      <h2 className="mt-0 mb-6 md:mb-8 type-h2">You may also like</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-x-6 md:gap-y-10">
        {items.map((r) => <RelatedCard key={r.id} p={r} />)}
      </div>
    </section>
  );
}

// The design's related card: image, name, first part of the line (fabric), price.
const RelatedCard = memo(function RelatedCard({ p }) {
  return (
    <Link to={`/product/${p.id}`} className="vs-card flex flex-col text-brown hover:text-brown no-underline">
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-cream">
        <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="vs-card-img w-full h-full object-cover block rounded-sm bg-cream"
          style={{ objectPosition: p.pos }} />
      </div>
      <span className="pt-3 md:pt-4 text-[16px] leading-[1.4] font-medium">{p.name}</span>
      <span className="pt-1 text-[14px] leading-[1.5] text-taupe-deep">{p.line.split(' · ')[0]}</span>
      <span className="pt-1.5 text-[17px] leading-[1.3] font-medium">{inr(p.price)}</span>
    </Link>
  );
});
