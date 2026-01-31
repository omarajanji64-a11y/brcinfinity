import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/index';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Readable } from 'stream';
import cloudinary from '@/lib/cloudinary';

interface ProductMetadata {
  id: string;
  name: string;
  price: number;
  stock: number;
  fileName: string;
}

const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bulk-product-imports',
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload did not return a result.'));
        }
      }
    );
    stream.pipe(uploadStream);
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const productMetadataString = formData.get('products') as string;
    const files = formData.getAll('files') as File[];

    if (!productMetadataString || !files || files.length === 0) {
      return NextResponse.json({ message: 'Missing product data or files.' }, { status: 400 });
    }

    const productMetadata: ProductMetadata[] = JSON.parse(productMetadataString);

    if (productMetadata.length !== files.length) {
      return NextResponse.json({ message: 'Mismatch between product data and number of files.' }, { status: 400 });
    }

    const batch = writeBatch(db);
    const productCollection = collection(db, 'products');

    for (const file of files) {
        const metadata = productMetadata.find(p => p.fileName === file.name);

        if (!metadata) {
            console.warn(`No metadata found for file: ${file.name}. Skipping this file.`);
            continue; 
        }

        const readableStream = new Readable();
        const buffer = Buffer.from(await file.arrayBuffer());
        readableStream.push(buffer);
        readableStream.push(null);

        const imageUrl = await uploadStreamToCloudinary(readableStream, file.name);

        const productData = {
            name: { en: metadata.name, fr: metadata.name, tr: metadata.name },
            category: { en: 'Uncategorized', fr: 'Non classé', tr: 'Kategorize edilmemiş' },
            style: 'Modern',
            shortDescription: { en: '', fr: '', tr: '' },
            description: { en: '', fr: '', tr: '' },
            price: metadata.price,
            stock: metadata.stock,
            imageUrl: imageUrl,
        };

        const docRef = doc(productCollection, metadata.id);
        batch.set(docRef, productData);
    }

    await batch.commit();

    return NextResponse.json({ message: `${productMetadata.length} products added successfully` }, { status: 201 });

  } catch (error: any) {
    console.error('Error adding products:', error);

    let errorMessage = 'An unexpected error occurred on the server.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (error.code) {
        errorMessage = `Firestore error: ${error.message}`;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
