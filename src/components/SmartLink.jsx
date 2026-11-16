import { Link } from 'react-router-dom';

// Internal routes use react-router; '#' placeholders (pages with no design yet) stay plain anchors.
export default function SmartLink({ to, children, ...rest }) {
  if (to.startsWith('/')) return <Link to={to} {...rest}>{children}</Link>;
  return <a href={to} {...rest}>{children}</a>;
}
