
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

const uploadToCloudinary = (fileStream: stream.Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'google-drive-imports',
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload failed to return a result.'));
        }
      }
    );
    fileStream.pipe(uploadStream);
  });
};

export async function POST(req: NextRequest) {
    // 1. Environment Variable Check
    const requiredEnvVars = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'GOOGLE_SERVICE_ACCOUNT_EMAIL',
        'GOOGLE_PRIVATE_KEY',
    ];
    const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingEnvVars.length > 0) {
        const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}. Please check your server configuration.`;
        console.error(errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    try {
        const { googleDriveLink } = await req.json();

        if (!googleDriveLink) {
            return NextResponse.json({ error: 'Google Drive link is required' }, { status: 400 });
        }

        // 2. Extract Folder ID
        const folderIdMatch = googleDriveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (!folderIdMatch || !folderIdMatch[1]) {
            return NextResponse.json({ error: 'Invalid Google Drive folder link. Please provide a valid folder link.' }, { status: 400 });
        }
        const folderId = folderIdMatch[1];

        // 3. Google Drive Authentication
        const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // 4. List files in the folder
        const listResponse = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
            fields: 'files(id, name)',
            pageSize: 100
        });

        const files = listResponse.data.files;
        if (!files || files.length === 0) {
            return NextResponse.json({ imageUrls: [], message: 'No image files (JPEG or PNG) found in the specified Google Drive folder.' });
        }

        // 5. Download from Drive and Upload to Cloudinary
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                if (!file.id || !file.name) {
                  console.warn("A file in Google Drive is missing an ID or a name, skipping it.", file);
                  return null; // Skip this file
                }
                
                try {
                    const fileResponse = await drive.files.get(
                        { fileId: file.id, alt: 'media' },
                        { responseType: 'stream' }
                    );
                    const cloudinaryUrl = await uploadToCloudinary(fileResponse.data as stream.Readable, file.name);
                    return cloudinaryUrl;
                } catch(uploadError: any) {
                    console.error(`Failed to process file ${file.name} (ID: ${file.id}):`, uploadError);
                    throw new Error(`Failed to process file '${file.name}': ${uploadError.message}`);
                }
            })
        );
        
        const successfulUploads = imageUrls.filter(url => url !== null) as string[];

        // 6. Return the Cloudinary URLs
        return NextResponse.json({ imageUrls: successfulUploads });

    } catch (error: any) {
        console.error('Full error object during import:', error);

        if (error.message.includes("cannot use 'in' operator to search for '_delegate'")) {
            const detailedMessage = `Google Drive authentication failed. This is often due to malformed or incorrect service account credentials in your environment variables. Please double-check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.`;
            return NextResponse.json({ error: detailedMessage }, { status: 500 });
        }

        if (error.code && error.errors) {
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
