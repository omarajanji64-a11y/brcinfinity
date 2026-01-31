'''
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

// Configure Cloudinary with your credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This function will upload a file stream to Cloudinary
const uploadToCloudinary = (fileStream: stream.Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'google-drive-imports', // Optional: specify a folder in Cloudinary
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(error);
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
    const { googleDriveLink } = await req.json();

    if (!googleDriveLink) {
        return NextResponse.json({ error: 'Google Drive link is required' }, { status: 400 });
    }

    try {
        // 1. Authenticate with Google Drive API using a Service Account
        // Make sure to share your Google Drive folder with the service account's email address
        const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // 2. Extract Folder ID from Google Drive Link
        const folderIdMatch = googleDriveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (!folderIdMatch || !folderIdMatch[1]) {
            return NextResponse.json({ error: 'Invalid Google Drive folder link' }, { status: 400 });
        }
        const folderId = folderIdMatch[1];

        // 3. List files in the Google Drive folder
        const listResponse = await drive.files.list({
            q: `\'${folderId}\' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
            fields: 'files(id, name)',
        });

        const files = listResponse.data.files;
        if (!files || files.length === 0) {
            return NextResponse.json({ imageUrls: [] });
        }

        // 4. Download from Drive and Upload to Cloudinary for each file
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                if (!file.id || !file.name) {
                  throw new Error("A file is missing an ID or a name.");
                }
                
                // Get the file stream from Google Drive
                const fileResponse = await drive.files.get(
                    { fileId: file.id, alt: 'media' },
                    { responseType: 'stream' }
                );

                // Upload the stream to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(fileResponse.data as stream.Readable, file.name);
                return cloudinaryUrl;
            })
        );

        // 5. Return the Cloudinary URLs
        return NextResponse.json({ imageUrls });

    } catch (error) {
        console.error('An error occurred during the import process:', error);
        // A more specific error could be returned based on the error type
        return NextResponse.json({ error: 'Failed to import images. Please check your setup and permissions.' }, { status: 500 });
    }
}
''