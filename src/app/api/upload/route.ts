
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const runtime = 'nodejs';

const PDF_MIME_TYPE = 'application/pdf';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable function to upload a file stream to Cloudinary
const uploadStreamToCloudinary = ({
  stream,
  fileName,
  resourceType,
  folder,
}: {
  stream: Readable;
  fileName: string;
  resourceType: 'image' | 'raw';
  folder: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const safeFileName = fileName.replace(/[^\w.-]/g, '_');
    const fileBaseName = safeFileName.includes('.')
      ? safeFileName.substring(0, safeFileName.lastIndexOf('.'))
      : safeFileName;
    const fileExtension = safeFileName.includes('.') ? safeFileName.substring(safeFileName.lastIndexOf('.') + 1) : '';
    const publicIdBase = `${fileBaseName}-${Date.now()}`;
    const publicId = resourceType === 'raw' && fileExtension ? `${publicIdBase}.${fileExtension}` : publicIdBase;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: resourceType,
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

const isPdfFile = (file: File) => file.type === PDF_MIME_TYPE || file.name.toLowerCase().endsWith('.pdf');

const isImageFile = (file: File) => file.type.startsWith('image/');

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
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const isPdf = isPdfFile(file);
                const isImage = isImageFile(file);

                if (!isPdf && !isImage) {
                    throw new Error(`'${file.name}' desteklenmeyen bir dosya turu.`);
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const readableNodeStream = new Readable();
                readableNodeStream.push(buffer);
                readableNodeStream.push(null);

                const url = await uploadStreamToCloudinary({
                    stream: readableNodeStream,
                    fileName: file.name,
                    resourceType: isPdf ? 'raw' : 'image',
                    folder: isPdf ? 'catalog-uploads' : 'direct-uploads',
                });

                return {
                    name: file.name,
                    type: isPdf ? 'pdf' : 'image',
                    url,
                };
            })
        );

        const uploadedUrls = uploadedFiles.map((file) => file.url);
        const imageUrls = uploadedFiles.filter((file) => file.type === 'image').map((file) => file.url);
        const pdfUrls = uploadedFiles.filter((file) => file.type === 'pdf').map((file) => file.url);

        // 4. Return the secure URLs without breaking existing image upload consumers
        return NextResponse.json({ uploadedUrls, imageUrls, pdfUrls });

    } catch (error: any) {
        console.error('[Direct Upload API Error]', error);
        // Return a generic but informative error to the client
        return NextResponse.json({ error: error.message || 'An unknown server error occurred during file upload.' }, { status: 500 });
    }
}
