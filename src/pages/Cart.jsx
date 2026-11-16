// Design source: design-reference/screens/Cart.dc.html (desktop only; <768px follows tokens.json:
// 16px gutter, stacked columns, mobile type sizes, full-width buttons).
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import CartLine from '../components/CartLine.jsx';
import Icon from '../components/Icon.jsx';
import { PageError, PageLoading } from '../components/PageStatus.jsx';
import { useCartActions, useCartItems } from '../context/CartContext.jsx';
import { useCartLines } from '../lib/useCartLines.js';
import { inr } from '../lib/format.js';
import { categoryHref } from '../data/navigation.js';
import { whatsappHref } from '../config.js';

const askHref = whatsappHref('Hello Varnika, I have a question about the sarees in my cart.');
const row = 'flex justify-between text-[16px]';

export default function Cart() {
  const { lines, count, subtotal, loading, error } = useCartLines();
  const actions = useCartActions();
  // Only wait for product data when the cart has items (an empty cart renders at once).
  const hasItems = useCartItems().length > 0;
  const waiting = loading && hasItems;

  if (error) return <PageError error={error} />;

  return (
    <main className="max-w-lg mx-auto pt-8 px-4 pb-12 md:pt-12 md:px-8 md:pb-20">
      <h1 className="m-0 mb-6 md:mb-8 type-h1">Your cart</h1>
      {waiting ? (
        <PageLoading />
      ) : lines.length > 0 ? (
        <div className="flex flex-wrap gap-x-16 gap-y-10 items-start">
          <section aria-label="Items in your cart" className="flex-[999_1_560px] min-w-0 flex flex-col border-t border-champagne">
            {lines.map((l) => <CartLine key={l.id} line={l} actions={actions} />)}
            <Link to={categoryHref('new')}
              className="self-start inline-flex items-center gap-2 mt-6 text-[15px] font-semibold underline-offset-4">
              <Icon name="back" size={18} />
              Continue shopping
            </Link>
          </section>
          <OrderSummary count={count} subtotal={subtotal} />
        </div>
      ) : (
        <EmptyCart />
      )}
    </main>
  );
}

function OrderSummary({ count, subtotal }) {
  return (
    <aside aria-label="Order summary"
      className="flex-[1_1_320px] max-w-[420px] max-md:max-w-none bg-white border border-champagne rounded-md p-6 md:p-8 box-border flex flex-col gap-4">
      <h2 className="m-0 mb-2 type-h3">Order summary</h2>
      <div className={row}><span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span><span>{inr(subtotal)}</span></div>
      <div className={row}><span>Delivery</span><span className="text-taupe-deep">Confirmed on WhatsApp</span></div>
      <div className="flex justify-between items-baseline pt-4 border-t border-champagne">
        <span className="text-[17px] font-semibold">Total</span>
        <span className="text-[26px] font-medium">{inr(subtotal)}</span>
      </div>
      <span className="text-[14px] text-taupe-deep -mt-2">Inclusive of all taxes</span>
      <Link to="/checkout"
        className="vs-btn-primary flex items-center justify-center h-14 mt-2 bg-cta text-white rounded-md no-underline text-[16px] font-semibold tracking-[0.02em]">
        Continue to place order
      </Link>
      <a href={askHref} target="_blank" rel="noreferrer"
        className="vs-btn-secondary flex items-center justify-center gap-2 h-[52px] border border-solid border-stone rounded-md text-brown no-underline text-[15px] font-semibold box-border">
        <Icon name="whatsapp" size={20} />
        Ask a question on WhatsApp
      </a>
      <div className="flex flex-col gap-2.5 pt-4 border-t border-champagne text-[14px] leading-[1.5] text-taupe-deep">
        <span className="flex gap-2"><Icon name="whatsapp" size={18} className="shrink-0" />No online payment. Your order is sent to us on WhatsApp and we confirm it with you personally.</span>
        <span className="flex gap-2"><Icon name="exchange" size={18} className="shrink-0" />[Returns policy, e.g. 7-day exchange]</span>
      </div>
    </aside>
  );
}

function EmptyCart() {
  return (
    <div className="max-w-[560px] mx-auto py-16 px-6 bg-cream rounded-md flex flex-col items-center gap-4 text-center">
      <h2 className="m-0 type-h3">Your cart is empty</h2>
      <p className="m-0 text-[16px] leading-[1.6]">Browse our latest sarees, or message us and we will help you find the right one.</p>
      <Button to={categoryHref('new')} className="tracking-normal">Shop new arrivals</Button>
    </div>
  );
}
