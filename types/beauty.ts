export type SkinType = 'OILY' | 'DRY' | 'COMBINATION' | 'NORMAL' | 'SENSITIVE';
export type Undertone = 'COOL' | 'WARM' | 'NEUTRAL' | 'OLIVE' | 'GOLDEN' | 'RED';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type MatchConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BeautyProfile {
  id: string;
  userId: string;
  skinType?: SkinType;
  undertone?: Undertone;
  skillLevel?: SkillLevel;
  skinToneHex?: string;
  faceConcerns: string[];
  beautyGoals: string[];
  preferredBrands: string[];
  budgetRange?: 'BUDGET' | 'MID' | 'LUXURY' | 'MIXED';
  stylePreferences: string[];
  completionPercent: number;
}

export interface ShadeMatchResult {
  id: string;
  productCategory: string;
  matchedShade: string;
  brandName: string;
  productName: string;
  hexColor: string;
  confidence: MatchConfidence;
  reason: string;
  alternatives: ShadeAlternative[];
}

export interface ShadeAlternative {
  brandName: string;
  productName: string;
  shade: string;
  hexColor: string;
  priceRange: string;
}

export interface LookRecreation {
  id: string;
  imageUrl: string;
  analyzedAt: string;
  sections: LookSection[];
  userAdaptedVersion?: LookVersion;
  beginnerVersion?: LookVersion;
  budgetVersion?: LookVersion;
}

export interface LookSection {
  area: 'BASE' | 'BROWS' | 'EYES' | 'CHEEKS' | 'LIPS';
  description: string;
  products: SuggestedProduct[];
  technique: string;
}

export interface LookVersion {
  label: string;
  description: string;
  sections: LookSection[];
}

export interface SuggestedProduct {
  name: string;
  brand: string;
  shade?: string;
  hexColor?: string;
  priceRange: string;
  affiliateUrl?: string;
}
