// Design source: design-reference/screens/Category.dc.html (desktop),
// Category-Mobile.dc.html + Filters-Mobile.dc.html (<768px)
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import Button from '../components/Button.jsx';
import FilterGroups from '../components/FilterGroups.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PageError, PageLoading } from '../components/PageStatus.jsx';
import { getProducts } from '../api/products.js';
import { useApi } from '../lib/useApi.js';
import { activeChips, applyFilters, sortLabel, sortProducts } from '../lib/filterProducts.js';
import { allSarees, categories, searchCategory } from '../data/categories.js';
import { emptyFilters, sortOpts } from '../data/filters.js';
import { whatsappHref } from '../config.js';

const askHref = whatsappHref('Hello Varnika, I am looking for a saree I could not find on the website.');

export default function Category() {
  const [params] = useSearchParams();
  const c = params.get('c');
  const q = params.get('q')?.trim();
  const category = q ? searchCategory(q) : categories[c] ?? allSarees;
  const { data: products, error, loading } = useApi('products', getProducts);

  if (error) return <PageError error={error} />;
  if (loading) return <PageLoading />;
  // A new category or search starts with fresh filters.
  return <CategoryView key={`${c}|${q}`} category={category} products={products} />;
}

function CategoryView({ category, products }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState('newest');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Everything below is derived from props + state (rule rerender-derived-state-no-effect).
  const base = useMemo(() => products.filter(category.match), [products, category]);
  const items = useMemo(() => sortProducts(applyFilters(base, filters), sort), [base, filters, sort]);
  const counts = useMemo(() => {
    const m = new Map();
    for (const p of base) m.set(p.fabric, (m.get(p.fabric) ?? 0) + 1);
    return m;
  }, [base]);
  const chips = activeChips(filters);
  const hasActive = chips.length > 0;
  const clearAll = useCallback(() => setFilters(emptyFilters), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <main className="md:max-w-lg md:mx-auto md:pt-6 md:px-8 md:pb-20">
      <div className="pt-4 px-4 pb-2 md:p-0">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: category.title }]} />
        <div className="md:pt-6 md:pb-10 md:flex md:flex-col md:gap-3 md:max-w-text">
          <h1 className="mt-3 mb-2 md:m-0 type-h1">{category.title}</h1>
          <p className="m-0 text-[16px] leading-[1.6]">
            {category.introMobile ? (
              <>
                <span className="md:hidden">{category.introMobile}</span>
                <span className="hidden md:inline">{category.intro}</span>
              </>
            ) : category.intro}
          </p>
        </div>
      </div>

      {/* Mobile: sticky filter / sort bar */}
      <div className="md:hidden sticky top-0 z-[100] bg-ivory border-b border-champagne py-3 px-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setSheetOpen(true)} aria-haspopup="dialog"
          className="box-content flex items-center justify-center gap-2 h-12 p-0 bg-white border border-solid border-stone rounded-md text-brown font-sans text-[15px] font-semibold cursor-pointer">
          <Icon name="filter" size={20} />Filters{hasActive ? ` (${chips.length})` : ''}
        </button>
        <label className="relative flex items-center justify-center gap-2 h-12 bg-white border border-solid border-stone rounded-md text-brown text-[15px] font-semibold box-border">
          <Icon name="sort" size={20} />Sort: {sortLabel(sort).short}
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            {sortOpts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
      </div>

      <div className="md:flex md:flex-wrap md:gap-10 md:items-start">
        {/* Desktop filters */}
        <aside aria-label="Filters" className="hidden md:flex flex-[1_1_240px] max-w-[280px] flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-champagne">
            <h2 className="m-0 text-[18px] font-semibold">Filters</h2>
            {hasActive ? <ClearAllButton onClick={clearAll} /> : null}
          </div>
          <FilterGroups size="sidebar" idPrefix="d" filters={filters} onChange={setFilters} counts={counts} />
        </aside>

        {/* Results */}
        <section aria-label="Products" className="md:flex-[999_1_560px] md:min-w-0 md:flex md:flex-col md:gap-6">
          <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
            <span className="text-[16px]" aria-live="polite"><strong className="font-semibold">{items.length}</strong> sarees</span>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-[15px] font-medium">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}
                className="h-11 px-3 min-w-[200px] border border-solid border-stone rounded-md bg-white font-sans font-normal text-[16px] text-brown">
                {sortOpts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Mobile count + chips */}
          <div className="md:hidden pt-4 px-4 flex flex-wrap items-center gap-2">
            <span className="text-[15px]" aria-live="polite"><strong className="font-semibold">{items.length}</strong> sarees</span>
            {chips.map((ch) => <Chip key={ch.key} chip={ch} onRemove={setFilters} />)}
          </div>

          {hasActive ? (
            <div className="hidden md:flex flex-wrap items-center gap-2">
              <span className="text-[14px] text-taupe-deep mr-1">Showing:</span>
              {chips.map((ch) => <Chip key={ch.key} chip={ch} onRemove={setFilters} />)}
            </div>
          ) : null}

          <div className="pt-6 px-4 pb-12 md:p-0 md:flex md:flex-col md:gap-6">
            {items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-x-6 md:gap-y-10">
                  {items.map((p) => <ProductCard key={p.id} product={p} variant="listing" />)}
                </div>
                <div className="hidden md:flex flex-col items-center gap-3 pt-6">
                  <span className="text-[14px] text-taupe-deep">You have seen all {items.length} sarees</span>
                  <Button variant="secondary" href={askHref} target="_blank" rel="noreferrer">Ask us about a saree you cannot find</Button>
                </div>
                <div className="md:hidden flex flex-col items-stretch gap-3 pt-10 text-center">
                  <span className="text-[14px] text-taupe-deep">Cannot find what you are looking for?</span>
                  <Button variant="secondary" href={askHref} target="_blank" rel="noreferrer" className="flex justify-center tracking-normal">
                    <Icon name="whatsapp" size={20} />Ask us on WhatsApp
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-16 px-6 bg-cream rounded-md flex flex-col items-center gap-4 text-center">
                <h3 className="m-0 type-h3">{hasActive ? 'No sarees match these filters' : 'No sarees here yet'}</h3>
                <p className="m-0 max-w-[440px] text-[16px] leading-[1.6]">
                  {hasActive
                    ? 'Try removing a filter, or message us on WhatsApp and we will look through new stock for you.'
                    : 'New stock arrives often. Message us on WhatsApp and we will tell you what is coming in.'}
                </p>
                {hasActive ? (
                  <Button onClick={clearAll} className="tracking-normal">Clear all filters</Button>
                ) : (
                  <Button href={askHref} target="_blank" rel="noreferrer" className="tracking-normal">Ask us on WhatsApp</Button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <FilterSheet open={sheetOpen} onClose={closeSheet} applied={filters} onApply={setFilters} base={base} counts={counts} />
    </main>
  );
}

function ClearAllButton({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="h-11 p-0 bg-transparent border-0 text-rosewood-deep font-sans text-[15px] font-semibold underline underline-offset-4 cursor-pointer">
      Clear all
    </button>
  );
}

function Chip({ chip, onRemove }) {
  return (
    <button type="button" onClick={() => onRemove(chip.remove)} aria-label={`Remove filter ${chip.label}`}
      className="inline-flex items-center gap-2 h-10 px-3 bg-blush border border-solid border-dusty-rose hover:border-brown rounded-md text-brown font-sans text-[15px] font-medium cursor-pointer">
      {chip.label}
      <Icon name="close" size={16} />
    </button>
  );
}

// Mobile filters: edits a draft; "Show N sarees" applies it, Close discards it.
function FilterSheet({ open, onClose, applied, onApply, base, counts }) {
  if (!open) return null;
  return <FilterSheetBody onClose={onClose} applied={applied} onApply={onApply} base={base} counts={counts} />;
}

function FilterSheetBody({ onClose, applied, onApply, base, counts }) {
  const [draft, setDraft] = useState(applied);
  const n = useMemo(() => applyFilters(base, draft).length, [base, draft]);
  return (
    <BottomSheet open onClose={onClose} labelledBy="sheet-title">
      <div className="flex items-center justify-between py-2 pr-2 pl-5 border-b border-champagne">
        <h2 id="sheet-title" className="m-0 text-[20px] font-semibold">Filters</h2>
        <button type="button" onClick={onClose}
          className="flex items-center gap-1.5 h-12 px-3 bg-transparent border-0 text-brown font-sans text-[15px] font-semibold cursor-pointer">
          <Icon name="close" size={22} />Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5">
        <FilterGroups size="sheet" idPrefix="m" filters={draft} onChange={setDraft} counts={counts} />
      </div>
      <div className="grid grid-cols-[1fr_1.6fr] gap-3 pt-3 px-5 pb-5 border-t border-champagne bg-white">
        <button type="button" onClick={() => setDraft(emptyFilters)}
          className="vs-btn-secondary h-[52px] bg-transparent border border-solid border-stone rounded-md text-brown font-sans text-[15px] font-semibold cursor-pointer">
          Clear all
        </button>
        <button type="button" onClick={() => { onApply(draft); onClose(); }}
          className="vs-btn-primary flex items-center justify-center h-[52px] bg-cta border-0 rounded-md text-white font-sans text-[15px] font-semibold tracking-[0.02em] cursor-pointer">
          Show {n} {n === 1 ? 'saree' : 'sarees'}
        </button>
      </div>
    </BottomSheet>
  );
}
