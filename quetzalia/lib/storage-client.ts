import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { compressImage } from "./image-compressor";

// Subida de fotografía privada de speaker (comprimida a máx 1600px, <500KB)
export async function uploadPrivateSpeakerPhoto(
  file: File,
  userId: string
): Promise<{ path: string; url: string }> {
  const compression = await compressImage(file);
  const filePath = `speakers/private/${userId}/photo.jpg`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, compression.file, {
    contentType: "image/jpeg",
    customMetadata: {
      ownerUserId: userId,
      uploadedAt: new Date().toISOString(),
      originalSize: compression.originalSize.toString(),
      compressedSize: compression.compressedSize.toString(),
      width: compression.width.toString(),
      height: compression.height.toString(),
    },
  });

  const url = await getDownloadURL(snapshot.ref);
  return { path: filePath, url };
}

// Subida de logotipo de patrocinador
export async function uploadSponsorLogo(
  file: File,
  sponsorId: string
): Promise<{ path: string; url: string }> {
  // Comprimir imagen si es muy grande
  const compression = await compressImage(file);
  const filePath = `sponsors/logos/${sponsorId}/logo.jpg`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, compression.file, {
    contentType: "image/jpeg",
    customMetadata: {
      sponsorId,
      uploadedAt: new Date().toISOString(),
    },
  });

  const url = await getDownloadURL(snapshot.ref);
  return { path: filePath, url };
}

// Obtener URL de descarga segura para una ruta
export async function getStorageFileUrl(filePath: string): Promise<string | null> {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (err) {
    console.error("Error al obtener URL del archivo:", err);
    return null;
  }
}

// Eliminar archivo desde el cliente (solo si tiene permisos de dueño)
export async function deleteStorageFile(filePath: string): Promise<void> {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
}
