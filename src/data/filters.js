// Filter options from Category.dc.html renderVals(). Swatch hexes are product data (the saree colours),
// not UI colours, so they stay as values here. `short` is the two-column label in the mobile sheet.
export const fabricNames = ['Kanjivaram', 'Banarasi', 'Paithani', 'Chanderi', 'Tussar', 'Soft silk'];

export const colourList = [
  { label: 'Red and maroon', short: 'Red, maroon', hex: '#8a2a2e' },
  { label: 'Pink', hex: '#d9849a' },
  { label: 'Green', hex: '#4f7a4a' },
  { label: 'Blue', hex: '#2f4f7a' },
  { label: 'Purple', hex: '#5e3a7a' },
  { label: 'Yellow and mustard', short: 'Yellow, mustard', hex: '#c9962e' },
  { label: 'Cream and ivory', short: 'Cream, ivory', hex: '#efe6d6' },
];

export const priceOpts = [
  { id: 'any', label: 'Any price', test: () => true },
  { id: 'u5', label: 'Under ₹5,000', test: (p) => p < 5000 },
  { id: '5-10', label: '₹5,000 to ₹10,000', test: (p) => p >= 5000 && p <= 10000 },
  { id: '10-20', label: '₹10,000 to ₹20,000', test: (p) => p > 10000 && p <= 20000 },
  { id: 'o20', label: 'Above ₹20,000', test: (p) => p > 20000 },
];

export const sortOpts = [
  { id: 'newest', label: 'Newest first', short: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high', short: 'Low to high' },
  { id: 'price-desc', label: 'Price: high to low', short: 'High to low' },
];

export const emptyFilters = { fabrics: [], colours: [], price: 'any', inStock: false };
