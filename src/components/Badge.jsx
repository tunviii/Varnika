// Product badges over images: New arrival (sage) and Featured (dusty rose).
const kinds = {
  new: { label: 'New arrival', cls: 'bg-sage' },
  featured: { label: 'Featured', cls: 'bg-dusty-rose' },
};

export default function Badge({ kind, className = '' }) {
  const k = kinds[kind];
  if (!k) return null;
  return <span className={`text-brown text-[13px] font-semibold rounded-sm ${k.cls} ${className}`}>{k.label}</span>;
}
