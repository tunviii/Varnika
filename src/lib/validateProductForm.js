// Client-side validation for the admin "Add product" form.
// Each error has `summary` (the lower-case link text in the error summary) and `message` (inline).

// Field order = form order, so the error summary lists problems top to bottom.
export const fieldIds = { name: 'p-name', price: 'p-price', mrp: 'p-mrp', sku: 's-sku', stock: 's-qty' };

// "18,500", "₹ 18500" → "18500"
export const cleanRupees = (v) => v.replace(/[₹,\s]/g, '');
const wholeNumber = /^\d+$/;
const skuPattern = /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/;

export function validateProductForm(v) {
  const e = {};
  if (!v.name.trim()) {
    e.name = { summary: 'enter a product name', message: 'Enter a product name, for example Maroon Kanjivaram silk saree' };
  }

  const price = cleanRupees(v.price);
  if (!price) {
    e.price = { summary: 'enter a selling price', message: 'Enter a selling price, for example 18500' };
  } else if (!wholeNumber.test(price) || Number(price) <= 0) {
    e.price = { summary: 'enter the selling price in whole rupees', message: 'Enter the selling price in whole rupees, for example 18500' };
  }

  const mrp = cleanRupees(v.mrp);
  if (mrp && (!wholeNumber.test(mrp) || (!e.price && Number(mrp) <= Number(price)))) {
    e.mrp = { summary: 'check the original price', message: 'Original price must be in whole rupees and higher than the selling price' };
  }

  const sku = v.sku.trim().toUpperCase();
  if (!sku) {
    e.sku = { summary: 'enter a SKU', message: 'Enter a SKU, for example VS-KJ-0150' };
  } else if (!skuPattern.test(sku)) {
    e.sku = { summary: 'check the SKU format', message: 'Use capital letters, numbers and hyphens, for example VS-KJ-0150' };
  }

  if (v.stock.trim() === '') {
    e.stock = { summary: 'enter the quantity in stock', message: 'Enter the quantity in stock, 0 or more' };
  } else if (!wholeNumber.test(v.stock.trim())) {
    e.stock = { summary: 'enter a whole number for the quantity', message: 'Enter a whole number of 0 or more' };
  }
  return e;
}

const counts = ['', 'One thing', 'Two things', 'Three things', 'Four things', 'Five things'];
export const summaryTitle = (n) => `${counts[n] ?? `${n} things`} to fix before saving:`;
