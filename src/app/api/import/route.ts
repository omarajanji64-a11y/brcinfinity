
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable function to upload a stream to Cloudinary
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
        // 1. Environment Variable Validation
        const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
        for (const v of requiredEnvVars) {
            if (!process.env[v]) {
                throw new Error(`Critical: Missing required environment variable '${v}'.`);
            }
        }

        // 2. Input Validation
        const { googleDriveLink } = await req.json();
        if (!googleDriveLink) {
            return NextResponse.json({ error: 'Google Drive link is required.' }, { status: 400 });
        }

        const folderIdMatch = googleDriveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (!folderIdMatch || !folderIdMatch[1]) {
            return NextResponse.json({ error: 'Invalid Google Drive folder link format.' }, { status: 400 });
        }
        const folderId = folderIdMatch[1];

        // 3. Credential Preparation and Validation
        const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
        const private_key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

        if (!private_key.startsWith('-----BEGIN PRIVATE KEY-----') || !private_key.endsWith('-----END PRIVATE KEY-----\n')) {
            throw new Error("The `GOOGLE_PRIVATE_KEY` environment variable is severely malformed. It must be the full, unmodified key string, including the `-----BEGIN` and `-----END` markers, with newlines represented as `\n`.");
        }
         if (!client_email.includes('@') || !client_email.endsWith('.iam.gserviceaccount.com')) {
             throw new Error("The `GOOGLE_SERVICE_ACCOUNT_EMAIL` environment variable is malformed. It must be a valid Google service account email address.");
        }

        // 4. Direct JWT Authentication (Bypassing GoogleAuth)
        const jwtClient = new google.auth.JWT(
            client_email,
            undefined,
            private_key,
            ['https://www.googleapis.com/auth/drive.readonly'],
            undefined
        );

        // 5. Explicit Authorization Check
        try {
            await jwtClient.authorize();
        } catch (authError: any) {
            console.error("JWT Authorization Failed:", authError);
            const errorMessage = authError.message.includes('private key') 
                ? "Authentication failed due to an invalid private key. Please double-check the `GOOGLE_PRIVATE_KEY` variable."
                : "Authentication failed. Please verify both `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`.";
            throw new Error(errorMessage);
        }
        
        const drive = google.drive({ version: 'v3', auth: jwtClient });

        // 6. Google Drive API Call
        const listResponse = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
            fields: 'files(id, name)',
            pageSize: 100
        });

        const files = listResponse.data.files;
        if (!files || files.length === 0) {
            return NextResponse.json({ imageUrls: [], message: 'No image files (JPEG or PNG) found in the specified Google Drive folder.' });
        }

        // 7. Process and Upload Files
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
        console.error('[Import API Error]', error.message);

        let status = 500;
        let message = error.message || 'An unknown error occurred.';

        if (error.code === 404) {
            status = 404;
            message = `Folder not found. Check the link and sharing settings for: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`;
        }
        if (error.code === 403) {
            status = 403;
            message = `Permission denied. Please share the folder with: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`;
        }

        return NextResponse.json({ error: message }, { status });
    }
}
