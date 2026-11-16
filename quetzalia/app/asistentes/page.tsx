import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Greca from "@/components/ui/Greca";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos y Lineamientos para Asistentes | Quetzalia 2027",
  description:
    "Términos de asistencia, política de aforo de 400 lugares, lista de espera, acreditación y constancias oficiales para el Encuentro Quetzalia en la FES Acatlán.",
};

export default function AsistentesPage() {
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
              href="/registro/asistentes"
              className="text-[var(--accent)] hover:underline"
            >
              Registrar Asistencia
            </Link>
            <Link
              href="/mi-registro"
              className="hidden sm:inline text-[var(--fg)] hover:text-[var(--accent)]"
            >
              Mi Registro
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
              Documento Normativo 05 (Publicable) · Términos de Participación
            </span>
            <h1 className="text-2xl sm:text-4xl font-display text-[var(--head)]">
              Lineamientos Generales para Asistentes
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg)] opacity-75">
              Condiciones de acceso, aforo, acreditaciones y constancias · Quetzalia 2027
            </p>
          </div>

          {/* Bienvenida y Naturaleza del Evento */}
          <div className="p-4 sm:p-5 bg-[var(--bg-alt)] border-l-4 border-[var(--accent)] text-sm space-y-2 leading-relaxed">
            <h2 className="font-semibold text-base text-[var(--head)]">
              1. Naturaleza del Encuentro y Acceso Gratuito
            </h2>
            <p>
              El encuentro <strong>Quetzalia</strong> es un foro académico, científico y formativo impulsado por la comunidad de Matemáticas Aplicadas y Computación (MAC) en la <strong>FES Acatlán, UNAM</strong>, enfocado en visibilizar y empoderar el liderazgo de las mujeres y disidencias en áreas STEM.
            </p>
            <p>
              El acceso a todas las conferencias magistrales, mesas de diálogo y talleres es <strong>100% gratuito</strong>. No obstante, por estrictas razones de seguridad y aforo de protección civil, la asistencia requiere <strong>registro individual previo y asignación formal de pase de acceso</strong>.
            </p>
          </div>

          {/* 2. Control de Aforo y Límite de 400 Asistentes */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              2. Capacidad del Recinto y Política de Aforo (400 Lugares)
            </h2>
            <p>
              La seguridad e integridad de nuestra comunidad es prioritaria. En estricto apego a las disposiciones de Protección Civil de la FES Acatlán:
            </p>

            <div className="p-4 border-2 border-[var(--head)] bg-white space-y-2 text-sm">
              <p className="font-bold text-[var(--head)] text-base">
                Límite de Cupo Máximo: 400 Personas Autorizadas
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm opacity-90">
                <li>
                  Las solicitudes de registro recibidas a través de <Link href="/registro/asistentes" className="text-[var(--accent)] underline font-semibold">/registro/asistentes</Link> son procesadas bajo estricto orden cronológico de postulación (FIFO).
                </li>
                <li>
                  <strong>Lista de Espera Oficial:</strong> Una vez alcanzado el cupo límite de 400 personas confirmadas, el sistema dirigirá automáticamente los registros posteriores a una lista de espera ordenada.
                </li>
                <li>
                  <strong>Promoción automática:</strong> En caso de cancelaciones o reasignación de espacios antes del evento, las solicitudes en lista de espera serán promovidas de manera sucesiva, notificando inmediatamente al correo registrado.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Acreditación el Día del Evento */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              3. Acreditación y Acceso en la Sede
            </h2>
            <p>
              Para acceder a las actividades presenciales el día del encuentro:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-sm pl-2">
              <li>
                <strong>Pase digital personal:</strong> Deberás presentar en la mesa de registro tu folio o comprobante digital emitido en el portal <Link href="/mi-registro" className="text-[var(--accent)] underline font-semibold">/mi-registro</Link> (en tu dispositivo móvil o impreso).
              </li>
              <li>
                <strong>Horario de acreditación:</strong> Las mesas de registro operarán en el horario de <strong>[horario de registro]</strong> en las instalaciones de <strong>[ubicación / auditorio en FES Acatlán]</strong>.
              </li>
              <li>
                <strong>Identificación:</strong> Se solicitará mostrar una credencial estudiantil vigente (UNAM o de tu institución de procedencia) o identificación oficial para verificar la coincidencia de datos con tu pase.
              </li>
              <li>
                <strong>Entrega de gafete:</strong> Al acreditarte, recibirás tu gafete oficial con tu nombre elegido. Dicho gafete deberá portarse de forma visible durante toda la permanencia en las instalaciones del evento.
              </li>
            </ol>
          </section>

          {/* 4. Emisión de Constancias Oficiales */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              4. Constancias de Asistencia con Valor Curricular
            </h2>
            <p>
              El <strong>Comité Organizador de Quetzalia STEM</strong> expedirá constancias digitales oficiales de asistencia con valor curricular a quienes cumplan con los siguientes requisitos:
            </p>

            <div className="grid gap-3 sm:grid-cols-2 text-sm pt-1">
              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">1. Acreditación Presencial</p>
                <p className="text-xs opacity-90">
                  Haber registrado su acceso en las mesas de bienvenida al inicio de la jornada matutina.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">2. Permanencia en Actividades</p>
                <p className="text-xs opacity-90">
                  Haber asistido al menos al 80% de las actividades y conferencias programadas durante el día.
                </p>
              </div>
            </div>

            <p className="text-xs opacity-85 pt-1">
              * Las constancias se generarán con base en el <strong>nombre legal</strong> manifestado en el formulario y se enviarán en formato digital PDF firmado a la cuenta de correo registrada, en un lapso no mayor a quince (15) días hábiles posteriores a la conclusión de Quetzalia.
            </p>
          </section>

          {/* 5. Fotografía Documental y Grabaciones Generales */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              5. Tomas Documentales, Transmisiones y Privacidad
            </h2>
            <p>
              Durante el desarrollo de las conferencias plenarias y paneles se llevarán a cabo tomas panorámicas, grabaciones institucionales y retransmisiones en vivo del auditorio con fines de divulgación académica y memoria documental de la FES Acatlán.
            </p>
            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-sm space-y-2">
              <p className="font-bold text-[var(--head)]">
                Opción de exclusión y salvaguarda de imagen:
              </p>
              <p className="text-xs sm:text-sm">
                Si prefieres no aparecer en tomas generales o solicitas que tu imagen no sea difundida en cápsulas de redes sociales, podrás manifestarlo al momento de acreditarte en las mesas de bienvenida para asignarte asientos en zonas reservadas sin cobertura directa de cámara, o bien ejercer tu derecho en cualquier momento conforme a nuestro procedimiento de <Link href="/derechos-arco" className="text-[var(--accent)] underline font-semibold">Derechos ARCO</Link>.
              </p>
            </div>
          </section>

          {/* 6. Compromiso con el Código de Conducta */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              6. Convivencia y Respeto
            </h2>
            <p>
              La participación en el encuentro implica la observancia irrestricta de nuestro{" "}
              <Link href="/codigo-de-conducta" className="text-[var(--accent)] underline font-semibold">
                Código de Conducta
              </Link>
              . El comité se reserva el derecho de revocar el acceso a cualquier asistente que incurra en actos de violencia, discriminación o acoso.
            </p>
          </section>

          {/* Enlaces de Acción */}
          <div className="p-6 bg-white border-2 border-[var(--head)] text-center space-y-4 shadow-sm">
            <h3 className="font-display text-lg text-[var(--head)]">
              ¿Lista para acompañarnos en Quetzalia 2027?
            </h3>
            <p className="text-xs sm:text-sm opacity-85 max-w-xl mx-auto">
              Asegura tu lugar en el encuentro que impulsa a las mujeres y futuras líderes científicas y tecnológicas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/registro/asistentes" className="btn btn-primary text-xs uppercase tracking-wider">
                Registrar Mi Pase de Asistente
              </Link>
              <Link href="/privacidad" className="btn btn-ghost text-xs uppercase tracking-wider">
                Consultar Aviso de Privacidad
              </Link>
            </div>
          </div>

          {/* Pie de documento */}
          <div className="pt-2 text-center text-xs opacity-70 border-t border-[var(--rule)]">
            Encuentro Quetzalia 2027 · Contacto organizador: <a href="mailto:registro@quetzalia.dev" className="font-mono underline">registro@quetzalia.dev</a> · Sitio oficial: <span className="font-mono">quetzalia.dev</span>
          </div>
        </article>
      </main>

      <Greca />
      <Footer />
    </div>
  );
}
