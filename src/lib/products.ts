import type { Language } from '@/lib/i18n';

export type LocalizedText = Partial<Record<Language, string>>;
export type ProductStyle = 'Modern' | 'Classic';

export type Product = {
  id: string;
  name: LocalizedText;
  category: LocalizedText;
  categoryKey: string;
  style: ProductStyle;
  shortDescription: LocalizedText;
  description: LocalizedText;
  price: number;
  stock: number;
  imageUrl: string;
  imageUrls: string[];
};

type TranslationFn = (key: string) => string;

const KNOWN_CATEGORY_LABELS: Record<string, string> = {
  'living-room': 'categories.living_room',
  bedroom: 'categories.bedroom',
  'dining-room': 'categories.dining_room',
  'sofa-set': 'categories.sofa_set',
};

const KNOWN_CATEGORY_TERMS: Record<string, string[]> = {
  'living-room': ['living room', 'oturma odasi', 'salon'],
  bedroom: ['bedroom', 'yatak odasi'],
  'dining-room': ['dining room', 'yemek odasi', 'yemek'],
  'sofa-set': ['sofa set', 'koltuk takimi', 'koltuk', 'sofa'],
};

const DEFAULT_LOCALIZED_TEXT: LocalizedText = {
  tr: '',
  en: '',
  fr: '',
};

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createLocalizedText = (value: string): LocalizedText => ({
  tr: value,
  en: value,
  fr: value,
});

export const normalizeLocalizedText = (value: unknown): LocalizedText => {
  if (typeof value === 'string') {
    return createLocalizedText(value.trim());
  }

  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_LOCALIZED_TEXT };
  }

  const localizedValue = value as Record<string, unknown>;

  return {
    tr: typeof localizedValue.tr === 'string' ? localizedValue.tr : '',
    en: typeof localizedValue.en === 'string' ? localizedValue.en : '',
    fr: typeof localizedValue.fr === 'string' ? localizedValue.fr : '',
  };
};

export const getLocalizedText = (
  value: unknown,
  language: Language,
  fallback = ''
) => {
  const localizedValue = normalizeLocalizedText(value);

  return (
    localizedValue[language]?.trim() ||
    localizedValue.tr?.trim() ||
    localizedValue.en?.trim() ||
    localizedValue.fr?.trim() ||
    fallback
  );
};

export const normalizeCategoryKey = (value: string) => {
  const normalized = toSlug(value);

  if (!normalized) {
    return 'other';
  }

  const matchedKnownCategory = Object.entries(KNOWN_CATEGORY_TERMS).find(([, terms]) =>
    terms.some((term) => normalized.includes(toSlug(term)))
  );

  return matchedKnownCategory?.[0] ?? normalized;
};

export const normalizeProduct = (value: Record<string, unknown>): Product => {
  const name = normalizeLocalizedText(value.name);
  const category = normalizeLocalizedText(value.category);
  const shortDescription = normalizeLocalizedText(value.shortDescription);
  const description = normalizeLocalizedText(value.description);
  const rawImageUrls = Array.isArray(value.imageUrls)
    ? value.imageUrls.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const imageUrl =
    typeof value.imageUrl === 'string' && value.imageUrl.trim().length > 0
      ? value.imageUrl
      : rawImageUrls[0] ?? '';
  const imageUrls = rawImageUrls.length > 0 ? rawImageUrls : imageUrl ? [imageUrl] : [];
  const fallbackCategoryLabel =
    getLocalizedText(category, 'tr') || getLocalizedText(category, 'en') || getLocalizedText(category, 'fr');

  return {
    id: typeof value.id === 'string' ? value.id : '',
    name,
    category,
    categoryKey: normalizeCategoryKey(
      typeof value.categoryKey === 'string' && value.categoryKey.trim().length > 0
        ? value.categoryKey
        : fallbackCategoryLabel
    ),
    style: value.style === 'Classic' ? 'Classic' : 'Modern',
    shortDescription,
    description,
    price:
      typeof value.price === 'number'
        ? value.price
        : Number.isFinite(Number(value.price))
          ? Number(value.price)
          : 0,
    stock:
      typeof value.stock === 'number'
        ? value.stock
        : Number.isFinite(Number(value.stock))
          ? Number(value.stock)
          : 0,
    imageUrl,
    imageUrls,
  };
};

export const getProductCategoryLabel = (
  product: Pick<Product, 'category' | 'categoryKey'>,
  language: Language,
  t: TranslationFn
) => {
  const translationKey = KNOWN_CATEGORY_LABELS[product.categoryKey];
  if (translationKey) {
    return t(translationKey);
  }

  return getLocalizedText(product.category, language, product.categoryKey);
};

export const getProductName = (product: Pick<Product, 'name'>, language: Language) =>
  getLocalizedText(product.name, language, 'BRC Infinity');

export const buildCategoryOptions = (
  products: Product[],
  language: Language,
  t: TranslationFn
) => {
  const categoryMap = new Map<string, string>();

  products.forEach((product) => {
    if (!product.categoryKey) {
      return;
    }

    categoryMap.set(product.categoryKey, getProductCategoryLabel(product, language, t));
  });

  const options = Array.from(categoryMap.entries()).map(([key, label]) => ({ key, label }));

  options.sort((a, b) => {
    const knownA = Object.keys(KNOWN_CATEGORY_LABELS).indexOf(a.key);
    const knownB = Object.keys(KNOWN_CATEGORY_LABELS).indexOf(b.key);

    if (knownA !== -1 && knownB !== -1) {
      return knownA - knownB;
    }

    if (knownA !== -1) {
      return -1;
    }

    if (knownB !== -1) {
      return 1;
    }

    return a.label.localeCompare(b.label, 'tr');
  });

  return options;
};

