// "Save this address for next time" (Checkout). Versioned key + try/catch, and only the fields the
// form needs are stored (rule client-localstorage-schema).
const KEY = 'vs-checkout-address:v1';
export const ADDRESS_FIELDS = ['mobile', 'email', 'name', 'pin', 'line1', 'area', 'landmark', 'city', 'state'];

export function readSavedAddress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!parsed || typeof parsed !== 'object') return null;
    const out = {};
    for (const f of ADDRESS_FIELDS) if (typeof parsed[f] === 'string') out[f] = parsed[f];
    return out;
  } catch {
    return null;
  }
}

export function saveAddress(values) {
  try {
    const out = {};
    for (const f of ADDRESS_FIELDS) out[f] = values[f] ?? '';
    localStorage.setItem(KEY, JSON.stringify(out));
  } catch { /* storage full or blocked */ }
}

export function forgetAddress() {
  try { localStorage.removeItem(KEY); } catch { /* blocked */ }
}
