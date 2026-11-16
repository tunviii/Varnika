// Design source: design-reference/screens/Main.dc.html (desktop) + Mobile-Home.dc.html (<768px)
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { getCollections, getNewArrivals } from '../api/products.js';
import { useApi } from '../lib/useApi.js';
import { categoryHref, mobileChips } from '../data/navigation.js';
import { telHref, whatsappHref } from '../config.js';

const enquiryHref = whatsappHref('Hello Varnika, I would like help choosing a saree.');
const textLink = 'text-[15px] font-semibold underline-offset-4';

export default function Home() {
  const { state } = useLocation();

  // Header "Search" on other pages links here with { focusSearch: true }.
  useEffect(() => {
    if (!state?.focusSearch) return;
    const input = [document.getElementById('site-search'), document.getElementById('m-search')]
      .find((el) => el && el.offsetParent !== null);
    input?.focus();
  }, [state]);

  return (
    <main className="home">
      <MobileChips />
      <Hero />
      <Collections />
      <NewArrivals />
      <BrandStory />
      <Contact />
    </main>
  );
}

// Mobile only: row of category chips under the header (Mobile-Home.dc.html).
function MobileChips() {
  return (
    <nav aria-label="Categories" className="md:hidden pt-4 px-4 flex flex-wrap gap-2">
      {mobileChips.map((l) => (
        <Link key={l.label} to={l.to}
          className="inline-flex items-center h-11 px-4 bg-white border border-solid border-stone rounded-md text-brown no-underline text-[15px] font-medium">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-ivory">
      <div className="max-w-lg mx-auto pt-6 px-4 pb-12 flex flex-col gap-5 md:pt-16 md:px-8 md:pb-20 md:flex-row md:flex-wrap md:items-center md:gap-x-16 md:gap-y-12">
        <div className="flex flex-col gap-5 md:flex-[1_1_380px] md:gap-6 md:max-w-[520px]">
          <div className="type-eyebrow text-taupe-deep">The festive edit</div>
          <h1 className="m-0 type-display text-brown">Where tradition meets timeless style</h1>
          <p className="m-0 type-body-lg text-brown">
            <span className="md:hidden">Handpicked silk, cotton and handloom sarees for weddings, festivals and every day.</span>
            <span className="hidden md:inline">Handpicked silk, cotton and handloom sarees, chosen piece by piece for weddings, festivals and every day in between.</span>
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4 md:pt-2">
            <Button to={categoryHref('new')} className="flex justify-center md:inline-flex">Shop new arrivals</Button>
            <Button variant="secondary" href="#collections" className="flex justify-center md:inline-flex">View collections</Button>
          </div>
        </div>
        <img src="/images/magenta-banarasi.jpg" fetchpriority="high"
          alt="Woman in a magenta Banarasi silk saree with gold brocade, standing in a sunlit courtyard"
          className="order-first md:order-none w-full aspect-[4/5] object-cover object-[62%_40%] block bg-blush md:flex-[1.4_1_480px] md:min-w-0 md:aspect-video md:object-[60%_30%]" />
      </div>
    </section>
  );
}

function Collections() {
  const { data: collections = [] } = useApi('collections', getCollections);
  return (
    <section id="collections" className="bg-cream">
      <div className="max-w-lg mx-auto py-12 px-4 md:py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-12">
          <SectionHeading eyebrow="Collections" title="Shop by collection" />
          <Link to="/sarees" className={`hidden md:inline ${textLink}`}>See all collections</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-6">
          {collections.map((c) => (
            <Link key={c.id} to={categoryHref(c.id)} className="vs-card flex flex-col gap-2.5 md:gap-4 text-brown no-underline">
              <div className="aspect-[4/5] overflow-hidden rounded-sm">
                <img className="vs-card-img w-full h-full object-cover block bg-cream" src={c.img} alt={c.alt}
                  loading="lazy" decoding="async" style={{ objectPosition: c.pos }} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="m-0 type-h3">{c.name}</h3>
                <span className="hidden md:inline text-[14px] leading-[1.5] text-taupe-deep">{c.note}</span>
                <span className="hidden md:inline text-[15px] font-semibold text-rosewood-deep pt-1">View collection</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { data: products = [] } = useApi('products:new', getNewArrivals);
  return (
    <section className="bg-ivory">
      <div className="max-w-lg mx-auto py-12 px-4 md:py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-12">
          <SectionHeading eyebrow="Just in" title="New arrivals" />
          <Link to={categoryHref('new')} className={`hidden md:inline ${textLink}`}>View all new arrivals</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-x-6 md:gap-y-10">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <Button variant="secondary" to={categoryHref('new')} className="flex justify-center mt-8 md:hidden tracking-normal">View all new arrivals</Button>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="bg-blush">
      <div className="max-w-lg mx-auto py-12 px-4 flex flex-col gap-5 md:py-20 md:px-8 md:flex-row md:flex-wrap md:items-center md:gap-x-20 md:gap-y-12">
        <img src="/images/handloom-weaving.jpg" alt="Hands weaving a red and gold silk saree on a wooden handloom"
          loading="lazy" decoding="async"
          className="w-full aspect-[4/5] object-cover object-[55%_50%] rounded-sm block bg-champagne md:flex-[1_1_360px] md:min-w-0 md:max-w-[480px]" />
        <div className="flex flex-col gap-5 md:flex-[1_1_400px] md:max-w-[600px] md:gap-6">
          <div className="type-eyebrow text-taupe-deep">Our story</div>
          <h2 className="m-0 type-h2">A family boutique, one saree at a time</h2>
          <div className="w-14 md:w-16 h-px bg-brand-gold" />
          <p className="hidden md:block m-0 type-body-lg">
            [A short paragraph about how Varnika began: who started it, when, and what you look for in every saree you bring into the shop.]
          </p>
          <p className="m-0 type-body-lg">
            We work with weavers we know by name, and we are happy to help you choose, whether it is your first silk saree or
            <span className="md:hidden"> a wedding trousseau.</span>
            <span className="hidden md:inline"> your daughter's wedding trousseau.</span>
          </p>
          <a href="#" className={`self-start ${textLink}`}>Read our story</a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-ivory">
      {/* Desktop */}
      <div className="hidden md:flex max-w-md mx-auto py-20 px-8 flex-col items-center gap-6 text-center">
        <div className="type-eyebrow text-taupe-deep">We are here to help</div>
        <h2 className="m-0 type-h2">Need help choosing a saree?</h2>
        <p className="m-0 max-w-[600px] type-body-lg">
          Send us a message with the occasion and your budget. We will share photos and videos of sarees that suit you, and
          answer questions about fabric, blouse pieces and delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button href={enquiryHref} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={20} />Enquire on WhatsApp</Button>
          <Button variant="secondary" href={telHref}><Icon name="phone" size={20} />Call us</Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden py-12 px-4 flex flex-col gap-4">
        <h2 className="m-0 type-h2">Need help choosing?</h2>
        <p className="m-0 text-[16px] leading-[1.6]">Tell us the occasion and your budget. We will send photos and videos of sarees that suit you.</p>
        <Button href={enquiryHref} target="_blank" rel="noreferrer" className="flex justify-center max-md:tracking-normal">
          <Icon name="whatsapp" size={20} />Enquire on WhatsApp
        </Button>
        <Button variant="secondary" href={telHref} className="flex justify-center max-md:tracking-normal"><Icon name="phone" size={20} />Call us</Button>
      </div>
    </section>
  );
}
