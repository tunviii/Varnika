import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SPA navigation: scroll to the top on page change, or to #hash targets (e.g. /#contact).
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
