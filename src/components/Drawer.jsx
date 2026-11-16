import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

// Side drawer for the mobile menu. Not drawn in the design; built from the token rules:
// scrim behind, white surface, shadow-lg, z-overlay, 18px drawer links.
export default function Drawer({ open, onClose, title, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300]">
      <div className="absolute inset-0 bg-scrim" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title}
        className="absolute inset-y-0 left-0 w-[320px] max-w-[85vw] box-border overflow-y-auto bg-white shadow-lg px-4 pt-2 pb-8 text-brown">
        <div className="flex items-center justify-between h-14 mb-2">
          <span className="font-display font-semibold text-[22px] leading-[1.2]">{title}</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu"
            className="flex items-center justify-center w-11 h-11 bg-transparent border-0 text-brown cursor-pointer">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
