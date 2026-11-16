# Varnika Sarees – frontend

## Run it
```
npm install
npm run dev        # open http://localhost:5173
npm run build      # production files in dist/
```

## Folders
- `design-reference/screens/` – the 10 screens exported from your Claude design canvas (source of truth)
- `design-reference/tokens.json` – your design system (colours, type, spacing, with usage rules)
- `public/images/` – the product photos, brand photo and both logos used in the design
- `src/styles/tokens.css` – the design system as CSS variables (generated from tokens.json)
- `src/data/products.js` – product data from the design
- `src/components/ProductCard.jsx` – first component, converted exactly from the design
- `src/pages/` – one file per page, ready to be filled in
- `CLAUDE.md` – conversion rules (Claude Code reads this automatically)

## Changes in this version
- Real Varnika logos replace the logo placeholders on every screen
- Homepage buttons and cart count now use the logo maroon (#850219)
- Checkout is now "Place your order": orders are sent on WhatsApp, no online payment
- Cart wording updated to match ("Continue to place order", "Ask a question on WhatsApp")
