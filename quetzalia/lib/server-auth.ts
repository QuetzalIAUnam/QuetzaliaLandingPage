import { adminAuth, adminDb } from "./firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

export interface AdminUserRecord {
  email: string;
  source: "env" | "firestore";
  addedBy?: string;
  addedAt?: string;
}

// Obtiene los correos base definidos en la variable de entorno
export function getEnvAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Obtiene todos los correos autorizados (variables de entorno + Firestore)
export async function getAllAdminEmails(): Promise<string[]> {
  const envEmails = getEnvAdminEmails();
  const emailsSet = new Set<string>(envEmails);

  try {
    const snap = await adminDb.collection("admins").get();
    snap.forEach((doc) => {
      const data = doc.data();
      if (data?.email) {
        emailsSet.add(data.email.toLowerCase().trim());
      }
    });
  } catch (err) {
    console.warn("[Auth Server] No se pudo consultar la colección admins en Firestore:", err);
  }

  return Array.from(emailsSet);
}

// Lista detallada de administradores para el panel
export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const envEmails = getEnvAdminEmails();
  const list: AdminUserRecord[] = envEmails.map((email) => ({
    email,
    source: "env",
    addedBy: "Sistema (.env)",
    addedAt: "Principal",
  }));

  try {
    const snap = await adminDb.collection("admins").get();
    snap.forEach((doc) => {
      const data = doc.data();
      const email = (data.email || doc.id).toLowerCase().trim();
      // Si no estaba ya en el env, lo agregamos como proveniente de Firestore
      if (!envEmails.includes(email)) {
        list.push({
          email,
          source: "firestore",
          addedBy: data.addedBy || "Comité",
          addedAt: data.addedAt || new Date().toISOString(),
        });
      }
    });
  } catch (err) {
    console.error("[Auth Server] Error al listar administradores:", err);
  }

  return list;
}

// Extrae el token Bearer del encabezado Authorization
export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7).trim();
}

// Verifica si la solicitud proviene de un usuario autenticado en Firebase
export async function verifyAuthUser(req: Request): Promise<DecodedIdToken | null> {
  const token = extractBearerToken(req);
  if (!token) return null;

  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("[Auth Server] Error al verificar token de usuario:", error);
    return null;
  }
}

// Verifica si el usuario autenticado pertenece a los correos autorizados del comité
export async function verifyAdminUser(req: Request): Promise<{
  authorized: boolean;
  user: DecodedIdToken | null;
  errorStatus?: number;
  errorMessage?: string;
}> {
  const user = await verifyAuthUser(req);
  if (!user) {
    return {
      authorized: false,
      user: null,
      errorStatus: 401,
      errorMessage: "No autenticado. Se requiere token Bearer válido.",
    };
  }

  const userEmail = (user.email || "").toLowerCase().trim();
  const adminEmails = await getAllAdminEmails();

  // Si no hay correos configurados
  if (adminEmails.length === 0) {
    console.warn("[Admin Server] Advertencia: No hay correos configurados en ADMIN_EMAILS ni en Firestore.");
    return {
      authorized: false,
      user,
      errorStatus: 403,
      errorMessage: "No hay correos de administrador configurados en el sistema.",
    };
  }

  if (!adminEmails.includes(userEmail)) {
    return {
      authorized: false,
      user,
      errorStatus: 403,
      errorMessage: "Acceso denegado. Este correo no pertenece al comité organizador.",
    };
  }

  return {
    authorized: true,
    user,
  };
}
