"use client";

import { useCallback, useEffect, useState } from 'react';

import { deleteStoredProduct, getStoredProducts, subscribeToProducts } from '@/lib/product-storage';
import type { Product } from '@/lib/products';

type UseProductsOptions = {
  realtime?: boolean;
};

export function useProducts(_options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  const refreshProducts = useCallback(() => {
    setProducts(getStoredProducts());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProducts();
    return subscribeToProducts(refreshProducts);
  }, [refreshProducts]);

  const deleteProduct = async (id: string) => {
    deleteStoredProduct(id);
  };

  return { products, isLoading, error, deleteProduct };
}
