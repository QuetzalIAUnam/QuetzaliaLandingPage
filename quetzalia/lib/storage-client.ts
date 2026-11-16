import { compressImage } from "./image-compressor";

// Almacenamiento directo en Base64 para Firestore (cero costos de Storage, instantáneo y sin plan Blaze)
export async function uploadPrivateSpeakerPhoto(
  file: File,
  userId?: string
): Promise<{ path: string; url: string }> {
  void userId;
  const result = await compressImage(file);
  return { path: result.base64, url: result.base64 };
}

// Subida de logotipo de patrocinador
export async function uploadSponsorLogo(
  file: File,
  sponsorId?: string
): Promise<{ path: string; url: string }> {
  void sponsorId;
  const result = await compressImage(file);
  return { path: result.base64, url: result.base64 };
}

// Subida de logotipo o emblema de comunidad o colectivo
export async function uploadCommunityLogo(
  file: File,
  communityId?: string
): Promise<{ path: string; url: string }> {
  void communityId;
  const result = await compressImage(file);
  return { path: result.base64, url: result.base64 };
}

// Obtener URL de descarga segura para una ruta o Data URL Base64
export async function getStorageFileUrl(filePath: string): Promise<string | null> {
  if (!filePath) return null;
  return filePath;
}

// Eliminar archivo desde el cliente (no-op para base64 en Firestore)
export async function deleteStorageFile(filePath?: string): Promise<void> {
  void filePath;
}
