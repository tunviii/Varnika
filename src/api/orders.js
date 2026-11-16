import { mock } from './client.js';
import { whatsappHref } from '../config.js';
import { inr } from '../lib/format.js';

// Orders are placed on WhatsApp: there is no online payment (CLAUDE.md). placeOrder() returns the
// wa.me URL with the order summary; when a backend exists it can also save the order (admin → Orders)
// and return the real order number.

// Indian mobile: 10 digits starting 6–9. Accepts spaces, +91 / 91 / 0 prefixes.
export function normaliseMobile(value) {
  let d = String(value ?? '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export const formatMobile = (digits) => `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

export const isValidPin = (value) => /^[1-9]\d{5}$/.test(String(value ?? '').trim());

// Temporary reference until the backend issues order numbers (design: "Order VS-1042").
export const newOrderRef = () => `VS-${Date.now().toString(36).slice(-6).toUpperCase()}`;

// order: { ref, lines: [{ name, sku, qty, lineTotal }], subtotal,
//          contact: { mobile, email }, address: { name, line1, area, landmark, city, state, pin }, note }
export function buildOrderMessage({ ref, lines, subtotal, contact, address, note }) {
  const t = (s) => (s ?? '').trim();
  const mobile = normaliseMobile(contact.mobile);
  const place = [t(address.line1), t(address.area), t(address.landmark), t(address.city)].filter(Boolean);
  const statePin = [t(address.state), t(address.pin)].filter(Boolean).join(' ');
  if (statePin) place.push(statePin);

  const out = [
    'New order from the Varnika website',
    `Order ${ref}`,
    '',
    ...lines.map((l) => `${l.qty} × ${l.name}${l.sku ? ` (${l.sku})` : ''} · ${inr(l.lineTotal)}`),
    `Order total: ${inr(subtotal)} (delivery charge confirmed on WhatsApp)`,
    '',
    `Name: ${t(address.name)}`,
    `Mobile: ${mobile ? formatMobile(mobile) : t(contact.mobile)}`,
  ];
  if (t(contact.email)) out.push(`Email: ${t(contact.email)}`);
  out.push(`Deliver to: ${place.join(', ')}`);
  if (t(note)) out.push(`Note: ${t(note)}`);
  return out.join('\n');
}

export async function placeOrder(order) {
  return mock(whatsappHref(buildOrderMessage(order)));
}
