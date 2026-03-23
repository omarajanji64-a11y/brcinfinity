import { isHttpsImageUrl, isLocalImagePath } from '@/lib/image-utils';
import { CATEGORY_SHOWCASE_IMAGES, type CategoryImage } from '@/lib/site-config';

export const HOMEPAGE_SETTINGS_COLLECTION = 'site-config';
export const HOMEPAGE_SETTINGS_DOC = 'homepage';

type HomepageCategoryImageOverride = {
  id: string;
  imageUrl: string;
  imageHint?: string;
};

const CATEGORY_SHOWCASE_BY_ID = CATEGORY_SHOWCASE_IMAGES.reduce<Record<string, CategoryImage>>((result, item) => {
  result[item.id] = item;
  return result;
}, {});

export const isValidHomepageImageUrl = (value: string) => {
  const trimmedValue = value.trim();
  return isLocalImagePath(trimmedValue) || isHttpsImageUrl(trimmedValue);
};

const normalizeHomepageCategoryImageOverride = (value: unknown): HomepageCategoryImageOverride | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const entry = value as Record<string, unknown>;
  const id = typeof entry.id === 'string' ? entry.id.trim() : '';
  const imageUrl = typeof entry.imageUrl === 'string' ? entry.imageUrl.trim() : '';
  const imageHint = typeof entry.imageHint === 'string' ? entry.imageHint.trim() : '';

  if (!id || !CATEGORY_SHOWCASE_BY_ID[id] || !isValidHomepageImageUrl(imageUrl)) {
    return null;
  }

  return {
    id,
    imageUrl,
    imageHint,
  };
};

export const mergeHomepageCategoryShowcaseImages = (value: unknown): CategoryImage[] => {
  const overrides = Array.isArray(value)
    ? value
        .map((item) => normalizeHomepageCategoryImageOverride(item))
        .filter((item): item is HomepageCategoryImageOverride => Boolean(item))
    : [];

  const overrideMap = overrides.reduce<Record<string, HomepageCategoryImageOverride>>((result, item) => {
    result[item.id] = item;
    return result;
  }, {});

  return CATEGORY_SHOWCASE_IMAGES.map((item) => {
    const override = overrideMap[item.id];

    if (!override) {
      return item;
    }

    return {
      ...item,
      imageUrl: override.imageUrl,
      imageHint: override.imageHint || item.imageHint,
    };
  });
};

export const buildHomepageCategoryShowcasePayload = (items: CategoryImage[]) =>
  items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl.trim(),
    imageHint: item.imageHint?.trim() || '',
  }));
