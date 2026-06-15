/**
 * Curated, verified beauty photography (Unsplash).
 * Every ID below was checked to return a real image — no 404s.
 * Use `img(id, w, h)` to request a cropped, optimised variant.
 */

const BASE = 'https://images.unsplash.com/photo-';

export function img(id: string, w = 800, h?: number) {
  const ar = h ? `&h=${h}` : '';
  return `${BASE}${id}?auto=format&fit=crop&w=${w}${ar}&q=80`;
}

// Raw verified IDs grouped by subject
export const PHOTO = {
  // Model / face portraits
  modelSoft:     '1591019479261-1a103585c559', // soft beauty portrait
  modelBold:     '1502823403499-6ccfcf4fb453', // striking coloured-hair portrait
  modelClean:    '1488426862026-3ee34a7d66df', // clean studio portrait
  modelNatural:  '1522335789203-aabd1fc54bc9', // natural daylight portrait

  // Looks / palettes / eyes / lips
  paletteEyes:   '1487412720507-e7ab37603c6f', // eyeshadow palette
  paletteColor:  '1591019479261-1a103585c559', // colourful palette
  lipstick:      '1457972729786-0411a3b2b626', // lipstick
  brushesTop:    '1512496015851-a90fb38ba796', // brushes + palette flatlay
  brushesPink:   '1515688594390-b649af70d282', // brushes

  // Products / skincare / shop
  productsFlat:  '1596462502278-27bfdc403348', // makeup products flatlay
  skincareGrey:  '1571781926291-c477ebfd024b', // skincare bottles
  skincareCream: '1620916566398-39f1143ab7be', // cream jars
  skincareTube:  '1556228720-195a672e8a03',     // skincare tube
} as const;

// Semantic, ready-to-use URLs
export const Img = {
  heroLook:      img(PHOTO.modelBold, 900, 1100),
  matchHero:     img(PHOTO.modelSoft, 800, 800),

  looks: {
    softGlam:  img(PHOTO.modelSoft, 500, 600),
    glassSkin: img(PHOTO.modelClean, 500, 600),
    boldLip:   img(PHOTO.lipstick, 500, 600),
    bronzed:   img(PHOTO.modelNatural, 500, 600),
  },

  tutorials: {
    foundation: img(PHOTO.productsFlat, 400, 400),
    brows:      img(PHOTO.modelClean, 400, 400),
    smokyEye:   img(PHOTO.paletteEyes, 400, 400),
    glassBase:  img(PHOTO.skincareCream, 400, 400),
    cutCrease:  img(PHOTO.paletteColor, 400, 400),
  },

  products: {
    a: img(PHOTO.productsFlat, 400, 400),
    b: img(PHOTO.skincareGrey, 400, 400),
    c: img(PHOTO.skincareCream, 400, 400),
    d: img(PHOTO.brushesPink, 400, 400),
  },

  avatar: img(PHOTO.modelClean, 200, 200),
} as const;
