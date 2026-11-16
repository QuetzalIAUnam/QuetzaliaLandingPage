export interface CompressionResult {
  file: File;
  base64: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

const MAX_UNCOMPRESSED_SIZE = 15 * 1024 * 1024; // 15 MB para soportar fotos tomadas con celulares modernos
const MAX_DIMENSION = 800; // 800 px para optimizar peso en Firestore (<60 KB) manteniendo nitidez HD
const JPEG_QUALITY = 0.75; // Calidad óptima para almacenamiento directo en Firestore

export async function compressImage(file: File): Promise<CompressionResult> {
  // 1. Validar tipo de archivo
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen válida.");
  }

  // 2. Validar tamaño máximo antes de comprimir (15 MB)
  if (file.size > MAX_UNCOMPRESSED_SIZE) {
    throw new Error(
      `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB y supera el límite de 15 MB sin comprimir.`
    );
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Escalar si el ancho o alto supera MAX_DIMENSION px manteniendo proporción
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo inicializar el contexto de compresión gráfica."));
        return;
      }

      // Fondo blanco para imágenes transparentes (PNG) al convertir a JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Generar Data URL Base64 para guardado instantáneo en Firestore
      const base64 = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

      // Exportar en JPEG optimizado
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Error al generar el archivo comprimido."));
            return;
          }

          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve({
            file: compressedFile,
            base64,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            width,
            height,
          });
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen seleccionada."));
    };

    img.src = objectUrl;
  });
}
