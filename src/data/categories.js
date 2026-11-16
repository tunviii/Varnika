// Category pages behind /sarees?c=<key>. Only "Silk sarees" copy exists in the design
// (Category.dc.html / Category-Mobile.dc.html); the rest follow the same pattern.
const any = () => true;

export const categories = {
  silk: {
    title: 'Silk sarees',
    intro: 'Kanjivaram, Banarasi, Paithani, Chanderi and Tussar silks, chosen for weddings, festivals and family occasions.',
    introMobile: 'Kanjivaram, Banarasi, Paithani, Chanderi and Tussar.',
    match: any, // every saree in the current catalogue is silk
  },
  new: { title: 'New arrivals', intro: 'The latest sarees to arrive in the boutique.', match: (p) => p.newArrival },
  cotton: { title: 'Cotton sarees', intro: 'Handloom cottons for everyday wear and summer functions.', match: (p) => p.fabric === 'Cotton' },
  kanjivaram: { title: 'Kanjivaram silk', intro: 'Rich zari borders for weddings.', match: (p) => p.collection === 'kanjivaram' },
  banarasi: { title: 'Banarasi weaves', intro: 'Brocade pallus and fine motifs.', match: (p) => p.collection === 'banarasi' },
  tussar: { title: 'Tussar and handloom', intro: 'Textured, natural, easy to wear.', match: (p) => p.collection === 'tussar' },
  chanderi: { title: 'Chanderi and soft silk', intro: 'Light silks for festivals and functions.', match: (p) => p.collection === 'chanderi' },
  wedding: {
    title: 'Wedding sarees',
    intro: 'Kanjivaram, Banarasi and Paithani silks for the wedding and every function around it.',
    match: (p) => ['Kanjivaram', 'Banarasi', 'Paithani'].includes(p.fabric),
  },
};

export const allSarees = { title: 'All sarees', intro: 'Every saree in the boutique right now.', match: any };

export function searchCategory(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return {
    title: `Results for “${q}”`,
    intro: 'Sarees that match your search.',
    match: (p) => {
      const hay = `${p.name} ${p.line} ${p.fabric} ${p.colour}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    },
  };
}
