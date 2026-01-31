
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import cloudinary from '@/lib/cloudinary';
import axios from 'axios';

// Reusable function to upload a file stream to Cloudinary
const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'google-drive-link-imports',
        public_id: fileName,
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

// Function to extract file ID from Google Drive link
const getGoogleDriveFileId = (link: string): string | null => {
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    if (!link) {
      return NextResponse.json({ error: 'Google Drive link is required.' }, { status: 400 });
    }

    const fileId = getGoogleDriveFileId(link);

    if (!fileId) {
        return NextResponse.json({ error: 'Invalid Google Drive link format. Please use a link like "https://drive.google.com/file/d/FILE_ID/view".' }, { status: 400 });
    }

    // Construct the direct download link
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Fetch the file from the download link as a stream
    const response = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream',
    });

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
        return NextResponse.json({ error: 'The linked file is not a valid image. Please link to an image file.' }, { status: 400 });
    }

    // We need a file name. We can try to get it from headers or just use the fileId.
    const contentDisposition = response.headers['content-disposition'];
    let fileName = fileId; // default
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length > 1) {
            fileName = decodeURIComponent(fileNameMatch[1]);
        }
    }

    const readableNodeStream = response.data as Readable;

    // Upload the stream to Cloudinary
    const imageUrl = await uploadStreamToCloudinary(readableNodeStream, fileName);

    return NextResponse.json({ imageUrls: [imageUrl] }); // return as array for consistency

  } catch (error: any) {
    console.error('[Google Drive Link Import API Error]', error);
    return NextResponse.json({ error: 'Could not download file from Google Drive. Please ensure the link is public ("Anyone with the link").' }, { status: 500 });
  }
}
