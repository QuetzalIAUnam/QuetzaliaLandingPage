/**
 * Quetzalia 2027 - Plantillas Oficiales de Correo Electrónico
 * 
 * Cumplimiento normativo y directrices de diseño:
 * 1. Todas las plantillas incluyen el nombre del evento (Quetzalia / Quetzalia 2027).
 * 2. Encabezado con datos del remitente y logotipo institucional.
 * 3. Pie de página obligatorio con enlaces exactos a:
 *    - https://quetzalia.dev/privacidad
 *    - https://quetzalia.dev/codigo-de-conducta
 *    - https://quetzalia.dev/derechos-arco
 *    - La línea obligatoria: "Si tienes dudas, responde este correo".
 * 4. HTML nativo sin dependencias externas para compatibilidad universal con clientes de correo.
 */

export type EmailTemplateType = "speaker" | "sponsor" | "community" | "attendee" | string;

export interface EmailRenderResult {
  subject: string;
  html: string;
  previewText?: string;
}

// Mapeo canónico de tipos a nombres legibles en español
export function formatRegistrationType(type?: string): string {
  const normalized = (type || "").toLowerCase().trim();
  switch (normalized) {
    case "speaker":
    case "ponente":
    case "tallerista":
      return "Ponente / Tallerista";
    case "sponsor":
    case "patrocinador":
      return "Patrocinador";
    case "community":
    case "comunidad":
      return "Comunidad Aliada STEM";
    case "attendee":
    case "asistente":
      return "Asistente";
    default:
      return "Participante";
  }
}

/**
 * Función de sanitización contra inyección HTML y XSS en clientes de correo
 */
