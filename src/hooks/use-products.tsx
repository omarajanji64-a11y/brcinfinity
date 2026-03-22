"use client";

import { useSyncExternalStore } from 'react';

import {
  DEFAULT_PRODUCTS,
  deleteStoredProduct,
  getStoredProducts,
  subscribeToProducts,
} from '@/lib/product-storage';
import type { Product } from '@/lib/products';

type UseProductsOptions = {
  realtime?: boolean;
};

export function useProducts(_options?: UseProductsOptions) {
  const products = useSyncExternalStore<Product[]>(
    subscribeToProducts,
    getStoredProducts,
    () => DEFAULT_PRODUCTS
  );

  const deleteProduct = async (id: string) => {
    deleteStoredProduct(id);
  };

  return { products, isLoading: false, error: null, deleteProduct };
}
