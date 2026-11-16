import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Greca from "@/components/ui/Greca";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aviso de Privacidad Integral | Quetzalia 2027",
  description:
    "Aviso de Privacidad Integral de Quetzalia - Encuentro de mujeres en STEM, FES Acatlán. Tratamiento responsable y transparente de datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* Barra superior de navegación */}
      <header className="border-b border-[var(--rule)] bg-[var(--card)] py-4 px-6 sticky top-0 z-40 shadow-sm backdrop-blur-md">
        <div className="max-w-[var(--maxw)] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="brand text-xl font-display text-[var(--head)] hover:opacity-80 transition-opacity"
          >
            ← Quetzal-IA
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <Link
              href="/mi-registro"
              className="text-[var(--accent)] hover:underline"
            >
              Mi Registro
            </Link>
            <Link
              href="/derechos-arco"
              className="hidden sm:inline text-[var(--fg)] hover:text-[var(--accent)]"
            >
              Derechos ARCO
            </Link>
          </div>
        </div>
      </header>

      <Greca />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <article className="border-2 border-[var(--head)] bg-[var(--card)] shadow-xl p-6 sm:p-12 space-y-8">
          {/* Encabezado del documento */}
          <div className="border-b border-[var(--rule)] pb-6 text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--accent-text)]">
              Documento Normativo 03 · Marco Legal
            </span>
            <h1 className="text-2xl sm:text-4xl font-display text-[var(--head)]">
              Aviso de Privacidad Integral
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg)] opacity-75">
              Versión oficial 2027.1 · Encuentro Quetzalia STEM · FES Acatlán
            </p>
          </div>

          {/* Recuadro de identidad */}
          <div className="p-4 sm:p-5 bg-[var(--bg-alt)] border-l-4 border-[var(--accent)] text-sm space-y-2 leading-relaxed">
            <p className="font-semibold text-[var(--head)]">
              1. Identidad y Domicilio del Responsable de los Datos Personales
            </p>
            <p>
              El presente Aviso de Privacidad regula el tratamiento de los datos personales recabados con motivo del evento <strong>Quetzalia: Encuentro de Mujeres en STEM</strong>. 
              El responsable directo de la recopilación, almacenamiento y protección de los datos personales es el <strong>Comité Organizador de Quetzalia STEM</strong>, actuando en su carácter de particulares organizadores y miembros de la comunidad académica, con domicilio legal para oír y recibir todo tipo de notificaciones ubicado en <strong>FES Acatlán, UNAM (Av. Alcanfores y San Juan Totoltepec s/n, Naucalpan de Juárez, Estado de México, C.P. 53150)</strong>, y correo electrónico de contacto oficial:{" "}
              <a href="mailto:registro@quetzalia.dev" className="text-[var(--accent)] font-mono underline">
                registro@quetzalia.dev
              </a> (con atención de respuestas a: <a href="mailto:923475@pcpuma.acatlan.unam.mx" className="text-[var(--accent)] font-mono underline">923475@pcpuma.acatlan.unam.mx</a>).
            </p>
            <p className="text-xs opacity-85">
              * Nota de alcance legal: La organización y custodia de los datos recabados en este sitio web (<strong>quetzalia.dev</strong>) es realizada de manera directa e independiente por el comité organizador de Quetzalia como particulares. No representa ni compromete legalmente a la Universidad Nacional Autónoma de México (UNAM) ni a terceras entidades corporativas o patrocinadoras.
            </p>
          </div>

          {/* 2. Datos personales recabados */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              2. Datos Personales Recabados
            </h2>
            <p>
              Para cumplir con las finalidades organizativas del encuentro, el responsable recaba datos personales de identificación, contacto y académicos a través de nuestros formularios electrónicos, según la modalidad de registro del titular:
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wide text-[var(--head)]">
                  A. Asistentes Generales
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 opacity-90">
                  <li>Nombre completo.</li>
                  <li>Correo electrónico (autenticado con Google).</li>
                  <li>Institución o escuela de procedencia.</li>
                  <li>Nivel académico en curso.</li>
                  <li>Licenciatura o área de conocimiento.</li>
                </ul>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wide text-[var(--head)]">
                  B. Ponentes y Talleristas
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 opacity-90">
                  <li>Nombre elegido (para identificación pública).</li>
                  <li>Nombre legal completo (para constancias).</li>
                  <li>Correo electrónico y teléfono celular.</li>
                  <li>Institución, universidad o empresa.</li>
                  <li>Título, materiales y requerimientos técnicos de ponencia.</li>
                  <li>Semblanza curricular y fotografía de retrato.</li>
                </ul>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wide text-[var(--head)]">
                  C. Patrocinadores
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 opacity-90">
                  <li>Denominación o razón social.</li>
                  <li>Nombre y cargo de la persona de contacto.</li>
                  <li>Correo electrónico y teléfono de contacto.</li>
                  <li>Logotipo vectorial o de alta resolución.</li>
                  <li>Convenio 06 firmado de patrocinio y licencia de uso.</li>
                </ul>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wide text-[var(--head)]">
                  D. Comunidades STEM
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 opacity-90">
                  <li>Nombre de la colectiva, grupo o comunidad.</li>
                  <li>Nombre de la persona representante.</li>
                  <li>Correo electrónico de coordinación.</li>
                  <li>Número estimado de integrantes o alcance.</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-3">
              <strong>Protección de datos sensibles:</strong> El comité organizador <u>no recaba ni solicita</u> bajo ninguna circunstancia datos personales sensibles (origen étnico, convicciones religiosas, estado de salud médico, datos biométricos, afiliación sindical u opiniones políticas). En el caso de asistentes generales, expresamente se prescinde de recabar el número telefónico para garantizar la máxima minimización de datos.
            </div>
          </section>

          {/* 3. Finalidades del tratamiento */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              3. Finalidades del Tratamiento de los Datos
            </h2>
            
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--head)]">
                Finalidades Primarias (Necesarias para participar en Quetzalia):
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 text-sm">
                <li>Validar la identidad de las personas solicitantes y gestionar su registro de participación.</li>
                <li>Monitorear y controlar estrictamente el límite de cupo y aforo de protección civil en las salas y auditorios de la FES Acatlán (máximo autorizado de 400 personas).</li>
                <li>Asignar folios individuales y expedir pases digitales de acreditación en el portal de <em>Mi Registro</em>.</li>
                <li>Gestionar la lista de espera oficial bajo el orden cronológico estricto de postulación.</li>
                <li>Generar y emitir las constancias de participación con valor curricular y constancias de impartición de ponencia.</li>
                <li>Garantizar la logística interna de acceso y entrega de gafetes el día de la jornada.</li>
                <li>Establecer comunicación directa y oportuna en caso de modificaciones de horarios, salas o eventualidades del programa.</li>
              </ol>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--accent)]">
                Finalidades Secundarias (Opcionales y sujetas a consentimiento expreso no premarcado):
              </h3>
              <p className="text-sm">
                El titular otorga o niega su consentimiento para cada una de estas finalidades de manera independiente en el formulario de inscripción:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm opacity-90">
                <li><strong>Publicación de imagen básica:</strong> Difusión de la fotografía de semblanza, nombre y trayectoria de ponentes en la página web oficial (<strong>quetzalia.dev</strong>) y redes sociales durante un plazo máximo de 12 meses.</li>
                <li><strong>Grabación y transmisión audiovisual:</strong> Registro en video y retransmisión en directo de conferencias y talleres.</li>
                <li><strong>Materiales didácticos:</strong> Publicación y descarga libre de diapositivas o recursos compartidos por ponentes.</li>
                <li><strong>Vinculación laboral y becas:</strong> Puesta a disposición de su correo de contacto a empresas patrocinadoras oficiales para envío de convocatorias, vacantes de empleo y becas STEM.</li>
                <li><strong>Clips y cápsulas de difusión:</strong> Creación de fragmentos audiovisuales y testimonios de difusión científica.</li>
                <li><strong>Futuras ediciones:</strong> Envío de avisos de apertura de registros y convocatorias para ediciones subsecuentes de Quetzalia.</li>
              </ul>
              <p className="text-xs text-[var(--fg)] opacity-80 italic">
                La negativa al uso de finalidades secundarias no será motivo para negar el registro ni la emisión de constancias al evento.
              </p>
            </div>
          </section>

          {/* 4. Política estricta de no transferencia de datos */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              4. Transferencia de Datos y Relación con Terceros
            </h2>
            <p>
              El comité organizador mantiene una política rigurosa de protección:
            </p>
            <div className="border border-[var(--accent)] bg-[var(--bg-alt)]/60 p-4 space-y-2 text-sm">
              <p className="font-bold text-[var(--head)]">
                Garantía fundamental de confidencialidad:
              </p>
              <p>
                <strong>No vendemos, cedemos, alquilamos ni transferimos bases de datos masivas ni directorios de participantes a patrocinadores, empresas privadas ni terceros ajenos.</strong>
              </p>
              <p className="text-xs opacity-90">
                Únicamente en el supuesto de que el titular haya marcado voluntariamente la casilla opt-in de vinculación con patrocinadores, se facilitará su dirección de correo exclusivamente para propósitos de convocatorias de talento y becas científicas.
              </p>
            </div>
          </section>

          {/* 5. Almacenamiento seguro y medidas técnicas */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              5. Almacenamiento Seguro y Medidas de Protección
            </h2>
            <p>
              Sus datos son resguardados en servidores en la nube administrados con arquitectura de seguridad por capas:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
              <li><strong>Aislamiento de accesos:</strong> Se implementan reglas de seguridad a nivel de base de datos que impiden que cualquier participante pueda acceder o visualizar registros ajenos.</li>
              <li><strong>Fotografías protegidas:</strong> Las imágenes de semblanza se almacenan en directorios privados aislados (<code>speakers/private/</code>) y bajo ninguna circunstancia se publican hasta que el comité valide la acreditación y la firma de la autorización correspondiente.</li>
              <li><strong>Credenciales confidenciales:</strong> Las llaves criptográficas y accesos administrativos operan exclusivamente en el servidor backend, sin exposición en el código del navegador.</li>
            </ul>
          </section>

          {/* 6. Derechos ARCO y Retiro en 72 Horas */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              6. Ejercicio de Derechos ARCO y Revocación del Consentimiento
            </h2>
            <p>
              Usted tiene el derecho inalienable de ejercer en todo momento sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, así como de revocar el consentimiento que nos haya otorgado.
            </p>
            <p>
              Para conocer los requisitos, plazos de respuesta (20 días hábiles) y la <strong>garantía especial de retiro acelerado de imagen en 72 horas</strong>, consulte nuestro procedimiento normativo:
            </p>
            <div className="pt-2 text-center sm:text-left">
              <Link
                href="/derechos-arco"
                className="btn btn-primary inline-block text-xs uppercase tracking-wider"
              >
                Consultar Procedimiento y Plazos de Derechos ARCO →
              </Link>
            </div>
          </section>

          {/* 7. Actualizaciones del aviso */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              7. Modificaciones al Aviso de Privacidad
            </h2>
            <p>
              El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales o de nuestras necesidades organizativas. Nos comprometemos a mantener informadas a las personas registradas sobre los cambios que pueda sufrir este documento a través de su publicación permanente en la dirección electrónica:
            </p>
            <p className="font-mono text-xs bg-[var(--bg-alt)] p-3 border border-[var(--rule)]">
              https://www.quetzalia.dev/privacidad
            </p>
            <p className="text-xs opacity-75">
              Última actualización: Enero 2027 · Versión 2027.1. Contacto:{" "}
              <a href="mailto:registro@quetzalia.dev" className="font-mono underline text-[var(--accent)]">registro@quetzalia.dev</a>.
            </p>
          </section>
        </article>
      </main>

      <Greca />
      <Footer />
    </div>
  );
}
