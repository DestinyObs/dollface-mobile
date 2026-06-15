export type ProductCategory =
  | 'FOUNDATION'
  | 'CONCEALER'
  | 'POWDER'
  | 'BLUSH'
  | 'BRONZER'
  | 'HIGHLIGHTER'
  | 'EYESHADOW'
  | 'EYELINER'
  | 'MASCARA'
  | 'BROW'
  | 'LIPSTICK'
  | 'LIP_GLOSS'
  | 'LIP_LINER'
  | 'PRIMER'
  | 'SETTING_SPRAY'
  | 'SKINCARE';

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  shades: ProductShade[];
  priceRange: string;
  rating?: number;
  isSaved?: boolean;
  affiliateUrl?: string;
}

export interface ProductShade {
  id: string;
  name: string;
  hexColor: string;
  undertone?: string;
  depth?: 'FAIR' | 'LIGHT' | 'MEDIUM' | 'TAN' | 'DEEP' | 'RICH';
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  priceRange: 'BUDGET' | 'MID' | 'LUXURY';
}
