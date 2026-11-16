import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import {
  verifyAdminUser,
  listAdminUsers,
  getEnvAdminEmails,
} from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// GET /api/admin/users: Lista administradores autorizados
export async function GET(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const admins = await listAdminUsers();
    return NextResponse.json({ admins });
  } catch (error: unknown) {
    console.error("[GET /api/admin/users] Error:", error);
    return NextResponse.json(
      { error: "Error interno al consultar la lista de administradores." },
      { status: 500 }
    );
  }
}

// POST /api/admin/users: Agrega un nuevo correo de administrador a Firestore
export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const body = await req.json();
    const targetEmail = (body.email || "").toLowerCase().trim();

    // Validación básica de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!targetEmail || !emailRegex.test(targetEmail)) {
      return NextResponse.json(
        { error: "Por favor proporciona un correo electrónico válido." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    await adminDb.collection("admins").doc(targetEmail).set({
      email: targetEmail,
      addedBy: authCheck.user?.email || "Comité",
      addedAt: now,
      role: "admin",
    });

    const updatedList = await listAdminUsers();
    return NextResponse.json({
      success: true,
      message: `El correo ${targetEmail} ha sido agregado exitosamente al comité.`,
      admins: updatedList,
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/users] Error:", error);
    return NextResponse.json(
      { error: "Error interno al registrar nuevo administrador." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users: Revoca el acceso de un administrador agregado en Firestore
export async function DELETE(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const body = await req.json();
    const targetEmail = (body.email || "").toLowerCase().trim();

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Se requiere especificar el correo a remover." },
        { status: 400 }
      );
    }

    // No permitir eliminar al administrador principal configurado en el .env
    const envAdmins = getEnvAdminEmails();
    if (envAdmins.includes(targetEmail)) {
      return NextResponse.json(
        {
          error: "No se puede revocar al administrador principal definido en las variables de entorno del servidor.",
        },
        { status: 403 }
      );
    }

    await adminDb.collection("admins").doc(targetEmail).delete();

    const updatedList = await listAdminUsers();
    return NextResponse.json({
      success: true,
      message: `El acceso para ${targetEmail} ha sido revocado.`,
      admins: updatedList,
    });
  } catch (error: unknown) {
    console.error("[DELETE /api/admin/users] Error:", error);
    return NextResponse.json(
      { error: "Error interno al revocar administrador." },
      { status: 500 }
    );
  }
}
