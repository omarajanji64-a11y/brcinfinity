import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import cloudinary from '@/lib/cloudinary';

interface UploadResult {
    status: "fulfilled" | "rejected";
    value?: { public_id: string; secure_url: string; original_filename: string; };
    reason?: any;
    fileName: string;
}

const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<{public_id: string, secure_url: string, original_filename: string}> => {
    // Use a unique public_id to prevent overwrites and allow for easier rollbacks if needed.
    const public_id = `brc-infinity-products/${fileName.split('.').slice(0, -1).join('.')}-${Date.now()}`;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { public_id, overwrite: true },
            (error, result) => {
                if (error) return reject(new Error(`Upload failed for ${fileName}: ${error.message}`));
                if (result) return resolve({ public_id: result.public_id, secure_url: result.secure_url, original_filename: fileName });
                reject(new Error(`Upload for ${fileName} did not return a result.`));
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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files provided.' }, { status: 400 });
    }

    // --- PHASE 1: UPLOAD ALL IMAGES TO CLOUDINARY --- 
    const uploadPromises: Promise<UploadResult>[] = files.map(async file => {
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

    const successfulUploads = uploadResults.filter((r): r is { status: 'fulfilled', value: Required<UploadResult['value']>, fileName: string } => r.status === 'fulfilled' && r.value !== undefined);
    const failedUploads = uploadResults.filter(r => r.status === 'rejected');

    // --- ROLLBACK PHASE: If any upload fails, delete all successful ones and abort --- 
    if (failedUploads.length > 0) {
        console.error("Image upload failed. Rolling back successful uploads.", { failedUploads });
        const rollbackPromises = successfulUploads.map(r => deleteFromCloudinary(r.value.public_id));
        await Promise.all(rollbackPromises);

        const firstError = failedUploads[0];
        const errorMessage = firstError.reason instanceof Error ? firstError.reason.message : String(firstError.reason);

        return NextResponse.json({
             message: `The import failed. Could not upload file '${firstError.fileName}'. Reason: ${errorMessage}` 
        }, { status: 500 });
    }

    // --- SUCCESS: Return the URLs of the uploaded images --- 
    const responsePayload = {
        message: `${successfulUploads.length} images uploaded successfully.`,
        uploads: successfulUploads.map(r => ({ 
            fileName: r.fileName, 
            url: r.value.secure_url 
        }))
    };

    return NextResponse.json(responsePayload, { status: 200 });
}
