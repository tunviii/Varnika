import SmartLink from './SmartLink.jsx';

// PrimaryButton / SecondaryButton from the design (52px tall, 28px side padding, radius-md).
// Primary fill is var(--cta): rosewood-deep everywhere, logo maroon inside <main className="home">.
const base = 'items-center gap-2 h-[52px] px-7 rounded-md no-underline font-sans text-[15px] font-semibold tracking-[0.02em] cursor-pointer';
const variants = {
  primary: 'vs-btn-primary bg-cta text-white border-0',
  secondary: 'vs-btn-secondary bg-transparent text-brown border border-solid border-stone box-border',
};

export default function Button({ variant = 'primary', to, href, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className.includes('flex') ? '' : 'inline-flex'} ${className}`;
  if (to) return <SmartLink to={to} className={cls} {...rest}>{children}</SmartLink>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
