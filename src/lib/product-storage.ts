import placeholderImagesData from '@/lib/placeholder-images.json';
import {
  createLocalizedText,
  normalizeProduct,
  type Product,
  type ProductStyle,
} from '@/lib/products';

type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const PRODUCTS_STORAGE_KEY = 'brc-infinity-products';
const PRODUCTS_UPDATED_EVENT = 'brc-infinity-products-updated';
const placeholderImages = placeholderImagesData.placeholderImages as PlaceholderImage[];

const getProductImageUrl = (id: string, fallbackUrl: string) =>
  placeholderImages.find((image) => image.id === id)?.imageUrl ?? fallbackUrl;

const createDefaultProduct = ({
  id,
  name,
  category,
  categoryKey,
  style,
  shortDescription,
  description,
  price,
  stock,
  imageIds,
}: {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  style: ProductStyle;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  imageIds: string[];
}) => {
  const imageUrls = imageIds.map((imageId) =>
    getProductImageUrl(imageId, 'https://picsum.photos/seed/brc-product/1200/1200')
  );

  return normalizeProduct({
    id,
    name: createLocalizedText(name),
    category: createLocalizedText(category),
    categoryKey,
    style,
    shortDescription: createLocalizedText(shortDescription),
    description: createLocalizedText(description),
    price,
    stock,
    imageUrl: imageUrls[0] ?? '',
    imageUrls,
  });
};

export const DEFAULT_PRODUCTS: Product[] = [
  createDefaultProduct({
    id: 'living-room-royal-sofa',
    name: 'Royal Koltuk Takimi',
    category: 'Oturma Odasi',
    categoryKey: 'living-room',
    style: 'Classic',
    shortDescription: 'El isi detaylarla hazirlanmis gosteri seviye salon takimi.',
    description:
      'Klasik hatlari, yumusak oturumu ve dikkat ceken isciligiyle oturma odasinda odak noktasi olacak bir takim.',
    price: 4200,
    stock: 3,
    imageIds: ['prod-4', 'prod-12'],
  }),
  createDefaultProduct({
    id: 'dining-room-elegance',
    name: 'Elegance Yemek Odasi',
    category: 'Yemek Odasi',
    categoryKey: 'dining-room',
    style: 'Modern',
    shortDescription: 'Genis aile sofralari icin tasarlanmis modern yemek odasi seti.',
    description:
      'Masa ve sandalye kombinasyonu ile gunluk kullanimda rahat, davetlerde ise dikkat cekici bir deneyim sunar.',
    price: 3600,
    stock: 4,
    imageIds: ['prod-3', 'prod-9', 'prod-11'],
  }),
  createDefaultProduct({
    id: 'bedroom-imperial-set',
    name: 'Imperial Yatak Odasi',
    category: 'Yatak Odasi',
    categoryKey: 'bedroom',
    style: 'Classic',
    shortDescription: 'Konfor ve gosterisi dengeli sekilde bir araya getiren yatak odasi takimi.',
    description:
      'Buyuk yatak basligi, zarif detaylari ve tamamlayici goruntusu ile yatak odasina daha zengin bir karakter katar.',
    price: 5100,
    stock: 2,
    imageIds: ['prod-2', 'prod-10'],
  }),
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const sanitizeProducts = (value: unknown): Product[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => normalizeProduct(item))
    .filter((product) => product.id.trim().length > 0);
};

const emitProductsUpdated = () => {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
};

const seedDefaultProducts = () => {
  if (!canUseStorage()) {
    return DEFAULT_PRODUCTS;
  }

  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
};

export const getStoredProducts = (): Product[] => {
  if (!canUseStorage()) {
    return DEFAULT_PRODUCTS;
  }

  const rawProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!rawProducts) {
    return seedDefaultProducts();
  }

  try {
    const parsedProducts = JSON.parse(rawProducts);

    if (!Array.isArray(parsedProducts)) {
      return seedDefaultProducts();
    }

    return sanitizeProducts(parsedProducts);
  } catch {
    return seedDefaultProducts();
  }
};

export const saveStoredProducts = (products: Product[]) => {
  if (!canUseStorage()) {
    return products;
  }

  const sanitizedProducts = sanitizeProducts(products);
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sanitizedProducts));
  emitProductsUpdated();
  return sanitizedProducts;
};

export const upsertStoredProduct = (product: Record<string, unknown>) => {
  const normalizedProduct = normalizeProduct(product);
  const currentProducts = getStoredProducts();
  const currentIndex = currentProducts.findIndex((item) => item.id === normalizedProduct.id);

  const nextProducts =
    currentIndex >= 0
      ? currentProducts.map((item, index) => (index === currentIndex ? normalizedProduct : item))
      : [normalizedProduct, ...currentProducts];

  return saveStoredProducts(nextProducts);
};

export const deleteStoredProduct = (id: string) => {
  const nextProducts = getStoredProducts().filter((product) => product.id !== id);
  return saveStoredProducts(nextProducts);
};

export const subscribeToProducts = (listener: () => void) => {
  if (!canUseStorage()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PRODUCTS_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(PRODUCTS_UPDATED_EVENT, listener);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, listener);
  };
};
