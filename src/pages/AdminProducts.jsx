// Design source: design-reference/screens/Admin-Products.dc.html
// Rendered inside AdminLayout's <main> (sidebar + main are the layout's), so this returns a fragment.
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getAdminProducts } from '../api/admin.js';
import { useApi } from '../lib/useApi.js';
import { inr } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { PageError, PageLoading } from '../components/PageStatus.jsx';

const PAGE_SIZE = 6; // the design shows rows 1–6

// Design options first; categories created later in the add form are appended from the data.
const baseCategories = ['Silk sarees', 'Cotton sarees'];
const statusOptions = [
  ['published', 'Published'],
  ['draft', 'Draft'],
  ['sold-out', 'Sold out'],
  ['low-stock', 'Low stock'], // not in the design's option list, added so every badge can be filtered
];

const control = 'h-[44px] px-3 border border-solid border-stone rounded-md font-sans text-[16px] font-normal leading-[normal] text-brown bg-white';
const fieldLabel = 'text-[15px] font-medium';
const th = 'py-3 px-4 text-[14px] font-semibold';
const td = 'py-3 px-4';
const pager = 'inline-flex items-center h-[44px] px-4 border border-solid border-stone rounded-md bg-transparent text-brown font-sans text-[15px] font-medium box-border cursor-pointer disabled:cursor-default';

function matches(p, { q, cat, status }) {
  if (cat && p.category !== cat) return false;
  if (status && p.adminStatus !== status) return false;
  if (!q) return true;
  const hay = `${p.name} ${p.sku}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

export default function AdminProducts() {
  const { data: products, error, loading } = useApi('admin:products', getAdminProducts);
  const [params, setParams] = useSearchParams();
  const notice = useNotice();

  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? '';
  const status = params.get('status') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const all = products ?? [];
  // Derived values (rule rerender-derived-state-no-effect)
  const attention = useMemo(() => all.filter((p) => p.adminStatus !== 'published').length, [all]);
  const categories = useMemo(
    () => [...new Set([...baseCategories, ...all.map((p) => p.category)])],
    [all],
  );
  const filtered = useMemo(() => all.filter((p) => matches(p, { q, cat, status })), [all, q, cat, status]);

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const hasFilters = Boolean(q || cat || status);

  const setFilter = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.delete('page');
      return next;
    }, { replace: true });
  const goTo = (n) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (n > 1) next.set('page', String(n)); else next.delete('page');
      return next;
    });

  return (
    <>
      {notice ? (
        <div role="status" className="flex items-start gap-3 p-4 rounded-md bg-success-bg text-success text-[15px] leading-[1.5]">
          <Icon name="check" size={20} className="shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-display font-medium text-[34px] leading-[1.15]">Products</h1>
          <span className="text-[14px] text-taupe-deep">
            {all.length} {all.length === 1 ? 'product' : 'products'} · {attention} need attention
          </span>
        </div>
        <Link to="/admin/products/new"
          className="vs-btn-primary inline-flex items-center gap-2 h-12 px-5 bg-cta text-white hover:text-white rounded-md no-underline text-[15px] font-semibold tracking-[0.02em]">
          <Icon name="plus" size={20} />
          Add product
        </Link>
      </div>

      {/* Filters */}
      <div role="search" className="flex flex-wrap items-end gap-4 p-5 bg-white border border-champagne rounded-md">
        <div className="grow-[2] shrink basis-[260px] flex flex-col gap-2">
          <label htmlFor="a-search" className={fieldLabel}>Search products</label>
          <input id="a-search" type="search" placeholder="Name or SKU" value={q}
            onChange={(e) => setFilter('q', e.target.value)} className={control} />
        </div>
        <div className="grow shrink basis-[180px] flex flex-col gap-2">
          <label htmlFor="a-cat" className={fieldLabel}>Category</label>
          <select id="a-cat" value={cat} onChange={(e) => setFilter('cat', e.target.value)} className={control}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grow shrink basis-[180px] flex flex-col gap-2">
          <label htmlFor="a-status" className={fieldLabel}>Status</label>
          <select id="a-status" value={status} onChange={(e) => setFilter('status', e.target.value)} className={control}>
            <option value="">Any status</option>
            {statusOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setParams({}, { replace: true })} disabled={!hasFilters}
          className="h-[44px] px-4 bg-transparent border-0 text-rosewood-deep font-sans text-[15px] font-semibold leading-[normal] cursor-pointer disabled:cursor-default underline underline-offset-4">
          Clear filters
        </button>
      </div>

      {/* Table: scrolls inside its own box on narrow screens */}
      <div className="bg-white border border-champagne rounded-md overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-[16px] leading-[1.5]">
          <thead>
            <tr className="bg-cream text-left">
              <th scope="col" className={th}>Product</th>
              <th scope="col" className={th}>SKU</th>
              <th scope="col" className={th}>Category</th>
              <th scope="col" className={`${th} text-right`}>Price</th>
              <th scope="col" className={`${th} text-right`}>Stock</th>
              <th scope="col" className={th}>Status</th>
              {/* relative: keeps the absolutely positioned sr-only text inside the scroll box on mobile */}
              <th scope="col" className={`${th} relative`}><span className="vs-sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t border-champagne">
                <td colSpan={7} className={`${td} text-taupe-deep`}>No products match these filters.</td>
              </tr>
            ) : rows.map((p) => (
              <tr key={p.id} className="border-t border-champagne hover:bg-ivory">
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt="" loading="lazy" decoding="async" className="w-12 h-12 shrink-0 object-cover rounded-sm block bg-cream"
                      style={{ objectPosition: p.thumbPos }} />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className={`${td} text-[14px] text-taupe-deep whitespace-nowrap`}>{p.sku}</td>
                <td className={td}>{p.category}</td>
                <td className={`${td} text-right tabular-nums`}>{inr(p.price)}</td>
                <td className={`${td} text-right tabular-nums`}>{p.stock}</td>
                <td className={td}><StatusBadge status={p.adminStatus} /></td>
                {/* No edit screen is designed yet */}
                <td className={`${td} text-right`}>
                  <a href="#" className="text-[15px] font-semibold" aria-label={`Edit ${p.name}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-[14px] text-taupe-deep">
        <span aria-live="polite">
          {filtered.length === 0 ? 'Showing 0 of 0' : `Showing ${start + 1}–${start + rows.length} of ${filtered.length}`}
        </span>
        <nav aria-label="Pagination" className="flex gap-2">
          <button type="button" className={pager} disabled={current <= 1} onClick={() => goTo(current - 1)}>Previous</button>
          <button type="button" className={pager} disabled={current >= pages} onClick={() => goTo(current + 1)}>Next</button>
        </nav>
      </div>
    </>
  );
}

// Success message passed by the add-product page: navigate('/admin/products', { state: { notice } }).
// Kept in local state and removed from history, so it does not come back on reload / back.
function useNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notice] = useState(() => location.state?.notice ?? null);
  useEffect(() => {
    if (location.state?.notice) navigate({ search: location.search }, { replace: true, state: null });
  }, [location.state, location.search, navigate]);
  return notice;
}
