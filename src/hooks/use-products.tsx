
"use client";

import { useMemo } from "react";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { useCollection } from "@/firebase/firestore/use-collection";

export function useProducts() {
  const productsCollection = useMemo(
    () => Object.assign(collection(firestore, "products"), { __memo: true }),
    []
  );

  const { data: products, ...rest } = useCollection(productsCollection);

  const deleteProduct = async (id: string) => {
    const productDoc = doc(firestore, "products", id);
    await deleteDoc(productDoc);
  };

  return { products, ...rest, deleteProduct };
}
