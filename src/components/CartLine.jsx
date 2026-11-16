import { Link } from 'react-router-dom';
import QuantityStepper from './QuantityStepper.jsx';
import { inr, stockLabel, toneText } from '../lib/format.js';

// One row of the cart (Cart.dc.html "Lines"). `line` comes from useCartLines();
// `actions` is the stable object from useCartActions().
// Below 768px the image shrinks to 96px and the line total moves under the stock status.
export default function CartLine({ line: l, actions }) {
  const href = `/product/${l.id}`;
  const stock = stockLabel(l.stock);
  return (
    <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-6 py-6 border-b border-champagne">
      <Link to={href} aria-label={l.name}
        className="w-24 md:w-[120px] aspect-[3/4] bg-cream rounded-sm shrink-0 overflow-hidden">
        <img src={l.img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover block" />
      </Link>
      <div className="flex-1 max-md:min-w-0 md:flex-[1_1_240px] flex flex-col gap-1.5">
        <Link to={href} className="text-brown no-underline text-[17px] leading-[1.4] font-medium">{l.name}</Link>
        <span className="text-[14px] leading-[1.5] text-taupe-deep">{l.line} · with blouse piece</span>
        <span className={`text-[14px] ${toneText[stock.tone]}`}>{stock.text}</span>
        <span className="md:hidden text-[17px] font-medium leading-[1.3]">{inr(l.lineTotal)}</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-3">
          <QuantityStepper id={l.id} value={l.qty} onChange={(q) => actions.setQty(l.id, q)} />
          <button type="button" onClick={() => actions.remove(l.id)}
            className="self-end h-11 p-0 bg-transparent border-0 text-rosewood-deep font-sans text-[15px] leading-[normal] font-semibold underline underline-offset-4 cursor-pointer">
            Remove
          </button>
        </div>
      </div>
      <div className="hidden md:block text-right text-[17px] font-medium leading-[1.3] min-w-[100px]">{inr(l.lineTotal)}</div>
    </div>
  );
}
