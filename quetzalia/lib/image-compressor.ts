export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

const MAX_UNCOMPRESSED_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_WIDTH = 1600; // 1600 px de ancho máximo
const JPEG_QUALITY = 0.85; // Calidad para obtener un archivo de ~300-500 KB

export async function compressImage(file: File): Promise<CompressionResult> {
  // 1. Validar tipo de archivo
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen válida.");
  }

  // 2. Validar tamaño máximo antes de comprimir (5 MB)
  if (file.size > MAX_UNCOMPRESSED_SIZE) {
    throw new Error(
      `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB y supera el límite de 5 MB sin comprimir.`
    );
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Escalar si el ancho supera 1600 px manteniendo proporción
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo inicializar el contexto de compresión gráfica."));
        return;
      }

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

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
