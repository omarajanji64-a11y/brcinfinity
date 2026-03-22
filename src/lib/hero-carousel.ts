import { isHttpsImageUrl, isLocalImagePath } from '@/lib/image-utils';

export const HERO_CAROUSEL_DOC_ID = 'homepage';
export const DEFAULT_HERO_SLIDE_DURATION_SECONDS = 5;
export const MIN_HERO_SLIDE_DURATION_SECONDS = 1;

export type HeroCarouselSlide = {
  id: string;
  imageUrl: string;
  durationSeconds: number;
};

export type HeroCarouselConfig = {
  autoplay: boolean;
  randomOrder: boolean;
  slides: HeroCarouselSlide[];
  updatedAt?: string;
};

export const DEFAULT_HERO_CAROUSEL_CONFIG: HeroCarouselConfig = {
  autoplay: true,
  randomOrder: true,
  slides: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const normalizeDurationSeconds = (value: unknown) => {
  const parsedValue =
    typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : Number.NaN;

  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_HERO_SLIDE_DURATION_SECONDS;
  }

  return Math.max(MIN_HERO_SLIDE_DURATION_SECONDS, Math.round(parsedValue));
};

export const isValidHeroCarouselImageUrl = (value: string) => {
  const trimmedValue = value.trim();
  return isLocalImagePath(trimmedValue) || isHttpsImageUrl(trimmedValue);
};

const normalizeSlide = (value: unknown, index: number): HeroCarouselSlide | null => {
  if (typeof value === 'string') {
    const imageUrl = value.trim();

    if (!imageUrl) {
      return null;
    }

    return {
      id: `hero-slide-${index + 1}`,
      imageUrl,
      durationSeconds: DEFAULT_HERO_SLIDE_DURATION_SECONDS,
    };
  }

  if (!isRecord(value)) {
    return null;
  }

  const imageUrl = typeof value.imageUrl === 'string' ? value.imageUrl.trim() : '';

  if (!imageUrl) {
    return null;
  }

  const slideId =
    typeof value.id === 'string' && value.id.trim() ? value.id.trim() : `hero-slide-${index + 1}`;

  return {
    id: slideId,
    imageUrl,
    durationSeconds: normalizeDurationSeconds(value.durationSeconds),
  };
};

export function normalizeHeroCarouselConfig(value: unknown): HeroCarouselConfig {
  const record = isRecord(value) ? value : {};
  const rawSlides = Array.isArray(record.slides)
    ? record.slides
    : Array.isArray(record.imageUrls)
      ? record.imageUrls
      : [];

  const slides = rawSlides
    .map((slide, index) => normalizeSlide(slide, index))
    .filter((slide): slide is HeroCarouselSlide => slide !== null);

  return {
    autoplay: normalizeBoolean(record.autoplay, DEFAULT_HERO_CAROUSEL_CONFIG.autoplay),
    randomOrder: normalizeBoolean(record.randomOrder, DEFAULT_HERO_CAROUSEL_CONFIG.randomOrder),
    slides,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : undefined,
  };
}

export function sanitizeHeroCarouselConfig(config: HeroCarouselConfig): HeroCarouselConfig {
  return normalizeHeroCarouselConfig(config);
}
