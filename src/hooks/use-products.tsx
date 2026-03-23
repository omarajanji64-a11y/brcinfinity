"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  type CollectionReference,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { normalizeProduct, type Product } from '@/lib/products';

type UseProductsOptions = {
  realtime?: boolean;
};

let cachedProducts: Record<string, unknown>[] | null = null;
let cachedProductsCollectionPath: string | null = null;
let cachedProductsRequest: Promise<Record<string, unknown>[]> | null = null;

const normalizeProductsSnapshot = async (productsCollection: CollectionReference<DocumentData>) => {
  const querySnapshot = await getDocs(productsCollection);

  return querySnapshot.docs.map((documentSnapshot) => ({
    ...documentSnapshot.data(),
    id: documentSnapshot.id,
  }));
};

const readProductsOnce = (productsCollection: CollectionReference<DocumentData>) => {
  const collectionPath = productsCollection.path;

  if (cachedProducts && cachedProductsCollectionPath === collectionPath) {
    return Promise.resolve(cachedProducts);
  }

  if (cachedProductsRequest && cachedProductsCollectionPath === collectionPath) {
    return cachedProductsRequest;
  }

  cachedProductsCollectionPath = collectionPath;
  cachedProductsRequest = normalizeProductsSnapshot(productsCollection)
    .then((products) => {
      cachedProducts = products;
      return products;
    })
    .finally(() => {
      cachedProductsRequest = null;
    });

  return cachedProductsRequest;
};

export const invalidateProductsCache = () => {
  cachedProducts = null;
  cachedProductsCollectionPath = null;
  cachedProductsRequest = null;
};

export function useProducts(_options?: UseProductsOptions) {
  const realtime = _options?.realtime ?? true;
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const liveResult = useCollection<Record<string, unknown>>(realtime ? productsCollection : null);
  const [data, setData] = useState<Record<string, unknown>[] | null>(() => (realtime ? null : cachedProducts));
  const [isLoading, setIsLoading] = useState<boolean>(() => !realtime && !cachedProducts);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (realtime) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (cachedProducts) {
      setData(cachedProducts);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    readProductsOnce(productsCollection)
      .then((products) => {
        if (isCancelled) {
          return;
        }

        setData(products);
        setIsLoading(false);
      })
      .catch((loadError: FirestoreError | Error) => {
        if (isCancelled) {
          return;
        }

        setError(loadError);
        setData(null);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [productsCollection, realtime]);

  const sourceData = realtime ? liveResult.data : data;
  const sourceIsLoading = realtime ? liveResult.isLoading : isLoading;
  const sourceError = realtime ? liveResult.error : error;

  const products = useMemo<Product[]>(
    () => (sourceData ?? []).map((product) => normalizeProduct(product)),
    [sourceData]
  );

  const deleteProduct = async (id: string) => {
    const productDoc = doc(firestore, 'products', id);
    await deleteDoc(productDoc);
    invalidateProductsCache();
  };

  return { products, isLoading: sourceIsLoading, error: sourceError, deleteProduct };
}
