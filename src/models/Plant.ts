export type PlantCategory = 'sobne' | 'spoljne' | 'sukulenti' | 'sadnice' | 'pribor';

export const CATEGORY_LABELS: Record<PlantCategory, string> = {
  sobne: 'Sobne biljke',
  spoljne: 'Spoljne biljke',
  sukulenti: 'Sukulenti i kaktusi',
  sadnice: 'Sadnice voća i povrća',
  pribor: 'Pribor i nega',
};

export type CareLevel = 'lako' | 'srednje' | 'zahtevno';

export const CARE_LEVEL_LABELS: Record<CareLevel, string> = {
  lako: 'Lako za negu',
  srednje: 'Srednje zahtevno',
  zahtevno: 'Zahtevna nega',
};

export type SunlightLevel = 'puno-sunce' | 'delimicna-senka' | 'senka';

export const SUNLIGHT_LABELS: Record<SunlightLevel, string> = {
  'puno-sunce': 'Puno sunca',
  'delimicna-senka': 'Delimična senka',
  senka: 'Senka',
};

export interface IPlant {
  id: string;
  name: string;
  category: PlantCategory;
  price: number;
  description: string;
  icon: string;
  color: string;
  stock: number;
  rating: number;
  careLevel: CareLevel;
  light: string;
  watering: string;
  sunlightLevel?: SunlightLevel;
}
