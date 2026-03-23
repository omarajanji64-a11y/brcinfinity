'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import {
  CATALOG_SETTINGS_COLLECTION,
  CATALOG_SETTINGS_DOC,
  getStaticCatalogs,
  sanitizeCatalogs,
  type Catalog,
} from '@/lib/catalogs';

type CatalogSettingsDocument = {
  items?: unknown;
};

export function useCatalogs() {
  const firestore = useFirestore();
  const catalogSettingsDoc = useMemoFirebase(
    () => doc(firestore, CATALOG_SETTINGS_COLLECTION, CATALOG_SETTINGS_DOC),
    [firestore]
  );
  const { data, isLoading, error } = useDoc<CatalogSettingsDocument>(catalogSettingsDoc);

  const catalogs = useMemo<Catalog[]>(() => {
    if (!data) {
      return getStaticCatalogs();
    }

    return sanitizeCatalogs(data.items);
  }, [data]);

  return {
    catalogs,
    isLoading,
    error,
    hasRemoteConfig: Boolean(data),
  };
}
