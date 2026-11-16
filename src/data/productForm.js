// Options for the admin "Add product" form (Admin-Add-Product.dc.html).
import { colourList, fabricNames } from './filters.js';

export const categoryOptions = ['Silk sarees', 'Cotton sarees', 'Wedding'];
export const collectionOptions = ['Kanjivaram silk', 'Festive and party'];
export const materialOptions = ['Pure silk', 'Silk-cotton', 'Cotton', 'Georgette'];
// Weave = the storefront "Fabric" filter, so new products are filterable.
export const weaveOptions = fabricNames;
// Colour groups = the storefront colour filter labels, in the design's order first.
const designColourOrder = ['Green', 'Red and maroon', 'Blue', 'Pink', 'Purple'];
export const colourGroupOptions = [
  ...designColourOrder,
  ...colourList.map((c) => c.label).filter((l) => !designColourOrder.includes(l)),
];
export const blouseOptions = ['Included, unstitched', 'Included, stitched', 'Not included'];
export const careOptions = ['Dry clean only', 'Gentle hand wash'];

export const MAX_PHOTOS = 8;

// Empty form. Default-checked controls follow the design (Kanjivaram silk, Draft, New arrival).
export const emptyProductForm = {
  name: '', description: '', category: categoryOptions[0], collections: ['Kanjivaram silk'],
  price: '', mrp: '',
  material: materialOptions[0], weave: weaveOptions[0], colourText: '', colourGroup: colourGroupOptions[0],
  length: '', blouse: blouseOptions[0], care: careOptions[0],
  status: 'published', sku: '', stock: '', newArrival: true, featured: false,
};
