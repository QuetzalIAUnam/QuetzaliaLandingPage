"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface BoardingPassProps {
  passengerName: string;
  role?: "speaker" | "community" | "sponsor" | "asistente" | "admin" | string;
  registrationId?: string;
  organization?: string;
  status?: string;
  eventDate?: string;
  gate?: string;
  seat?: string;
  photoPath?: string;
}

// Representación binaria ASCII de 8 bits para la palabra "BIENVENIDA"
const BINARY_BIENVENIDA = [
  "01000010", // B
  "01001001", // I
  "01000101", // E
  "01001110", // N
  "01010110", // V
  "01000101", // E
  "01001110", // N
  "01001001", // I
  "01000100", // D
  "01000001", // A
];

export default function BoardingPass({
  passengerName,
  role = "asistente",
  registrationId = "QIA-042",
  organization,
  eventDate = "27 ABR 2027",
  gate = "PRESENCIAL // CEMM",
  seat,
}: BoardingPassProps) {
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCopy, setCopiedCopy] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Normalizar rol
  const normRole = (role || "").toLowerCase().trim();
  const isSpeaker =
    normRole.includes("speaker") ||
    normRole.includes("ponente") ||
    normRole.includes("tallerista");
  const isCommunity =
    normRole.includes("community") || normRole.includes("comunidad");
  const isSponsor =
    normRole.includes("sponsor") || normRole.includes("patrocinador");
  const isAdmin =
    normRole.includes("admin") ||
    normRole.includes("comité") ||
    normRole.includes("comite");

  // Asignación estricta de imágenes por rol:
  // - Ponente: SIEMPRE /Ponentes.jpg
  // - Patrocinador: SIEMPRE /Patrocinadores.jpg
  // - Comunidad: SIEMPRE /Comunidades.jpg
  // - Asistente General: SIEMPRE /asistente_general.jpg (Emblema sagrado con la pluma de quetzal y circuitos)
  // - Comité: /QuetzaliaLogo.jpeg
  let badgeTitle = "PASAJERA / ASISTENTE";
  let badgeSubtitle = "ASISTENCIA GENERAL";
  let headerImg = "/asistente_general.jpg";

  if (isSpeaker) {
    badgeTitle = "PONENTE / SPEAKER";
    badgeSubtitle = "DIVULGACIÓN CIENTÍFICA";
    headerImg = "/Ponentes.jpg";
  } else if (isCommunity) {
    badgeTitle = "COMUNIDAD ALIADA";
    badgeSubtitle = "REDES Y COLECTIVOS";
    headerImg = "/Comunidades.jpg";
  } else if (isSponsor) {
    badgeTitle = "PATROCINADOR OFICIAL";
    badgeSubtitle = "INDUSTRIA Y TALENTO";
    headerImg = "/Patrocinadores.jpg";
  } else if (isAdmin) {
    badgeTitle = "COMITÉ ORGANIZADOR";
    badgeSubtitle = "UNAM FES ACATLÁN";
    headerImg = "/QuetzaliaLogo.jpeg";
  }

  // Generar ID de pase dinámico (#QIA-042 o similar)
  const displayPaseId = seat
    ? `#${seat.toUpperCase()}`
    : registrationId
    ? `#QIA-${registrationId.replace(/[^a-zA-Z0-9]/g, "").slice(-3).toUpperCase().padStart(3, "0")}`
    : "#QIA-042";

  const displayFolio = registrationId
    ? `QIA-${registrationId.slice(0, 8).toUpperCase()}`
    : "QIA-2027-FES";

  // Texto sugerido para publicar en redes
  const suggestedCopy = `¡Lista para despegar! 🚀✨ Ya tengo mi pase de abordar para Quetzal-IA 2027, la Cumbre de Mujeres en STEM en la FES Acatlán de la UNAM. Acompañándoles como ${badgeTitle}. ¡Nos vemos el 27 de abril en el CEMM! 💜👩‍💻 #Quetzalia #QuetzalIA2027 #MujeresEnSTEM #UNAM @QuetzalIA https://quetzalia.dev`;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3800);
  };

  // Motor Canvas Compacto y Ligero (720 x 960 px)
  const generateCanvasBlob = async (): Promise<Blob | null> => {
    const W = 720;
    const H = 960;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. LIENZO BASE
    const grad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, W * 0.7);
    grad.addColorStop(0, "#734464");
    grad.addColorStop(0.65, "#613954");
    grad.addColorStop(1, "#4A2940");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Resplandor Ambiental
    ctx.save();
    const glow = ctx.createRadialGradient(W / 2, H * 0.4, 20, W / 2, H * 0.4, 260);
    glow.addColorStop(0, "rgba(244, 179, 217, 0.18)");
    glow.addColorStop(1, "rgba(244, 179, 217, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 2. CÓDIGO BINARIO LATERAL ("BIENVENIDA" en ASCII)
    ctx.save();
    ctx.fillStyle = "#F4B3D9";
    ctx.globalAlpha = 0.22;
    ctx.font = "bold 9px monospace";
    BINARY_BIENVENIDA.forEach((binStr, idx) => {
      const yPos = 180 + idx * 58;
      ctx.fillText(binStr, 8, yPos);
      ctx.fillText(binStr, W - 62, yPos);
    });
    ctx.restore();

    // 3. DIMENSIONES DEL BOLETO
    const marginX = 68;
    const ticketTop = 45;
    const ticketW = W - marginX * 2; // 584px
    const ticketH = 860;
    const stubSplitY = ticketTop + 695;
    const cardRadius = 18;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });
    };

    // 4. DIBUJAR TARJETA (2 Bloques unidos con bordes redondeados)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 16;

    // Bloque 1: Cuerpo Superior Marfil (#FAF5F7)
    ctx.fillStyle = "#FAF5F7";
    ctx.beginPath();
    ctx.moveTo(marginX + cardRadius, ticketTop);
    ctx.lineTo(marginX + ticketW - cardRadius, ticketTop);
    ctx.arcTo(marginX + ticketW, ticketTop, marginX + ticketW, ticketTop + cardRadius, cardRadius);
    ctx.lineTo(marginX + ticketW, stubSplitY);
    ctx.lineTo(marginX, stubSplitY);
    ctx.lineTo(marginX, ticketTop + cardRadius);
    ctx.arcTo(marginX, ticketTop, marginX + cardRadius, ticketTop, cardRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Bloque 2: Talón Inferior Ciruela Oscuro (#4A2940)
    ctx.save();
    ctx.fillStyle = "#4A2940";
    ctx.beginPath();
    ctx.moveTo(marginX, stubSplitY);
    ctx.lineTo(marginX + ticketW, stubSplitY);
    ctx.lineTo(marginX + ticketW, ticketTop + ticketH - cardRadius);
    ctx.arcTo(marginX + ticketW, ticketTop + ticketH, marginX + ticketW - cardRadius, ticketTop + ticketH, cardRadius);
    ctx.lineTo(marginX + cardRadius, ticketTop + ticketH);
    ctx.arcTo(marginX, ticketTop + ticketH, marginX, ticketTop + ticketH - cardRadius, cardRadius);
    ctx.lineTo(marginX, stubSplitY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5. MARCO INTERIOR ART DÉCO (#EBCFDA)
    const frameInset = 12;
    const cornerCut = 12;
    ctx.save();
    ctx.strokeStyle = "#EBCFDA";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(marginX + frameInset + cornerCut, ticketTop + frameInset);
    ctx.lineTo(marginX + ticketW - frameInset - cornerCut, ticketTop + frameInset);
    ctx.lineTo(marginX + ticketW - frameInset, ticketTop + frameInset + cornerCut);
    ctx.lineTo(marginX + ticketW - frameInset, stubSplitY - 10);
    ctx.lineTo(marginX + frameInset, stubSplitY - 10);
    ctx.lineTo(marginX + frameInset, ticketTop + frameInset + cornerCut);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 6. MARCA DE AGUA CENTRAL
    ctx.save();
    ctx.strokeStyle = "#EBCFDA";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.18;
    const wmCenterX = W / 2;
    const wmCenterY = ticketTop + 370;

    ctx.beginPath();
    ctx.moveTo(wmCenterX, wmCenterY - 65);
    ctx.lineTo(wmCenterX + 85, wmCenterY + 50);
    ctx.lineTo(wmCenterX - 85, wmCenterY + 50);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(wmCenterX, wmCenterY - 8, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 7. CABECERA EDITORIAL
    const headerY = ticketTop + 32;

    try {
      const logoImg = await loadImage(headerImg);
      ctx.save();
      ctx.beginPath();
      ctx.arc(marginX + 50, headerY + 36, 30, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, marginX + 20, headerY + 6, 60, 60);
      ctx.restore();

      ctx.strokeStyle = "#613954";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(marginX + 50, headerY + 36, 30, 0, Math.PI * 2);
      ctx.stroke();
    } catch (e) {
      console.warn("Logo load err", e);
    }

    // Título
    ctx.fillStyle = "#613954";
    ctx.font = "bold 24px 'Playfair Display', Georgia, serif";
    ctx.fillText("QUETZAL-IA", marginX + 92, headerY + 28);

    ctx.fillStyle = "#8D627B";
    ctx.font = "bold 9px monospace";
    ctx.fillText("CUMBRE DE MUJERES EN STEM", marginX + 92, headerY + 46);

    ctx.fillStyle = "#774665";
    ctx.font = "600 8.5px 'Segoe UI', sans-serif";
    ctx.fillText("UNAM FES ACATLÁN · EDICIÓN CONMEMORATIVA", marginX + 92, headerY + 61);

    // Rol a la derecha
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = "#8D627B";
    ctx.font = "bold 8.5px monospace";
    ctx.fillText("MODALIDAD DE PARTICIPACIÓN", marginX + ticketW - 32, headerY + 22);

    ctx.fillStyle = "#613954";
    ctx.font = "bold 14px 'Playfair Display', Georgia, serif";
    ctx.fillText(badgeTitle, marginX + ticketW - 32, headerY + 43);

    ctx.fillStyle = "#774665";
    ctx.font = "bold 8.5px monospace";
    ctx.fillText(badgeSubtitle, marginX + ticketW - 32, headerY + 58);
    ctx.restore();

    // 8. LA TRAVESÍA
    const routeY = headerY + 95;

    ctx.save();
    ctx.strokeStyle = "#EBCFDA";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(marginX + 28, routeY);
    ctx.lineTo(marginX + ticketW - 28, routeY);
    ctx.moveTo(marginX + 28, routeY + 75);
    ctx.lineTo(marginX + ticketW - 28, routeY + 75);
    ctx.stroke();
    ctx.restore();

    // Origen: CÓDICE
    ctx.fillStyle = "#8D627B";
    ctx.font = "bold 9px monospace";
    ctx.fillText("ORIGEN // BASE", marginX + 35, routeY + 24);

    ctx.fillStyle = "#613954";
    ctx.font = "bold 28px 'Playfair Display', Georgia, serif";
    ctx.fillText("CÓDICE", marginX + 35, routeY + 56);

    // Destino: FUTURO IA
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = "#8D627B";
    ctx.font = "bold 9px monospace";
    ctx.fillText("DESTINO // HORIZONTE", marginX + ticketW - 35, routeY + 24);

    ctx.fillStyle = "#613954";
    ctx.font = "bold 28px 'Playfair Display', Georgia, serif";
    ctx.fillText("FUTURO IA", marginX + ticketW - 35, routeY + 56);
    ctx.restore();

    // Conector Central
    const curveStartX = marginX + 165;
    const curveEndX = marginX + ticketW - 190;
    const curveMidX = (curveStartX + curveEndX) / 2;
    const curveMidY = routeY + 40;

    ctx.save();
    ctx.strokeStyle = "#DFB15B";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(curveStartX, routeY + 44);
    ctx.quadraticCurveTo(curveMidX, routeY + 22, curveEndX, routeY + 44);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = "#DFB15B";
    ctx.beginPath();
    ctx.arc(curveMidX, curveMidY - 3, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#613954";
    ctx.beginPath();
    ctx.arc(curveStartX, routeY + 44, 3.5, 0, Math.PI * 2);
    ctx.arc(curveEndX, routeY + 44, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 9. BLOQUE DEL PASAJERO
    const passY = routeY + 115;

    ctx.fillStyle = "#8D627B";
    ctx.font = "bold 10px monospace";
    ctx.fillText("PASAJERO / EXPLORADOR", marginX + 35, passY);

    const pName = passengerName.toUpperCase();
    ctx.fillStyle = "#613954";
    const fontSize = pName.length > 24 ? 24 : 29;
    ctx.font = `bold ${fontSize}px 'Segoe UI', -apple-system, sans-serif`;
    ctx.fillText(pName, marginX + 35, passY + 34);

    if (organization) {
      const pillY = passY + 48;
      ctx.save();
      ctx.fillStyle = "#EBCFDA";
      ctx.beginPath();
      ctx.roundRect(marginX + 35, pillY, 260, 24, 5);
      ctx.fill();

      ctx.fillStyle = "#4A2940";
      ctx.font = "bold 9.5px 'Segoe UI', sans-serif";
      let displayOrg = organization;
      if (displayOrg.length > 34) displayOrg = displayOrg.slice(0, 32) + "...";
      ctx.fillText(`Afiliación: ${displayOrg}`, marginX + 45, pillY + 16);
      ctx.restore();
    }

    // 10. RETÍCULA DE VUELO
    const gridY = passY + (organization ? 100 : 80);
    const colW = (ticketW - 70) / 3;

    const cols = [
      { label: "FECHA", val: eventDate, sub: "09:00 HRS CST" },
      { label: "PUERTA / MODALIDAD", val: gate, sub: "FES ACATLÁN" },
      { label: "PASE ID", val: displayPaseId, sub: "ACCESO CONFIRMADO" },
    ];

    cols.forEach((col, idx) => {
      const colX = marginX + 35 + idx * colW;

      if (idx > 0) {
        ctx.save();
        ctx.strokeStyle = "#EBCFDA";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(colX - 14, gridY);
        ctx.lineTo(colX - 14, gridY + 52);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = "#8D627B";
      ctx.font = "bold 9px monospace";
      ctx.fillText(col.label, colX, gridY + 10);

      ctx.fillStyle = "#613954";
      ctx.font = "bold 15px 'Segoe UI', sans-serif";
      ctx.fillText(col.val, colX, gridY + 30);

      ctx.fillStyle = "#774665";
      ctx.font = "500 8.5px monospace";
      ctx.fillText(col.sub, colX, gridY + 45);
    });

    // 11. UNIÓN DE LOS 2 BLOQUES
    ctx.save();
    ctx.strokeStyle = "#8D627B";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(marginX + 8, stubSplitY);
    ctx.lineTo(marginX + ticketW - 8, stubSplitY);
    ctx.stroke();
    ctx.restore();

    // 12. TALÓN INFERIOR
    const stubInnerY = stubSplitY + 45;

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#F4B3D9";
    ctx.font = "italic bold 19px 'Playfair Display', Georgia, serif";
    ctx.fillText("“Tejiendo el futuro desde nuestras raíces”", W / 2, stubInnerY + 22);

    ctx.fillStyle = "#DFB15B";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`#QuetzalIA2027 · ${displayFolio} · ACCESO OFICIAL VALIDADO`, W / 2, stubInnerY + 52);

    ctx.fillStyle = "#FAF5F7";
    ctx.font = "500 8.5px 'Segoe UI', sans-serif";
    ctx.fillText("UNAM FES ACATLÁN · CENTRO DE ESTUDIOS MUNICIPALES Y METROPOLITANOS (CEMM)", W / 2, stubInnerY + 72);
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
    });
  };

  // Descargar archivo PNG
  const downloadBoardingPassPng = async () => {
    try {
      setGenerating(true);
      const blob = await generateCanvasBlob();
      if (!blob) throw new Error("No blob generated");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeFilename = `Quetzalia-Pase-${passengerName.replace(/\s+/g, "_")}.png`;
      link.download = safeFilename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      showToast("🎟️ ¡Pase descargado! Listo para compartir en tus redes.");
      setTimeout(() => setDownloadSuccess(false), 2600);
    } catch (err) {
      console.error("Error generating boarding pass PNG:", err);
      alert("Hubo un detalle al exportar la imagen. Puedes tomar una captura de pantalla.");
    } finally {
      setGenerating(false);
    }
  };

  // Compartir en Stories / TikTok (Web Share API nativa si está disponible)
  const handleShareStories = async () => {
    try {
      const blob = await generateCanvasBlob();
      if (
        blob &&
        navigator.canShare &&
        navigator.canShare({
          files: [new File([blob], "Quetzalia-Pase.png", { type: "image/png" })],
        })
      ) {
        await navigator.share({
          files: [new File([blob], "Quetzalia-Pase.png", { type: "image/png" })],
          title: "Mi Pase de Abordar Quetzal-IA 2027",
          text: suggestedCopy,
        });
        showToast("¡Listo para compartir en tus Stories!");
      } else {
        // Fallback en desktop o navegadores sin files share: descarga y muestra modal instructivo
        await downloadBoardingPassPng();
        showToast("¡Imagen guardada! Ábrela en tus Stories y usa #QuetzalIA2027");
      }
    } catch {
      // Si el usuario cancela la hoja de compartir nativa
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      "https://quetzalia.dev"
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      suggestedCopy
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      suggestedCopy
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopySuggestedText = () => {
    navigator.clipboard.writeText(suggestedCopy);
    setCopiedCopy(true);
    showToast("📋 ¡Texto sugerido copiado! Pégalo en tu post o historia.");
    setTimeout(() => setCopiedCopy(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Flotante de Notificación Instantánea */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#613954] text-[#FAF5F7] border-2 border-[#F4B3D9] px-5 py-3 rounded-xl shadow-2xl animate-bounce text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. PANEL DE CONTROL ELEGANTE (ESTILO CABINA / TERMINAL) - PRIMERO */}
      <div
        className="rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #4A2940 0%, #361D2E 100%)",
          border: "2px solid rgba(235, 207, 218, 0.25)",
        }}
      >
        {/* Luces sutiles de cabina en esquinas */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F4B3D9] rounded-full blur-[60px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#DFB15B] rounded-full blur-[60px] opacity-15 pointer-events-none" />

        {/* Micro-copy persuasivo de la cabina */}
        <div className="text-center space-y-2 relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#613954]/60 border border-[#F4B3D9]/30 text-[#F4B3D9] text-[10px] font-mono tracking-widest uppercase mb-1">
            <span>🚀</span>
            <span>CABINA DE DESPEGUE QUETZAL-IA</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-display font-bold text-[#FAF5F7] leading-snug">
            ¡Tu lugar en el vuelo está asegurado!
          </h4>
          <p className="text-xs sm:text-sm text-[#EBCFDA] opacity-90 leading-relaxed">
            Descarga tu pase oficial y compártelo en redes para conectar con la comunidad antes del despegue.
          </p>

          {/* Banner de Sorteos y Premios Increíbles con #Quetzalia */}
          <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#DFB15B]/20 via-[#F4B3D9]/25 to-[#DFB15B]/20 border border-[#DFB15B]/40 text-left flex items-start gap-3 shadow-lg">
            <span className="text-2xl shrink-0">🎁</span>
            <div className="text-xs sm:text-sm text-[#FAF5F7] space-y-0.5">
              <p className="font-bold text-[#DFB15B] uppercase tracking-wide text-[11px] sm:text-xs flex items-center gap-1.5">
                <span>¡Gana premios increíbles durante la cumbre!</span>
              </p>
              <p className="text-[#EBCFDA] text-xs leading-relaxed">
                Si compartes tu pase de abordar en tus redes sociales con el hashtag{" "}
                <strong className="text-[#F4B3D9] font-bold">#Quetzalia</strong> y etiquetando a{" "}
                <strong className="text-[#F4B3D9] font-bold">@QuetzalIA</strong>, ¡estarás participando automáticamente para ganar premios increíbles y kits conmemorativos durante el evento!
              </p>
            </div>
          </div>
        </div>

        {/* NIVEL 1: HERO CTA (EL BOTÓN PRINCIPAL) */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={downloadBoardingPassPng}
            disabled={generating}
            className={`w-full py-4 px-6 rounded-xl font-display font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-3 border-2 border-white/50 ${
              downloadSuccess
                ? "bg-emerald-400 text-emerald-950 scale-[1.01]"
                : "bg-[#F4B3D9] text-[#613954] hover:bg-[#ffc5e7] hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(244,179,217,0.45)]"
            }`}
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#613954]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Generando pase en alta definición...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <span className="text-lg">🎟️</span>
                <span>¡Pase descargado! Listo para compartir</span>
              </>
            ) : (
              <>
                <span className="text-lg">✨</span>
                <span>DESCARGAR MI PASE DE ABORDAR</span>
              </>
            )}
          </button>
        </div>

        {/* SEPARADOR: O COMPÁRTELO DIRECTO EN */}
        <div className="relative z-10 flex items-center justify-center my-4">
          <div className="border-t border-[#EBCFDA]/20 w-full" />
          <span className="px-3 text-[10px] font-mono tracking-widest text-[#EBCFDA] uppercase whitespace-nowrap bg-[#361D2E]/80 py-0.5 rounded">
            O COMPÁRTELO DIRECTO EN:
          </span>
          <div className="border-t border-[#EBCFDA]/20 w-full" />
        </div>

        {/* NIVEL 2: CARRIL DE REDES (CUADRÍCULA ESTILO TERMINAL) */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stories / TikTok */}
          <button
            type="button"
            onClick={handleShareStories}
            className="py-3 px-3 rounded-xl bg-[#613954]/60 hover:bg-[#613954] border border-[#F4B3D9]/40 hover:border-[#F4B3D9] text-[#FAF5F7] text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer group shadow-sm"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📸</span>
            <span className="text-[11px]">Stories / TikTok</span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="py-3 px-3 rounded-xl bg-[#613954]/60 hover:bg-[#0A66C2] border border-[#EBCFDA]/25 hover:border-[#0A66C2] text-[#FAF5F7] text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer group shadow-sm"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">💼</span>
            <span className="text-[11px]">LinkedIn</span>
          </button>

          {/* X / Twitter */}
          <button
            type="button"
            onClick={handleShareX}
            className="py-3 px-3 rounded-xl bg-[#613954]/60 hover:bg-black border border-[#EBCFDA]/25 hover:border-neutral-500 text-[#FAF5F7] text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer group shadow-sm"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">✖</span>
            <span className="text-[11px]">Postear en X</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="py-3 px-3 rounded-xl bg-[#613954]/60 hover:bg-[#25D366] hover:text-white border border-[#EBCFDA]/25 hover:border-[#25D366] text-[#FAF5F7] text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer group shadow-sm"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">💬</span>
            <span className="text-[11px]">WhatsApp</span>
          </button>
        </div>

        {/* COPIAR COPY SUGERIDO */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#361D2E]/70 p-3.5 rounded-xl border border-[#EBCFDA]/15">
          <p className="text-[11px] text-[#EBCFDA] leading-relaxed text-center sm:text-left">
            ¿No sabes qué escribir? Copia el texto oficial listo con hashtags y mención:
          </p>
          <button
            type="button"
            onClick={handleCopySuggestedText}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2 ${
              copiedCopy
                ? "bg-emerald-400 text-emerald-950 font-bold"
                : "bg-[#613954] hover:bg-[#734464] text-[#FAF5F7] border border-[#F4B3D9]/40"
            }`}
          >
            <span>{copiedCopy ? "✓" : "📋"}</span>
            <span>{copiedCopy ? "¡Texto Copiado!" : "Copiar texto sugerido"}</span>
          </button>
        </div>
      </div>

      {/* 2. LIENZO DEL BOLETO CON TEXTURA Y CÓDIGO BINARIO - ABAJO */}
      <div
        className="w-full relative overflow-hidden p-3 sm:p-6 flex items-center justify-center transition-all duration-300 rounded-2xl shadow-xl"
        style={{
          background: "radial-gradient(circle at center, #734464 0%, #613954 60%, #4A2940 100%)",
        }}
      >
        {/* Resplandor Ambiental difuminado */}
        <div
          className="absolute w-64 h-64 rounded-full pointer-events-none blur-[90px] opacity-25"
          style={{ background: "#F4B3D9", top: "15%", left: "15%" }}
        />
        <div
          className="absolute w-56 h-56 rounded-full pointer-events-none blur-[90px] opacity-20"
          style={{ background: "#EBCFDA", bottom: "15%", right: "15%" }}
        />

        {/* CÓDIGO BINARIO LATERAL ("BIENVENIDA" en ASCII) */}
        <div className="absolute left-2 sm:left-4 top-16 bottom-16 flex flex-col justify-between pointer-events-none opacity-25 font-mono text-[8px] sm:text-[9px] text-[#F4B3D9] select-none">
          {BINARY_BIENVENIDA.map((bin, i) => (
            <span key={i} className="tracking-widest">
              {bin}
            </span>
          ))}
        </div>
        <div className="absolute right-2 sm:right-4 top-16 bottom-16 flex flex-col justify-between pointer-events-none opacity-25 font-mono text-[8px] sm:text-[9px] text-[#F4B3D9] select-none">
          {BINARY_BIENVENIDA.map((bin, i) => (
            <span key={i} className="tracking-widest">
              {bin}
            </span>
          ))}
        </div>

        {/* ARQUITECTURA DEL BOLETO (2 Cuadros unidos sin comisuras) */}
        <div
          className="relative w-full max-w-lg text-[#362B32] shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl mx-auto z-10"
          style={{
            backgroundColor: "#FAF5F7",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.55)",
          }}
        >
          {/* Textura de papel sutil */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Marco Interior Art Déco (#EBCFDA) */}
          <div
            className="absolute inset-3 pointer-events-none z-10 hidden sm:block"
            style={{
              border: "1.2px solid #EBCFDA",
              bottom: "22%",
              clipPath:
                "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 12px)",
            }}
          />

          {/* Marca de Agua Central (Pirámide + pluma) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.16] z-0 overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-72 h-72 text-[#EBCFDA]" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="150,40 260,230 40,230" />
              <line x1="150" y1="80" x2="225" y2="210" />
              <line x1="150" y1="120" x2="90" y2="210" />
              <circle cx="150" cy="150" r="45" />
              <path d="M150,110 Q165,150 150,190" strokeWidth="2.5" />
            </svg>
          </div>

          {/* BLOQUE SUPERIOR: CUERPO PRINCIPAL (#FAF5F7) */}
          <div className="p-5 sm:p-7 relative z-20 space-y-5">
            {/* A. CABECERA EDITORIAL */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBCFDA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#613954] p-0.5 bg-white shrink-0 shadow-sm">
                  <Image
                    src={headerImg}
                    alt={badgeTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-display font-bold text-[#613954] tracking-wider leading-none">
                    QUETZAL-IA
                  </h4>
                  <p className="text-[9px] font-mono font-bold tracking-widest text-[#8D627B] uppercase mt-1">
                    CUMBRE DE MUJERES EN STEM
                  </p>
                  <p className="text-[8px] text-[#774665] font-medium tracking-wide">
                    UNAM FES ACATLÁN · EDICIÓN CONMEMORATIVA
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[8px] font-mono font-bold text-[#8D627B] uppercase tracking-wider block">
                  MODALIDAD DE PARTICIPACIÓN
                </span>
                <p className="text-xs sm:text-sm font-display font-bold text-[#613954] uppercase tracking-wider mt-0.5">
                  {badgeTitle}
                </p>
                <span className="text-[8px] font-mono text-[#774665] block">
                  {badgeSubtitle}
                </span>
              </div>
            </div>

            {/* B. LA TRAVESÍA */}
            <div className="border-y border-[#EBCFDA] py-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-[8px] font-mono font-bold text-[#8D627B] uppercase block">
                  ORIGEN // BASE
                </span>
                <span className="text-xl sm:text-2xl font-display font-bold text-[#613954] block leading-tight mt-0.5">
                  CÓDICE
                </span>
                <span className="text-[8px] font-mono text-[#774665]">
                  MÉXICO · HISTORIA
                </span>
              </div>

              <div className="flex-1 px-2 flex flex-col items-center">
                <span className="text-[7.5px] font-mono text-[#8D627B] mb-0.5">
                  CIRCUITO ESPACIAL
                </span>
                <div className="w-full relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-[#DFB15B]" />
                  <div className="absolute w-4 h-4 rounded-full bg-[#DFB15B] border-2 border-[#613954] flex items-center justify-center shadow-md">
                    <span className="text-[7px] text-[#613954]">✦</span>
                  </div>
                </div>
                <span className="text-[7.5px] font-bold text-[#DFB15B] mt-1 tracking-widest uppercase">
                  UNAM FES ACATLÁN
                </span>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-mono font-bold text-[#8D627B] uppercase block">
                  DESTINO // HORIZONTE
                </span>
                <span className="text-xl sm:text-2xl font-display font-bold text-[#613954] block leading-tight mt-0.5">
                  FUTURO IA
                </span>
                <span className="text-[8px] font-mono text-[#774665]">
                  INNOVACIÓN STEM
                </span>
              </div>
            </div>

            {/* C. BLOQUE DEL PASAJERO */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[9px] font-mono font-bold text-[#8D627B] uppercase tracking-wider block">
                PASAJERO / EXPLORADOR
              </span>
              <h5
                className="font-bold text-[#613954] tracking-wide leading-tight break-words"
                style={{ fontSize: passengerName.length > 24 ? "1.35rem" : "1.75rem" }}
              >
                {passengerName.toUpperCase()}
              </h5>
              {organization && (
                <div className="inline-block px-2.5 py-0.5 bg-[#EBCFDA] border border-[#D5B0C4] rounded text-[#4A2940] text-[11px] font-semibold">
                  Afiliación: {organization}
                </div>
              )}
            </div>

            {/* D. RETÍCULA DE VUELO */}
            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#EBCFDA]/60">
              <div className="p-1.5 sm:p-2">
                <span className="text-[8px] font-mono text-[#8D627B] uppercase block">
                  FECHA
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#613954] mt-0.5">
                  {eventDate}
                </p>
                <span className="text-[7.5px] text-[#774665] font-mono block">09:00 HRS CST</span>
              </div>
              <div className="p-1.5 sm:p-2 border-l border-[#EBCFDA]">
                <span className="text-[8px] font-mono text-[#8D627B] uppercase block">
                  PUERTA / MODALIDAD
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#613954] mt-0.5">
                  {gate}
                </p>
                <span className="text-[7.5px] text-[#774665] font-mono block">FES ACATLÁN</span>
              </div>
              <div className="p-1.5 sm:p-2 border-l border-[#EBCFDA]">
                <span className="text-[8px] font-mono text-[#8D627B] uppercase block">
                  PASE ID
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#613954] mt-0.5 font-mono">
                  {displayPaseId}
                </p>
                <span className="text-[7.5px] text-emerald-800 font-bold block">✓ VALIDADO</span>
              </div>
            </div>
          </div>

          {/* LÍNEA DE UNIÓN ENTRE AMBOS BLOQUES */}
          <div className="border-t-2 border-dashed border-[#8D627B]/60 w-full" />

          {/* BLOQUE INFERIOR: TALÓN CIRUELA OSCURO (#4A2940) */}
          <div
            className="p-5 text-center text-white space-y-1.5"
            style={{ backgroundColor: "#4A2940" }}
          >
            <p className="text-sm sm:text-lg font-display italic text-[#F4B3D9] leading-tight">
              “Tejiendo el futuro desde nuestras raíces”
            </p>
            <p className="text-[9px] font-mono text-[#DFB15B] font-bold tracking-wider">
              #QuetzalIA2027 · {displayFolio} · ACCESO OFICIAL VALIDADO
            </p>
            <p className="text-[8px] text-[#FAF5F7] opacity-80">
              UNAM FES ACATLÁN · CENTRO DE ESTUDIOS MUNICIPALES Y METROPOLITANOS (CEMM)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
