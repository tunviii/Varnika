import { store, telHref } from '../config.js';

// Main.dc.html (desktop) / Mobile-Home.dc.html (mobile) announcement bar.
// Online-only business: the design's "Visit our boutique in [CITY] · Open …" line is intentionally not shown.
export default function AnnouncementBar() {
  return (
    <div className="bg-cream border-b border-solid border-champagne">
      <div className="hidden md:flex max-w-lg mx-auto py-2.5 px-8 flex-wrap justify-center gap-x-8 gap-y-2 text-[14px] leading-[1.5] text-brown">
        <span>Questions? Call or WhatsApp <a href={telHref} className="font-medium">{store.phone}</a></span>
      </div>
      <div className="md:hidden py-2 px-4 text-center text-[14px] leading-[1.5]">
        Call or WhatsApp <a href={telHref} className="font-medium">{store.phone}</a>
      </div>
    </div>
  );
}
