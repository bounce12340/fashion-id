export type BodyRatio = 'longer_torso' | 'longer_legs' | 'equal';

export type StyleTag =
  | 'Casual'
  | 'Minimalist'
  | 'Bold'
  | 'Romantic'
  | 'Formal'
  | 'Streetwear';

export interface Profile {
  fashionId: string;
  firstName: string;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  weight?: number;
  shoulderWidth?: number;
  armLength?: number;
  bodyRatio: BodyRatio;
  styleTags: StyleTag[];
  unit: 'in' | 'cm';
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: 'top' | 'bottom' | 'dress' | 'shoe' | 'accessory';
  styleTags: StyleTag[];
  affiliateUrl: string;
  measurements?: {
    bustMin?: number;
    bustMax?: number;
    waistMin?: number;
    waistMax?: number;
    hipsMin?: number;
    hipsMax?: number;
    sizes: string[];
  };
}

export interface Outfit {
  id: string;
  name: string;
  items: CatalogItem[];
}
