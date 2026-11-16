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

    // Consultar todos los registros una sola vez y procesar filtros y métricas en memoria.
    // Esto previene errores de "The query requires an index" (índices compuestos de Firestore)
    // cuando se combinan filtros de tipo/estatus con ordenamiento por fecha.
    const snapshot = await adminDb.collection("registrations").get();

    let totalAttendees = 0;
    let approvedAttendees = 0;
    let totalSpeakers = 0;
    let approvedSpeakers = 0;
    let totalSponsors = 0;
    let approvedSponsors = 0;
    let totalCommunities = 0;
    let approvedCommunities = 0;
    let approvedTotal = 0;

    const filteredRegistrations: Registration[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Registration;
      const reg: Registration = {
        ...data,
        id: doc.id,
      };

      const type = reg.type || "attendee";
      const isApproved = reg.status === "aprobado";

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

      // Aplicar filtro de tipo
      if (typeFilter && reg.type !== typeFilter) {
        return;
      }

      // Aplicar filtro de estatus
      if (statusFilter && reg.status !== statusFilter) {
        return;
      }

      // Aplicar búsqueda por texto libre
      if (searchQuery) {
        const full = (reg.fullName || "").toLowerCase();
        const chosen = (reg.chosenName || "").toLowerCase();
        const legal = (reg.legalName || "").toLowerCase();
        const email = (reg.email || "").toLowerCase();
        const org = (reg.organization || "").toLowerCase();
        const title = (reg.talkTitle || "").toLowerCase();
        if (
          !full.includes(searchQuery) &&
          !chosen.includes(searchQuery) &&
          !legal.includes(searchQuery) &&
          !email.includes(searchQuery) &&
          !org.includes(searchQuery) &&
          !title.includes(searchQuery)
        ) {
          return;
        }
      }

      filteredRegistrations.push(reg);
    });

    // Ordenar por fecha de creación descendente en memoria
    filteredRegistrations.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({
      registrations: filteredRegistrations,
      stats: {
        total: snapshot.size,
        filteredCount: filteredRegistrations.length,
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