export function escapeHtml(str?: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Plantilla Maestra / Contenedor Art Déco para todos los correos de Quetzalia
 */
export function getBaseEmailLayout(
  title: string,
  contentHtml: string,
  previewText: string = "",
  includeUnsubscribe: boolean = false
): string {
  const senderDisplay = "Quetzalia &lt;registro@quetzalia.dev&gt;";
  const logoUrl = "https://quetzalia.dev/QuetzaliaLogo.jpeg";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#F7EFF2; font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif; color:#362B32; -webkit-font-smoothing:antialiased;">
  ${
    previewText
      ? `<div style="display:none; font-size:1px; color:#F7EFF2; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
          ${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
         </div>`
      : ""
  }
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7EFF2; padding:32px 12px 48px 12px; margin:0;">
    <tr>
      <td align="center">
        <!-- Contenedor Central -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px; width:100%; background-color:#FFFFFF; border:2px solid #5A354C; box-shadow:0 12px 36px rgba(90,53,76,0.14);">
          
          <!-- Barra Superior de Remitente Institucional -->
          <tr>
            <td style="background-color:#48283C; padding:10px 24px; border-bottom:1px solid #774665; text-align:center; font-size:11px; letter-spacing:1px; color:#F5E4E9; text-transform:uppercase;">
              Remitente: <strong style="color:#DFB15B;">${senderDisplay}</strong>
            </td>
          </tr>

          <!-- Cabecera Art Déco con Logo Oficial de Quetzalia -->
          <tr>
            <td style="background-color:#5A354C; padding:32px 28px 26px 28px; text-align:center; border-bottom:3px solid #DFB15B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${logoUrl}" alt="Quetzalia" width="76" height="76" style="display:block; margin:0 auto 14px auto; width:76px; height:76px; border-radius:50%; border:2px solid #DFB15B; background-color:#FFFFFF; object-fit:cover;" />
                    <h1 style="margin:0; font-family:'Playfair Display',Georgia,'Times New Roman',serif; font-size:27px; font-weight:700; letter-spacing:4px; color:#DFB15B; text-transform:uppercase;">
                      QUETZALIA
                    </h1>
                    <p style="margin:6px 0 0 0; font-size:11px; letter-spacing:2px; color:#F5E4E9; text-transform:uppercase; font-weight:600;">
                      Encuentro de Mujeres en STEM · FES Acatlán, UNAM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contenido Principal Dinámico -->
          <tr>
            <td style="padding:36px 32px 28px 32px; font-size:15px; line-height:1.68; color:#362B32;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Pie Institucional y Legal Requerido -->
          <tr>
            <td style="background-color:#FAF4F6; border-top:1px solid #EACED8; padding:28px 30px 24px 30px; text-align:center; font-size:12px; color:#6B5864; line-height:1.6;">
              <p style="margin:0 0 10px 0; font-weight:700; color:#5A354C; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Quetzalia · Comité Organizador
              </p>
              
              <!-- Línea reglamentaria obligatoria -->
              <p style="margin:0 0 14px 0; color:#5A354C; font-size:13px; font-weight:600;">
                Si tienes dudas, responde este correo.
              </p>
              
              <div style="height:1px; background-color:#E3C2CE; width:80%; margin:12px auto;"></div>

              <p style="margin:12px 0 10px 0; font-size:11px; color:#7E6B77;">
                Tratamiento seguro y ético de datos conforme a la legislación aplicable y la normatividad de la UNAM.
              </p>

              <!-- Enlaces canónicos requeridos -->
              <p style="margin:0; font-size:12px;">
                <a href="https://quetzalia.dev/privacidad" style="color:#942969; text-decoration:underline; font-weight:600;" target="_blank" rel="noopener noreferrer">
                  Aviso de Privacidad
                </a>
                <span style="color:#C7A6B6; margin:0 8px;">·</span>
                <a href="https://quetzalia.dev/codigo-de-conducta" style="color:#942969; text-decoration:underline; font-weight:600;" target="_blank" rel="noopener noreferrer">
                  Código de Conducta
                </a>
                <span style="color:#C7A6B6; margin:0 8px;">·</span>
                <a href="https://quetzalia.dev/derechos-arco" style="color:#942969; text-decoration:underline; font-weight:600;" target="_blank" rel="noopener noreferrer">
                  Derechos ARCO
                </a>
              </p>

              ${
                includeUnsubscribe
                  ? `<p style="margin:14px 0 0 0; font-size:11px; color:#8A7583; line-height:1.5;">
                      Aviso oficial de logística para personas registradas y aprobadas en Quetzalia 2027.
                      Si deseas darte de baja de futuros avisos generales, puedes 
                      <a href="{{{resend_unsubscribe_url}}}" style="color:#942969; text-decoration:underline; font-weight:600;">cancelar tu suscripción aquí</a>.
                    </p>`
                  : ""
              }
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PLANTILLA: REGISTRO RECIBIDO
// Reglas:
// - Confirma que recibimos su registro.
// - Indica su tipo (speaker, patrocinador, comunidad o asistente).
// - Estado: pendiente de revisión por el comité.
// - Confirma que avisaremos por este mismo correo.
// - IMPORTANTE: NO promete fecha de respuesta.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderRegistrationReceivedEmail({
  toName,
  regId,
  type,
}: {
  toName: string;
  regId?: string;
  type?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const typeLabel = formatRegistrationType(type);
  const safeType = escapeHtml(typeLabel);
  const safeRegId = escapeHtml(regId);
  const subject = `Quetzalia: Hemos recibido tu registro (${typeLabel})`;
  const previewText = `Tu solicitud de registro para Quetzalia como ${typeLabel} ha sido recibida y se encuentra pendiente de revisión.`;

  const content = `
    <h2 style="color:#5A354C; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      ¡Hola, ${safeName}!
    </h2>
    <p style="margin-top:0;">
      Confirmamos que hemos recibido satisfactoriamente tu solicitud de registro para participar en <strong>Quetzalia</strong>.
    </p>

    <!-- Ficha de Estatus de Solicitud -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0; background-color:#FBF4F7; border-left:4px solid #942969; border-top:1px solid #EACED8; border-right:1px solid #EACED8; border-bottom:1px solid #EACED8;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#5A354C; font-weight:bold;">
            Tipo de postulación:
          </p>
          <p style="margin:0 0 12px 0; font-size:15px; color:#942969; font-weight:700;">
            ${safeType}
          </p>
          ${
            safeRegId
              ? `<p style="margin:0 0 4px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#5A354C; font-weight:bold;">
                  Folio de registro:
                 </p>
                 <p style="margin:0 0 12px 0; font-family:Consolas,monaco,monospace; font-size:14px; color:#362B32; font-weight:bold;">
                  ${safeRegId}
                 </p>`
              : ""
          }
          <p style="margin:0 0 4px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#5A354C; font-weight:bold;">
            Estado actual:
          </p>
          <p style="margin:0; font-size:14px; color:#78350F; font-weight:bold;">
            ⏳ Pendiente de revisión por el comité organizador
          </p>
        </td>
      </tr>
    </table>

    <p>
      El comité organizador evaluará tu solicitud conforme a los lineamientos y cupos establecidos para el encuentro. <strong>Te avisaremos de la resolución por este mismo correo electrónico</strong>.
    </p>
    
    <p style="font-size:14px; color:#6B5864; background-color:#F5EDF0; padding:12px 16px; border-radius:4px; margin:20px 0;">
      <em>Nota: Las solicitudes se evalúan de manera individual. Mantente al pendiente de tu bandeja de entrada para futuras actualizaciones.</em>
    </p>

    <div style="text-align:center; margin:28px 0 10px 0;">
      <a href="https://quetzalia.dev/mi-registro" style="display:inline-block; background-color:#5A354C; color:#FFFFFF; text-decoration:none; padding:13px 30px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:1px solid #DFB15B;" target="_blank" rel="noopener noreferrer">
        Consultar Mi Registro
      </a>
    </div>
  `;

  return {
    subject,
    previewText,
    html: getBaseEmailLayout("Registro Recibido - Quetzalia", content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. PLANTILLA: REGISTRO APROBADO
// Reglas:
// - Le confirma que su registro fue aprobado.
// - Para speakers: Recuerda que antes de publicar su foto o ponencia debe
//   estar firmado el formato 01 Autorización de imagen, voz y nombre y el
//   02 Licencia de ponencia y materiales.
// - Para patrocinadores: Recuerda que su logotipo solo se publica con el
//   convenio 06 firmado.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderRegistrationApprovedEmail({
  toName,
  type,
  talkTitle,
  organization,
}: {
  toName: string;
  type?: string;
  talkTitle?: string;
  organization?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const safeOrg = escapeHtml(organization);
  const safeTalk = escapeHtml(talkTitle);
  const normType = (type || "").toLowerCase().trim();
  const typeLabel = formatRegistrationType(type);
  const safeType = escapeHtml(typeLabel);
  const isSpeaker = normType === "speaker" || normType === "ponente" || normType === "tallerista";
  const isSponsor = normType === "sponsor" || normType === "patrocinador";
  const isCommunity = normType === "community" || normType === "comunidad";

  const subject = `¡Aprobado! Tu registro para Quetzalia ha sido confirmado`;
  const previewText = `Tu registro como ${typeLabel} en Quetzalia ha sido formalmente aprobado por el comité organizador.`;

  // Bloque específico por rol institucional
  let roleNoticeHtml = "";

  if (isSpeaker) {
    roleNoticeHtml = `
      <div style="background-color:#FEF3C7; border-left:4px solid #D97706; padding:16px 18px; margin:22px 0; color:#92400E; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#B45309;">
          ⚖️ Requisito obligatorio para ponentes y talleristas:
        </p>
        <p style="margin:0 0 8px 0;">
          Para garantizar la máxima certeza jurídica y el respeto a tus derechos de autor e imagen, <strong>antes de publicar tu fotografía de semblanza o los detalles de tu ponencia en el programa oficial</strong>, es indispensable contar con la firma de:
        </p>
        <ul style="margin:0; padding-left:20px; font-weight:600;">
          <li style="margin-bottom:4px;">Formato 01: Autorización de imagen, voz y nombre.</li>
          <li>Formato 02: Licencia de ponencia y materiales.</li>
        </ul>
        <p style="margin:8px 0 0 0; font-size:13px;">
          En breve el comité te compartirá los mecanismos seguros para la formalización digital de ambos formatos.
        </p>
      </div>
    `;
  } else if (isSponsor) {
    roleNoticeHtml = `
      <div style="background-color:#EFF6FF; border-left:4px solid #2563EB; padding:16px 18px; margin:22px 0; color:#1E40AF; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#1D4ED8;">
          🤝 Requisito para publicación de marca y logotipo:
        </p>
        <p style="margin:0;">
          Agradecemos profundamente el compromiso de tu organización con la equidad en STEM. Te recordamos que, conforme a nuestras políticas institucionales, <strong>el logotipo y distintivos de tu marca solo se publicarán en el portal oficial y materiales de difusión con el Convenio 06 firmado</strong> (Convenio de patrocinio y licencia de uso de marca y logotipo).
        </p>
      </div>
    `;
  } else if (isCommunity) {
    roleNoticeHtml = `
      <div style="background-color:#F5F3FF; border-left:4px solid #7C3AED; padding:16px 18px; margin:22px 0; color:#5B21B6; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#6D28D9;">
          💜 Alianzas y Colectivos STEM:
        </p>
        <p style="margin:0;">
          Celebramos contar con la presencia de tu comunidad en Quetzalia. Próximamente coordinaremos contigo la asignación de espacios, mesas de vinculación y las acreditaciones de tu equipo promotor.
        </p>
      </div>
    `;
  } else {
    roleNoticeHtml = `
      <div style="background-color:#ECFDF5; border-left:4px solid #059669; padding:16px 18px; margin:22px 0; color:#065F46; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 6px 0; font-weight:700;">
          🎉 Tu lugar presencial se encuentra confirmado
        </p>
        <p style="margin:0;">
          Tu lugar para las conferencias, paneles y actividades en la FES Acatlán está debidamente reservado. Próximamente recibirás las indicaciones logísticas de acceso y tu gafete digital de asistente.
        </p>
      </div>
    `;
  }

  const content = `
    <h2 style="color:#065F46; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      ¡Felicidades, ${safeName}!
    </h2>
    <p style="margin-top:0;">
      Nos complace informarte que tu registro en <strong>Quetzalia</strong> como <strong>${safeType}</strong> ha sido <strong>APROBADO</strong> por el comité organizador.
    </p>

    <!-- Ficha de confirmación -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0; background-color:#ECFDF5; border-left:4px solid #10B981; border-top:1px solid #A7F3D0; border-right:1px solid #A7F3D0; border-bottom:1px solid #A7F3D0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#065F46; font-weight:bold;">
            Estatus oficial:
          </p>
          <p style="margin:0 0 8px 0; font-size:16px; color:#047857; font-weight:700;">
            ✓ REGISTRO APROBADO
          </p>
          ${
            safeOrg
              ? `<p style="margin:0 0 2px 0; font-size:12px; color:#065F46; font-weight:bold;">Organización / Afiliación:</p>
                 <p style="margin:0 0 8px 0; font-size:14px; color:#1F2937;">${safeOrg}</p>`
              : ""
          }
          ${
            safeTalk
              ? `<p style="margin:0 0 2px 0; font-size:12px; color:#065F46; font-weight:bold;">Ponencia / Sesión:</p>
                 <p style="margin:0; font-size:14px; color:#1F2937; font-style:italic;">"${safeTalk}"</p>`
              : ""
          }
        </td>
      </tr>
    </table>

    ${roleNoticeHtml}

    <!-- SECCIÓN CONMEMORATIVA: PASE DE ABORDAR OFICIAL ESTILO ARTEMIS -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0; background-color:#FAF2F5; border:2px solid #5A354C; box-shadow:0 8px 24px rgba(90,53,76,0.12);">
      <tr>
        <td style="background-color:#5A354C; padding:16px 20px; border-bottom:3px solid #DFB15B;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin:0; font-family:'Playfair Display',Georgia,serif; font-size:16px; font-weight:bold; color:#DFB15B; letter-spacing:1px; text-transform:uppercase;">
                  QUETZAL-IA 2027 · PASE DE ABORDAR
                </p>
                <p style="margin:2px 0 0 0; font-size:10px; color:#F5E4E9; font-weight:600; letter-spacing:0.5px;">
                  CUMBRE DE MUJERES EN STEM · UNAM FES ACATLÁN
                </p>
              </td>
              <td align="right">
                <span style="display:inline-block; background-color:#48283C; border:1px solid #DFB15B; color:#FFFFFF; font-size:10px; font-weight:bold; padding:4px 10px; text-transform:uppercase; letter-spacing:1px;">
                  ${safeType}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 22px;">
          <!-- Trayectoria CÓDICE -> FUTURO IA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px; border-bottom:1px dashed #D4B5C3; padding-bottom:14px;">
            <tr>
              <td width="35%">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#8D627B; font-weight:bold;">ORIGEN (FROM)</p>
                <p style="margin:2px 0 0 0; font-size:22px; font-weight:bold; color:#5A354C; font-family:'Playfair Display',Georgia,serif;">CDX</p>
                <p style="margin:0; font-size:10px; color:#774665; font-weight:600;">CÓDICE / CURIOSIDAD</p>
              </td>
              <td width="30%" align="center">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#DFB15B; font-weight:bold;">✈ VIAJE STEM</p>
                <p style="margin:4px 0 0 0; font-size:14px; color:#DFB15B; letter-spacing:3px;">- - ✦ - -</p>
              </td>
              <td width="35%" align="right">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#8D627B; font-weight:bold;">DESTINO (TO)</p>
                <p style="margin:2px 0 0 0; font-size:22px; font-weight:bold; color:#5A354C; font-family:'Playfair Display',Georgia,serif;">QIA</p>
                <p style="margin:0; font-size:10px; color:#774665; font-weight:600;">FUTURO IA 2027</p>
              </td>
            </tr>
          </table>

          <!-- Datos del Pasajero -->
          <p style="margin:0 0 2px 0; font-size:10px; font-family:monospace; color:#8D627B; font-weight:bold;">PASAJERA / PASSENGER:</p>
          <p style="margin:0 0 14px 0; font-size:18px; font-weight:bold; color:#5A354C; text-transform:uppercase;">${safeName}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5E8EE; padding:10px; border:1px solid #E5CBD6;">
            <tr>
              <td width="33%">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#8D627B;">FECHA</p>
                <p style="margin:2px 0 0 0; font-size:11px; font-weight:bold; color:#5A354C;">27 ABR 2027</p>
              </td>
              <td width="33%">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#8D627B;">MODALIDAD</p>
                <p style="margin:2px 0 0 0; font-size:11px; font-weight:bold; color:#5A354C;">PRESENCIAL // CEMM</p>
              </td>
              <td width="34%">
                <p style="margin:0; font-size:9px; font-family:monospace; color:#8D627B;">CLASE</p>
                <p style="margin:2px 0 0 0; font-size:11px; font-weight:bold; color:#059669;">✓ ACREDITADA</p>
              </td>
            </tr>
          </table>

          <!-- Lema y Llamado a Redes Sociales -->
          <div style="margin-top:16px; padding:12px; background-color:#FFFFFF; border-left:3px solid #DFB15B; font-size:12px; color:#5A354C; line-height:1.5;">
            <p style="margin:0 0 6px 0; font-style:italic; font-weight:bold; font-size:13px; color:#613954;">
              “Tejiendo el futuro desde nuestras raíces”
            </p>
            Tu Pase de Abordar conmemorativo ya está listo y validado en tu perfil. Puedes descargarlo en alta resolución para publicarlo en LinkedIn, Instagram o TikTok con la etiqueta <em>@quetzalia</em>.
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align:center; margin:28px 0 10px 0;">
      <a href="https://quetzalia.dev/mi-registro" style="display:inline-block; background-color:#5A354C; color:#FFFFFF; text-decoration:none; padding:14px 32px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:2px solid #DFB15B; box-shadow:0 4px 14px rgba(90,53,76,0.2);" target="_blank" rel="noopener noreferrer">
        🎫 Descargar Mi Pase de Abordar
      </a>
    </div>
  `;

  return {
    subject,
    previewText,
    html: getBaseEmailLayout("Registro Aprobado - Quetzalia", content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. PLANTILLA: LISTA DE ESPERA
// Reglas:
// - Le explica que el cupo está lleno.
// - Quedó en lista de espera en el orden en que se registró (cronológico).
// - Le avisaremos si se libera un lugar.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderWaitlistEmail({
  toName,
  type,
}: {
  toName: string;
  type?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const typeLabel = formatRegistrationType(type);
  const safeType = escapeHtml(typeLabel);
  const subject = `Quetzalia: Estado de tu registro (Lista de espera)`;
  const previewText = `El cupo de Quetzalia ha alcanzado su capacidad máxima. Tu registro ha quedado en lista de espera en estricto orden cronológico.`;

  const content = `
    <h2 style="color:#5A354C; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      Hola, ${safeName}
    </h2>
    <p style="margin-top:0;">
      Te escribimos del comité organizador de <strong>Quetzalia</strong> para informarte sobre el estado de tu postulación como <strong>${safeType}</strong>.
    </p>

    <!-- Ficha de Lista de Espera -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0; background-color:#F5F3FF; border-left:4px solid #7C3AED; border-top:1px solid #DDD6FE; border-right:1px solid #DDD6FE; border-bottom:1px solid #DDD6FE;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#5B21B6; font-weight:bold;">
            Estatus actual:
          </p>
          <p style="margin:0 0 8px 0; font-size:16px; color:#6D28D9; font-weight:700;">
            ⏳ Lista de espera
          </p>
          <p style="margin:0; font-size:13px; color:#4C1D95; line-height:1.5;">
            Por disposiciones de seguridad y aforo en la FES Acatlán, <strong>el cupo para esta modalidad se encuentra lleno</strong>.
          </p>
        </td>
      </tr>
    </table>

    <p>
      Tu solicitud se encuentra registrada en <strong>lista de espera en el estricto orden cronológico en que completaste tu registro</strong>.
    </p>
    
    <p>
      En caso de que se libere un lugar o se habiliten nuevos espacios en las salas de conferencias, el sistema reasignará las plazas en dicho orden y <strong>te avisaremos de inmediato a este mismo correo electrónico</strong> con la confirmación de tu acceso.
    </p>

    <div style="text-align:center; margin:28px 0 10px 0;">
      <a href="https://quetzalia.dev/mi-registro" style="display:inline-block; background-color:#5A354C; color:#FFFFFF; text-decoration:none; padding:13px 30px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:1px solid #DFB15B;" target="_blank" rel="noopener noreferrer">
        Consultar Mi Portal
      </a>
    </div>
  `;

  return {
    subject,
    previewText,
    html: getBaseEmailLayout("Lista de Espera - Quetzalia", content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. PLANTILLA: RECHAZADO / NO ACEPTADO
// Reglas:
// - Mensaje breve y respetuoso.
// - Sin dar detalles internos del comité.
// - Con el contacto de reply-to para dudas ("Si tienes dudas, responde este correo").
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderRejectedEmail({
  toName,
  type,
}: {
  toName: string;
  type?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const typeLabel = formatRegistrationType(type);
  const safeType = escapeHtml(typeLabel);
  const subject = `Actualización sobre tu postulación a Quetzalia`;
  const previewText = `Agradecemos tu interés en Quetzalia. Te compartimos una actualización sobre tu solicitud.`;

  const content = `
    <h2 style="color:#5A354C; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      Estimada/o ${safeName},
    </h2>
    <p style="margin-top:0;">
      Agradecemos sinceramente tu interés y el tiempo dedicado a registrar tu postulación como <strong>${safeType}</strong> para <strong>Quetzalia</strong>.
    </p>

    <!-- Recuadro Respetuoso -->
    <div style="background-color:#FAF5F7; border:1px solid #EACED8; padding:16px 20px; margin:22px 0; font-size:13px; color:#5A354C; line-height:1.6;">
      <p style="margin:0;">
        Reconocemos y valoramos profundamente tu dedicación al desarrollo científico y tecnológico. Te invitamos a mantenerte al tanto de nuestras transmisiones en vivo y futuras convocatorias del encuentro.
      </p>
    </div>

    <p style="font-size:14px; color:#6B5864;">
      Para cualquier aclaración o inquietud adicional sobre el proceso, <strong>puedes responder directamente a este correo electrónico</strong> y con gusto te atenderemos.
    </p>
  `;

  return {
    subject,
    previewText,
    html: getBaseEmailLayout("Notificación de Registro - Quetzalia", content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. PLANTILLA: PROMOVIDO DE LISTA DE ESPERA
// Reglas:
// - Le confirma que se liberó un lugar y que ahora su registro está aprobado.
// - Con las MISMAS indicaciones del correo de aprobado según su tipo:
//   * Speakers: Formato 01 (Autorización de imagen, voz y nombre) y 02 (Licencia de ponencia y materiales).
//   * Patrocinadores: Convenio 06 firmado antes de publicar logotipo.
//   * Comunidades y Asistentes: Confirmación de lugar y pase.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderWaitlistPromotedEmail({
  toName,
  type,
  talkTitle,
  organization,
}: {
  toName: string;
  type?: string;
  talkTitle?: string;
  organization?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const safeOrg = escapeHtml(organization);
  const safeTalk = escapeHtml(talkTitle);
  const normType = (type || "").toLowerCase().trim();
  const typeLabel = formatRegistrationType(type);
  const safeType = escapeHtml(typeLabel);
  const isSpeaker = normType === "speaker" || normType === "ponente" || normType === "tallerista";
  const isSponsor = normType === "sponsor" || normType === "patrocinador";
  const isCommunity = normType === "community" || normType === "comunidad";

  const subject = `¡Lugar liberado! Tu registro para Quetzalia ha sido aprobado`;
  const previewText = `Se ha liberado un lugar en Quetzalia y tu registro ha sido promovido al estatus de APROBADO.`;

  // Mismas directrices legales que la plantilla de aprobado
  let roleNoticeHtml = "";

  if (isSpeaker) {
    roleNoticeHtml = `
      <div style="background-color:#FEF3C7; border-left:4px solid #D97706; padding:16px 18px; margin:22px 0; color:#92400E; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#B45309;">
          ⚖️ Requisito obligatorio para ponentes y talleristas:
        </p>
        <p style="margin:0 0 8px 0;">
          Para garantizar la máxima certeza jurídica y el respeto a tus derechos de autor e imagen, <strong>antes de publicar tu fotografía de semblanza o los detalles de tu ponencia en el programa oficial</strong>, es indispensable contar con la firma de:
        </p>
        <ul style="margin:0; padding-left:20px; font-weight:600;">
          <li style="margin-bottom:4px;">Formato 01: Autorización de imagen, voz y nombre.</li>
          <li>Formato 02: Licencia de ponencia y materiales.</li>
        </ul>
        <p style="margin:8px 0 0 0; font-size:13px;">
          En breve el comité te compartirá los mecanismos seguros para la formalización digital de ambos formatos.
        </p>
      </div>
    `;
  } else if (isSponsor) {
    roleNoticeHtml = `
      <div style="background-color:#EFF6FF; border-left:4px solid #2563EB; padding:16px 18px; margin:22px 0; color:#1E40AF; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#1D4ED8;">
          🤝 Requisito para publicación de marca y logotipo:
        </p>
        <p style="margin:0;">
          Agradecemos profundamente el compromiso de tu organización con la equidad en STEM. Te recordamos que, conforme a nuestras políticas institucionales, <strong>el logotipo y distintivos de tu marca solo se publicarán en el portal oficial y materiales de difusión con el Convenio 06 firmado</strong> (Convenio de patrocinio y licencia de uso de marca y logotipo).
        </p>
      </div>
    `;
  } else if (isCommunity) {
    roleNoticeHtml = `
      <div style="background-color:#F5F3FF; border-left:4px solid #7C3AED; padding:16px 18px; margin:22px 0; color:#5B21B6; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 8px 0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; font-size:12px; color:#6D28D9;">
          💜 Alianzas y Colectivos STEM:
        </p>
        <p style="margin:0;">
          Celebramos contar con la presencia de tu comunidad en Quetzalia. Próximamente coordinaremos contigo la asignación de espacios, mesas de vinculación y las acreditaciones de tu equipo promotor.
        </p>
      </div>
    `;
  } else {
    roleNoticeHtml = `
      <div style="background-color:#ECFDF5; border-left:4px solid #059669; padding:16px 18px; margin:22px 0; color:#065F46; font-size:14px; line-height:1.6;">
        <p style="margin:0 0 6px 0; font-weight:700;">
          🎉 Tu lugar presencial se encuentra confirmado
        </p>
        <p style="margin:0;">
          Tu lugar para las conferencias, paneles y actividades en la FES Acatlán está debidamente reservado. Próximamente recibirás las indicaciones logísticas de acceso y tu gafete digital de asistente.
        </p>
      </div>
    `;
  }

  const content = `
    <h2 style="color:#065F46; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      ¡Excelentes noticias, ${safeName}!
    </h2>
    <p style="margin-top:0;">
      Te confirmamos que <strong>se ha liberado un lugar en Quetzalia</strong> y tu postulación como <strong>${safeType}</strong> ha sido promovida de la lista de espera: <strong>¡ahora tu registro está APROBADO!</strong>
    </p>

    <!-- Ficha de Promoción a Aprobado -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0; background-color:#ECFDF5; border-left:4px solid #10B981; border-top:1px solid #A7F3D0; border-right:1px solid #A7F3D0; border-bottom:1px solid #A7F3D0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#065F46; font-weight:bold;">
            Nuevo estatus:
          </p>
          <p style="margin:0 0 8px 0; font-size:16px; color:#047857; font-weight:700;">
            ✓ PROMOVIDO A REGISTRO APROBADO
          </p>
          ${
            safeOrg
              ? `<p style="margin:0 0 2px 0; font-size:12px; color:#065F46; font-weight:bold;">Organización / Afiliación:</p>
                 <p style="margin:0 0 8px 0; font-size:14px; color:#1F2937;">${safeOrg}</p>`
              : ""
          }
          ${
            safeTalk
              ? `<p style="margin:0 0 2px 0; font-size:12px; color:#065F46; font-weight:bold;">Ponencia / Sesión:</p>
                 <p style="margin:0; font-size:14px; color:#1F2937; font-style:italic;">"${safeTalk}"</p>`
              : ""
          }
        </td>
      </tr>
    </table>

    ${roleNoticeHtml}

    <p>
      Por favor ingresa a tu panel de participante para verificar tu información y mantenerte informada/o:
    </p>

    <div style="text-align:center; margin:28px 0 10px 0;">
      <a href="https://quetzalia.dev/mi-registro" style="display:inline-block; background-color:#059669; color:#FFFFFF; text-decoration:none; padding:13px 30px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:1px solid #047857;" target="_blank" rel="noopener noreferrer">
        Acceder a Mi Registro
      </a>
    </div>
  `;

  return {
    subject,
    previewText,
    html: getBaseEmailLayout("Lugar Liberado - Quetzalia", content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. PLANTILLA: AVISO / COMUNICADO PERSONALIZADO DEL COMITÉ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderCustomNoticeEmail({
  toName,
  subject,
  messageContent,
  actionUrl,
  actionText,
}: {
  toName: string;
  subject: string;
  messageContent: string;
  actionUrl?: string;
  actionText?: string;
}): EmailRenderResult {
  const safeName = escapeHtml(toName);
  const previewText = `Comunicado oficial del comité organizador de Quetzalia: ${subject}`;

  // Formatear saltos de línea a párrafos HTML sanitizados si viene en texto plano
  const formattedBody = messageContent.includes("<p>")
    ? messageContent
    : messageContent
        .split("\n\n")
        .map((p) => `<p style="margin:0 0 14px 0;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
        .join("");

  const validActionUrl =
    actionUrl && (actionUrl.startsWith("http://") || actionUrl.startsWith("https://"))
      ? actionUrl
      : undefined;

  const content = `
    <h2 style="color:#5A354C; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      Hola, ${safeName}
    </h2>
    <div style="font-size:15px; line-height:1.68; color:#362B32;">
      ${formattedBody}
    </div>

    ${
      validActionUrl && actionText
        ? `<div style="text-align:center; margin:30px 0 12px 0;">
             <a href="${escapeHtml(validActionUrl)}" style="display:inline-block; background-color:#5A354C; color:#FFFFFF; text-decoration:none; padding:13px 30px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:1px solid #DFB15B;" target="_blank" rel="noopener noreferrer">
               ${escapeHtml(actionText)}
             </a>
           </div>`
        : ""
    }
  `;

  return {
    subject: `Quetzalia: ${subject}`,
    previewText,
    html: getBaseEmailLayout(subject, content, previewText),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. PLANTILLA: BROADCAST / RECORDATORIO GENERAL (AUDIENCIA RESEND)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function renderBroadcastEmail({
  subject,
  messageContent,
  actionUrl,
  actionText,
}: {
  subject: string;
  messageContent: string;
  actionUrl?: string;
  actionText?: string;
}): EmailRenderResult {
  const previewText = `Aviso importante de Quetzalia 2027: ${subject}`;

  const formattedBody = messageContent.includes("<p>")
    ? messageContent
    : messageContent
        .split("\n\n")
        .map((p) => `<p style="margin:0 0 14px 0;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
        .join("");

  const validActionUrl =
    actionUrl && (actionUrl.startsWith("http://") || actionUrl.startsWith("https://"))
      ? actionUrl
      : undefined;

  const content = `
    <h2 style="color:#5A354C; font-size:22px; font-weight:700; margin-top:0; margin-bottom:16px; font-family:'Playfair Display',Georgia,serif;">
      Aviso Oficial de Quetzalia
    </h2>
    <div style="font-size:15px; line-height:1.68; color:#362B32;">
      ${formattedBody}
    </div>

    ${
      validActionUrl && actionText
        ? `<div style="text-align:center; margin:30px 0 12px 0;">
             <a href="${escapeHtml(validActionUrl)}" style="display:inline-block; background-color:#5A354C; color:#FFFFFF; text-decoration:none; padding:13px 30px; font-weight:700; letter-spacing:1.5px; font-size:13px; text-transform:uppercase; border:1px solid #DFB15B;" target="_blank" rel="noopener noreferrer">
               ${escapeHtml(actionText)}
             </a>
           </div>`
        : ""
    }
  `;

  return {
    subject: `Quetzalia: ${subject}`,
    previewText,
    html: getBaseEmailLayout(subject, content, previewText, true),
  };
}

// Definición de catálogo para el panel de administración
export const OFFICIAL_TEMPLATES_CATALOG = [
  {
    id: "received",
    title: "1. Registro Recibido",
    description: "Confirma recepción de solicitud, tipo de participante, estado pendiente y aviso sin promesa de fecha.",
  },
  {
    id: "approved",
    title: "2. Registro Aprobado",
    description: "Confirma aceptación. Cláusulas Formato 01 y 02 para speakers; Convenio 06 firmado para patrocinadores.",
  },
  {
    id: "waitlist",
    title: "3. Lista de Espera",
    description: "Informa cupo lleno, asignación en estricto orden cronológico y promesa de aviso si se libera cupo.",
  },
  {
    id: "rejected",
    title: "4. No Aceptado / Rechazado",
    description: "Mensaje respetuoso sin detalles internos del comité, con contacto reply-to para dudas.",
  },
  {
    id: "promoted",
    title: "5. Promovido de Lista de Espera",
    description: "Informa liberación de lugar con estatus aprobado y las mismas indicaciones según el tipo.",
  },
] as const;
