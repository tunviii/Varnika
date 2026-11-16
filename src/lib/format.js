export const inr = (n) => '₹' + n.toLocaleString('en-IN');

export const stockLabel = (stock) =>
  stock === 0 ? { text: 'Sold out', tone: 'error' }
  : stock <= 2 ? { text: `Only ${stock} left`, tone: 'warning' }
  : { text: 'In stock', tone: 'success' };

// Text colour class for each status tone (literal strings so Tailwind can see them).
export const toneText = { success: 'text-success', warning: 'text-warning', error: 'text-error' };
