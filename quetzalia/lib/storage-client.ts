import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { compressImage } from "./image-compressor";

// Subida de fotografía privada de speaker (comprimida a máx 1200px, <300KB)
export async function uploadPrivateSpeakerPhoto(
  file: File,
  userId: string
): Promise<{ path: string; url: string }> {
  // Evitar re-compresión innecesaria si ya viene optimizado desde el preview
  const fileToUpload =
    file.type === "image/jpeg" && file.size < 800 * 1024
      ? file
      : (await compressImage(file)).file;

  const filePath = `speakers/private/${userId}/photo.jpg`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, fileToUpload, {
    contentType: "image/jpeg",
    customMetadata: {
      ownerUserId: userId,
      uploadedAt: new Date().toISOString(),
      compressedSize: fileToUpload.size.toString(),
    },
  });

  let url = "";
  try {
    url = await getDownloadURL(snapshot.ref);
  } catch (urlErr) {
    console.warn("Advertencia al obtener URL de descarga para foto privada:", urlErr);
  }

  return { path: filePath, url };
}

// Subida de logotipo de patrocinador
export async function uploadSponsorLogo(
  file: File,
  sponsorId: string
): Promise<{ path: string; url: string }> {
  const fileToUpload =
    file.type === "image/jpeg" && file.size < 800 * 1024
      ? file
      : (await compressImage(file)).file;

  const filePath = `sponsors/logos/${sponsorId}/logo.jpg`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, fileToUpload, {
    contentType: "image/jpeg",
    customMetadata: {
      sponsorId,
      uploadedAt: new Date().toISOString(),
      compressedSize: fileToUpload.size.toString(),
    },
  });

  let url = "";
  try {
    url = await getDownloadURL(snapshot.ref);
  } catch (urlErr) {
    console.warn("Advertencia al obtener URL de descarga para logotipo:", urlErr);
  }

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
