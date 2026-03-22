
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const runtime = 'nodejs';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable function to upload a file stream to Cloudinary
const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const safeFileName = fileName.replace(/[^\w.-]/g, '_');
    const fileBaseName = safeFileName.includes('.')
      ? safeFileName.substring(0, safeFileName.lastIndexOf('.'))
      : safeFileName;
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'direct-uploads',
        public_id: `${fileBaseName}-${Date.now()}`,
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
        // 1. Verify that required environment variables are present
        const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
        for (const v of requiredEnvVars) {
            if (!process.env[v]) {
                console.error(`Missing Cloudinary environment variable: ${v}`);
                throw new Error(`Server configuration error: Missing required variable '${v}'. Uploads are disabled.`);
            }
        }

        // 2. Parse the incoming form data to get the files
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
        }

        // 3. Upload each file to Cloudinary in parallel
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                if (!file.type.startsWith('image/')) {
                    throw new Error(`'${file.name}' bir gorsel dosyasi degil.`);
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const readableNodeStream = new Readable();
                readableNodeStream.push(buffer);
                readableNodeStream.push(null);

                return uploadStreamToCloudinary(readableNodeStream, file.name);
            })
        );
        
        // 4. Return the secure URLs of the uploaded images
        return NextResponse.json({ imageUrls });

    } catch (error: any) {
        console.error('[Direct Upload API Error]', error);
        // Return a generic but informative error to the client
        return NextResponse.json({ error: error.message || 'An unknown server error occurred during file upload.' }, { status: 500 });
    }
}
