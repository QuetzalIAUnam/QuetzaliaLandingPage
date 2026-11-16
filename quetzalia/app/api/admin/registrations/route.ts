import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { MAX_APPROVED, Registration } from "@/lib/types";

export const dynamic = "force-dynamic";

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

    // Contar total de aprobados para control de cupo
    const approvedSnapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const approvedCount = approvedSnapshot.data().count;

    return NextResponse.json({
      registrations,
      stats: {
        total: registrations.length,
        approvedCount,
        maxApproved: MAX_APPROVED,
        availableSlots: Math.max(0, MAX_APPROVED - approvedCount),
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
