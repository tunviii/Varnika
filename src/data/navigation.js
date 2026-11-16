// Site navigation from the design headers/footers. `c` is the category key read by the Category page.
export const categoryHref = (c) => `/sarees?c=${c}`;

// Homepage desktop header (Main.dc.html)
export const homeNav = [
  { label: 'New arrivals', to: categoryHref('new'), c: 'new' },
  { label: 'Silk sarees', to: categoryHref('silk'), c: 'silk' },
  { label: 'Cotton sarees', to: categoryHref('cotton'), c: 'cotton' },
  { label: 'Kanjivaram', to: categoryHref('kanjivaram'), c: 'kanjivaram' },
  { label: 'Banarasi', to: categoryHref('banarasi'), c: 'banarasi' },
  { label: 'Wedding', to: categoryHref('wedding'), c: 'wedding' },
  { label: 'Our story', to: '#' },
  { label: 'Contact us', to: '/#contact' },
];

// Compact header on Category / Product / Cart (Category.dc.html)
export const storeNav = [
  { label: 'New arrivals', to: categoryHref('new'), c: 'new' },
  { label: 'Silk sarees', to: categoryHref('silk'), c: 'silk' },
  { label: 'Cotton sarees', to: categoryHref('cotton'), c: 'cotton' },
  { label: 'Wedding', to: categoryHref('wedding'), c: 'wedding' },
  { label: 'Contact us', to: '/#contact' },
];

// Mobile homepage chip row (Mobile-Home.dc.html)
export const mobileChips = [
  { label: 'New arrivals', to: categoryHref('new') },
  { label: 'Silk', to: categoryHref('silk') },
  { label: 'Cotton', to: categoryHref('cotton') },
  { label: 'Wedding', to: categoryHref('wedding') },
];

// Full footer (Main.dc.html)
export const footerShop = [
  { label: 'New arrivals', to: categoryHref('new') },
  { label: 'Silk sarees', to: categoryHref('silk') },
  { label: 'Cotton sarees', to: categoryHref('cotton') },
  { label: 'Wedding sarees', to: categoryHref('wedding') },
];
export const footerHelp = ['Shipping and delivery', 'Returns and exchanges', 'Saree care', 'My account'];

// Mobile footer: two columns, read row by row (Mobile-Home.dc.html)
export const mobileFooterLinks = [
  { label: 'New arrivals', to: categoryHref('new') },
  { label: 'Shipping', to: '#' },
  { label: 'Silk sarees', to: categoryHref('silk') },
  { label: 'Returns', to: '#' },
  { label: 'Cotton sarees', to: categoryHref('cotton') },
  { label: 'My account', to: '#' },
];
