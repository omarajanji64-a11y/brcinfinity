
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
        const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
        if (missingEnvVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}. Please check your server configuration.`);
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
        const private_key_from_env = process.env.GOOGLE_PRIVATE_KEY!;
        const private_key = private_key_from_env.replace(/\\n/g, '\n');

        if (!private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
            throw new Error("The `GOOGLE_PRIVATE_KEY` environment variable appears to be malformed. It should start with '-----BEGIN PRIVATE KEY-----'. Please check your environment configuration.");
        }

        const auth = new google.auth.GoogleAuth({
            credentials: { client_email, private_key },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        if (!auth || typeof auth.getAccessToken !== 'function') {
            throw new Error("The Google authentication object could not be created correctly. This is a strong indicator that the service account credentials (email or private key) are invalid or malformed. Please verify them in your environment variables.");
        }

        const drive = google.drive({ version: 'v3', auth });

        const listResponse = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
            fields: 'files(id, name)',
            pageSize: 100
        });

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
        console.error('An error occurred during the import process:', error);

        if (error.code && error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
            const googleError = error.errors[0];
            let detailedMessage = googleError.message || 'A Google API error occurred.';
            if (googleError.reason === 'notFound') {
                detailedMessage = `The specified Google Drive folder was not found. Please check the link and ensure the folder is shared with the service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}.`;
            } else if (googleError.reason === 'forbidden') {
                 detailedMessage = `Permission denied for the Google Drive folder. Please ensure the folder is shared with the service account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}.`;
            }
            return NextResponse.json({ error: detailedMessage }, { status: 500 });
        }
        
        const errorMessage = error.message || 'An unknown error occurred during image import. Please check server logs.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
