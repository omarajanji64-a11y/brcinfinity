
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import cloudinary from '@/lib/cloudinary';
import axios from 'axios';

type DriveLinkType = 'file' | 'folder';

type DriveLinkInfo = {
  id: string;
  type: DriveLinkType;
};

type UploadResult = {
  public_id: string;
  secure_url: string;
  original_filename: string;
};

type UploadOutcome = {
  status: 'fulfilled' | 'rejected';
  value?: UploadResult;
  reason?: unknown;
  fileName: string;
};

const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const DRIVE_FOLDER = 'google-drive-link-imports';
const MAX_FOLDER_IMAGES = 50;

const uploadStreamToCloudinary = (stream: Readable, fileName: string): Promise<UploadResult> => {
  const safeBaseName = fileName.replace(/[^\w.-]/g, '_');
  const public_id = `${safeBaseName}-${Date.now()}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: DRIVE_FOLDER,
        public_id,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed for ${fileName}: ${error.message}`));
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: fileName,
          });
        } else {
          reject(new Error('Cloudinary upload did not return a result.'));
        }
      }
    );
    stream.pipe(uploadStream);
  });
};

const deleteFromCloudinary = (public_id: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const parseDriveLink = (link: string): DriveLinkInfo | null => {
  const folderMatch = link.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return { id: folderMatch[1], type: 'folder' };

  const fileMatch = link.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return { id: fileMatch[1], type: 'file' };

  const openMatch = link.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return { id: openMatch[1], type: 'file' };

  const ucMatch = link.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return { id: ucMatch[1], type: 'file' };

  return null;
};

const fetchFolderName = async (folderId: string): Promise<string | null> => {
  if (!GOOGLE_DRIVE_API_KEY) return null;
  const response = await axios.get<{ name?: string }>(
    `https://www.googleapis.com/drive/v3/files/${folderId}?fields=name&key=${GOOGLE_DRIVE_API_KEY}`
  );
  return response.data?.name ?? null;
};

const listFolderImages = async (folderId: string) => {
  if (!GOOGLE_DRIVE_API_KEY) {
    throw new Error('Google Drive API key is required to import folder links.');
  }

  const images: { id: string; name: string; mimeType: string }[] = [];
  let pageToken: string | undefined;

  do {
    const response = await axios.get<{
      nextPageToken?: string;
      files: { id: string; name: string; mimeType: string }[];
    }>(
      `https://www.googleapis.com/drive/v3/files`,
      {
        params: {
          q: `'${folderId}' in parents and trashed=false`,
          fields: 'nextPageToken,files(id,name,mimeType)',
          pageSize: 1000,
          key: GOOGLE_DRIVE_API_KEY,
          pageToken,
        },
      }
    );

    const files = response.data?.files ?? [];
    for (const file of files) {
      if (file.mimeType?.startsWith('image/')) {
        images.push(file);
        if (images.length >= MAX_FOLDER_IMAGES) {
          return images;
        }
      }
    }

    pageToken = response.data?.nextPageToken;
  } while (pageToken);

  return images;
};

const downloadDriveFileAsStream = async (fileId: string) => {
  if (GOOGLE_DRIVE_API_KEY) {
    return axios.get<Readable>(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        params: {
          alt: 'media',
          key: GOOGLE_DRIVE_API_KEY,
          acknowledgeAbuse: true,
        },
        responseType: 'stream',
      }
    );
  }

  return axios.get<Readable>(
    `https://drive.google.com/uc`,
    {
      params: {
        export: 'download',
        id: fileId,
      },
      responseType: 'stream',
    }
  );
};

const runWithConcurrency = async <T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) => {
  const results: R[] = [];
  let index = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await task(items[currentIndex]);
    }
  });

  await Promise.all(workers);
  return results;
};

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    if (!link) {
      return NextResponse.json({ error: 'Google Drive link is required.' }, { status: 400 });
    }

    const driveInfo = parseDriveLink(link);

    if (!driveInfo) {
      return NextResponse.json(
        { error: 'Invalid Google Drive link format. Please use a file or folder link from drive.google.com.' },
        { status: 400 }
      );
    }

    let filesToUpload: { id: string; name: string }[] = [];
    let folderName: string | null = null;

    if (driveInfo.type === 'folder') {
      const images = await listFolderImages(driveInfo.id);
      if (images.length === 0) {
        return NextResponse.json(
          { error: 'No images found in this Google Drive folder. Please ensure the folder contains image files.' },
          { status: 400 }
        );
      }

      filesToUpload = images.map((image) => ({ id: image.id, name: image.name }));
      folderName = await fetchFolderName(driveInfo.id);
    } else {
      filesToUpload = [{ id: driveInfo.id, name: driveInfo.id }];
    }

    const uploadOutcomes = await runWithConcurrency(filesToUpload, 3, async (file) => {
      try {
        const response = await downloadDriveFileAsStream(file.id);
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`The linked file ${file.name} is not a valid image.`);
        }

        const contentDisposition = response.headers['content-disposition'];
        let fileName = file.name;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch.length > 1) {
            fileName = decodeURIComponent(fileNameMatch[1]);
          }
        }

        const upload = await uploadStreamToCloudinary(response.data as Readable, fileName);
        return { status: 'fulfilled', value: upload, fileName } as UploadOutcome;
      } catch (error) {
        return { status: 'rejected', reason: error, fileName: file.name } as UploadOutcome;
      }
    });

    const successfulUploads = uploadOutcomes.filter((result): result is UploadOutcome & { value: UploadResult } => result.status === 'fulfilled' && !!result.value);
    const failedUploads = uploadOutcomes.filter((result) => result.status === 'rejected');

    if (failedUploads.length > 0) {
      await Promise.all(successfulUploads.map((result) => deleteFromCloudinary(result.value.public_id)));
      const firstError = failedUploads[0];
      const errorMessage = firstError.reason instanceof Error ? firstError.reason.message : String(firstError.reason);
      return NextResponse.json(
        { error: `Import failed. Could not upload file '${firstError.fileName}'. Reason: ${errorMessage}` },
        { status: 500 }
      );
    }

    const imageUrls = successfulUploads.map((upload) => upload.value.secure_url);

    return NextResponse.json({
      imageUrls,
      folderName,
      source: driveInfo.type,
    });
  } catch (error: any) {
    console.error('[Google Drive Link Import API Error]', error);

    if (String(error?.message || '').includes('Google Drive API key')) {
      return NextResponse.json(
        { error: 'Missing Google Drive API key. Please set GOOGLE_DRIVE_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Could not download files from Google Drive. Please ensure the link is public ("Anyone with the link").' },
      { status: 500 }
    );
  }
}
