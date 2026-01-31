import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/index';
import { collection, addDoc } from 'firebase/firestore';

interface Product {
  name: string;
  price: number;
  quantity: number;
  collection: string;
  image_url: string;
}

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: 'No products to add' }, { status: 400 });
    }

    const productCollection = collection(db, 'products');

    for (const product of products) {
      await addDoc(productCollection, product);
    }

    return NextResponse.json({ message: 'Products added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
