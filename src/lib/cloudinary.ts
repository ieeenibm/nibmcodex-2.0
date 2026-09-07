export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d';
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nibmcodex';

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

/**
 * Direct unsigned upload to Cloudinary using the 'nibmcodex' preset.
 * Enforces < 10MB limit and image MIME validation.
 */
export async function uploadImageToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const MAX_BYTES = 10 * 1024 * 1024; // 10MB Cloudinary free tier limit
  if (file.size > MAX_BYTES) {
    throw new Error(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 10MB.`);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WEBP, AVIF, GIF).');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'pulse_mini_ai_vs_human');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
  }

  const optimizedUrl = getOptimizedCloudinaryUrl(data.secure_url, {
    quality: 'auto',
    format: 'auto',
  });

  return {
    url: optimizedUrl,
    publicId: data.public_id,
  };
}
