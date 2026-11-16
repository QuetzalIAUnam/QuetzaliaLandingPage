"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/firebase";
import { Registration, MAX_APPROVED, BroadcastRecord } from "@/lib/types";
import { AdminUserRecord } from "@/lib/server-auth";
import Greca from "@/components/ui/Greca";

interface ProfileStat {
  total: number;
  approved: number;
}

interface StatsData {
  total: number;
  filteredCount?: number;
  approvedCount: number;
  maxApproved: number;
  availableSlots: number;
  breakdown?: {
    attendee: ProfileStat;
    speaker: ProfileStat;
    sponsor: ProfileStat;
    community: ProfileStat;
  };
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"registrations" | "admins" | "notices">("registrations");

  // Clave para refrescar datos tras una acción
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados de Registros
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    approvedCount: 0,
    maxApproved: MAX_APPROVED,
    availableSlots: MAX_APPROVED,
    breakdown: {
      attendee: { total: 0, approved: 0 },
      speaker: { total: 0, approved: 0 },
      sponsor: { total: 0, approved: 0 },
      community: { total: 0, approved: 0 },
    },
  });
  const [loadingData, setLoadingData] = useState(true);
  const [unauthorizedError, setUnauthorizedError] = useState<string | null>(null);

  // Filtros
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Acciones / Modales
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Estados de Administradores
  const [adminsList, setAdminsList] = useState<AdminUserRecord[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Estados de Avisos y Plantillas de Correo
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("received");
  const [previewType, setPreviewType] = useState<string>("speaker");
  const [templatePreview, setTemplatePreview] = useState<{ subject: string; html: string } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Estados de Broadcasts (Fase 6: Recordatorios a Asistentes Aprobados)
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastActionUrl, setBroadcastActionUrl] = useState("https://quetzalia.dev/mi-registro");
  const [broadcastActionText, setBroadcastActionText] = useState("Consultar Acceso");
  const [broadcastPreviewHtml, setBroadcastPreviewHtml] = useState<string | null>(null);
  const [showBroadcastConfirmModal, setShowBroadcastConfirmModal] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastRecord[]>([]);
  const [audienceConfigured, setAudienceConfigured] = useState(true);

  // Carga asíncrona de datos protegida con bandera isMounted
  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    async function loadAdminData() {
      try {
        const token = await getAuthToken();
        if (!token || !isMounted) return;

        const params = new URLSearchParams();
        if (filterType) params.set("type", filterType);
        if (filterStatus) params.set("status", filterStatus);
        if (searchQuery) params.set("search", searchQuery);

        const [resRegs, resAdmins] = await Promise.all([
          fetch(`/api/admin/registrations?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!isMounted) return;

        if (!resRegs.ok) {
          if (resRegs.status === 401 || resRegs.status === 403) {
            const errData = await resRegs.json();
            setUnauthorizedError(errData.error || "No tienes permisos de administrador.");
          } else {
            setFeedbackMsg({ text: "Error al cargar los registros del servidor.", type: "error" });
          }
        } else {
          const data = await resRegs.json();
          setRegistrations(data.registrations || []);
          if (data.stats) setStats(data.stats);
          setUnauthorizedError(null);
        }

        if (resAdmins.ok) {
          const adminData = await resAdmins.json();
          setAdminsList(adminData.admins || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setFeedbackMsg({ text: "Error de red al consultar registros.", type: "error" });
        }
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [user, filterType, filterStatus, searchQuery, refreshKey]);

  // Ejecutar cambio de estado (Aprobar, Lista de espera, Rechazar)
  const handleUpdateStatus = async (
    regId: string,
    action: "approve" | "waitlist" | "reject",
    note?: string
  ) => {
    try {
      setActionLoading(regId);
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ registrationId: regId, adminNote: note }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackMsg({
          text: data.error || `Error al actualizar el registro.`,
          type: "error",
        });
        return;
      }

      setFeedbackMsg({
        text: `Acción ejecutada correctamente: ${data.message || action}`,
        type: "success",
      });

      // Refrescar datos
      setRefreshKey((k) => k + 1);
      if (selectedReg && selectedReg.id === regId) {
        setSelectedReg(null);
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al procesar la solicitud.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Eliminar postulación / usuario (Herramienta para pruebas y administración)
  const handleDeleteRegistration = async (regId: string, fullName: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas ELIMINAR permanentemente la postulación de "${fullName}"?\n\nEsta acción borrará el registro de Firestore y su contacto de audiencia para que pueda postularse de nuevo.`
    );
    if (!confirmDelete) return;

    const alsoDeleteAuth = window.confirm(
      `¿Deseas también ELIMINAR su cuenta de acceso de Firebase Auth?\n\n• ACEPTAR: Se borra la postulación Y la cuenta de Auth (reinicio total para pruebas de login).\n• CANCELAR: Se borra solo la postulación en Firestore (el usuario conserva su sesión activa pero sin registro).`
    );

    try {
      setActionLoading(regId);
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationId: regId,
          deleteAuthUser: alsoDeleteAuth,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackMsg({
          text: data.error || "No se pudo eliminar el registro.",
          type: "error",
        });
        return;
      }

      setFeedbackMsg({
        text: data.message || "Registro eliminado exitosamente.",
        type: "success",
      });

      if (selectedReg && selectedReg.id === regId) {
        setSelectedReg(null);
      }
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al eliminar el registro.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Promover a la primera persona en lista de espera
  const handlePromoteNext = async () => {
    if (!confirm("¿Deseas promover a la primera persona registrada en lista de espera al estatus Aprobado?")) {
      return;
    }

    try {
      setActionLoading("promote");
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "No se pudo promover.", type: "error" });
        return;
      }

      setFeedbackMsg({
        text: data.message || "Persona promovida con éxito.",
        type: "success",
      });

      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error al promover de lista de espera.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Agregar nuevo administrador
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      setAddingAdmin(true);
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newAdminEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "No se pudo agregar al administrador.", type: "error" });
        return;
      }

      setFeedbackMsg({ text: data.message, type: "success" });
      setNewAdminEmail("");
      setAdminsList(data.admins || []);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error al agregar administrador.", type: "error" });
    } finally {
      setAddingAdmin(false);
    }
  };

  // Revocar acceso de administrador
  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`¿Estás segura/o de revocar los permisos de administrador para ${email}?`)) {
      return;
    }

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "No se pudo revocar el acceso.", type: "error" });
        return;
      }

      setFeedbackMsg({ text: data.message, type: "success" });
      setAdminsList(data.admins || []);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error al revocar administrador.", type: "error" });
    }
  };

  // Publicar foto en Storage público tras verificar Formato 01
  const handlePublishPhoto = async (regId: string) => {
    const confirmed = confirm(
      "¿Confirmas que el Formato 01 (Autorización de imagen, voz y nombre) se encuentra debidamente firmado por la ponente?"
    );
    if (!confirmed) return;

    try {
      setActionLoading(regId);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/publish-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationId: regId,
          mediaType: "speaker_photo",
          hasSignedDocument: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "Error al publicar foto.", type: "error" });
        return;
      }

      setFeedbackMsg({ text: data.message, type: "success" });
      setRefreshKey((k) => k + 1);
      setSelectedReg((prev) =>
        prev ? { ...prev, photoPath: `speakers/public/${regId}/photo.jpg` } : null
      );
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al publicar fotografía.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Retirar foto y materiales en garantía de 72 horas
  const handleWithdrawMedia = async (regId: string) => {
    const reason = prompt(
      "Indica el motivo del retiro de fotografía y materiales (ej. Ejercicio de derecho ARCO / Cancelación):"
    );
    if (reason === null) return;

    try {
      setActionLoading(regId);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/withdraw-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationId: regId,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "Error al retirar medios.", type: "error" });
        return;
      }

      setFeedbackMsg({ text: data.message, type: "success" });
      setRefreshKey((k) => k + 1);
      setSelectedReg((prev) =>
        prev
          ? {
              ...prev,
              photoPath: undefined,
              talkMaterials: "[Contenido retirado por solicitud del titular]",
            }
          : null
      );
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al retirar fotografía.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Carga reactiva de la vista previa de la plantilla seleccionada
  useEffect(() => {
    if (activeTab !== "notices") return;
    let isMounted = true;

    async function loadTemplatePreview() {
      try {
        setLoadingPreview(true);
        const token = await getAuthToken();
        if (!token || !isMounted) return;

        const res = await fetch(
          `/api/admin/notices?templateId=${selectedTemplateId}&type=${previewType}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok && isMounted) {
          const data = await res.json();
          setTemplatePreview({ subject: data.subject, html: data.html });
        }
      } catch (err) {
        console.error("Error al cargar vista previa:", err);
      } finally {
        if (isMounted) setLoadingPreview(false);
      }
    }

    loadTemplatePreview();

    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedTemplateId, previewType]);

  // Re-enviar correo oficial de estatus
  const handleResendStatus = async (regId: string) => {
    if (!confirm("¿Deseas re-enviar la plantilla de correo oficial correspondiente al estatus actual de este registro?")) {
      return;
    }

    try {
      setActionLoading(regId);
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "resend_status",
          registrationId: regId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ text: data.error || "Error al re-enviar correo de estatus.", type: "error" });
        return;
      }

      setFeedbackMsg({
        text: data.message || "Correo de estatus re-enviado con éxito.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al procesar el re-envío.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  // Carga del historial de Broadcasts
  useEffect(() => {
    let isMounted = true;
    if (!user || activeTab !== "notices") return;

    async function loadBroadcastData() {
      try {
        const token = await getAuthToken();
        if (!token || !isMounted) return;
        const res = await fetch("/api/admin/broadcast", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setBroadcastHistory(data.history || []);
          setAudienceConfigured(Boolean(data.audienceIdConfigured));
        }
      } catch (err) {
        console.error("Error al cargar historial de broadcasts:", err);
      }
    }

    loadBroadcastData();

    return () => {
      isMounted = false;
    };
  }, [user, activeTab, refreshKey]);

  // Generar vista previa y abrir confirmación obligatoria del comité
  const handleOpenBroadcastConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      setFeedbackMsg({ text: "El asunto y el contenido del aviso son obligatorios.", type: "error" });
      return;
    }

    try {
      const token = await getAuthToken();
      if (!token) return;
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
          actionUrl: broadcastActionUrl.trim() || undefined,
          actionText: broadcastActionText.trim() || undefined,
          previewOnly: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBroadcastPreviewHtml(data.previewHtml);
      }
    } catch (err) {
      console.error("Error al previsualizar broadcast:", err);
    }

    setShowBroadcastConfirmModal(true);
  };

  // Enviar el broadcast tras confirmación expresa del comité
  const handleSendBroadcastConfirmed = async () => {
    try {
      setSendingBroadcast(true);
      setFeedbackMsg(null);
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
          actionUrl: broadcastActionUrl.trim() || undefined,
          actionText: broadcastActionText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({
          text: data.error || "Error al emitir el broadcast.",
          type: "error",
        });
        return;
      }

      setFeedbackMsg({
        text: `✓ ${data.message || "Aviso general enviado exitosamente."}`,
        type: "success",
      });

      setShowBroadcastConfirmModal(false);
      setBroadcastSubject("");
      setBroadcastMessage("");
      setBroadcastPreviewHtml(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ text: "Error de red al enviar el broadcast.", type: "error" });
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Estado de carga inicial de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <p className="text-lg font-display text-[var(--head)] animate-pulse">
          Validando credenciales del comité...
        </p>
      </div>
    );
  }

  // Si no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full border-2 border-[var(--accent)] p-8 bg-[var(--card)] shadow-2xl text-center space-y-6">
          <Greca />
          <h1 className="text-3xl font-display text-[var(--head)]">
            Acceso al Comité
          </h1>
          <p className="text-sm">
            Este panel es de uso restringido y exclusivo para el comité organizador de <strong>Quetzalia 2027</strong>.
          </p>
          <button
            onClick={() => loginWithGoogle()}
            className="btn btn-primary w-full inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Ingresar con Google</span>
          </button>
          <Link href="/" className="block text-xs uppercase tracking-wider text-[var(--head)] hover:underline">
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    );
  }

  // Si está autenticado pero el servidor rechazó el acceso (no es admin)
  if (unauthorizedError) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col justify-center items-center p-6">
        <div className="max-w-lg w-full border-2 border-rose-500 p-8 bg-[var(--card)] shadow-xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
            ✕
          </div>
          <h1 className="text-2xl font-display text-rose-700">
            Acceso No Autorizado
          </h1>
          <p className="text-sm">
            La cuenta <code className="font-bold text-[var(--head)]">{user.email}</code> no está autorizada para administrar el evento.
          </p>
          <p className="text-xs text-[var(--fg)] opacity-80">
            Para solicitar acceso, contacta al administrador principal (<span className="font-mono">dr87152@gmail.com</span>) para que registre tu correo en el sistema.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => logout()}
              className="btn btn-ghost text-xs"
            >
              Cambiar de cuenta
            </button>
            <Link href="/" className="btn btn-primary text-xs">
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* Barra de cabecera del Admin */}
      <header className="border-b border-[var(--rule)] bg-[var(--card)] py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="brand text-xl font-display text-[var(--head)]">
              Quetzal-IA
            </Link>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[var(--bg-alt)] border border-[var(--accent)] text-[var(--head)]">
              Panel Comité
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="Admin"
                  width={28}
                  height={28}
                  className="rounded-full border border-[var(--accent)]"
                  unoptimized
                />
              )}
              <span className="font-semibold text-xs text-[var(--head)] hidden sm:inline">
                {user.email}
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="text-xs uppercase tracking-wider font-semibold text-[var(--accent)] hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <Greca />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Banner de Mensajes de Feedback */}
        {feedbackMsg && (
          <div
            className={`p-4 border text-sm font-medium flex items-center justify-between ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-400"
                : "bg-rose-50 text-rose-900 border-rose-400"
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="font-bold text-xs uppercase px-2 hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Métricas Globales y Control de Cupo */}
        <div className="space-y-4">
          {/* Fila 1: Cupo del Auditorio FES Acatlán (400 Asistentes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 border border-[var(--rule)] bg-[var(--card)]">
              <p className="eyebrow text-xs">Total Solicitudes</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-display text-[var(--head)]">{stats.total}</p>
                <span className="text-xs text-[var(--fg)] opacity-70">registros</span>
              </div>
            </div>

            <div className="p-5 border border-[var(--rule)] bg-[var(--card)]">
              <p className="eyebrow text-xs">Asistentes / Cupo Auditorio</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-display text-[var(--head)]">
                  {stats.breakdown?.attendee.approved ?? stats.approvedCount}
                </span>
                <span className="text-sm text-[var(--fg)] opacity-70">/ {stats.maxApproved}</span>
              </div>
              {/* Barra de progreso de cupo */}
              <div className="w-full bg-[var(--bg-alt)] h-2 mt-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (stats.breakdown?.attendee.approved ?? stats.approvedCount) >= stats.maxApproved
                      ? "bg-rose-500"
                      : "bg-[var(--accent)]"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      ((stats.breakdown?.attendee.approved ?? stats.approvedCount) / stats.maxApproved) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 border border-[var(--rule)] bg-[var(--card)]">
              <p className="eyebrow text-xs">Lugares Disponibles (Asistentes)</p>
              <p
                className={`text-3xl font-display mt-1 ${
                  stats.availableSlots === 0 ? "text-rose-600 font-bold" : "text-emerald-700"
                }`}
              >
                {stats.availableSlots}
              </p>
            </div>

            <div className="p-5 border border-[var(--accent)] bg-[var(--bg-alt)] flex flex-col justify-between">
              <div>
                <p className="eyebrow text-xs">Liberación de Lugares</p>
                <p className="text-xs text-[var(--fg)] mt-1">
                  Promueve en orden cronológico al primer registro en lista de espera.
                </p>
              </div>
              <button
                onClick={handlePromoteNext}
                disabled={actionLoading === "promote" || stats.availableSlots === 0}
                className="mt-3 btn btn-primary text-xs w-full cursor-pointer disabled:opacity-50"
              >
                {actionLoading === "promote"
                  ? "Promoviendo..."
                  : stats.availableSlots === 0
                  ? "Sin cupo disponible"
                  : "⚡ Promover de Lista de Espera"}
              </button>
            </div>
          </div>

          {/* Fila 2: Desglose por Modalidad de Participación (Tarjetas con filtro interactivo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Asistentes */}
            <div
              onClick={() => setFilterType(filterType === "attendee" ? "" : "attendee")}
              className={`p-4 border transition-all cursor-pointer ${
                filterType === "attendee"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-blue-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  👩‍💻 Asistentes
                </span>
                <span className="text-xs px-2 py-0.5 font-bold bg-blue-100 text-blue-900 border border-blue-300">
                  {stats.breakdown?.attendee.approved ?? 0} aprobados
                </span>
              </div>
              <p className="text-2xl font-display text-[var(--head)] mt-2">
                {stats.breakdown?.attendee.total ?? 0}
              </p>
              <p className="text-xs text-[var(--fg)] opacity-75 mt-0.5">
                registrados en total {filterType === "attendee" ? "(Filtro activo)" : "• Clic para filtrar"}
              </p>
            </div>

            {/* 2. Ponentes (Speakers) */}
            <div
              onClick={() => setFilterType(filterType === "speaker" ? "" : "speaker")}
              className={`p-4 border transition-all cursor-pointer ${
                filterType === "speaker"
                  ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-purple-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  🎙️ Ponentes (Speakers)
                </span>
                <span className="text-xs px-2 py-0.5 font-bold bg-purple-100 text-purple-900 border border-purple-300">
                  {stats.breakdown?.speaker.approved ?? 0} confirmadas
                </span>
              </div>
              <p className="text-2xl font-display text-[var(--head)] mt-2">
                {stats.breakdown?.speaker.total ?? 0}
              </p>
              <p className="text-xs text-[var(--fg)] opacity-75 mt-0.5">
                propuestas de ponencia {filterType === "speaker" ? "(Filtro activo)" : "• Clic para filtrar"}
              </p>
            </div>

            {/* 3. Patrocinadores */}
            <div
              onClick={() => setFilterType(filterType === "sponsor" ? "" : "sponsor")}
              className={`p-4 border transition-all cursor-pointer ${
                filterType === "sponsor"
                  ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-amber-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  🏢 Patrocinadores
                </span>
                <span className="text-xs px-2 py-0.5 font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {stats.breakdown?.sponsor.approved ?? 0} aliados
                </span>
              </div>
              <p className="text-2xl font-display text-[var(--head)] mt-2">
                {stats.breakdown?.sponsor.total ?? 0}
              </p>
              <p className="text-xs text-[var(--fg)] opacity-75 mt-0.5">
                empresas aliadas {filterType === "sponsor" ? "(Filtro activo)" : "• Clic para filtrar"}
              </p>
            </div>

            {/* 4. Comunidades STEM */}
            <div
              onClick={() => setFilterType(filterType === "community" ? "" : "community")}
              className={`p-4 border transition-all cursor-pointer ${
                filterType === "community"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-emerald-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  🌐 Comunidades STEM
                </span>
                <span className="text-xs px-2 py-0.5 font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {stats.breakdown?.community.approved ?? 0} aliadas
                </span>
              </div>
              <p className="text-2xl font-display text-[var(--head)] mt-2">
                {stats.breakdown?.community.total ?? 0}
              </p>
              <p className="text-xs text-[var(--fg)] opacity-75 mt-0.5">
                colectivos y clubes {filterType === "community" ? "(Filtro activo)" : "• Clic para filtrar"}
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex border-b border-[var(--rule)] gap-2">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-6 py-3 font-display text-sm tracking-wide transition-colors ${
              activeTab === "registrations"
                ? "border-b-2 border-[var(--accent)] text-[var(--head)] font-bold bg-[var(--bg-alt)]/50"
                : "text-[var(--fg)] opacity-70 hover:opacity-100"
            }`}
          >
            Registros y Solicitudes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("notices")}
            className={`px-6 py-3 font-display text-sm tracking-wide transition-colors ${
              activeTab === "notices"
                ? "border-b-2 border-[var(--accent)] text-[var(--head)] font-bold bg-[var(--bg-alt)]/50"
                : "text-[var(--fg)] opacity-70 hover:opacity-100"
            }`}
          >
            Avisos y Plantillas de Correo
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-6 py-3 font-display text-sm tracking-wide transition-colors ${
              activeTab === "admins"
                ? "border-b-2 border-[var(--accent)] text-[var(--head)] font-bold bg-[var(--bg-alt)]/50"
                : "text-[var(--fg)] opacity-70 hover:opacity-100"
            }`}
          >
            Comité y Administradores ({adminsList.length})
          </button>
        </div>

        {/* PESTAÑA 1: GESTIÓN DE REGISTROS */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            {/* Píldoras de Filtro Rápido por Perfil */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--rule)] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--head)] mr-2">
                Filtrar por perfil:
              </span>
              <button
                onClick={() => setFilterType("")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer ${
                  filterType === ""
                    ? "bg-[var(--head)] text-white border-[var(--head)] font-bold shadow-xs"
                    : "bg-[var(--card)] text-[var(--head)] border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                📋 Todos ({stats.total})
              </button>
              <button
                onClick={() => setFilterType("attendee")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer ${
                  filterType === "attendee"
                    ? "bg-blue-800 text-white border-blue-800 font-bold shadow-xs"
                    : "bg-[var(--card)] text-[var(--head)] border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                👩‍💻 Asistentes ({stats.breakdown?.attendee.total || 0})
              </button>
              <button
                onClick={() => setFilterType("speaker")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer ${
                  filterType === "speaker"
                    ? "bg-purple-800 text-white border-purple-800 font-bold shadow-xs"
                    : "bg-[var(--card)] text-[var(--head)] border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                🎙️ Ponentes ({stats.breakdown?.speaker.total || 0})
              </button>
              <button
                onClick={() => setFilterType("sponsor")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer ${
                  filterType === "sponsor"
                    ? "bg-amber-800 text-white border-amber-800 font-bold shadow-xs"
                    : "bg-[var(--card)] text-[var(--head)] border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                🏢 Patrocinadores ({stats.breakdown?.sponsor.total || 0})
              </button>
              <button
                onClick={() => setFilterType("community")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer ${
                  filterType === "community"
                    ? "bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs"
                    : "bg-[var(--card)] text-[var(--head)] border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                🌐 Comunidades STEM ({stats.breakdown?.community.total || 0})
              </button>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 border border-[var(--rule)] bg-[var(--card)] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-1 min-w-[280px]">
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo u organización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input text-sm flex-1 min-w-[200px]"
                />

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-select text-sm w-auto"
                >
                  <option value="">Todos los tipos</option>
                  <option value="attendee">Asistentes Generales</option>
                  <option value="speaker">Ponentes (Speakers)</option>
                  <option value="sponsor">Patrocinadores</option>
                  <option value="community">Comunidades</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select text-sm w-auto"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="lista_espera">Lista de espera</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>

              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={loadingData}
                className="btn btn-ghost text-xs cursor-pointer"
              >
                {loadingData ? "Cargando..." : "↻ Actualizar"}
              </button>
            </div>

            {/* Tabla de Registros */}
            <div className="border border-[var(--rule)] bg-[var(--card)] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--rule)] bg-[var(--bg-alt)]/60 text-xs uppercase tracking-wider text-[var(--head)] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Nombre / Organización</th>
                    <th className="py-3 px-4">Contacto</th>
                    <th className="py-3 px-4">Estatus</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--rule)]">
                  {loadingData && registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--head)] font-medium">
                        Cargando registros...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--fg)] opacity-70">
                        No se encontraron registros con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[var(--bg-alt)]/20 transition-colors">
                        <td className="py-3 px-4">
                          {reg.type === "attendee" && (
                            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
                              👩‍💻 Asistente
                            </span>
                          )}
                          {reg.type === "speaker" && (
                            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800">
                              🎙️ Ponente
                            </span>
                          )}
                          {reg.type === "sponsor" && (
                            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                              🏢 Patrocinio
                            </span>
                          )}
                          {reg.type === "community" && (
                            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800">
                              🌐 Comunidad
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[var(--head)] text-base">
                            {reg.chosenName || reg.fullName}
                          </p>
                          {reg.organization && (
                            <p className="text-xs text-[var(--fg)] opacity-90 font-medium mt-0.5">
                              {reg.type === "sponsor"
                                ? `🏢 Empresa: ${reg.organization}`
                                : reg.type === "community"
                                ? `🌐 Colectivo: ${reg.organization}`
                                : reg.type === "speaker"
                                ? `🏛️ Institución: ${reg.organization}`
                                : `Institución: ${reg.organization}`}
                            </p>
                          )}
                          {reg.talkTitle && (
                            <p className="text-xs italic text-[var(--accent-text)] truncate max-w-sm mt-0.5 font-medium">
                              {reg.type === "speaker"
                                ? `🎙️ Ponencia: "${reg.talkTitle}"`
                                : reg.type === "sponsor"
                                ? `💼 Propuesta: ${reg.talkTitle}`
                                : reg.type === "community"
                                ? `🌱 Enfoque: ${reg.talkTitle}`
                                : `Carrera/Nivel: ${reg.talkTitle}`}
                            </p>
                          )}
                          {reg.talkMaterials && (
                            <p className="text-xs text-[var(--fg)] opacity-75 truncate max-w-sm mt-0.5">
                              {reg.talkMaterials.startsWith("http") ? (
                                <a
                                  href={reg.talkMaterials}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline text-[var(--accent)] hover:opacity-80"
                                >
                                  🔗 Ver propuesta / enlace
                                </a>
                              ) : (
                                `Modalidad / Detalles: ${reg.talkMaterials}`
                              )}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <p>{reg.email}</p>
                          {reg.phone && <p className="opacity-75">{reg.phone}</p>}
                        </td>
                        <td className="py-3 px-4">
                          {reg.status === "pendiente" && (
                            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                              Pendiente
                            </span>
                          )}
                          {reg.status === "aprobado" && (
                            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                              Aprobado
                            </span>
                          )}
                          {reg.status === "lista_espera" && (
                            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-purple-100 text-purple-900 border border-purple-300">
                              En espera
                            </span>
                          )}
                          {reg.status === "rechazado" && (
                            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-rose-100 text-rose-900 border border-rose-300">
                              Rechazado
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs opacity-75 whitespace-nowrap">
                          {new Date(reg.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedReg(reg);
                                setAdminNoteInput(reg.adminNote || "");
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-[var(--head)] border border-[var(--rule)] hover:bg-[var(--bg-alt)]"
                              title="Ver ficha completa y consentimientos"
                            >
                              Ficha
                            </button>

                            {/* Acciones directas */}
                            {reg.status !== "aprobado" && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, "approve")}
                                disabled={actionLoading === reg.id}
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                                title="Aprobar y notificar"
                              >
                                Aprobar
                              </button>
                            )}

                            {reg.status !== "lista_espera" && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, "waitlist")}
                                disabled={actionLoading === reg.id}
                                className="px-2.5 py-1 text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50"
                                title="Pasar a lista de espera"
                              >
                                Espera
                              </button>
                            )}

                            {reg.status !== "rechazado" && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, "reject")}
                                disabled={actionLoading === reg.id}
                                className="px-2.5 py-1 text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-50"
                                title="Rechazar solicitud"
                              >
                                Rechazar
                              </button>
                            )}

                            {/* Borrar registro (Pruebas) */}
                            <button
                              onClick={() => handleDeleteRegistration(reg.id, reg.fullName)}
                              disabled={actionLoading === reg.id}
                              className="px-2.5 py-1 text-xs font-semibold bg-red-950 text-red-200 border border-red-800 hover:bg-red-900 disabled:opacity-50"
                              title="Eliminar postulación de la base de datos (para pruebas)"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: GESTIÓN DE ADMINISTRADORES DEL COMITÉ */}
        {activeTab === "admins" && (
          <div className="space-y-6">
            <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
              <h2 className="text-xl font-display text-[var(--head)]">
                Agregar Nuevo Miembro al Comité
              </h2>
              <p className="text-sm text-[var(--fg)] opacity-90">
                Otorga acceso de administrador a otra persona introduciendo la dirección de correo de Google con la que iniciará sesión:
              </p>

              <form onSubmit={handleAddAdmin} className="flex flex-wrap gap-3 max-w-xl">
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="form-input text-sm flex-1 min-w-[240px]"
                />
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="btn btn-primary text-xs cursor-pointer"
                >
                  {addingAdmin ? "Guardando..." : "Agregar Administrador"}
                </button>
              </form>
            </div>

            <div className="border border-[var(--rule)] bg-[var(--card)] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--rule)] bg-[var(--bg-alt)]/60 text-xs uppercase tracking-wider text-[var(--head)] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Correo Autorizado</th>
                    <th className="py-3 px-4">Origen</th>
                    <th className="py-3 px-4">Registrado por</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--rule)]">
                  {adminsList.map((adm) => (
                    <tr key={adm.email} className="hover:bg-[var(--bg-alt)]/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[var(--head)]">
                        {adm.email}
                      </td>
                      <td className="py-3 px-4">
                        {adm.source === "env" ? (
                          <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            Principal (.env)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Plataforma (Firestore)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs opacity-75">{adm.addedBy || "—"}</td>
                      <td className="py-3 px-4 text-xs opacity-75">
                        {adm.addedAt === "Principal"
                          ? "Permanente"
                          : new Date(adm.addedAt || "").toLocaleDateString("es-MX")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {adm.source === "env" ? (
                          <span className="text-xs text-[var(--fg)] opacity-50 italic">
                            Inmutable
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRemoveAdmin(adm.email)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-300 hover:bg-rose-50 cursor-pointer"
                          >
                            Revocar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: AVISOS Y PLANTILLAS DE CORREO (BROADCAST A APROBADOS) */}
        {activeTab === "notices" && (
          <div className="space-y-8">
            {/* Encabezado y Garantías Institucionales de Broadcast */}
            <div className="border border-[var(--accent)] bg-[var(--bg-alt)]/30 p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-display text-[var(--head)]">
                  Avisos Generales y Recordatorios (Broadcast a Asistentes Aprobados)
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white">
                    {stats.approvedCount} Asistentes en Audiencia
                  </span>
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[var(--head)] text-[#DFB15B] border border-[#DFB15B]">
                    Resend Marketing Broadcast
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--fg)] opacity-90 max-w-3xl leading-relaxed">
                Envía recordatorios y avisos generales a toda la comunidad de participantes <strong>APROBADOS</strong> (ej. <em>&ldquo;mañana es el evento&rdquo;</em>, <em>&ldquo;horarios y acceso a FES Acatlán&rdquo;</em>, <em>&ldquo;trae tu credencial&rdquo;</em>). Estos envíos se gestionan vía Resend Broadcasts y <strong>NO consumen el límite transaccional de 100 correos al día</strong>.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 bg-[var(--card)] text-[var(--head)] border border-[var(--rule)] font-semibold">✓ Remitente: Quetzalia &lt;registro@quetzalia.dev&gt;</span>
                <span className="px-2.5 py-1 bg-[var(--card)] text-[var(--head)] border border-[var(--rule)] font-semibold">✓ Respuestas: 923475@pcpuma.acatlan.unam.mx</span>
                <span className="px-2.5 py-1 bg-[var(--card)] text-[var(--head)] border border-[var(--rule)] font-semibold">✓ Cupo de marketing: hasta 1,000 contactos</span>
                <span className="px-2.5 py-1 bg-[var(--card)] text-[var(--head)] border border-[var(--rule)] font-semibold">✓ Enlace de cancelación incluido automáticamente</span>
              </div>
              <p className="text-xs text-[var(--fg)] opacity-80 pt-1 italic">
                ⚖️ <strong>Lineamiento de uso:</strong> Los avisos son exclusivos para logística del evento (recordatorios, horarios, sede, cambios). No mandes por Broadcast promociones de patrocinadores ni noticias no autorizadas.
              </p>
              {!audienceConfigured && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs">
                  ⚠️ <strong>Atención:</strong> <code>RESEND_AUDIENCE_ID</code> no está configurada en las variables de entorno. Crea la audiencia <strong>&ldquo;Quetzalia&rdquo;</strong> en tu panel de Resend e ingresa su ID en <code>.env.local</code> / Vercel para habilitar el envío masivo.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Columna 1: Formulario "Enviar aviso" (Broadcast) (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-5 shadow-sm">
                  <div className="border-b border-[var(--rule)] pb-2 flex items-center justify-between">
                    <h3 className="text-lg font-display text-[var(--head)]">
                      📢 Enviar Aviso a Asistentes Aprobados
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                      {stats.approvedCount} destinatarios
                    </span>
                  </div>

                  <form onSubmit={handleOpenBroadcastConfirm} className="space-y-4 text-sm">
                    {/* Asunto */}
                    <div>
                      <label className="form-label text-xs font-bold uppercase tracking-wider text-[var(--head)]" htmlFor="broadcastSubject">
                        Asunto del Aviso
                      </label>
                      <input
                        id="broadcastSubject"
                        type="text"
                        required
                        placeholder="Ej: ¡Mañana inicia Quetzalia 2027! Indicaciones de acceso y horarios"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        className="form-input text-xs w-full"
                      />
                    </div>

                    {/* Mensaje */}
                    <div>
                      <label className="form-label text-xs font-bold uppercase tracking-wider text-[var(--head)]" htmlFor="broadcastMessage">
                        Mensaje Oficial / Recordatorio de Logística
                      </label>
                      <textarea
                        id="broadcastMessage"
                        required
                        rows={7}
                        placeholder="Escribe el aviso para los asistentes aprobados. Puedes separar párrafos con doble salto de línea...&#10;&#10;Ejemplo:&#10;Estimadas participantes:&#10;&#10;Les recordamos presentarse a las 8:45 AM en el auditorio principal de la FES Acatlán con su credencial oficial o escolar.&#10;&#10;¡Las esperamos para construir el futuro de STEM!"
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="form-textarea text-xs w-full leading-relaxed"
                      />
                    </div>

                    {/* Botón de acción opcional */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--head)]" htmlFor="broadcastActionText">
                          Texto del Botón (Opcional)
                        </label>
                        <input
                          id="broadcastActionText"
                          type="text"
                          value={broadcastActionText}
                          onChange={(e) => setBroadcastActionText(e.target.value)}
                          placeholder="Consultar Acceso"
                          className="form-input text-xs w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--head)]" htmlFor="broadcastActionUrl">
                          URL del Botón (Opcional)
                        </label>
                        <input
                          id="broadcastActionUrl"
                          type="url"
                          value={broadcastActionUrl}
                          onChange={(e) => setBroadcastActionUrl(e.target.value)}
                          placeholder="https://quetzalia.dev/mi-registro"
                          className="form-input text-xs w-full"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[var(--bg-alt)]/40 border border-[var(--rule)] text-xs text-[var(--fg)] space-y-1">
                      <p className="font-semibold text-[var(--head)]">Audiencia objetivo:</p>
                      <p>
                        Solo recibirán este aviso las personas registradas que hayan sido <strong>APROBADAS</strong> por el comité ({stats.approvedCount} participantes). Los contactos en lista de espera o rechazados están excluidos.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={stats.approvedCount === 0}
                      className="btn btn-primary text-xs w-full mt-3 cursor-pointer disabled:opacity-50 py-3 font-bold tracking-wider"
                    >
                      👁️ Preparar y Previsualizar Aviso Oficial
                    </button>
                  </form>
                </div>

                {/* Historial de Avisos / Broadcasts Enviados */}
                <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4 shadow-sm">
                  <h3 className="text-base font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
                    📜 Historial de Broadcasts Enviados ({broadcastHistory.length})
                  </h3>

                  {broadcastHistory.length === 0 ? (
                    <p className="text-xs text-[var(--fg)] opacity-70 italic py-2">
                      No se ha emitido ningún broadcast general todavía.
                    </p>
                  ) : (
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-[var(--rule)] bg-[var(--bg-alt)]/60 text-[var(--head)] font-semibold">
                          <tr>
                            <th className="py-2 px-3">Fecha</th>
                            <th className="py-2 px-3">Asunto</th>
                            <th className="py-2 px-3">Enviado por</th>
                            <th className="py-2 px-3 text-right">Alcance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--rule)]">
                          {broadcastHistory.map((b) => (
                            <tr key={b.id} className="hover:bg-[var(--bg-alt)]/20">
                              <td className="py-2 px-3 opacity-75 whitespace-nowrap">
                                {new Date(b.sentAt).toLocaleString("es-MX", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </td>
                              <td className="py-2 px-3 font-medium text-[var(--head)]">
                                {b.subject}
                              </td>
                              <td className="py-2 px-3 opacity-75">{b.sentBy}</td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">
                                {b.audienceCount ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna 2: Auditoría y Visor de Plantillas Oficiales (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3">
                    <h3 className="text-lg font-display text-[var(--head)]">
                      👁️ Auditoría de Plantillas Oficiales
                    </h3>
                    {loadingPreview && (
                      <span className="text-xs text-[var(--accent)] font-semibold animate-pulse">
                        Cargando...
                      </span>
                    )}
                  </div>

                  {/* Selectores de Plantilla y Tipo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-[var(--head)] block mb-1">
                        Seleccionar Plantilla Oficial:
                      </label>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="form-input text-xs w-full"
                      >
                        <option value="received">1. Registro Recibido</option>
                        <option value="approved">2. Registro Aprobado</option>
                        <option value="waitlist">3. Lista de Espera</option>
                        <option value="rejected">4. No Aceptado / Rechazado</option>
                        <option value="promoted">5. Promovido de Lista de Espera</option>
                        <option value="custom">6. Comunicado Personalizado</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[var(--head)] block mb-1">
                        Modalidad / Rol para Visualización:
                      </label>
                      <select
                        value={previewType}
                        onChange={(e) => setPreviewType(e.target.value)}
                        className="form-input text-xs w-full"
                      >
                        <option value="speaker">Ponente / Tallerista (Formatos 01 y 02)</option>
                        <option value="sponsor">Patrocinador (Convenio 06)</option>
                        <option value="community">Comunidad Aliada STEM</option>
                        <option value="attendee">Asistente General</option>
                      </select>
                    </div>
                  </div>

                  {/* Asunto Oficial de la plantilla */}
                  {templatePreview && (
                    <div className="p-3 bg-[var(--bg-alt)]/50 border border-[var(--rule)] text-xs space-y-1">
                      <p className="font-semibold text-[var(--head)]">
                        Asunto generado: <span className="font-normal text-[var(--fg)]">{templatePreview.subject}</span>
                      </p>
                    </div>
                  )}

                  {/* Renderizado de Previsualización en iframe aislado */}
                  <div className="border-2 border-[var(--rule)] overflow-hidden bg-white shadow-inner">
                    {templatePreview ? (
                      <iframe
                        title="Previsualización de Correo"
                        srcDoc={templatePreview.html}
                        className="w-full h-[540px] border-0"
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="h-[400px] flex items-center justify-center text-xs text-opacity-60">
                        Cargando plantilla...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL OBLIGATORIO DE CONFIRMACIÓN DE BROADCAST */}
        {showBroadcastConfirmModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-3xl w-full bg-[var(--card)] border-2 border-[var(--head)] p-6 space-y-5 max-h-[95vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
                <div>
                  <h3 className="text-xl font-display text-[var(--head)]">
                    ⚠️ Confirmación Requerida del Comité Organizador
                  </h3>
                  <p className="text-xs text-[var(--fg)] opacity-80 mt-0.5">
                    Nunca envíes un broadcast sin verificar detenidamente el contenido y el alcance.
                  </p>
                </div>
                <button
                  onClick={() => setShowBroadcastConfirmModal(false)}
                  className="font-bold text-lg text-[var(--head)] hover:opacity-75"
                >
                  ✕
                </button>
              </div>

              {/* Ficha Resumen del Broadcast */}
              <div className="bg-[var(--bg-alt)]/40 border border-[var(--rule)] p-4 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-[var(--head)] uppercase">Remitente oficial:</span>
                    <p className="font-mono mt-0.5">Quetzalia &lt;registro@quetzalia.dev&gt;</p>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--head)] uppercase">Respuestas dirigidas a:</span>
                    <p className="font-mono mt-0.5">923475@pcpuma.acatlan.unam.mx</p>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--head)] uppercase">Audiencia destinataria:</span>
                    <p className="font-bold text-emerald-800 mt-0.5">
                      ✓ {stats.approvedCount} asistentes con registro APROBADO
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--head)] uppercase">Límite diario:</span>
                    <p className="text-emerald-800 mt-0.5">
                      Sin consumo de cuota transaccional (100/día)
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--rule)]">
                  <span className="font-bold text-[var(--head)] uppercase">Asunto del correo:</span>
                  <p className="font-semibold text-sm text-[var(--head)] mt-0.5">Quetzalia: {broadcastSubject}</p>
                </div>
              </div>

              {/* Vista Previa Interactiva del Broadcast en iframe */}
              <div>
                <p className="text-xs font-bold text-[var(--head)] uppercase tracking-wider mb-2">
                  Vista Previa del Aviso a Enviarse:
                </p>
                <div className="border-2 border-[var(--rule)] overflow-hidden bg-white shadow-inner">
                  {broadcastPreviewHtml ? (
                    <iframe
                      title="Vista Previa de Broadcast"
                      srcDoc={broadcastPreviewHtml}
                      className="w-full h-[380px] border-0"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-xs opacity-60">
                      Generando vista previa...
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de Confirmación */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-[var(--rule)]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastConfirmModal(false)}
                  disabled={sendingBroadcast}
                  className="btn btn-ghost text-xs"
                >
                  Volver a Editar
                </button>

                <button
                  type="button"
                  onClick={handleSendBroadcastConfirmed}
                  disabled={sendingBroadcast || stats.approvedCount === 0}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer disabled:opacity-50 shadow-md tracking-wider uppercase"
                >
                  {sendingBroadcast
                    ? "Enviando Broadcast a la Audiencia..."
                    : `✓ Confirmar y Enviar Aviso Inmediato (${stats.approvedCount} Aprobados)`}
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedReg && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-2xl w-full bg-[var(--card)] border-2 border-[var(--head)] p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
                <h3 className="text-xl font-display text-[var(--head)]">
                  Ficha de Registro ({selectedReg.type})
                </h3>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="font-bold text-lg text-[var(--head)] hover:opacity-75"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-[var(--head)]">Nombre elegido / profesional:</p>
                  <p>{selectedReg.chosenName || selectedReg.fullName}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--head)]">Nombre legal completo:</p>
                  <p>{selectedReg.legalName || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--head)]">Correo:</p>
                  <p>{selectedReg.email}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--head)]">Teléfono:</p>
                  <p>{selectedReg.phone || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--head)]">Organización / Afiliación:</p>
                  <p>{selectedReg.organization || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--head)]">Estatus actual:</p>
                  <p className="font-bold uppercase text-xs">{selectedReg.status}</p>
                </div>
              </div>

              {selectedReg.talkTitle && (
                <div className="text-sm">
                  <p className="font-semibold text-[var(--head)]">Título de Ponencia:</p>
                  <p>{selectedReg.talkTitle}</p>
                </div>
              )}

              {selectedReg.talkMaterials && (
                <div className="text-sm">
                  <p className="font-semibold text-[var(--head)]">Resumen / Materiales / Propuesta:</p>
                  <p className="whitespace-pre-wrap bg-[var(--bg-alt)]/40 p-3 border border-[var(--rule)] text-xs mt-1">
                    {selectedReg.talkMaterials}
                  </p>
                </div>
              )}

              {/* Gestión de Fotografía o Logotipo y Garantía de Retiro en 72h */}
              {selectedReg.photoPath && (
                <div className="border border-[var(--accent)] p-4 bg-[var(--bg-alt)]/30 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-[var(--head)] uppercase tracking-wider">
                        {selectedReg.type === "sponsor"
                          ? "Logotipo oficial de la empresa:"
                          : selectedReg.type === "community"
                          ? "Emblema / Logotipo del colectivo:"
                          : "Fotografía de semblanza:"}
                      </p>
                      {selectedReg.photoPath.startsWith("data:") ? (
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          ✓ Almacenada en base de datos (Optimización HD)
                        </span>
                      ) : (
                        <p className="font-mono text-[11px] opacity-80 mt-0.5">
                          Ruta: {selectedReg.photoPath}
                        </p>
                      )}
                    </div>
                    <div>
                      {selectedReg.photoPath.startsWith("data:") ? (
                        <span className="px-2 py-0.5 font-bold uppercase text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-400">
                          Imagen Vinculada
                        </span>
                      ) : selectedReg.photoPath.includes("public") ? (
                        <span className="px-2 py-0.5 font-bold uppercase text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-400">
                          Publicada en Agenda Oficial
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 font-bold uppercase text-[10px] bg-amber-100 text-amber-900 border border-amber-400">
                          Privada (Pendiente Formato 01)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Previsualización visual de la imagen */}
                  {selectedReg.photoPath.startsWith("data:") && (
                    <div className="p-2 bg-[var(--card)] border border-[var(--rule)] flex items-center gap-3">
                      <Image
                        src={selectedReg.photoPath}
                        alt="Previsualización adjunta"
                        width={144}
                        height={96}
                        className="max-h-24 max-w-36 object-contain rounded border border-[var(--accent)] bg-white p-1"
                        unoptimized
                      />
                      <div className="text-[11px] opacity-85">
                        <p className="font-semibold text-[var(--head)]">Archivo gráfico listo</p>
                        <p>Visible para revisión del comité y despliegue oficial.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedReg.photoPath.includes("private") && (
                      <button
                        type="button"
                        onClick={() => handlePublishPhoto(selectedReg.id)}
                        disabled={actionLoading === selectedReg.id}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer disabled:opacity-50"
                      >
                        Publicar Foto (Formato 01 Firmado)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleWithdrawMedia(selectedReg.id)}
                      disabled={actionLoading === selectedReg.id}
                      className="px-2.5 py-1 text-xs font-semibold bg-rose-800 text-white hover:bg-rose-900 cursor-pointer disabled:opacity-50"
                      title="Baja la foto y materiales en cumplimiento del plazo de 72h"
                    >
                      Bajar y Retirar Foto / Materiales (72h)
                    </button>
                  </div>
                </div>
              )}

              {/* Registro de Consentimiento */}
              <div className="border border-[var(--rule)] p-4 bg-[var(--bg-alt)]/20 space-y-2 text-xs">
                <p className="font-bold text-[var(--head)] uppercase tracking-wider">
                  Consentimientos Otorgados (Versión: {selectedReg.consentVersion}):
                </p>
                <ul className="space-y-1">
                  <li>• Aviso Privacidad: {selectedReg.consent?.privacyNotice ? "Aceptado ✓" : "No ✗"}</li>
                  <li>• Uso de imagen básica: {selectedReg.consent?.imageBasic ? "Autorizado ✓" : "No ✗"}</li>
                  <li>• Grabación audiovisual: {selectedReg.consent?.recording ? "Autorizado ✓" : "No ✗"}</li>
                  <li>• Distribución de materiales: {selectedReg.consent?.materials ? "Autorizado ✓" : "No ✗"}</li>
                  <li>• Compartir correo con patrocinadores: {selectedReg.consent?.shareEmailWithSponsors ? "Autorizado ✓" : "No ✗"}</li>
                  <li>• Clips y testimonios: {selectedReg.consent?.clips ? "Autorizado ✓" : "No ✗"}</li>
                  <li>• Futuras ediciones: {selectedReg.consent?.futureEditions ? "Autorizado ✓" : "No ✗"}</li>
                </ul>
                <p className="text-[10px] opacity-75 pt-1">
                  Registrado el: {new Date(selectedReg.consentTimestamp || selectedReg.createdAt).toLocaleString("es-MX")}
                </p>
              </div>

              {/* Notas del Administrador */}
              <div>
                <label className="form-label" htmlFor="modalAdminNote">
                  Notas Internas del Comité
                </label>
                <textarea
                  id="modalAdminNote"
                  rows={2}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Añadir observaciones sobre convenios o estatus..."
                  className="form-textarea text-xs"
                />
              </div>

              {/* Botones de Acción en el Modal */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-[var(--rule)]">
                <div>
                  <button
                    type="button"
                    onClick={() => handleResendStatus(selectedReg.id)}
                    disabled={actionLoading === selectedReg.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#5A354C] text-[#DFB15B] border border-[#DFB15B] hover:bg-[#48283C] disabled:opacity-50 cursor-pointer"
                    title="Re-enviar la plantilla oficial correspondiente a su estatus actual"
                  >
                    {actionLoading === selectedReg.id
                      ? "Enviando..."
                      : `✉️ Re-enviar Correo (${selectedReg.status})`}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedReg(null)}
                    className="btn btn-ghost text-xs"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleDeleteRegistration(selectedReg.id, selectedReg.fullName)}
                    disabled={actionLoading === selectedReg.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-950 text-red-200 border border-red-800 hover:bg-red-900"
                    title="Eliminar postulación de la base de datos"
                  >
                    🗑️ Borrar Postulación
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, "reject", adminNoteInput)}
                    disabled={actionLoading === selectedReg.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, "waitlist", adminNoteInput)}
                    disabled={actionLoading === selectedReg.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800"
                  >
                    Lista de Espera
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, "approve", adminNoteInput)}
                    disabled={actionLoading === selectedReg.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Aprobar Solicitud
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-4 text-center text-xs opacity-75">
        Quetzalia 2027 · Sistema de Gestión y Administración
      </footer>
    </div>
  );
}
