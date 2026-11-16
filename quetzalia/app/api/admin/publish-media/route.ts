import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { Registration } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité organizador." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const body = await req.json();
    const { registrationId, hasSignedDocument } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Se requiere el ID del registro." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("registrations").doc(registrationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
    }

    const reg = docSnap.data() as Registration;

    // Validación de convenios legales antes de publicar
    if (reg.type === "speaker") {
      if (!hasSignedDocument) {
        return NextResponse.json(
          {
            error:
              "Requisito legal: No se puede publicar la fotografía de la ponente sin contar formalmente con el Formato 01 (Autorización de imagen, voz y nombre) firmado.",
            code: "FORMAT_01_REQUIRED",
          },
          { status: 400 }
        );
      }

      // Mover / Copiar de private a public en Storage
      const bucket = adminStorage.bucket();
      const privateFilePath = `speakers/private/${registrationId}/photo.jpg`;
      const publicFilePath = `speakers/public/${registrationId}/photo.jpg`;

      const privateFile = bucket.file(privateFilePath);
      const [exists] = await privateFile.exists();

      if (!exists) {
        return NextResponse.json(
          { error: "No se encontró fotografía privada subida por la ponente." },
          { status: 404 }
        );
      }

      // Copiar archivo a la carpeta pública
      await privateFile.copy(bucket.file(publicFilePath));
      const publicFile = bucket.file(publicFilePath);
      await publicFile.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${publicFilePath}`;

      await docRef.update({
        photoPath: publicFilePath,
        updatedAt: new Date().toISOString(),
        adminNote: reg.adminNote
          ? `${reg.adminNote}\n[Foto aprobada y publicada con Formato 01 firmado el ${new Date().toLocaleDateString("es-MX")}]`
          : `Foto publicada con Formato 01 firmado el ${new Date().toLocaleDateString("es-MX")}`,
      });

      return NextResponse.json({
        success: true,
        message: "Fotografía de speaker publicada oficialmente.",
        publicUrl,
      });
    }

    if (reg.type === "sponsor") {
      if (!hasSignedDocument) {
        return NextResponse.json(
          {
            error:
              "Requisito legal: No se puede publicar ningún logotipo corporativo sin el Convenio de patrocinio y licencia de marca (Formato 06) firmado previamente.",
            code: "FORMAT_06_REQUIRED",
          },
          { status: 400 }
        );
      }

      const logoPath = `sponsors/logos/${registrationId}/logo.jpg`;
      await docRef.update({
        logoPath,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Logotipo de patrocinador habilitado con Convenio 06 verificado.",
      });
    }

    return NextResponse.json(
      { error: "Tipo de medio no admitido." },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/admin/publish-media] Error:", error);
    return NextResponse.json(
      { error: "Error interno al publicar archivo en Storage." },
      { status: 500 }
    );
  }
}
