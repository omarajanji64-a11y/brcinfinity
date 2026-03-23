import type { Language } from '@/lib/i18n';
import placeholderImagesData from '@/lib/placeholder-images.json';

type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

type LocalizedString = Partial<Record<Language, string>>;

export type HslColor = {
  h: number;
  s: number;
  l: number;
};

export type ThemeConfig = {
  background: HslColor;
  primary: HslColor;
  accent: HslColor;
};

export type CategoryImage = {
  id: string;
  name: LocalizedString;
  imageUrl: string;
  imageHint?: string;
};

const placeholderImages = placeholderImagesData.placeholderImages as PlaceholderImage[];

const getPlaceholderImage = (id: string, fallbackUrl: string) =>
  placeholderImages.find((image) => image.id === id)?.imageUrl ?? fallbackUrl;

const getPlaceholderHint = (id: string, fallbackHint: string) =>
  placeholderImages.find((image) => image.id === id)?.imageHint ?? fallbackHint;

export const DEFAULT_THEME: ThemeConfig = {
  background: { h: 0, s: 0, l: 4 },
  primary: { h: 28, s: 10, l: 93 },
  accent: { h: 24, s: 12, l: 56 },
};

export const HEADER_LOGO_URL =
  'https://i.ibb.co/N2r4xFMc/Screenshot-2026-01-06-09-00-56-removebg-preview.png';

export const FALLBACK_LOGO_URL = '/brc-infinity-logo.png';

export const CATEGORY_SHOWCASE_IMAGES: CategoryImage[] = [
  {
    id: 'cat-living-room',
    name: { en: 'Living Room', fr: 'Salon', tr: 'Oturma Odası' },
    imageUrl: getPlaceholderImage('cat-living-room', 'https://picsum.photos/seed/cat-living/600/600'),
    imageHint: getPlaceholderHint('cat-living-room', 'living room'),
  },
  {
    id: 'cat-dining-room',
    name: { en: 'Dining Room', fr: 'Salle a manger', tr: 'Yemek Odası' },
    imageUrl: getPlaceholderImage('cat-dining-room', 'https://picsum.photos/seed/cat-dining/600/600'),
    imageHint: getPlaceholderHint('cat-dining-room', 'dining room'),
  },
  {
    id: 'cat-bedroom',
    name: { en: 'Bedroom', fr: 'Chambre', tr: 'Yatak Odası' },
    imageUrl: getPlaceholderImage('cat-bedroom', 'https://picsum.photos/seed/cat-bedroom/600/600'),
    imageHint: getPlaceholderHint('cat-bedroom', 'bedroom furniture'),
  },
];
