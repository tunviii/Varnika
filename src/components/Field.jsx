import Icon from './Icon.jsx';

// Labelled form field from the Checkout design: label 15px/500, 8px gap, helper text 14px taupe-deep.
// Errors are not in the design; they follow tokens.json (`error` colour, always with an icon and a message).

// Text input / select: 48px tall incl. border (border-box), 12px side padding, stone edge, radius-md.
export const inputClass = (invalid) =>
  `h-12 py-0 px-3 border border-solid ${invalid ? 'border-error' : 'border-stone'} rounded-md box-border bg-white font-sans font-normal text-[16px] leading-[normal] text-brown placeholder:text-taupe-deep`;

// aria-describedby value for a field with optional hint / error.
export const describedBy = (id, { hint, error }) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

export function FieldError({ id, children }) {
  return (
    <span id={id} className="flex items-start gap-1.5 text-[14px] leading-[1.4] text-error">
      <Icon name="alert" size={18} className="shrink-0" />
      {children}
    </span>
  );
}

export default function Field({ id, label, optional = false, hint, error, className = '', children }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
        {optional ? <> <span className="font-normal text-taupe-deep">(optional)</span></> : null}
      </label>
      {children}
      {hint ? <span id={`${id}-hint`} className="text-[14px] text-taupe-deep">{hint}</span> : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}
