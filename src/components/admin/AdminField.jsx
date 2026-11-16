import Icon from '../Icon.jsx';

// Labelled admin form field (Admin-Add-Product.dc.html): label 15px/500, control, hint 14px taupe,
// error row 14px error colour with a 16px alert icon.
export const fieldLabel = 'text-[15px] font-medium';
export const controlBase = 'h-12 border-solid rounded-md font-sans font-normal text-[16px] leading-[normal] text-brown bg-white placeholder:text-taupe-deep';
// Text inputs are box-sizing: border-box in the design; selects keep the browser's (also border-box).
export const inputClass = (error) =>
  `${controlBase} box-border ${error ? 'border-2 border-error px-[11px]' : 'border border-stone px-3'}`;
export const selectClass = `${controlBase} border border-stone px-3`;

export const describedBy = (id, { hint, error }) =>
  [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

export function FieldError({ id, children }) {
  return (
    <span id={id} className="flex items-center gap-1.5 text-[14px] text-error">
      <Icon name="alert" size={16} />
      {children}
    </span>
  );
}

export default function AdminField({ id, label, optional, hint, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {optional ? <> <span className="font-normal text-taupe-deep">(optional)</span></> : null}
      </label>
      {children}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
      {hint ? <span id={`${id}-hint`} className="text-[14px] text-taupe-deep">{hint}</span> : null}
    </div>
  );
}
