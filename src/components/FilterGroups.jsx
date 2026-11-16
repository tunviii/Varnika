// Fabric / Colour / Price / In-stock filter controls.
//   size="sidebar" → desktop aside (Category.dc.html): 20px controls, 44px rows, 16px text
//   size="sheet"   → mobile bottom sheet (Filters-Mobile.dc.html): 22px controls, 52px rows, 17px text,
//                    colours in two columns
// `filters` is the state object; `onChange(updater)` receives a functional update.
import { colourList, fabricNames, priceOpts } from '../data/filters.js';
import { toggleIn } from '../lib/filterProducts.js';

const styles = {
  sidebar: {
    fieldset: 'm-0 py-5 px-0 border-b border-champagne flex flex-col gap-1',
    legend: 'p-0 pb-2 text-[15px] font-semibold',
    colourLegend: 'p-0 pb-2 text-[15px] font-semibold',
    row: 'flex items-center gap-3 min-h-11 text-[16px] cursor-pointer',
    colourWrap: 'contents',
    colourRow: 'flex items-center gap-3 min-h-11 text-[16px] cursor-pointer',
    input: 'w-5 h-5 m-0 accent-rosewood-deep shrink-0',
    last: 'm-0 py-5 px-0 border-b border-champagne flex flex-col gap-1',
    stockWrap: 'py-5',
  },
  sheet: {
    fieldset: 'm-0 pt-5 pb-3 px-0 border-b border-champagne',
    legend: 'p-0 pb-2 text-[16px] font-semibold',
    colourLegend: 'p-0 pb-3 text-[16px] font-semibold',
    row: 'flex items-center gap-3.5 min-h-[52px] text-[17px] cursor-pointer',
    colourWrap: 'grid grid-cols-2 gap-x-3 gap-y-1',
    colourRow: 'flex items-center gap-3 min-h-[52px] text-[16px] cursor-pointer',
    input: 'w-[22px] h-[22px] m-0 accent-rosewood-deep shrink-0',
    last: 'm-0 pt-5 pb-3 px-0 border-b border-champagne',
    stockWrap: 'pt-3 pb-5',
  },
};

export default function FilterGroups({ size, filters: f, onChange, counts, idPrefix }) {
  const s = styles[size];
  return (
    <>
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>Fabric and weave</legend>
        {fabricNames.map((name) => (
          <label key={name} className={s.row}>
            <input type="checkbox" className={s.input} checked={f.fabrics.includes(name)}
              onChange={() => onChange((cur) => ({ ...cur, fabrics: toggleIn(cur.fabrics, name) }))} />
            <span className="flex-1">{name}</span>
            <span className="text-[14px] text-taupe-deep">{counts.get(name) ?? 0}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className={s.fieldset}>
        <legend className={s.colourLegend}>Colour</legend>
        <div className={s.colourWrap}>
          {colourList.map((c) => (
            <label key={c.label} className={s.colourRow}>
              <input type="checkbox" className={s.input} checked={f.colours.includes(c.label)}
                onChange={() => onChange((cur) => ({ ...cur, colours: toggleIn(cur.colours, c.label) }))} />
              <span aria-hidden="true" className="w-[18px] h-[18px] rounded-sm border border-stone shrink-0"
                style={{ background: c.hex }} />
              <span>{size === 'sheet' ? c.short ?? c.label : c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={s.last}>
        <legend className={s.legend}>Price</legend>
        {priceOpts.map((o) => (
          <label key={o.id} className={s.row}>
            <input type="radio" name={`${idPrefix}-price`} className={s.input} checked={f.price === o.id}
              onChange={() => onChange((cur) => ({ ...cur, price: o.id }))} />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>

      <div className={s.stockWrap}>
        <label className={s.row}>
          <input type="checkbox" className={s.input} checked={f.inStock}
            onChange={() => onChange((cur) => ({ ...cur, inStock: !cur.inStock }))} />
          <span>Show only sarees in stock</span>
        </label>
      </div>
    </>
  );
}
