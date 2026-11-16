import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Firestore,
  Unsubscribe,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { Registration } from "./types";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_SECRET_FIREBASE_API_KEY ||
    "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID || "",
};

// Inicialización segura del cliente (evita duplicados y errores en SSR/Build)
function createFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = createFirebaseApp();
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Iniciar sesión con Google vía Popup
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Cerrar sesión
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Obtener el ID Token actual del usuario para enviar a las API Routes
export async function getAuthToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

// Suscripción al estado de autenticación
export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// Leer el registro propio del usuario en Firestore (cliente)
export async function getUserRegistration(userId: string): Promise<Registration | null> {
  try {
    const docRef = doc(db, "registrations", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Registration;
    }
    return null;
  } catch (error) {
    console.error("Error al consultar registro del usuario:", error);
    throw error;
  }
}

// Suscribirse a cambios en tiempo real del registro propio
export function subscribeToUserRegistration(
  userId: string,
  onUpdate: (reg: Registration | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const docRef = doc(db, "registrations", userId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...snap.data() } as Registration);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error("Error en listener de registro:", err);
      if (onError) onError(err);
    }
  );
}

// Guardar o enviar registro inicial desde el navegador
export async function saveRegistration(
  data: Omit<Registration, "id" | "status" | "createdAt" | "updatedAt">,
  userId: string
): Promise<Registration> {
  const now = new Date().toISOString();
  const registrationRecord: Registration = {
    ...data,
    id: userId,
    userId,
    status: "pendiente",
    createdAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, "registrations", userId);
  await setDoc(docRef, registrationRecord);

  // Notificar al endpoint de backend para envío de correo de confirmación
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    }
  } catch (err) {
    console.warn("No se pudo notificar a /api/registrations:", err);
  }

  return registrationRecord;
}
