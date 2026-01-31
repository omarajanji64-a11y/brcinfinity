
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileStream: stream.Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'google-drive-imports', public_id: fileName },
      (error, result) => {
        if (error) reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
        else if (result) resolve(result.secure_url);
        else reject(new Error('Cloudinary upload failed to return a result.'));
      }
    );
    fileStream.pipe(uploadStream);
  });
};

export async function POST(req: NextRequest) {
    try {
        const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
        for (const v of requiredEnvVars) {
            if (!process.env[v]) {
                throw new Error(`Missing required environment variable: ${v}. Please check your server configuration.`);
            }
        }

        const { googleDriveLink } = await req.json();
        if (!googleDriveLink) {
            return NextResponse.json({ error: 'Google Drive link is required' }, { status: 400 });
        }

        const folderIdMatch = googleDriveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (!folderIdMatch || !folderIdMatch[1]) {
            return NextResponse.json({ error: 'Invalid Google Drive folder link. Please provide a valid folder link.' }, { status: 400 });
        }
        const folderId = folderIdMatch[1];

        const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
        const private_key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

        if (!private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
            throw new Error("The `GOOGLE_PRIVATE_KEY` environment variable appears to be malformed. It must be a string that starts with '-----BEGIN PRIVATE KEY-----'.");
        }
         if (!client_email.includes('@')) {
             throw new Error("The `GOOGLE_SERVICE_ACCOUNT_EMAIL` environment variable is malformed. It must be a valid service account email address.");
        }

        const auth = new google.auth.GoogleAuth({
            credentials: { client_email, private_key },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        let listResponse;
        try {
            listResponse = await drive.files.list({
                q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
                fields: 'files(id, name)',
                pageSize: 100
            });
        } catch (error: any) {
            // Definitive fix: Check only the error message, as the error type can be inconsistent.
            if (error?.message?.includes("cannot use 'in' operator to search for '_delegate'")) {
                 const detailedMessage = "A critical Google Drive authentication error occurred. This is caused by malformed credentials in your environment variables. Please meticulously check your `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`. The private key must be correctly formatted, including the `-----BEGIN` and `-----END` lines, with `\n` for newlines.";
                 return NextResponse.json({ error: detailedMessage }, { status: 500 });
            }
            // Re-throw other errors to be handled by the main catch block
            throw error;
        }

        const files = listResponse.data.files;
        if (!files || files.length === 0) {
            return NextResponse.json({ imageUrls: [], message: 'No image files (JPEG or PNG) found in the specified Google Drive folder.' });
        }

        const imageUrls = await Promise.all(
            files.map(async (file) => {
                if (!file.id || !file.name) return null;
                const fileResponse = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'stream' });
                return uploadToCloudinary(fileResponse.data as stream.Readable, file.name);
            })
        );
        
        const successfulUploads = imageUrls.filter(Boolean) as string[];
        return NextResponse.json({ imageUrls: successfulUploads });

    } catch (error: any) {
        console.error('[Import API Error]', error);

        if (error.code === 404 || (error.errors && error.errors[0]?.reason === 'notFound')) {
            return NextResponse.json({ error: `The specified Google Drive folder was not found. Please check the link and ensure the folder is shared with the service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}.` }, { status: 404 });
        }
        if (error.code === 403 || (error.errors && error.errors[0]?.reason === 'forbidden')) {
             return NextResponse.json({ error: `Permission denied for the Google Drive folder. Please ensure the folder is shared with the service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}.` }, { status: 403 });
        }
        
        const errorMessage = error.message || 'An unknown error occurred during image import. Please check server logs.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
