// Design source: design-reference/screens/Checkout.dc.html (desktop only; <768px derived from tokens.json:
// 16px gutter, single column, summary + send button below the form).
import { useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import CheckoutHeader from '../components/CheckoutHeader.jsx';
import Field, { describedBy, inputClass } from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { PageError, PageLoading } from '../components/PageStatus.jsx';
import { buildOrderMessage, isValidPin, newOrderRef, normaliseMobile, placeOrder } from '../api/orders.js';
import { useCartActions } from '../context/CartContext.jsx';
import { useCartLines } from '../lib/useCartLines.js';
import { forgetAddress, readSavedAddress, saveAddress } from '../lib/savedAddress.js';
import { inr } from '../lib/format.js';
import { indianStates } from '../data/indianStates.js';
import { store } from '../config.js';

const EMPTY = { mobile: '', email: '', name: '', pin: '', line1: '', area: '', landmark: '', city: '', state: '', note: '' };
// Field order = tab order, so the first invalid one gets focus.
const REQUIRED_ORDER = ['mobile', 'email', 'name', 'pin', 'line1', 'area', 'city', 'state'];
const ID = { mobile: 'c-mobile', email: 'c-email', name: 'a-name', pin: 'a-pin', line1: 'a-line1', area: 'a-area', landmark: 'a-landmark', city: 'a-city', state: 'a-state', note: 'o-note' };

function validate(v) {
  const e = {};
  if (!v.mobile.trim()) e.mobile = 'Enter your mobile number.';
  else if (!normaliseMobile(v.mobile)) e.mobile = 'Enter a 10-digit Indian mobile number, for example 98450 12345.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter an email address like name@example.com, or leave it empty.';
  if (!v.name.trim()) e.name = 'Enter the full name of the person receiving the order.';
  if (!v.pin.trim()) e.pin = 'Enter your PIN code.';
  else if (!isValidPin(v.pin)) e.pin = 'Enter a 6-digit PIN code, for example 560011.';
  if (!v.line1.trim()) e.line1 = 'Enter the house number, building and street.';
  if (!v.area.trim()) e.area = 'Enter the area or locality.';
  if (!v.city.trim()) e.city = 'Enter the city.';
  if (!v.state) e.state = 'Choose your state.';
  return e;
}

const sectionCls = 'bg-white border border-champagne rounded-md p-5 md:p-8 flex flex-col gap-6';
const h2Cls = 'm-0 flex items-center gap-3 type-h3';
const gridCls = 'grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6';

function SectionTitle({ n, children }) {
  return (
    <h2 className={h2Cls}>
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-round bg-blush font-sans text-[15px] font-semibold leading-[normal]">{n}</span>
      {children}
    </h2>
  );
}

function Step({ n, children }) {
  return (
    <li className="flex gap-3 text-[16px] leading-[1.5]">
      <span className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-round bg-cream text-[14px] font-semibold">{n}</span>
      <span>{children}</span>
    </li>
  );
}

// Static, hoisted (rule rendering-hoist-jsx).
const steps = (
  <ol className="m-0 p-0 list-none flex flex-col gap-3">
    <Step n="1">Tap <strong className="font-semibold">Send order on WhatsApp</strong>. WhatsApp opens with the message below already written.</Step>
    <Step n="2">Press send. Your order goes straight to Varnika on {store.phone}.</Step>
    <Step n="3">We check the saree, confirm the delivery charge and agree how you would like to pay. Nothing is charged online.</Step>
  </ol>
);

export default function Checkout() {
  const cart = useCartLines();
  let body;
  if (cart.error) body = <PageError error={cart.error} />;
  else if (cart.loading) body = <PageLoading />;
  else body = <CheckoutView lines={cart.lines} subtotal={cart.subtotal} />;
  return (
    <div className="font-sans text-brown bg-ivory min-h-full">
      <CheckoutHeader />
      {body}
    </div>
  );
}

function CheckoutView({ lines, subtotal }) {
  const { clear } = useCartActions();
  // Lazy initial state: saved address read once (rule rerender-lazy-state-init).
  const [values, setValues] = useState(() => ({ ...EMPTY, ...readSavedAddress() }));
  const [save, setSave] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentUrl, setSentUrl] = useState(null);
  const [orderRef] = useState(newOrderRef);
  const confirmRef = useRef(null);

  // Derived, never stored (rule rerender-derived-state-no-effect): errors show after the first submit.
  const errors = submitted ? validate(values) : {};
  const order = {
    ref: orderRef,
    lines: lines.map((l) => ({ name: l.name, sku: l.sku, qty: l.qty, lineTotal: l.lineTotal })),
    subtotal,
    contact: { mobile: values.mobile, email: values.email },
    address: values,
    note: values.note,
  };
  const message = buildOrderMessage(order);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setSentUrl(null); // the sent message no longer matches the form
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSubmitted(true);
    const errs = validate(values);
    const first = REQUIRED_ORDER.find((f) => errs[f]);
    if (first) {
      document.getElementById(ID[first])?.focus();
      return;
    }
    setSending(true);
    try {
      const url = await placeOrder(order);
      const m = normaliseMobile(values.mobile);
      if (save) saveAddress({ ...values, mobile: `${m.slice(0, 5)} ${m.slice(5)}` });
      else forgetAddress();
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url; // popup blocked: open WhatsApp in this tab
      setSentUrl(url);
      clear(); // the order now lives in WhatsApp; empty the cart (user decision)
      requestAnimationFrame(() => confirmRef.current?.focus());
    } finally {
      setSending(false);
    }
  };

  // Sent: confirmation screen (checked before the empty-cart state, because sending clears the cart).
  if (sentUrl) {
    return (
      <main className="max-w-lg mx-auto pt-8 px-4 pb-12 md:pt-12 md:px-8 md:pb-20">
        <div ref={confirmRef} tabIndex={-1} role="status"
          className="bg-success-bg rounded-md p-5 md:p-8 flex gap-3 md:gap-4 max-w-text outline-none">
          <Icon name="check" size={28} className="shrink-0 text-success" />
          <div className="flex flex-col items-start gap-4">
            <h1 className="m-0 type-h2">Your order is ready in WhatsApp</h1>
            <p className="m-0 text-[16px] leading-[1.6]">
              Press send in WhatsApp to place order {orderRef}. We will confirm availability, delivery and payment with you there.
              Your cart has been cleared.
            </p>
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-[16px] font-semibold">WhatsApp did not open? Open it again</a>
            <Button to="/sarees" className="mt-2">Continue shopping</Button>
          </div>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="max-w-lg mx-auto pt-8 px-4 pb-12 md:pt-12 md:px-8 md:pb-20">
        <h1 className="mt-0 mb-2 type-h1">Place your order</h1>
        <div className="mt-8 md:mt-10 bg-white border border-champagne rounded-md p-5 md:p-8 flex flex-col items-start gap-4 max-w-text">
          <h2 className="m-0 type-h3">Your cart is empty</h2>
          <p className="m-0 text-[16px] leading-[1.6]">Add a saree to your cart first, then come back here to send your order on WhatsApp.</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/sarees">Browse sarees</Button>
            <Button variant="secondary" to="/cart">Go to cart</Button>
          </div>
        </div>
      </main>
    );
  }

  const field = (key, extra = {}) => ({
    id: ID[key],
    name: key,
    value: values[key],
    onChange,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': describedBy(ID[key], { hint: extra.hint, error: errors[key] }),
  });

  return (
    <main className="max-w-lg mx-auto pt-8 px-4 pb-12 md:pt-12 md:px-8 md:pb-20">
      <h1 className="mt-0 mb-2 type-h1">Place your order</h1>
      <p className="mt-0 mb-8 md:mb-10 text-[16px] text-taupe-deep">Fill in your details and send the order to us on WhatsApp. There is no online payment: we confirm availability, delivery and payment with you directly.</p>


      <div className="flex flex-wrap gap-x-16 gap-y-10 items-start">
        <form id="checkout-form" noValidate onSubmit={onSubmit} className="flex-[999_1_560px] min-w-0 flex flex-col gap-6">

          <section className={sectionCls}>
            <SectionTitle n="1">Contact details</SectionTitle>
            <div className={gridCls}>
              <Field id={ID.mobile} label="Mobile number" hint="We will send order updates on SMS and WhatsApp." error={errors.mobile}>
                <div className={`flex h-12 border border-solid ${errors.mobile ? 'border-error' : 'border-stone'} rounded-md bg-white overflow-hidden has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-rosewood-dark has-[:focus-visible]:outline-offset-2`}>
                  <span className="flex items-center px-3 bg-cream border-r border-stone text-[16px]">+91</span>
                  <input {...field('mobile', { hint: true })} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98450 12345"
                    className="flex-1 min-w-0 border-0 py-0 px-3 font-sans font-normal text-[16px] leading-[normal] text-brown bg-transparent placeholder:text-taupe-deep focus-visible:outline-none" />
                </div>
              </Field>
              <Field id={ID.email} label="Email address" optional error={errors.email}>
                <input {...field('email')} type="email" autoComplete="email" placeholder="name@example.com" className={inputClass(errors.email)} />
              </Field>
            </div>
          </section>

          <section className={sectionCls}>
            <SectionTitle n="2">Delivery address</SectionTitle>
            <div className={gridCls}>
              <Field id={ID.name} label="Full name" error={errors.name}>
                <input {...field('name')} type="text" autoComplete="name" placeholder="e.g. Lakshmi Rao" className={inputClass(errors.name)} />
              </Field>
              <Field id={ID.pin} label="PIN code" hint="6 digits" error={errors.pin}>
                <input {...field('pin', { hint: true })} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="e.g. 560011" className={inputClass(errors.pin)} />
              </Field>
            </div>
            <Field id={ID.line1} label="House number, building and street" error={errors.line1}>
              <input {...field('line1')} type="text" autoComplete="address-line1" placeholder="e.g. No. 14, 2nd Cross, Gandhi Nagar" className={inputClass(errors.line1)} />
            </Field>
            <div className={gridCls}>
              <Field id={ID.area} label="Area or locality" error={errors.area}>
                <input {...field('area')} type="text" autoComplete="address-line2" placeholder="e.g. Jayanagar 4th Block" className={inputClass(errors.area)} />
              </Field>
              <Field id={ID.landmark} label="Landmark" optional>
                <input {...field('landmark')} type="text" placeholder="e.g. Near the temple" className={inputClass(false)} />
              </Field>
              <Field id={ID.city} label="City" error={errors.city}>
                <input {...field('city')} type="text" autoComplete="address-level2" placeholder="e.g. Bengaluru" className={inputClass(errors.city)} />
              </Field>
              <Field id={ID.state} label="State" error={errors.state}>
                <select {...field('state')} autoComplete="address-level1" className={inputClass(errors.state)}>
                  <option value="">Choose a state</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-3 min-h-11 text-[16px]">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="w-5 h-5 m-0 accent-rosewood-deep shrink-0" />
              Save this address for next time
            </label>
          </section>

          <section className={sectionCls}>
            <SectionTitle n="3">Send your order on WhatsApp</SectionTitle>
            {steps}
            <Field id={ID.note} label="Anything we should know?" optional hint="For example blouse stitching, a delivery date or a gift message.">
              <textarea {...field('note', { hint: true })} rows={2} placeholder="e.g. Please share a video of the pallu before dispatch."
                className="p-3 border border-solid border-stone rounded-md font-sans font-normal text-[16px] leading-[1.6] text-brown bg-white resize-y placeholder:text-taupe-deep" />
            </Field>
            <div className="flex flex-col gap-2">
              <span id="msg-label" className="text-[15px] font-medium">Message that will be sent to us</span>
              <div aria-labelledby="msg-label" role="region"
                className="p-5 bg-cream border border-champagne rounded-md text-[15px] leading-[1.6] whitespace-pre-line [overflow-wrap:anywhere]">{message}</div>
              <span className="text-[14px] text-taupe-deep">A copy of this order is also saved in your shop's admin, under Orders.</span>
            </div>
          </section>
        </form>

        <OrderSummary lines={lines} subtotal={subtotal} sending={sending} />
      </div>
    </main>
  );
}

