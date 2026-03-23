export type Catalog = {
  id: string;
  name: string;
  url: string;
};

export const CATALOG_SETTINGS_COLLECTION = 'config';
export const CATALOG_SETTINGS_DOC = 'catalogs';

const EMPTY_CATALOG: Catalog = {
  id: '',
  name: '',
  url: '',
};

const isLocalCatalogPath = (value: string) => value.startsWith('/');

export const isValidCatalogUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (isLocalCatalogPath(trimmedValue)) {
    return true;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeCatalog = (value: unknown): Catalog => {
  if (!value || typeof value !== 'object') {
    return { ...EMPTY_CATALOG };
  }

  const catalog = value as Record<string, unknown>;

  return {
    id: typeof catalog.id === 'string' ? catalog.id.trim() : '',
    name: typeof catalog.name === 'string' ? catalog.name.trim() : '',
    url: typeof catalog.url === 'string' ? catalog.url.trim() : '',
  };
};

export const sanitizeCatalogs = (value: unknown): Catalog[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((catalog) => normalizeCatalog(catalog))
    .filter((catalog) => catalog.id && catalog.name && isValidCatalogUrl(catalog.url));
};

export const getStaticCatalogs = (): Catalog[] => [];
