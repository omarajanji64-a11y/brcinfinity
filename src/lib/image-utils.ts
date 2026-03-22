const NEXT_IMAGE_ALLOWED_HOSTNAMES = new Set([
  'images.unsplash.com',
  'i.ibb.co',
  'picsum.photos',
  'res.cloudinary.com',
]);

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
