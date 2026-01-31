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

interface FailedProduct {
    name: string;
    reason: string;
}

// This function uploads a file stream to Cloudinary and returns the secure URL.
const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'brc-infinity-products', // Use a specific folder
        public_id: fileName.split('.').slice(0, -1).join('.'), // Use filename without extension as public_id
        overwrite: true,
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
    
    const successfulProducts: string[] = [];
    const failedProducts: FailedProduct[] = [];
    
    const batch = writeBatch(db);
    const productCollection = collection(db, 'products');

    // Process all file uploads concurrently for better performance
    await Promise.all(files.map(async (file) => {
        const metadata = productMetadata.find(p => p.fileName === file.name);

        if (!metadata) {
            failedProducts.push({ name: file.name, reason: "No matching metadata found." });
            return;
        }

        try {
            // Convert file to buffer and create a readable stream for Cloudinary
            const buffer = Buffer.from(await file.arrayBuffer());
            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);

            const imageUrl = await uploadStreamToCloudinary(readableStream, file.name);

            const productData = {
                // Using a unique ID based on the original filename and timestamp from client
                id: metadata.id, 
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
            successfulProducts.push(metadata.name);

        } catch (uploadError: any) {
            failedProducts.push({ name: metadata.name, reason: uploadError.message });
        }
    }));
    
    // Only commit the batch if there were successful uploads
    if (successfulProducts.length > 0) {
        await batch.commit();
    }

    // If there are any failures, return a 207 Multi-Status response
    if (failedProducts.length > 0) {
        return NextResponse.json({
            message: "Partial success: Some products could not be imported.",
            successfulProducts,
            failedProducts
        }, { status: 207 });
    }

    // If all were successful
    return NextResponse.json({ 
        message: 'All products imported successfully.',
        successfulProducts
    }, { status: 201 });

  } catch (error: any) {
    console.error('Critical error in bulk import endpoint:', error);
    return NextResponse.json({ message: error.message || 'An unexpected server error occurred.' }, { status: 500 });
  }
}
