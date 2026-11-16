// Contact details shown across the site. Varnika is online-only (no physical store), so there is
// deliberately no address, city, opening hours or email here — see "Feature scope" in CLAUDE.md.
export const store = {
  phone: '7893 98 26 66',
  // International format for wa.me / tel: links (India +91).
  whatsappNumber: '917893982666',
};

export const telHref = `tel:+${store.whatsappNumber}`;
export const whatsappHref = (text) =>
  `https://wa.me/${store.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const MAX_QTY_PER_ITEM = 5;
