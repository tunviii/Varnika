// Design source: design-reference/screens/Admin-Add-Product.dc.html (desktop; <768px has no design:
// single column, full-width buttons). Rendered inside AdminLayout's <main> (sidebar + main padding).
// The design shows the validation error state (summary + "Selling price"); the form starts empty.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Icon from '../components/Icon.jsx';
import AdminField, { FieldError, describedBy, fieldLabel, inputClass, selectClass } from '../components/admin/AdminField.jsx';
import { createProduct } from '../api/admin.js';
import { inr } from '../lib/format.js';
import { cleanRupees, fieldIds, summaryTitle, validateProductForm } from '../lib/validateProductForm.js';
import {
  MAX_PHOTOS, blouseOptions, careOptions, categoryOptions, collectionOptions, colourGroupOptions,
  emptyProductForm, materialOptions, weaveOptions,
} from '../data/productForm.js';

const card = 'bg-white border border-solid border-champagne rounded-md p-6 flex flex-col';
const h2 = 'm-0 text-[18px] font-semibold';
const twoCol = 'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5';
const tick = 'w-5 h-5 m-0 accent-rosewood-deep shrink-0';
const tickLabel = 'flex items-center gap-3 text-[16px]';
const options = (list) => list.map((o) => <option key={o}>{o}</option>);

// Errors returned by createProduct (err.fields) → the same { summary, message } shape as client errors.
const fromApi = (fields) =>
  Object.fromEntries(Object.entries(fields).map(([k, msg]) => {
    const text = msg.replace(/\.$/, '');
    return [k, { summary: text.charAt(0).toLowerCase() + text.slice(1), message: text }];
  }));

