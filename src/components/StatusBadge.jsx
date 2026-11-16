// Admin product status badge (Admin-Products.dc.html, status column). Keys come from
// adminStatus() in src/api/admin.js.
export const statusMeta = {
  published: { label: 'Published', cls: 'bg-success-bg text-success', dot: 'bg-success' },
  'low-stock': { label: 'Low stock', cls: 'bg-warning-bg text-warning', dot: 'bg-warning' },
  draft: { label: 'Draft', cls: 'bg-cream text-taupe-deep', dot: 'bg-taupe-deep' },
  'sold-out': { label: 'Sold out', cls: 'bg-error-bg text-error', dot: 'bg-error' },
};

export default function StatusBadge({ status }) {
  const m = statusMeta[status] ?? statusMeta.published;
  return (
    <span className={`inline-flex items-center gap-1.5 py-[3px] px-2.5 rounded-sm text-[13px] font-semibold ${m.cls}`}>
      <span className={`w-2 h-2 rounded-round ${m.dot}`} />{m.label}
    </span>
  );
}
