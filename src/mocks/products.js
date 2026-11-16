// Mock catalogue, taken from the design screens' renderVals() data.
// Served by src/api/*.js; replace those functions with real fetch() calls when the backend exists.

// Badge kinds map to the design's fills: New arrival → sage, Featured → dusty rose.
export const products = [
  {
    id: 'red-kanjivaram', sku: 'VS-KJ-0142', name: 'Red Kanjivaram silk saree', fabric: 'Kanjivaram',
    line: 'Pure silk · gold zari border', colour: 'Red and maroon', price: 18500, stock: 4,
    img: '/images/red-kanjivaram.jpg', alt: 'Red Kanjivaram silk saree with a broad gold zari border, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', badge: 'new', newArrival: true, collection: 'kanjivaram', status: 'published',
  },
  {
    id: 'emerald-kanjivaram', sku: 'VS-KJ-0150', name: 'Emerald Kanjivaram silk saree', fabric: 'Kanjivaram',
    line: 'Pure silk · paisley zari border', colour: 'Green', price: 21000, stock: 3,
    img: '/images/emerald-kanjivaram.jpg', alt: 'Emerald Kanjivaram silk saree with a gold paisley border, worn and draped',
    pos: '50% 50%', thumbPos: '50% 25%', collection: 'kanjivaram', status: 'published',
  },
  {
    id: 'magenta-banarasi', sku: 'VS-BN-0087', name: 'Magenta Banarasi silk saree', fabric: 'Banarasi',
    line: 'Katan silk · gold brocade', colour: 'Pink', price: 14200, stock: 2,
    img: '/images/magenta-banarasi.jpg', alt: 'Magenta Banarasi silk saree with gold brocade, worn and draped',
    pos: '62% 50%', thumbPos: '62% 25%', badge: 'featured', newArrival: true, collection: 'banarasi', status: 'published',
  },
  {
    id: 'navy-banarasi', sku: 'VS-BN-0091', name: 'Navy Banarasi silk saree', fabric: 'Banarasi',
    line: 'Katan silk · butti weave', colour: 'Blue', price: 16750, stock: 1,
    img: '/images/navy-banarasi.jpg', alt: 'Navy Banarasi silk saree with gold butti weave, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', collection: 'banarasi', status: 'published',
  },
  {
    id: 'purple-paithani', sku: 'VS-PT-0019', name: 'Purple Paithani silk saree', fabric: 'Paithani',
    line: 'Pure silk · peacock pallu', colour: 'Purple', price: 19800, mrp: 22000, stock: 2,
    img: '/images/purple-paithani.jpg', alt: 'Purple Paithani silk saree with a gold peacock pallu, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', badge: 'featured', collection: 'kanjivaram', status: 'published',
  },
  {
    id: 'ivory-chanderi', sku: 'VS-CH-0033', name: 'Ivory Chanderi silk saree', fabric: 'Chanderi',
    line: 'Chanderi silk-cotton', colour: 'Cream and ivory', price: 6800, mrp: 7500, stock: 7,
    img: '/images/ivory-chanderi.jpg', alt: 'Ivory Chanderi silk saree with a gold border, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', newArrival: true, collection: 'chanderi', status: 'published',
  },
  {
    id: 'blush-chanderi', sku: 'VS-CH-0058', name: 'Blush pink Chanderi saree', fabric: 'Chanderi',
    line: 'Chanderi silk-cotton · zari buttis', colour: 'Pink', price: 7400, stock: 0,
    img: '/images/blush-chanderi.jpg', alt: 'Blush pink Chanderi saree with zari buttis, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', collection: 'chanderi', status: 'published',
  },
  {
    id: 'natural-tussar', sku: 'VS-TS-0210', name: 'Natural Tussar silk saree', fabric: 'Tussar',
    line: 'Tussar silk · woven border', colour: 'Cream and ivory', price: 8600, stock: 5,
    img: '/images/natural-tussar.jpg', alt: 'Natural Tussar silk saree with a woven border, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', newArrival: true, collection: 'tussar', status: 'published',
  },
  {
    id: 'sage-soft-silk', sku: 'VS-SS-0064', name: 'Sage green soft silk saree', fabric: 'Soft silk',
    line: 'Soft silk · zari jaal', colour: 'Green', price: 9800, stock: 6,
    img: '/images/sage-soft-silk.jpg', alt: 'Sage green soft silk saree with fine zari jaal, worn and draped',
    pos: '50% 50%', thumbPos: '50% 22%', collection: 'chanderi', status: 'published',
  },
];

// Homepage "Shop by collection" (Main.dc.html / Mobile-Home.dc.html).
export const collections = [
  { id: 'kanjivaram', name: 'Kanjivaram silk', note: 'Rich zari borders for weddings', img: '/images/emerald-kanjivaram.jpg', alt: 'Emerald Kanjivaram silk saree with a gold paisley border, worn and draped', pos: '50% 40%' },
  { id: 'banarasi', name: 'Banarasi weaves', note: 'Brocade pallus and fine motifs', img: '/images/navy-banarasi.jpg', alt: 'Navy Banarasi silk saree with gold butti weave, worn and draped', pos: '50% 35%' },
  { id: 'tussar', name: 'Tussar and handloom', note: 'Textured, natural, easy to wear', img: '/images/natural-tussar.jpg', alt: 'Natural Tussar silk saree with a woven border, worn and draped', pos: '50% 30%' },
  { id: 'chanderi', name: 'Chanderi and soft silk', note: 'Light silks for festivals and functions', img: '/images/blush-chanderi.jpg', alt: 'Blush pink Chanderi saree with zari buttis, worn and draped', pos: '50% 35%' },
];

// The homepage "New arrivals" grid order from the design.
export const newArrivalIds = ['red-kanjivaram', 'ivory-chanderi', 'magenta-banarasi', 'natural-tussar'];
