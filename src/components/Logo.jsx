import { Link } from 'react-router-dom';

// Header logo: 64px tall on desktop, 48px on mobile (CLAUDE.md).
export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Varnika Sarees home" className={`flex items-center h-12 md:h-16 rounded-sm ${className}`}>
      <img src="/images/logo.png" alt="Varnika, where tradition meets timeless style" className="h-12 md:h-16 w-auto block" />
    </Link>
  );
}