function toInput(v, photos, status) {
  const price = Number(cleanRupees(v.price));
  const mrp = cleanRupees(v.mrp);
  return {
    name: v.name.trim(), sku: v.sku.trim().toUpperCase(), price, ...(mrp && { mrp: Number(mrp) }),
    stock: Number(v.stock), status,
    description: v.description.trim(), category: v.category, collections: v.collections,
    material: v.material, weave: v.weave, colourText: v.colourText.trim(), colourGroup: v.colourGroup,
    length: v.length.trim(), blouse: v.blouse, care: v.care,
    newArrival: v.newArrival, featured: v.featured,
    ...((v.newArrival || v.featured) && { badge: v.newArrival ? 'new' : 'featured' }),
    // Frontend only: photos are local object URLs. A real backend would upload the files and return URLs.
    ...(photos[0] && { img: photos[0].url }),
    photos: photos.map((p, i) => ({ url: p.url, alt: `${v.name.trim()}, photo ${i + 1}` })),
  };
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [values, setValues] = useState(emptyProductForm);
  const [photos, setPhotos] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const summaryRef = useRef(null);
  const nextPhotoId = useRef(0);
  const liveUrls = useRef(new Set());
  const saved = useRef(false);

  // Errors are derived: re-checked on every edit once the form has been submitted.
  const errors = useMemo(
    () => (submitted ? { ...validateProductForm(values), ...apiErrors } : {}),
    [submitted, values, apiErrors],
  );
  const errorKeys = Object.keys(fieldIds).filter((k) => errors[k]);

  useEffect(() => { if (focusTick) summaryRef.current?.focus(); }, [focusTick]);

  // Free the photo previews when leaving without saving (a saved product keeps using them).
  useEffect(() => () => {
    if (!saved.current) liveUrls.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => {
      if (name === 'collections') {
        return { ...v, collections: checked ? [...v.collections, value] : v.collections.filter((c) => c !== value) };
      }
      return { ...v, [name]: type === 'checkbox' ? checked : value };
    });
    setApiErrors((errs) => {
      if (!errs[name]) return errs;
      const { [name]: _, ...rest } = errs;
      return rest;
    });
  }, []);

  const addPhotos = useCallback((e) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    e.target.value = ''; // allow picking the same file again
    setPhotos((list) => {
      const room = MAX_PHOTOS - list.length;
      const added = files.slice(0, room).map((file) => {
        const url = URL.createObjectURL(file);
        liveUrls.current.add(url);
        return { id: nextPhotoId.current++, url };
      });
      return [...list, ...added];
    });
  }, []);

  const removePhoto = useCallback((id) => {
    setPhotos((list) => {
      const p = list.find((x) => x.id === id);
      if (p) { URL.revokeObjectURL(p.url); liveUrls.current.delete(p.url); }
      return list.filter((x) => x.id !== id);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const status = e.nativeEvent.submitter?.value === 'draft' ? 'draft' : values.status;
    setSubmitted(true);
    setApiErrors({});
    if (Object.keys(validateProductForm(values)).length) {
      setFocusTick((t) => t + 1);
      return;
    }
    setSaving(true);
    try {
      const product = await createProduct(toInput(values, photos, status));
      saved.current = true;
      const notice = status === 'draft' ? `“${product.name}” is saved as a draft.` : `“${product.name}” is published.`;
      navigate('/admin/products', { state: { notice } });
    } catch (err) {
      setApiErrors(err.fields ? fromApi(err.fields) : { form: { summary: err.message || 'Something went wrong, please try again' } });
      setFocusTick((t) => t + 1);
      setSaving(false);
    }
  };

  const focusField = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.focus();
  };

  const priceText = cleanRupees(values.price);
  const previewPrice = /^\d+$/.test(priceText) && Number(priceText) > 0 ? inr(Number(priceText)) : null;
  const previewBadge = values.newArrival ? 'new' : values.featured ? 'featured' : null;
  const summaryCount = errorKeys.length + (errors.form ? 1 : 0);

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[14px] text-taupe-deep">
        <Link to="/admin/products">Products</Link> / Add product
      </nav>

      <form id="add-product" noValidate onSubmit={onSubmit} className="contents">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="m-0 font-display font-medium text-[34px] leading-[1.15]">Add product</h1>
          <div className="flex flex-wrap gap-3 max-md:w-full max-md:flex-col-reverse">
            <Link to="/admin/products" className="inline-flex items-center h-12 px-4 text-[15px] font-semibold max-md:justify-center">Cancel</Link>
            <button type="submit" value="draft" disabled={saving}
              className="vs-btn-secondary inline-flex items-center box-border no-underline h-12 px-5 bg-transparent border border-solid border-stone rounded-md text-brown font-sans font-semibold text-[15px] leading-[normal] cursor-pointer max-md:justify-center">
              Save as draft
            </button>
            <button type="submit" value="save" disabled={saving}
              className="vs-btn-primary inline-flex items-center no-underline h-12 px-6 bg-cta border-0 rounded-md text-white font-sans font-semibold text-[15px] leading-[normal] tracking-[0.02em] cursor-pointer max-md:justify-center">
              Save product
            </button>
          </div>
        </div>

        {summaryCount ? (
          <div role="alert" ref={summaryRef} tabIndex={-1}
            className="flex gap-3 p-4 bg-error-bg rounded-md text-error text-[15px] leading-[1.5] outline-none">
            <Icon name="alert" size={20} className="shrink-0 mt-px" />
            <span>
              <strong className="font-semibold">{summaryTitle(summaryCount)}</strong>{' '}
              {errorKeys.map((k, i) => (
                <span key={k}>
                  {i > 0 ? (i === errorKeys.length - 1 && !errors.form ? ' and ' : ', ') : null}
                  <a href={`#${fieldIds[k]}`} onClick={focusField(fieldIds[k])} className="text-error">{errors[k].summary}</a>
                </span>
              ))}
              {errors.form ? <>{errorKeys.length ? ' and ' : ''}{errors.form.summary}</> : null}
              .
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-6 items-start">
          {/* Left column */}
          <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-6">
            <section className={`${card} gap-4`}>
              <div className="flex flex-col gap-1">
                <h2 className={h2}>Photos</h2>
                <span id="photos-hint" className="text-[14px] text-taupe-deep">Add up to 8 photos. Portrait 3:4 in daylight works best. The first photo is shown on product cards.</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
                {photos.map((p, i) => (
                  <PhotoTile key={p.id} photo={p} index={i} onRemove={removePhoto} />
                ))}
                {photos.length < MAX_PHOTOS ? (
                  <label className="relative aspect-[3/4] flex flex-col items-center justify-center gap-2 p-3 border border-dashed border-stone rounded-md bg-ivory text-center text-[15px] font-semibold text-rosewood-deep cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rosewood-dark">
                    <Icon name="plus" size={24} />
                    Add photos
                    <input type="file" accept="image/*" multiple onChange={addPhotos} aria-describedby="photos-hint"
                      className="absolute w-px h-px opacity-0" />
                  </label>
                ) : null}
              </div>
            </section>

            <section className={`${card} gap-5`}>
              <h2 className={h2}>Basic details</h2>
              <AdminField id="p-name" label="Product name" hint="Colour, then weave. For example: Maroon Kanjivaram silk saree." error={errors.name?.message}>
                <input id="p-name" name="name" type="text" value={values.name} onChange={onChange}
                  placeholder="Emerald Kanjivaram silk saree" autoComplete="off"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('p-name', { hint: true, error: errors.name })}
                  className={inputClass(errors.name)} />
              </AdminField>
              <AdminField id="p-desc" label="Description">
                <textarea id="p-desc" name="description" rows={4} value={values.description} onChange={onChange}
                  placeholder="Describe the colour, border, pallu and the occasions it suits."
                  className="p-3 border border-solid border-stone rounded-md font-sans font-normal text-[16px] leading-[1.6] text-brown bg-white resize-y placeholder:text-taupe-deep" />
              </AdminField>
              <div className={twoCol}>
                <AdminField id="p-cat" label="Category">
                  <select id="p-cat" name="category" value={values.category} onChange={onChange} className={selectClass}>
                    {options(categoryOptions)}
                  </select>
                </AdminField>
                <fieldset className="m-0 p-0 border-0 flex flex-col gap-1">
                  <legend className={`p-0 pb-2 ${fieldLabel}`}>Collections</legend>
                  {collectionOptions.map((c) => (
                    <label key={c} className={`${tickLabel} min-h-10`}>
                      <input type="checkbox" name="collections" value={c} checked={values.collections.includes(c)}
                        onChange={onChange} className={tick} />
                      {c}
                    </label>
                  ))}
                </fieldset>
              </div>
            </section>

            <section className={`${card} gap-5`}>
              <h2 className={h2}>Price</h2>
              <div className={twoCol}>
                <RupeeField id="p-price" name="price" label="Selling price" value={values.price} onChange={onChange}
                  error={errors.price?.message} />
                <RupeeField id="p-mrp" name="mrp" label="Original price" optional value={values.mrp} onChange={onChange}
                  hint="Shown crossed out next to the selling price." error={errors.mrp?.message} />
              </div>
            </section>

            <section className={`${card} gap-5`}>
              <h2 className={h2}>Saree details</h2>
              <div className={twoCol}>
                <AdminField id="d-fabric" label="Fabric">
                  <select id="d-fabric" name="material" value={values.material} onChange={onChange} className={selectClass}>
                    {options(materialOptions)}
                  </select>
                </AdminField>
                <AdminField id="d-weave" label="Weave">
                  <select id="d-weave" name="weave" value={values.weave} onChange={onChange} className={selectClass}>
                    {options(weaveOptions)}
                  </select>
                </AdminField>
                <AdminField id="d-colour" label="Colour">
                  <input id="d-colour" name="colourText" type="text" value={values.colourText} onChange={onChange}
                    placeholder="Emerald green with a gold paisley border" autoComplete="off" className={inputClass(false)} />
                </AdminField>
                <AdminField id="d-filter" label="Colour group for filters">
                  <select id="d-filter" name="colourGroup" value={values.colourGroup} onChange={onChange} className={selectClass}>
                    {options(colourGroupOptions)}
                  </select>
                </AdminField>
                <AdminField id="d-length" label="Length">
                  <input id="d-length" name="length" type="text" value={values.length} onChange={onChange}
                    placeholder="5.5 m saree + 0.8 m blouse piece" autoComplete="off" className={inputClass(false)} />
                </AdminField>
                <AdminField id="d-blouse" label="Blouse piece">
                  <select id="d-blouse" name="blouse" value={values.blouse} onChange={onChange} className={selectClass}>
                    {options(blouseOptions)}
                  </select>
                </AdminField>
                <AdminField id="d-care" label="Care">
                  <select id="d-care" name="care" value={values.care} onChange={onChange} className={selectClass}>
                    {options(careOptions)}
                  </select>
                </AdminField>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="flex-[1_1_300px] md:max-w-[380px] flex flex-col gap-6">
            <section className={`${card} gap-3`}>
              <h2 className={`${h2} mb-1`}>Visibility</h2>
              <VisibilityOption value="draft" title="Draft" note="Only you can see it" current={values.status} onChange={onChange} />
              <VisibilityOption value="published" title="Published" note="Customers can see and buy it" current={values.status} onChange={onChange} />
            </section>

            <section className={`${card} gap-4`}>
              <h2 className={h2}>Stock</h2>
              <AdminField id="s-sku" label="SKU" error={errors.sku?.message}>
                <input id="s-sku" name="sku" type="text" value={values.sku} onChange={onChange}
                  placeholder="VS-KJ-0150" autoComplete="off" spellCheck={false}
                  aria-invalid={errors.sku ? true : undefined}
                  aria-describedby={describedBy('s-sku', { error: errors.sku })}
                  className={`${inputClass(errors.sku)} uppercase placeholder:normal-case`} />
              </AdminField>
              <AdminField id="s-qty" label="Quantity in stock" hint={'Shows "Only 2 left" on the site at 2 or fewer.'} error={errors.stock?.message}>
                <input id="s-qty" name="stock" type="number" min="0" step="1" inputMode="numeric" value={values.stock} onChange={onChange}
                  placeholder="0"
                  aria-invalid={errors.stock ? true : undefined}
                  aria-describedby={describedBy('s-qty', { hint: true, error: errors.stock })}
                  className={inputClass(errors.stock)} />
              </AdminField>
            </section>

            <section className={`${card} gap-2`}>
              <h2 className={`${h2} mb-1`}>Labels</h2>
              <label className={`${tickLabel} min-h-11`}>
                <input type="checkbox" name="newArrival" checked={values.newArrival} onChange={onChange} className={tick} />
                New arrival
              </label>
              <label className={`${tickLabel} min-h-11`}>
                <input type="checkbox" name="featured" checked={values.featured} onChange={onChange} className={tick} />
                Featured on homepage
              </label>
            </section>

            <section className="bg-cream rounded-md p-6 flex flex-col gap-3" aria-labelledby="card-preview">
              <h2 id="card-preview" className="m-0 text-[15px] font-semibold">Card preview</h2>
              <div className="bg-white p-3 rounded-sm flex flex-col">
                <div className="relative aspect-[3/4] bg-cream rounded-sm overflow-hidden">
                  {photos[0] ? (
                    <img src={photos[0].url} alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_50%]" />
                  ) : null}
                  {previewBadge ? <Badge kind={previewBadge} className="absolute top-2 left-2 py-[3px] px-2" /> : null}
                </div>
                <span className="pt-3 text-[16px] font-medium">{values.name.trim() || 'Product name'}</span>
                <span className="pt-1 text-[14px] text-taupe-deep">{values.material}</span>
                <span className={`pt-1.5 text-[17px] font-medium ${previewPrice ? '' : 'text-taupe-deep'}`}>{previewPrice ?? 'Price not set'}</span>
              </div>
            </section>
          </div>
        </div>
      </form>
    </>
  );
}

