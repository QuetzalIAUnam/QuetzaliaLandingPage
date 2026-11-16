import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Consultar todos los registros aprobados de la base de datos
    const snapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .get();

    const speakers: Array<{
      id: string;
      name: string;
      org: string;
      type: string;
      desc: string;
      talk: string;
      linkedin?: string;
      photoUrl?: string;
    }> = [];

    const sponsors: Array<{
      id: string;
      name: string;
      legalName?: string;
      logoUrl?: string;
    }> = [];

    const communities: Array<{
      id: string;
      name: string;
      representative?: string;
      desc?: string;
      logoUrl?: string;
    }> = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const type = data.type;

      if (type === "speaker") {
        speakers.push({
          id: doc.id,
          name: data.chosenName || data.fullName || "Ponente Quetzalia",
          org: data.organization || "Comunidad STEM",
          type: "Ponencia",
          desc: data.talkMaterials || "",
          talk: data.talkTitle || "Charla en Quetzalia 2027",
          linkedin: typeof data.phone === "string" && data.phone.startsWith("http") ? data.phone : undefined,
          photoUrl: data.photoPath || undefined,
        });
      } else if (type === "sponsor") {
        sponsors.push({
          id: doc.id,
          name: data.organization || data.legalName || "Marca Patrocinadora",
          legalName: data.legalName,
          logoUrl: data.logoPath || undefined,
        });
      } else if (type === "community") {
        communities.push({
          id: doc.id,
          name: data.organization || "Colectivo STEM",
          representative: data.fullName,
          desc: data.talkMaterials || "",
          logoUrl: data.logoPath || undefined,
        });
      }
    });

    return NextResponse.json({
      speakers,
      sponsors,
      communities,
      counts: {
        speakers: speakers.length,
        sponsors: sponsors.length,
        communities: communities.length,
      },
    });
  } catch (error) {
    console.error("Error al obtener registros públicos aprobados:", error);
    return NextResponse.json({
      speakers: [],
      sponsors: [],
      communities: [],
      counts: { speakers: 0, sponsors: 0, communities: 0 },
    });
  }
}
