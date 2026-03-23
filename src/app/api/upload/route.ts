import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

import { sanitizeUploadFileName } from '@/lib/upload-utils';

export const runtime = 'nodejs';

const PDF_MIME_TYPE = 'application/pdf';
const IMAGE_EXTENSION_SET = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'bmp',
  'svg',
  'avif',
  'heic',
  'heif',
  'jfif',
]);
const EXTRA_IMAGE_MIME_TYPES = new Set([
  'application/heic',
  'application/heif',
]);
const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');
const CLOUDINARY_REQUIRED_ENV_VARS = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const;
const hasCloudinaryConfig = CLOUDINARY_REQUIRED_ENV_VARS.every((key) => Boolean(process.env[key]));

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

const createReadableStream = (buffer: Buffer) => {
  const readableNodeStream = new Readable();
  readableNodeStream.push(buffer);
  readableNodeStream.push(null);
  return readableNodeStream;
};

const saveFileLocally = async ({
  buffer,
  fileName,
  resourceType,
}: {
  buffer: Buffer;
  fileName: string;
  resourceType: 'image' | 'raw';
}) => {
  const subfolder = resourceType === 'raw' ? 'catalogs' : 'images';
  const uploadDirectory = path.join(LOCAL_UPLOAD_ROOT, subfolder);
  const extension = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1) : '';
  const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
  const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
  const outputFileName = extension ? `${baseName}-${uniqueSuffix}.${extension}` : `${baseName}-${uniqueSuffix}`;
  const outputFilePath = path.join(uploadDirectory, outputFileName);

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(outputFilePath, buffer);

  return `/uploads/${subfolder}/${outputFileName}`;
};

const isPdfFile = (file: File) => file.type === PDF_MIME_TYPE || file.name.toLowerCase().endsWith('.pdf');

const getFileExtension = (fileName: string) => {
  const normalizedName = fileName.toLowerCase();
  return normalizedName.includes('.') ? normalizedName.substring(normalizedName.lastIndexOf('.') + 1) : '';
};

const isImageFile = (file: File) =>
  file.type.startsWith('image/') ||
  EXTRA_IMAGE_MIME_TYPES.has(file.type.toLowerCase()) ||
  IMAGE_EXTENSION_SET.has(getFileExtension(file.name));

export async function POST(req: NextRequest) {
    try {
        // 1. Parse the incoming form data to get the files
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
        }

        // 2. Upload each file to Cloudinary when configured, otherwise store it locally.
        const uploadResults = await Promise.allSettled(
            files.map(async (file) => {
                const isPdf = isPdfFile(file);
                const isImage = isImageFile(file);
                const safeFileName = sanitizeUploadFileName(
                    file,
                    isPdf ? 'katalog-dosyasi' : 'gorsel-dosyasi'
                );

                if (!isPdf && !isImage) {
                    throw new Error(`'${file.name || safeFileName}' desteklenmeyen bir dosya turu. JPG, PNG, WEBP, HEIC veya PDF kullan.`);
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const resourceType = isPdf ? 'raw' : 'image';
                let url = '';

                if (hasCloudinaryConfig) {
                    try {
                        url = await uploadStreamToCloudinary({
                            stream: createReadableStream(buffer),
                            fileName: safeFileName,
                            resourceType,
                            folder: isPdf ? 'catalog-uploads' : 'direct-uploads',
                        });
                    } catch (cloudinaryError) {
                        console.error('[Upload API] Cloudinary upload failed, falling back to local storage.', cloudinaryError);
                    }
                }

                if (!url) {
                    url = await saveFileLocally({
                        buffer,
                        fileName: safeFileName,
                        resourceType,
                    });
                }

                return {
                    name: safeFileName,
                    type: isPdf ? 'pdf' : 'image',
                    url,
                };
            })
        );

        const uploadedFiles = uploadResults
            .filter((result): result is PromiseFulfilledResult<{ name: string; type: 'pdf' | 'image'; url: string }> => result.status === 'fulfilled')
            .map((result) => result.value);
        const uploadErrors = uploadResults
            .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
            .map((result) => result.reason instanceof Error ? result.reason.message : 'Dosya yuklenemedi.');

        if (uploadedFiles.length === 0) {
            return NextResponse.json(
                {
                    error: uploadErrors[0] || 'Dosyalar yuklenemedi.',
                    errors: uploadErrors,
                },
                { status: 400 }
            );
        }

        const uploadedUrls = uploadedFiles.map((file) => file.url);
        const imageUrls = uploadedFiles.filter((file) => file.type === 'image').map((file) => file.url);
        const pdfUrls = uploadedFiles.filter((file) => file.type === 'pdf').map((file) => file.url);

        // 3. Return the generated URLs without breaking existing upload consumers
        return NextResponse.json({
            uploadedUrls,
            imageUrls,
            pdfUrls,
            errors: uploadErrors,
            storageProvider: hasCloudinaryConfig ? 'cloudinary-or-local-fallback' : 'local',
        });

    } catch (error: any) {
        console.error('[Direct Upload API Error]', error);
        // Return a generic but informative error to the client
        return NextResponse.json({ error: error.message || 'An unknown server error occurred during file upload.' }, { status: 500 });
    }
}
