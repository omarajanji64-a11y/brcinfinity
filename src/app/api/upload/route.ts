
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable function to upload a stream to Cloudinary
const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'direct-uploads', 
        public_id: fileName.substring(0, fileName.lastIndexOf('.')) || fileName
      },
      (error, result) => {
        if (error) reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
        else if (result) resolve(result.secure_url);
        else reject(new Error('Cloudinary upload did not return a result.'));
      }
    );
    stream.pipe(uploadStream);
  });
};

export async function POST(req: NextRequest) {
    try {
        // 1. Check for required environment variables
        const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
        for (const v of requiredEnvVars) {
            if (!process.env[v]) {
                throw new Error(`Missing required environment variable: ${v}. Cannot process uploads.`);
            }
        }

        // 2. Parse the incoming FormData
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
        }

        // 3. Upload each file to Cloudinary
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                // Convert the Web API File stream to a Node.js Readable stream
                const readableNodeStream = Readable.fromWeb(file.stream() as any);
                return uploadStreamToCloudinary(readableNodeStream, file.name);
            })
        );
        
        // 4. Return the URLs of the uploaded images
        return NextResponse.json({ imageUrls });

    } catch (error: any) {
        console.error('[Upload API Error]', error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred during upload.' }, { status: 500 });
    }
}
