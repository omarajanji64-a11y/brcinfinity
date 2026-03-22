"use client";

import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, type FirestoreError } from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { normalizeProduct, type Product } from '@/lib/products';

type UseProductsOptions = {
  realtime?: boolean;
};

export function useProducts(_options?: UseProductsOptions) {
  const realtime = _options?.realtime ?? true;
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const liveResult = useCollection<Record<string, unknown>>(realtime ? productsCollection : null);
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!realtime);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (realtime) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    getDocs(productsCollection)
      .then((querySnapshot) => {
        if (isCancelled) {
          return;
        }

        setData(querySnapshot.docs.map((documentSnapshot) => ({ ...documentSnapshot.data(), id: documentSnapshot.id })));
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
  };

  return { products, isLoading: sourceIsLoading, error: sourceError, deleteProduct };
}
