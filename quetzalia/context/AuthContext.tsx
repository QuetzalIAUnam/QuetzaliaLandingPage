"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  subscribeToUserRegistration,
  getUserRegistration,
} from "@/lib/firebase";
import { Registration } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  registration: Registration | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  refreshRegistration: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  registration: null,
  loading: true,
  loginWithGoogle: async () => { throw new Error("AuthContext no inicializado"); },
  logout: async () => {},
  refreshRegistration: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeRegistration: (() => void) | null = null;

    const unsubscribeAuth = onAuthChange((currentUser) => {
      setUser(currentUser);

      if (unsubscribeRegistration) {
        unsubscribeRegistration();
        unsubscribeRegistration = null;
      }

      if (currentUser) {
        // Suscribirse a los cambios en tiempo real del registro del usuario
        try {
          unsubscribeRegistration = subscribeToUserRegistration(
            currentUser.uid,
            (reg) => {
              setRegistration(reg);
              setLoading(false);
            },
            () => {
              // Si falla o no tiene permisos de lectura aún
              setLoading(false);
            }
          );
        } catch {
          setLoading(false);
        }
      } else {
        setRegistration(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeRegistration) {
        unsubscribeRegistration();
      }
    };
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    try {
      setLoading(true);
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      console.error("Error durante login con Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setRegistration(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshRegistration = async () => {
    if (!user) return;
    try {
      const reg = await getUserRegistration(user.uid);
      setRegistration(reg);
    } catch (err) {
      console.error("Error al refrescar registro:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registration,
        loading,
        loginWithGoogle,
        logout,
        refreshRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
