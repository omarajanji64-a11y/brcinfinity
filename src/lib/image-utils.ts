const NEXT_IMAGE_ALLOWED_HOSTNAMES = new Set([
  'images.unsplash.com',
  'i.ibb.co',
  'picsum.photos',
  'res.cloudinary.com',
]);

type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  format?: string;
  quality?: string | number;
  progressive?: boolean;
  dprAuto?: boolean;
};

export const isLocalImagePath = (value: string) => value.startsWith('/');

export const isHttpsImageUrl = (value: string) => {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const canUseNextImage = (value: string) => {
  if (isLocalImagePath(value)) {
    return true;
  }

  if (!isHttpsImageUrl(value)) {
    return false;
  }

  try {
    return NEXT_IMAGE_ALLOWED_HOSTNAMES.has(new URL(value).hostname);
  } catch {
    return false;
  }
};

export const buildCloudinaryImageUrl = (value: string, options: CloudinaryImageOptions = {}) => {
  if (!value || !value.includes('/upload/')) {
    return value;
  }

  const parts = value.split('/upload/');
  const transformations = [
    `f_${options.format ?? 'auto'}`,
    `q_${options.quality ?? 'auto'}`,
    options.dprAuto === false ? null : 'dpr_auto',
    options.progressive === false ? null : 'fl_progressive',
    options.width ? `w_${Math.round(options.width)}` : null,
    options.height ? `h_${Math.round(options.height)}` : null,
    options.crop ? `c_${options.crop}` : null,
    options.gravity ? `g_${options.gravity}` : null,
  ]
    .filter(Boolean)
    .join(',');

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};
