import Icon from './Icon.jsx';

// Quantity stepper from Cart.dc.html: 44px tall white box, stone border, −/+ buttons with blush hover.
// The parent clamps the value (CartContext keeps it within 1..MAX_QTY_PER_ITEM).
const step = 'flex items-center justify-center w-11 h-[42px] bg-transparent hover:bg-blush border-0 text-brown cursor-pointer';

export default function QuantityStepper({ id, value, onChange }) {
  const labelId = `qty-${id}`;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium" id={labelId}>Quantity</span>
      <div role="group" aria-labelledby={labelId}
        className="flex items-center h-11 border border-solid border-stone rounded-md bg-white">
        <button type="button" className={step} aria-label="Decrease quantity" onClick={() => onChange(value - 1)}>
          <Icon name="minus" size={18} />
        </button>
        <span aria-live="polite" className="min-w-9 text-center text-[16px] font-medium">{value}</span>
        <button type="button" className={step} aria-label="Increase quantity" onClick={() => onChange(value + 1)}>
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}