function OrderSummary({ lines, subtotal, sending }) {
  const last = lines.length - 1;
  return (
    <aside aria-label="Order summary"
      className="flex-[1_1_320px] md:max-w-[420px] bg-white border border-champagne rounded-md p-5 md:p-8 box-border flex flex-col gap-4">
      <h2 className="mt-0 mb-2 type-h3">Your order</h2>
      {lines.map((l, i) => (
        <div key={l.id} className={`flex gap-4 items-start ${i === last ? 'pb-4 border-b border-champagne' : ''}`}>
          <img src={l.img} alt="" decoding="async" className="w-16 aspect-[3/4] object-cover rounded-sm shrink-0 block" />
          <div className="flex-1 flex flex-col gap-1 text-[15px] leading-[1.4]">
            <span className="font-medium">{l.name}</span>
            <span className="text-[14px] text-taupe-deep">Quantity {l.qty}</span>
          </div>
          <span className="text-[16px] font-medium">{inr(l.lineTotal)}</span>
        </div>
      ))}
      <div className="flex justify-between text-[16px]"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
      <div className="flex justify-between text-[16px]"><span>Delivery</span><span className="text-taupe-deep">We confirm on WhatsApp</span></div>
      <div className="flex justify-between items-baseline pt-4 border-t border-champagne">
        <span className="text-[17px] font-semibold">Order total</span>
        <span className="text-[26px] font-medium">{inr(subtotal)}</span>
      </div>
      <span className="text-[14px] text-taupe-deep -mt-2">Inclusive of all taxes</span>
      <button type="submit" form="checkout-form" disabled={sending} aria-busy={sending || undefined}
        className="vs-btn-primary flex items-center justify-center gap-2.5 w-full h-14 mt-2 bg-cta text-white border-0 rounded-md font-sans text-[16px] font-semibold tracking-[0.02em] cursor-pointer disabled:cursor-wait">
        <Icon name="whatsapp" size={22} />Send order on WhatsApp
      </button>
      <span className="text-[14px] leading-[1.5] text-taupe-deep text-center">WhatsApp opens with your order ready to send. By sending, you agree to our <a href="#">terms of sale</a>.</span>
    </aside>
  );
}
