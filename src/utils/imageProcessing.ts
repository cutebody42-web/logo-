/**
 * Utility functions for logo and image processing
 */

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    img.src = src;
  });
}

/**
 * Remove background (white or black) with adjustable tolerance threshold
 */
export function removeImageBackground(
  image: HTMLImageElement,
  targetColor: 'white' | 'black',
  tolerance: number // 1 to 100
): string {
  if (tolerance <= 0) return image.src;

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return image.src;

  ctx.drawImage(image, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Convert tolerance (0-100) to RGB distance threshold (0-255)
  const threshold = (tolerance / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    if (targetColor === 'white') {
      // Distance from pure white (255, 255, 255)
      const dist = Math.sqrt(
        (255 - r) ** 2 +
        (255 - g) ** 2 +
        (255 - b) ** 2
      );
      if (dist < threshold) {
        // Soft edge anti-aliasing near boundary
        const alphaFactor = Math.max(0, (dist / threshold) ** 2);
        data[i + 3] = Math.round(a * alphaFactor);
      }
    } else {
      // Distance from pure black (0, 0, 0)
      const dist = Math.sqrt(r ** 2 + g ** 2 + b ** 2);
      if (dist < threshold) {
        const alphaFactor = Math.max(0, (dist / threshold) ** 2);
        data[i + 3] = Math.round(a * alphaFactor);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Download a data URL as a file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy image data URL to system clipboard as PNG blob
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}
