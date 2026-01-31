import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/index';
import { collection, doc, writeBatch } from 'firebase/firestore';

interface Product {
  name: string;
  price: number;
  quantity: number;
  collection: string;
  image_urls: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: 'No products to add' }, { status: 400 });
    }

    if (products.length > 400) {
      return NextResponse.json({ message: 'Cannot add more than 400 products at a time.' }, { status: 400 });
    }

    const batch = writeBatch(db);
    const productCollection = collection(db, 'products');

    for (const product of products) {
      const docRef = doc(productCollection);
      batch.set(docRef, product);
    }

    await batch.commit();

    return NextResponse.json({ message: 'Products added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
