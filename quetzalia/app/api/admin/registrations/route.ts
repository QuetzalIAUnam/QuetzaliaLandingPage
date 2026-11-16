import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { MAX_APPROVED, Registration } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité organizador." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type");
    const statusFilter = searchParams.get("status");
    const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();

    let query: FirebaseFirestore.Query = adminDb.collection("registrations");

    if (typeFilter && ["speaker", "sponsor", "community", "attendee"].includes(typeFilter)) {
      query = query.where("type", "==", typeFilter);
    }

    if (statusFilter && ["pendiente", "aprobado", "lista_espera", "rechazado"].includes(statusFilter)) {
      query = query.where("status", "==", statusFilter);
    }

    // Ordenar por fecha de creación descendente
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    let registrations: Registration[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Registration[];

    // Filtro en memoria para búsqueda por texto libre (nombre, correo u organización)
    if (searchQuery) {
      registrations = registrations.filter((reg) => {
        const full = (reg.fullName || "").toLowerCase();
        const chosen = (reg.chosenName || "").toLowerCase();
        const legal = (reg.legalName || "").toLowerCase();
        const email = (reg.email || "").toLowerCase();
        const org = (reg.organization || "").toLowerCase();
        return (
          full.includes(searchQuery) ||
          chosen.includes(searchQuery) ||
          legal.includes(searchQuery) ||
          email.includes(searchQuery) ||
          org.includes(searchQuery)
        );
      });
    }

    // Métricas globales desglosadas por perfil (Asistentes, Ponentes, Patrocinadores, Comunidades)
    const allSnapshot = await adminDb.collection("registrations").get();

    let totalAttendees = 0;
    let approvedAttendees = 0;
    let totalSpeakers = 0;
    let approvedSpeakers = 0;
    let totalSponsors = 0;
    let approvedSponsors = 0;
    let totalCommunities = 0;
    let approvedCommunities = 0;
    let approvedTotal = 0;

    allSnapshot.forEach((doc) => {
      const data = doc.data();
      const type = data.type || "attendee";
      const isApproved = data.status === "aprobado";

      if (isApproved) approvedTotal++;

      if (type === "attendee") {
        totalAttendees++;
        if (isApproved) approvedAttendees++;
      } else if (type === "speaker") {
        totalSpeakers++;
        if (isApproved) approvedSpeakers++;
      } else if (type === "sponsor") {
        totalSponsors++;
        if (isApproved) approvedSponsors++;
      } else if (type === "community") {
        totalCommunities++;
        if (isApproved) approvedCommunities++;
      }
    });

    return NextResponse.json({
      registrations,
      stats: {
        total: allSnapshot.size,
        filteredCount: registrations.length,
        approvedCount: approvedTotal,
        maxApproved: MAX_APPROVED,
        availableSlots: Math.max(0, MAX_APPROVED - approvedAttendees),
        breakdown: {
          attendee: { total: totalAttendees, approved: approvedAttendees },
          speaker: { total: totalSpeakers, approved: approvedSpeakers },
          sponsor: { total: totalSponsors, approved: approvedSponsors },
          community: { total: totalCommunities, approved: approvedCommunities },
        },
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/admin/registrations] Error:", error);
    return NextResponse.json(
      { error: "Error interno al consultar la lista de registros." },
      { status: 500 }
    );
  }
}
