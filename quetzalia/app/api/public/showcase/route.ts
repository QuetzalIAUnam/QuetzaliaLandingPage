import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

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
      socials?: {
        linkedin?: string;
        instagram?: string;
        tiktok?: string;
        twitter?: string;
        website?: string;
      };
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
      socials?: {
        linkedin?: string;
        instagram?: string;
        tiktok?: string;
        twitter?: string;
        website?: string;
      };
    }> = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const type = data.type;

      if (type === "speaker") {
        const rawSocials = data.socials || {};
        const linkedin =
          (typeof rawSocials.linkedin === "string" && rawSocials.linkedin.trim()) ||
          (typeof data.linkedin === "string" && data.linkedin.trim()) ||
          undefined;
        const instagram = rawSocials.instagram || data.instagram;
        const tiktok = rawSocials.tiktok || data.tiktok;
        const twitter = rawSocials.twitter || data.twitter;
        const website = rawSocials.website || data.website;

        speakers.push({
          id: doc.id,
          name: data.chosenName || data.fullName || "Ponente Quetzalia",
          org: data.organization || "Comunidad STEM",
          type: data.talkType || "Ponencia",
          desc: data.talkMaterials || "",
          talk: data.talkTitle || "Charla en Quetzalia 2027",
          linkedin,
          photoUrl: data.photoPath || undefined,
          socials: {
            linkedin,
            instagram,
            tiktok,
            twitter,
            website,
          },
        });
      } else if (type === "sponsor") {
        sponsors.push({
          id: doc.id,
          name: data.organization || data.legalName || "Marca Patrocinadora",
          legalName: data.legalName,
          logoUrl: data.photoPath || data.logoPath || undefined,
        });
      } else if (type === "community") {
        const rawSocials = data.socials || {};
        const linkedin = rawSocials.linkedin || data.linkedin;
        const instagram = rawSocials.instagram || data.instagram;
        const tiktok = rawSocials.tiktok || data.tiktok;
        const twitter = rawSocials.twitter || data.twitter;
        const website = rawSocials.website || data.website;

        communities.push({
          id: doc.id,
          name: data.organization || "Colectivo STEM",
          representative: data.fullName,
          desc: data.talkMaterials || "",
          logoUrl: data.photoPath || data.logoPath || undefined,
          socials: {
            linkedin,
            instagram,
            tiktok,
            twitter,
            website,
          },
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
