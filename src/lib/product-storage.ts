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

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

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
    name: 'Royal Koltuk Takımı',
    category: 'Koltuk Takımı',
    categoryKey: 'living-room',
    style: 'Classic',
    shortDescription: 'El işi detaylarla hazırlanmış gösteri seviye salon takımı.',
    description:
      'Klasik hatları, yumuşak oturumu ve dikkat çeken işçiliğiyle oturma odasında odak noktası olacak bir takım.',
    price: 4200,
    stock: 3,
    imageIds: ['prod-4', 'prod-12'],
  }),
  createDefaultProduct({
    id: 'dining-room-elegance',
    name: 'Elegance Yemek Odası',
    category: 'Yemek Odası',
    categoryKey: 'dining-room',
    style: 'Modern',
    shortDescription: 'Geniş aile sofraları için tasarlanmış modern yemek odası seti.',
    description:
      'Masa ve sandalye kombinasyonu ile günlük kullanımda rahat, davetlerde ise dikkat çekici bir deneyim sunar.',
    price: 3600,
    stock: 4,
    imageIds: ['prod-3', 'prod-9', 'prod-11'],
  }),
  createDefaultProduct({
    id: 'bedroom-imperial-set',
    name: 'Imperial Yatak Odası',
    category: 'Yatak Odası',
    categoryKey: 'bedroom',
    style: 'Classic',
    shortDescription: 'Konfor ve gösterişi dengeli şekilde bir araya getiren yatak odası takımı.',
    description:
      'Büyük yatak başlığı, zarif detayları ve tamamlayıcı görüntüsü ile yatak odasına daha zengin bir karakter katar.',
    price: 5100,
    stock: 2,
    imageIds: ['prod-2', 'prod-10'],
  }),
];

const canUseStorage = () => getStorage() !== null;

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
  const storage = getStorage();

  if (!storage) {
    return DEFAULT_PRODUCTS;
  }

  try {
    storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  } catch {
    return DEFAULT_PRODUCTS;
  }

  return DEFAULT_PRODUCTS;
};

export const getStoredProducts = (): Product[] => {
  const storage = getStorage();

  if (!storage) {
    return DEFAULT_PRODUCTS;
  }

  let rawProducts: string | null = null;

  try {
    rawProducts = storage.getItem(PRODUCTS_STORAGE_KEY);
  } catch {
    return DEFAULT_PRODUCTS;
  }

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
  const storage = getStorage();

  if (!storage) {
    return products;
  }

  const sanitizedProducts = sanitizeProducts(products);

  try {
    storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sanitizedProducts));
  } catch {
    return sanitizedProducts;
  }

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
