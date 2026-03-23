const MIME_TYPE_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'application/heic': 'heic',
  'application/heif': 'heif',
  'application/pdf': 'pdf',
};

const getMimeType = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const getFileExtension = (fileName: string) => {
  const trimmedFileName = fileName.trim();

  if (!trimmedFileName.includes('.')) {
    return '';
  }

  return trimmedFileName.substring(trimmedFileName.lastIndexOf('.') + 1).toLowerCase();
};

const sanitizeBaseName = (value: string, fallbackBaseName: string) => {
  const normalizedSource = (() => {
    try {
      return value.normalize('NFKD');
    } catch {
      return value;
    }
  })();
  const normalizedValue = normalizedSource
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalizedValue || fallbackBaseName;
};

export const sanitizeUploadFileName = (
  file: Pick<File, 'name' | 'type'>,
  fallbackBaseName = 'upload-file'
) => {
  const originalExtension = getFileExtension(file.name);
  const inferredExtension = MIME_TYPE_EXTENSION_MAP[getMimeType(file.type)] ?? '';
  const safeExtension = originalExtension || inferredExtension;
  const baseNameSource = originalExtension ? file.name.slice(0, -(originalExtension.length + 1)) : file.name;
  const safeBaseName = sanitizeBaseName(baseNameSource, fallbackBaseName);

  return safeExtension ? `${safeBaseName}.${safeExtension}` : safeBaseName;
};

export const createSafeUploadFile = (file: File, fallbackBaseName = 'upload-file') => {
  const safeName = sanitizeUploadFileName(file, fallbackBaseName);

  if (!safeName || safeName === file.name) {
    return file;
  }

  try {
    return new File([file], safeName, {
      type: file.type || 'application/octet-stream',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
};

export const appendUploadFile = (
  formData: FormData,
  fieldName: string,
  file: File,
  fallbackBaseName = 'upload-file'
) => {
  const safeFile = createSafeUploadFile(file, fallbackBaseName);

  try {
    formData.append(fieldName, safeFile);
    return;
  } catch {
    // Last-resort fallback for browsers that reject cloned File objects.
  }

  const safeName = sanitizeUploadFileName(file, fallbackBaseName);

  try {
    formData.append(fieldName, new Blob([file], { type: file.type || 'application/octet-stream' }), safeName);
  } catch {
    formData.append(fieldName, file);
  }
};