function PhotoTile({ photo, index, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[3/4] bg-cream rounded-sm overflow-hidden">
        <img src={photo.url} alt={`Photo ${index + 1}`} className="absolute inset-0 w-full h-full object-cover object-[50%_50%]" />
        {index === 0 ? (
          <span className="absolute top-2 left-2 py-0.5 px-2 bg-white text-[13px] font-semibold rounded-sm">Main photo</span>
        ) : null}
      </div>
      <button type="button" onClick={() => onRemove(photo.id)} aria-label={`Remove photo ${index + 1}`}
        className="h-9 bg-transparent border-0 text-rosewood-deep font-sans font-semibold text-[14px] leading-[normal] underline underline-offset-3 cursor-pointer">
        Remove
      </button>
    </div>
  );
}

function RupeeField({ id, name, label, optional, value, onChange, hint, error }) {
  return (
    <AdminField id={id} label={label} optional={optional} hint={hint}>
      <div className={`flex h-12 rounded-md bg-white overflow-hidden box-border border-solid ${error ? 'border-2 border-error' : 'border border-stone'}`}>
        <span className={`flex items-center px-3 bg-cream text-[16px] ${error ? '' : 'border-r border-stone'}`} aria-hidden="true">₹</span>
        <input id={id} name={name} type="text" inputMode="numeric" value={value} onChange={onChange}
          autoComplete="off" aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { hint, error })}
          className="flex-1 min-w-0 border-0 px-3 font-sans font-normal text-[16px] leading-[normal] text-brown bg-transparent placeholder:text-taupe-deep" />
      </div>
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </AdminField>
  );
}

function VisibilityOption({ value, title, note, current, onChange }) {
  const on = current === value;
  return (
    <label className={`flex items-start gap-3 p-3 rounded-md border-solid cursor-pointer ${on ? 'border-2 border-brown bg-ivory' : 'border border-stone'}`}>
      <input type="radio" name="status" value={value} checked={on} onChange={onChange} className={`${tick} mt-0.5`} />
      <span className="flex flex-col gap-0.5">
        <span className="text-[16px] font-medium">{title}</span>
        <span className="text-[14px] text-taupe-deep">{note}</span>
      </span>
    </label>
  );
}
