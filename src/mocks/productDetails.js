// Product page data (Product.dc.html). The design's values are for red-kanjivaram; the other sarees
// get details derived from their fabric, plus a short per-saree colour/subtitle/about line.
// Served by src/api/productDetails.js.

// Per-fabric defaults: what the "Saree details" table and photo labels say for each weave.
const byFabric = {
  Kanjivaram: { fabric: 'Pure mulberry silk', weave: 'Kanjivaram, handwoven', care: 'Dry clean only' },
  Banarasi: { fabric: 'Katan silk', weave: 'Banarasi, handwoven', care: 'Dry clean only' },
  Paithani: { fabric: 'Pure silk', weave: 'Paithani, handwoven', care: 'Dry clean only' },
  Chanderi: { fabric: 'Chanderi silk-cotton', weave: 'Chanderi, handloom', care: 'Gentle hand wash or dry clean' },
  Tussar: { fabric: 'Tussar silk', weave: 'Tussar, handloom', care: 'Dry clean only' },
  'Soft silk': { fabric: 'Soft silk', weave: 'Soft silk, powerloom', care: 'Dry clean recommended' },
};

const defaults = {
  length: '5.5 m saree + 0.8 m blouse piece',
  blouse: 'Included, unstitched',
  shipsIn: '[2–3]',
};

// Per-saree copy. `related` pins the "You may also like" order where the design shows one.
export const productCopy = {
  'red-kanjivaram': {
    subtitle: 'Pure silk · contrast gold zari border · with blouse piece',
    colour: 'Red with a gold zari border',
    about: [
      'A rich red Kanjivaram woven in pure mulberry silk, with a broad gold ',
      { em: 'zari' }, ' border and a richly worked ', { em: 'pallu' },
      '. A classic choice for weddings and family functions.',
    ],
    related: ['emerald-kanjivaram', 'purple-paithani', 'navy-banarasi', 'sage-soft-silk'],
  },
  'emerald-kanjivaram': {
    subtitle: 'Pure silk · paisley zari border · with blouse piece',
    colour: 'Emerald green with a gold paisley border',
    about: ['A deep emerald Kanjivaram in pure mulberry silk, edged with a gold paisley ', { em: 'zari' }, ' border. Made for weddings and festive mornings.'],
  },
  'magenta-banarasi': {
    subtitle: 'Katan silk · gold brocade · with blouse piece',
    colour: 'Magenta with gold brocade',
    about: ['A bright magenta Banarasi in katan silk, covered in fine gold brocade with a heavy ', { em: 'pallu' }, '. Lovely for receptions and sangeet evenings.'],
  },
  'navy-banarasi': {
    subtitle: 'Katan silk · gold butti weave · with blouse piece',
    colour: 'Navy blue with gold buttis',
    about: ['A navy Banarasi in katan silk, scattered with small gold ', { em: 'buttis' }, ' and finished with a woven border. Elegant for evening functions.'],
  },
  'purple-paithani': {
    subtitle: 'Pure silk · peacock pallu · with blouse piece',
    colour: 'Purple with a gold peacock pallu',
    about: ['A royal purple Paithani in pure silk, with the traditional peacock ', { em: 'pallu' }, ' woven in gold. A treasured piece for weddings.'],
  },
  'ivory-chanderi': {
    subtitle: 'Chanderi silk-cotton · gold border · with blouse piece',
    colour: 'Ivory with a gold border',
    about: ['A light ivory Chanderi in silk-cotton with a fine gold border. Airy and easy to drape for pujas, festivals and daytime functions.'],
  },
  'blush-chanderi': {
    subtitle: 'Chanderi silk-cotton · zari buttis · with blouse piece',
    colour: 'Blush pink with zari buttis',
    about: ['A soft blush pink Chanderi in silk-cotton, sprinkled with ', { em: 'zari' }, ' buttis. Light enough for summer functions and festive days.'],
  },
  'natural-tussar': {
    subtitle: 'Tussar silk · woven border · with blouse piece',
    colour: 'Natural beige with a woven border',
    about: ['A natural Tussar silk with its characteristic texture and a simple woven border. Easy to wear and lovely for office functions and festivals.'],
  },
  'sage-soft-silk': {
    subtitle: 'Soft silk · zari jaal · with blouse piece',
    colour: 'Sage green with a fine zari jaal',
    about: ['A sage green soft silk, light and fluid, with a fine ', { em: 'zari' }, ' jaal across the body. Comfortable for long festive days.'],
  },
};

// Gallery: the design's four photos. The close-ups are crops of the product photo; the last
// one is the shared loom photo.
const galleryFor = (p) => [
  { key: 'full', label: 'full saree', img: p.img, alt: p.alt, pos: '50% 50%', scale: 1 },
  { key: 'border', label: 'zari border close-up', img: p.img, alt: `${p.name}, close-up of the border`, pos: '62% 78%', scale: 2.4 },
  { key: 'pallu', label: 'pallu close-up', img: p.img, alt: `${p.name}, close-up of the pallu`, pos: '62% 45%', scale: 2 },
  { key: 'loom', label: 'the weave on the loom', img: '/images/handloom-weaving.jpg', alt: 'A handloom weaver at work on a silk saree', pos: '60% 50%', scale: 1 },
];

export function buildDetails(p) {
  const f = byFabric[p.fabric] ?? { fabric: p.line.split(' · ')[0], weave: p.fabric, care: 'Dry clean only' };
  const copy = productCopy[p.id] ?? {};
  return {
    subtitle: copy.subtitle ?? `${p.line} · with blouse piece`,
    about: copy.about ?? [`A ${p.colour.toLowerCase()} ${p.fabric} saree in ${f.fabric.toLowerCase()}.`],
    shipsIn: defaults.shipsIn,
    details: [
      { k: 'Fabric', v: f.fabric },
      { k: 'Colour', v: copy.colour ?? p.colour },
      { k: 'Weave', v: f.weave },
      { k: 'Length', v: defaults.length },
      { k: 'Blouse piece', v: defaults.blouse },
      { k: 'Care', v: f.care },
    ],
    gallery: galleryFor(p),
    relatedIds: copy.related ?? null,
  };
}
