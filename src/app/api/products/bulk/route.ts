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

interface CloudinaryUploadResult {
    status: "fulfilled" | "rejected";
    value?: { public_id: string; secure_url: string; };
    reason?: any;
    fileName: string;
}

const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<{public_id: string, secure_url: string}> => {
    const public_id = `brc-infinity-products/${fileName.split('.').slice(0, -1).join('.')}-${Date.now()}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { public_id, overwrite: true },
            (error, result) => {
                if (error) return reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
                if (result) return resolve({ public_id: result.public_id, secure_url: result.secure_url });
                reject(new Error('Cloudinary upload did not return a result.'));
            }
        );
        stream.pipe(uploadStream);
    });
};

const deleteFromCloudinary = (public_id: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};

export async function POST(req: NextRequest) {
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

    // --- PHASE 1: UPLOAD ALL IMAGES TO CLOUDINARY --- 
    const uploadPromises: Promise<CloudinaryUploadResult>[] = files.map(async file => {
        const metadata = productMetadata.find(p => p.fileName === file.name);
        if (!metadata) {
            return { status: 'rejected', reason: 'No matching metadata found', fileName: file.name };
        }

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);
            const result = await uploadStreamToCloudinary(readableStream, file.name);
            return { status: 'fulfilled', value: result, fileName: file.name };
        } catch (error) {
            return { status: 'rejected', reason: error, fileName: file.name };
        }
    });

    const uploadResults = await Promise.all(uploadPromises);

    const successfulUploads = uploadResults.filter(r => r.status === 'fulfilled');
    const failedUploads = uploadResults.filter(r => r.status === 'rejected');

    // --- ROLLBACK PHASE: If any upload fails, delete successful ones and abort --- 
    if (failedUploads.length > 0) {
        console.error("Bulk import failed. Rolling back successful uploads.", { failedUploads });
        const rollbackPromises = successfulUploads.map(r => r.value?.public_id ? deleteFromCloudinary(r.value.public_id) : Promise.resolve());
        await Promise.all(rollbackPromises);

        const firstError = failedUploads[0];
        const errorMessage = firstError.reason instanceof Error ? firstError.reason.message : String(firstError.reason);

        return NextResponse.json({
             message: `The import failed. Could not upload file '${firstError.fileName}'. Reason: ${errorMessage}` 
        }, { status: 500 });
    }

    // --- PHASE 2: COMMIT TO DATABASE (only if all uploads succeeded) ---
    try {
        const batch = writeBatch(db);
        const productCollection = collection(db, 'products');

        uploadResults.forEach(result => {
            const metadata = productMetadata.find(p => p.fileName === result.fileName);
            const uploadValue = result.value;

            if (metadata && uploadValue) {
                const productData = {
                    id: metadata.id, 
                    name: { en: metadata.name, fr: metadata.name, tr: metadata.name },
                    category: { en: 'Uncategorized', fr: 'Non classé', tr: 'Kategorize edilmemiş' },
                    style: 'Modern',
                    shortDescription: { en: '', fr: '', tr: '' },
                    description: { en: '', fr: '', tr: '' },
                    price: metadata.price,
                    stock: metadata.stock,
                    imageUrl: uploadValue.secure_url,
                };
                const docRef = doc(productCollection, metadata.id);
                batch.set(docRef, productData);
            }
        });

        await batch.commit();

        return NextResponse.json({ message: `${productMetadata.length} products added successfully` }, { status: 201 });

    } catch (dbError: any) {
        // If DB commit fails, we must still roll back the Cloudinary uploads
        console.error("Database commit failed after successful image uploads. Rolling back images.", { dbError });
        const rollbackPromises = successfulUploads.map(r => r.value?.public_id ? deleteFromCloudinary(r.value.public_id) : Promise.resolve());
        await Promise.all(rollbackPromises);
        
        return NextResponse.json({ message: `Database error after uploads: ${dbError.message}. All uploaded images have been deleted.` }, { status: 500 });
    }
}
