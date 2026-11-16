import { Link } from 'react-router-dom';

// "Home / Current page". Desktop: flex with 8px gaps. Mobile: inline text, 14px.
export default function Breadcrumb({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[14px] text-taupe-deep md:flex md:gap-2 md:leading-[1.5] ${className}`}>
      {items.map((it, i) => (
        <span key={it.label} className="contents">
          {i > 0 ? <>{' '}<span aria-hidden="true">/</span>{' '}</> : null}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
