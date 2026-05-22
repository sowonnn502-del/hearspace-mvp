const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.7;
const MAX_FILE_SIZE = 400 * 1024; // 400KB
const MIN_QUALITY = 0.2;

export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = calcDimensions(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_FILE_SIZE && quality > MIN_QUALITY) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

function calcDimensions(originalWidth: number, originalHeight: number) {
  if (originalWidth <= MAX_WIDTH) {
    return { width: originalWidth, height: originalHeight };
  }
  const ratio = MAX_WIDTH / originalWidth;
  return {
    width: MAX_WIDTH,
    height: Math.round(originalHeight * ratio),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/jpeg",
      quality,
    );
  });
}

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
