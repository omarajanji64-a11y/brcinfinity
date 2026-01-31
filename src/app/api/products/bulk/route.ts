
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/index';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Readable } from 'stream';
import cloudinary from '@/lib/cloudinary';

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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
    }

    const batch = writeBatch(db);
    const productCollection = collection(db, 'products');

    for (const file of files) {
        const readableStream = new Readable();
        const buffer = Buffer.from(await file.arrayBuffer());
        readableStream.push(buffer);
        readableStream.push(null);

        const imageUrl = await uploadStreamToCloudinary(readableStream, file.name);

        const productName = file.name.split('.').slice(0, -1).join('.'); // Remove extension

        const productData = {
            name: { en: productName, fr: productName, tr: productName },
            category: { en: 'Uncategorized', fr: 'Non classé', tr: 'Kategorize edilmemiş' },
            style: 'Modern',
            shortDescription: { en: '', fr: '', tr: '' },
            description: { en: '', fr: '', tr: '' },
            price: 0,
            stock: 0,
            imageUrl: imageUrl,
        };

        const docRef = doc(productCollection);
        batch.set(docRef, productData);
    }

    await batch.commit();

    return NextResponse.json({ message: `${files.length} products added successfully` }, { status: 201 });
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
