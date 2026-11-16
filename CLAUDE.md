# Converting the Varnika Sarees design to React

The approved design lives in `design-reference/`. It is the source of truth: match it exactly.

## How to read a design screen (`design-reference/screens/*.dc.html`)
- The visible markup is inside `<x-dc>…</x-dc>`. Everything outside it (support.js, `<helmet>`) is tooling, except the
  `<helmet><style>` rules, which are already in `src/styles/global.css`.
- `<sc-for list="{{items}}" as="p">…</sc-for>` → `items.map((p) => …)`
- `<sc-if value="{{x}}">…</sc-if>` → `{x && (…)}`
- `{{p.name}}` → `{p.name}`
- The data for each screen is in the `<script type="text/x-dc" data-dc-script>` block at the bottom
  (`renderVals()` returns the values; `this.state` / `setState` → `useState`). Move data into `src/data/`.
- Links like `href="Cart.dc.html"` → `<Link to="/cart">` (route map is in `src/App.jsx`).
- Inline `style="a: b; c-d: e"` → `style={{ a: 'b', cD: 'e' }}`. `class` → `className`, `for` → `htmlFor`,
  SVG `stroke-width` → `strokeWidth` etc.
- Replace hex colours with the CSS variables in `src/styles/tokens.css` (e.g. `#55433d` → `var(--brown)`).
- Logos: `public/images/logo.png` (header, 64px tall desktop / 48px mobile) and
  `public/images/logo-with-tagline.png` (footer). The design files already point to them.
- Homepage only: primary buttons and the cart count use `var(--home-cta)` (#850219, hover #6b0114).
  Wrap the homepage in `<main className="home">`. All other pages keep `var(--action-primary)`.
- Ordering is by WhatsApp, with NO online payment (see Cart.dc.html and Checkout.dc.html, "Place your order").
  The final button should open `https://wa.me/<number>?text=<encoded order summary>`.
- `[PLACEHOLDER]` text is intentional: keep it until the owner supplies the real value. Exceptions are listed
  under "Feature scope" below (phone supplied; store-location placeholders removed).

## Rules
- Keep spacing, font sizes, colours, radii and breakpoints exactly as in the design and `design-reference/tokens.json`
  (its `usage` notes explain where each token is allowed).
- Desktop and mobile artboards are the SAME page at different widths. Build one responsive component per page,
  using the desktop file as the base and the mobile file for <768px behaviour.
- Extract repeated parts into `src/components/` (Header, Footer, AnnouncementBar, ProductCard, Button, Badge, …).
  `src/components/ProductCard.jsx` is the reference conversion; follow its pattern.
- Frontend only: no backend, no payment gateway. Cart state can live in React context.

## React best practices
Follow the Vercel React best-practices guide in `react-best-practices/` when writing, reviewing or refactoring code.
- Start with `react-best-practices/SKILL.md` (index of all rules by priority). Open the specific file in
  `react-best-practices/rules/<rule-id>.md` for examples before applying a rule. `AGENTS.md` is the full compiled guide (large; read only the sections you need).
- The design rules above win if a best-practice rule would change the visual output.
- This is a **Vite + React 18 SPA** (client-only, react-router). Apply the rules accordingly:
  - **Apply:** `bundle-*` (use `React.lazy` + `<Suspense>` for route-level code splitting instead of `next/dynamic`),
    `client-*`, `rerender-*`, `rendering-*`, `js-*`, `advanced-event-handler-refs`, `advanced-init-once`, `advanced-use-latest`.
  - **Especially relevant here:** `rerender-no-inline-components`, `rerender-derived-state-no-effect` (cart totals are
    derived, not stored), `rerender-functional-setstate` (cart updates), `client-localstorage-schema` (if the cart is
    persisted: versioned key, try/catch), `rendering-conditional-render` (when converting `<sc-if>`, use a ternary
    instead of `&&` if the value can be `0`, e.g. cart count), `rendering-hoist-jsx`, `bundle-barrel-imports`.
  - **Skip (not applicable):** `server-*`, `async-api-routes`, `rendering-hydration-*` (no SSR / Next.js);
    `rendering-activity` and `advanced-effect-event-deps` need React 19 (this project is on React 18).

## Feature scope (agreed with the owner, 2026-11-16)

### Built
- Storefront: Home `/`, Category `/sarees` (`?c=<category>` or `?q=<search>`), Product `/product/:id`, Cart `/cart`,
  Checkout `/checkout` (order sent on WhatsApp, no payment).
- Admin: products list `/admin/products`, add product `/admin/products/new` (shared `AdminLayout`).
- Data comes only through the async functions in `src/api/` (mock data in `src/mocks/`). To connect the backend,
  replace those functions with `fetch()` calls; pages and components must not import `src/mocks/` directly.

### Decisions
- **Online-only business, no physical store.** Never show a store address, city, opening hours, email or reply time.
  The design's `[CITY]`, `[DAYS]`, `[HOURS]`, `[OPENING HOURS]`, `[STORE ADDRESS, CITY]`, `[EMAIL ADDRESS]` and
  `[REPLY TIME]` are dropped, not placeholders. Contact is phone/WhatsApp only: 7893 98 26 66 (`src/config.js`).
- Still placeholders (keep until supplied): delivery time `[2–3]` working days, `[Returns policy, e.g. 7-day exchange]`,
  the brand-story paragraph, `[Owner name]` in admin.
- Checkout clears the cart as soon as WhatsApp opens with the order, then shows a confirmation with "Open it again".
- Product page "Add to cart" stays on the page and shows "Added to cart · View cart".
- One consistent store header on Category / Product / Cart (the small per-screen nav differences in the designs are ignored).
- One catalogue for every page (e.g. Magenta Banarasi is Featured and Ivory Chanderi shows MRP ₹7,500 everywhere).
- New admin products default to **Published**.
- Images will come from the backend. Keep them fast: the above-the-fold image (home hero, product main photo) gets
  `fetchpriority="high"`; everything else `loading="lazy"` + `decoding="async"`; every image sits in an aspect-ratio box
  (no layout shift); pass `srcSet`/`sizes` through when the API provides `srcSet`.

### Not in scope yet (links stay `#` until designed)
- Sign in / My account, Our story, footer pages (Shipping, Returns, Saree care, Privacy policy, Terms of sale), Instagram.
- Admin: Dashboard, Orders, Enquiries, Collections, Settings, editing an existing product, admin authentication.
- Backend work: persistence, photo upload, real order numbers, stock updates.

### Implementation notes
- Tailwind v4 **without preflight** (`src/styles/index.css`): the design relies on browser defaults. Only design tokens
  exist as utilities (no default palette). `leading-normal` is 1.5 in Tailwind; use `leading-[normal]` for the CSS keyword.
- Visual checks: render the design and compare with the app at 1440px and 390px before calling a page done.
