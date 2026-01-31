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
      return NextResponse.json({ message: 'No products to add. The request body must contain a JSON array of products.' }, { status: 400 });
    }

    if (products.length > 400) {
      return NextResponse.json({ message: 'Cannot add more than 400 products at a time.' }, { status: 400 });
    }

    const batch = writeBatch(db);
    const productCollection = collection(db, 'products');

    for (const product of products) {
        // Validate product data
        if (!product.name || typeof product.name !== 'string' ||
            !product.price || typeof product.price !== 'number' ||
            !product.quantity || typeof product.quantity !== 'number' ||
            !product.collection || typeof product.collection !== 'string') {
          return NextResponse.json({
            message: 'Invalid product data. Each product must have a name (string), price (number), quantity (number), and collection (string).',
            invalidProduct: product
          }, { status: 400 });
        }

        const imageUrls = Array.isArray(product.image_urls) ? product.image_urls : [];

        const productData = {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            collection: product.collection,
            image_url: imageUrls[0] || null,
            additional_image_urls: imageUrls.slice(1),
        };

        const docRef = doc(productCollection);
        batch.set(docRef, productData);
    }

    await batch.commit();

    return NextResponse.json({ message: 'Products added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding products:', error);
    
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body. Please check the format of the data you are sending.', error: error.message }, { status: 400 });
    }
    
    // Check if it's a Firestore error
    if (error.code) {
        return NextResponse.json({ message: `Firestore error: ${error.message}`, code: error.code }, { status: 500 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred on the server.', error: error.message }, { status: 500 });
  }
}
