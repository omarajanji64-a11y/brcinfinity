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

const getFileExtension = (fileName: string) => {
  const trimmedFileName = fileName.trim();

  if (!trimmedFileName.includes('.')) {
    return '';
  }

  return trimmedFileName.substring(trimmedFileName.lastIndexOf('.') + 1).toLowerCase();
};

const sanitizeBaseName = (value: string, fallbackBaseName: string) => {
  const normalizedValue = value
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalizedValue || fallbackBaseName;
};

export const sanitizeUploadFileName = (file: File, fallbackBaseName = 'upload-file') => {
  const originalExtension = getFileExtension(file.name);
  const inferredExtension = MIME_TYPE_EXTENSION_MAP[file.type.toLowerCase()] ?? '';
  const safeExtension = originalExtension || inferredExtension;
  const baseNameSource = originalExtension ? file.name.slice(0, -(originalExtension.length + 1)) : file.name;
  const safeBaseName = sanitizeBaseName(baseNameSource, fallbackBaseName);

  return safeExtension ? `${safeBaseName}.${safeExtension}` : safeBaseName;
};
