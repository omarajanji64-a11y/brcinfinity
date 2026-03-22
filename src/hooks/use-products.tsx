"use client";

import { useMemo } from 'react';
import { collection, deleteDoc, doc } from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { normalizeProduct, type Product } from '@/lib/products';

type UseProductsOptions = {
  realtime?: boolean;
};

export function useProducts(_options?: UseProductsOptions) {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data, isLoading, error } = useCollection<Record<string, unknown>>(productsCollection);

  const products = useMemo<Product[]>(
    () => (data ?? []).map((product) => normalizeProduct(product)),
    [data]
  );

  const deleteProduct = async (id: string) => {
    const productDoc = doc(firestore, 'products', id);
    await deleteDoc(productDoc);
  };

  return { products, isLoading, error, deleteProduct };
}
