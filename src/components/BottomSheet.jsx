import { useEffect, useRef } from 'react';

// Mobile bottom sheet (Filters-Mobile.dc.html): scrim, white panel from 56px below the top,
// 8px top corners, shadow-lg, z-overlay. Escape or the scrim closes it.
export default function BottomSheet({ open, onClose, labelledBy, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300]">
      <div className="absolute inset-0 bg-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={labelledBy}
        className="absolute inset-x-0 bottom-0 top-14 bg-white rounded-t-lg shadow-lg flex flex-col text-brown outline-none">
        {children}
      </div>
    </div>
  );
}
