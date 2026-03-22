"use client";

import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, type FirestoreError } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { normalizeProduct, type Product } from '@/lib/products';

type UseProductOptions = {
  realtime?: boolean;
};

export function useProduct(id: string | null | undefined, options?: UseProductOptions) {
  const realtime = options?.realtime ?? false;
  const firestore = useFirestore();
  const productDoc = useMemoFirebase(() => (id ? doc(firestore, 'products', id) : null), [firestore, id]);
  const liveResult = useDoc<Record<string, unknown>>(realtime ? productDoc : null);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id) && !realtime);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (realtime) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!productDoc) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    getDoc(productDoc)
      .then((documentSnapshot) => {
        if (isCancelled) {
          return;
        }

        setData(documentSnapshot.exists() ? { ...documentSnapshot.data(), id: documentSnapshot.id } : null);
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
  }, [productDoc, realtime]);

  const sourceData = realtime ? liveResult.data : data;
  const sourceIsLoading = realtime ? liveResult.isLoading : isLoading;
  const sourceError = realtime ? liveResult.error : error;
  const product = useMemo<Product | null>(() => (sourceData ? normalizeProduct(sourceData) : null), [sourceData]);

  return {
    product,
    isLoading: sourceIsLoading,
    error: sourceError,
  };
}
