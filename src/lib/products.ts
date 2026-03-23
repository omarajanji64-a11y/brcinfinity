import type { Language } from '@/lib/i18n';

export type LocalizedText = Partial<Record<Language, string>>;
export type ProductStyle = 'Modern' | 'Classic';

export type Product = {
  id: string;
  name: LocalizedText;
  category: LocalizedText;
  categoryKey: string;
  categoryKeys: string[];
  style: ProductStyle;
  shortDescription: LocalizedText;
  description: LocalizedText;
  price: number;
  stock: number;
  imageUrl: string;
  imageUrls: string[];
};

type TranslationFn = (key: string) => string;

export const FIXED_CATEGORY_OPTIONS = [
  { key: 'living-room', translationKey: 'categories.living_room', adminLabel: 'Oturma Odası' },
  { key: 'dining-room', translationKey: 'categories.dining_room', adminLabel: 'Yemek Odası' },
  { key: 'bedroom', translationKey: 'categories.bedroom', adminLabel: 'Yatak Odası' },
] as const;

const KNOWN_CATEGORY_LABELS: Record<string, string> = {
  'living-room': 'categories.living_room',
  bedroom: 'categories.bedroom',
  'dining-room': 'categories.dining_room',
};

const KNOWN_CATEGORY_TERMS: Record<string, string[]> = {
  'living-room': ['living room', 'oturma odasi', 'salon'],
  bedroom: ['bedroom', 'yatak odasi'],
  'dining-room': ['dining room', 'yemek odasi', 'yemek'],
};

const FIXED_CATEGORY_ADMIN_LABELS = FIXED_CATEGORY_OPTIONS.reduce<Record<string, string>>((result, option) => {
  result[option.key] = option.adminLabel;
  return result;
}, {});

const uniqueCategoryKeys = (values: string[]) =>
  values.filter((value, index, array) => value && array.indexOf(value) === index);

const DEFAULT_LOCALIZED_TEXT: LocalizedText = {
  tr: '',
  en: '',
  fr: '',
};

const TURKISH_CHARACTER_MAP: Record<string, string> = {
  '\u0131': 'i',
  '\u0130': 'i',
  '\u011f': 'g',
  '\u011e': 'g',
  '\u015f': 's',
  '\u015e': 's',
  '\u00e7': 'c',
  '\u00c7': 'c',
  '\u00f6': 'o',
  '\u00d6': 'o',
  '\u00fc': 'u',
  '\u00dc': 'u',
};

const replaceTurkishCharacters = (value: string) =>
  value.replace(/[\u0131\u0130\u011f\u011e\u015f\u015e\u00e7\u00c7\u00f6\u00d6\u00fc\u00dc]/g, (character) =>
    TURKISH_CHARACTER_MAP[character] ?? character
  );

const toSlug = (value: string) =>
  replaceTurkishCharacters(
    value
      .trim()
      .replace(/&/g, ' and ')
      .replace(/['\u2019]/g, '')
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
  )
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

export const normalizeCategoryKeys = (value: unknown, fallbackValue = '') => {
  const parsedCategoryKeys = Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? normalizeCategoryKey(item) : ''))
        .filter(Boolean)
    : [];
  const fallbackKey = fallbackValue ? normalizeCategoryKey(fallbackValue) : '';

  return uniqueCategoryKeys([...parsedCategoryKeys, fallbackKey]);
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
  const categoryKeys = normalizeCategoryKeys(
    value.categoryKeys,
    typeof value.categoryKey === 'string' && value.categoryKey.trim().length > 0 ? value.categoryKey : fallbackCategoryLabel
  );
  const categoryKey = categoryKeys[0] ?? normalizeCategoryKey(fallbackCategoryLabel);

  return {
    id: typeof value.id === 'string' ? value.id : '',
    name,
    category,
    categoryKey,
    categoryKeys,
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
  product: Pick<Product, 'category' | 'categoryKey' | 'categoryKeys'>,
  language: Language,
  t: TranslationFn
) => {
  const categoryLabels = getProductCategoryLabels(product, language, t);
  return categoryLabels.join(', ');
};

export const getProductCategoryKeys = (
  product: Pick<Product, 'category' | 'categoryKey' | 'categoryKeys'>
) => {
  const fallbackCategoryLabel =
    getLocalizedText(product.category, 'tr') || getLocalizedText(product.category, 'en') || getLocalizedText(product.category, 'fr');

  return normalizeCategoryKeys(product.categoryKeys, product.categoryKey || fallbackCategoryLabel);
};

export const getProductCategoryLabels = (
  product: Pick<Product, 'category' | 'categoryKey' | 'categoryKeys'>,
  language: Language,
  t: TranslationFn
) => {
  const categoryKeys = getProductCategoryKeys(product);
  const labels = categoryKeys
    .map((categoryKey) => {
      const translationKey = KNOWN_CATEGORY_LABELS[categoryKey];
      if (translationKey) {
        return t(translationKey);
      }

      return getFixedCategoryAdminLabel(categoryKey) || categoryKey;
    })
    .filter(Boolean);

  if (labels.length > 0) {
    return labels;
  }

  const fallbackLabel = getLocalizedText(product.category, language, product.categoryKey);
  return fallbackLabel ? [fallbackLabel] : [];
};

export const getProductName = (
  product: Pick<Product, 'name'>,
  language: Language,
  fallback = ''
) => getLocalizedText(product.name, language, fallback);

export const buildWhatsAppOrderMessage = ({
  language,
  productName,
  productImage,
}: {
  language: Language;
  productName?: string;
  productImage?: string;
}) => {
  const intro =
    language === 'tr'
      ? 'Merhaba, bu ürün için sipariş vermek istiyorum:'
      : language === 'fr'
        ? 'Bonjour, je souhaite commander ce produit :'
        : 'Hello, I would like to order this product:';

  const nameLabel =
    language === 'tr'
      ? 'Ürün Adı'
      : language === 'fr'
        ? 'Nom'
        : 'Name';

  const imageLabel =
    language === 'tr'
      ? 'Ürün Görseli'
      : language === 'fr'
        ? 'Image'
        : 'Image';

  const lines = [intro];

  if (productName?.trim()) {
    lines.push(`${nameLabel}: ${productName.trim()}`);
  }

  if (productImage?.trim()) {
    lines.push(`${imageLabel}: ${productImage.trim()}`);
  }

  return lines.join('\n\n');
};

export const getFixedCategoryAdminLabel = (value: string) => {
  const normalizedCategory = normalizeCategoryKey(value);
  return FIXED_CATEGORY_ADMIN_LABELS[normalizedCategory] ?? '';
};

export const getFixedCategoryAdminLabels = (values: string[]) =>
  uniqueCategoryKeys(values.map((value) => getFixedCategoryAdminLabel(value)).filter(Boolean));

export const buildCategoryOptions = (
  _products: Product[],
  _language: Language,
  t: TranslationFn
) =>
  FIXED_CATEGORY_OPTIONS.map((option) => ({
    key: option.key,
    label: t(option.translationKey),
  }));
