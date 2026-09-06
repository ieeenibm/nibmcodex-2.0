export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d';

export const CLOUDINARY_CONFIG = {
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
};

export interface CloudinaryOptimizeOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  format?: string;
}

/**
 * Transforms a raw Cloudinary delivery URL into an optimized direct-CDN URL
 * with auto format (f_auto), auto quality (q_auto), and optional resizing/cropping.
 */
export function getOptimizedCloudinaryUrl(
  url: string | undefined | null,
  options: CloudinaryOptimizeOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('res.cloudinary.com')) return url;

  // If already transformed between /upload/ and /v1/ (or version string)
  if (/\/image\/upload\/[^v/][^/]*\/v\d+/.test(url)) {
    return url;
  }

  const {
    width,
    height,
    crop,
    gravity,
    quality = 'auto',
    format = 'auto',
  } = options;

  const transforms: string[] = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);

  const transformString = transforms.join(',');
  if (!transformString) return url;

  return url.replace('/image/upload/', `/image/upload/${transformString}/`);
}


