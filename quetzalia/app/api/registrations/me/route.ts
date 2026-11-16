import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuthUser } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const authUser = await verifyAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "No autenticado. Inicia sesión con Google." },
        { status: 401 }
      );
    }

    const docSnap = await adminDb.collection("registrations").doc(authUser.uid).get();

    if (!docSnap.exists) {
      return NextResponse.json({ exists: false, registration: null }, { status: 200 });
    }

    return NextResponse.json(
      { exists: true, registration: { id: docSnap.id, ...docSnap.data() } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[GET /api/registrations/me] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar tu registro." },
      { status: 500 }
    );
  }
}
