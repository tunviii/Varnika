import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';

// Focused checkout header (Checkout.dc.html): logo, WhatsApp-ordering note, back to cart.
// Below 768px the note drops to its own row under the logo and back link.
export default function CheckoutHeader() {
  return (
    <header className="bg-ivory border-b border-champagne">
      <div className="max-w-lg mx-auto py-3 px-4 md:py-4 md:px-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:gap-4">
        <Logo />
        <span className="order-last w-full md:order-none md:w-auto flex items-center gap-2 text-[14px] md:text-[15px] font-medium">
          <Icon name="whatsapp" size={20} />
          Order by WhatsApp · no online payment
        </span>
        <Link to="/cart" className="flex items-center gap-1.5 h-11 text-[15px] font-semibold">
          <Icon name="back" size={18} />
          Back to cart
        </Link>
      </div>
    </header>
  );
}
