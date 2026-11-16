import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Greca from "@/components/ui/Greca";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Derechos ARCO y Retiro en 72 Horas | Quetzalia 2027",
  description:
    "Procedimiento oficial para el ejercicio de los Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) y garantía reforzada de retiro de fotografías y materiales en un plazo máximo de 72 horas.",
};

export default function DerechosArcoPage() {
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
              href="/privacidad"
              className="text-[var(--accent)] hover:underline"
            >
              Aviso de Privacidad
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
              Documento Normativo 09 · Tutela de Datos Personales
            </span>
            <h1 className="text-2xl sm:text-4xl font-display text-[var(--head)]">
              Procedimiento de Derechos ARCO y Retiro en 72 Horas
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg)] opacity-75">
              Mecanismos transparentes de Acceso, Rectificación, Cancelación y Oposición · Quetzalia STEM
            </p>
          </div>

          {/* Banner de Garantía Prioritaria de 72h */}
          <div className="p-5 bg-[var(--bg-alt)] border-2 border-[var(--accent)] text-sm space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--head)] font-bold text-base">
              <span className="text-xl text-[var(--accent)]">⚡</span>
              <span>Garantía Reforzada y Prioritaria: Retiro de Fotografía y Materiales en 72 Horas</span>
            </div>
            <p className="leading-relaxed">
              Si participas como ponente, tallerista o asistente en <strong>Quetzalia</strong> y otorgaste previamente autorización para el uso de tu imagen, semblanza o materiales, tienes el <strong>derecho irrenunciable de revocarla en el momento que lo decidas</strong>.
            </p>
            <p className="text-xs leading-relaxed opacity-95">
              Para garantizar tu tranquilidad, el comité organizador no requiere agotar los 20 días hábiles ordinarios de un trámite ARCO estándar: <strong>retiraremos y eliminaremos de manera definitiva tus fotos, diapositivas y semblanza de nuestras plataformas públicas en un plazo máximo garantizado de 72 horas naturales</strong> tras recibir tu aviso.
            </p>
            <div className="pt-1">
              <a
                href="#retiro-72h"
                className="text-xs uppercase font-bold tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                Ver instrucciones para solicitar el retiro urgente de 72h ↓
              </a>
            </div>
          </div>

          {/* 1. ¿Qué son los Derechos ARCO? */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              1. ¿Qué son los Derechos ARCO?
            </h2>
            <p>
              De conformidad con la legislación aplicable en materia de protección de datos personales, toda persona titular tiene derecho a decidir sobre el tratamiento de su información mediante cuatro prerrogativas fundamentales:
            </p>

            <div className="grid gap-3 sm:grid-cols-2 pt-2 text-sm">
              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <h3 className="font-bold text-[var(--head)] uppercase tracking-wide text-xs">
                  Acceso
                </h3>
                <p className="text-xs opacity-90">
                  Conocer cuáles de tus datos personales obran en posesión del comité organizador, cómo fueron obtenidos y las condiciones de su tratamiento.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <h3 className="font-bold text-[var(--head)] uppercase tracking-wide text-xs">
                  Rectificación
                </h3>
                <p className="text-xs opacity-90">
                  Solicitar la corrección o actualización de tus datos en caso de ser inexactos, incompletos o erróneos (por ejemplo, corregir la ortografía de tu nombre legal para la expedición de constancias).
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <h3 className="font-bold text-[var(--head)] uppercase tracking-wide text-xs">
                  Cancelación
                </h3>
                <p className="text-xs opacity-90">
                  Solicitar la supresión y eliminación de tus datos de nuestros sistemas cuando consideres que no están siendo tratados conforme a la normativa o una vez concluido tu interés de participación en el evento.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <h3 className="font-bold text-[var(--head)] uppercase tracking-wide text-xs">
                  Oposición
                </h3>
                <p className="text-xs opacity-90">
                  Oponerte al uso de tus datos para finalidades específicas y secundarias, tales como la recepción de boletines para futuras ediciones o la remisión de convocatorias de empresas patrocinadoras.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Procedimiento y Requisitos de la Solicitud */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              2. Procedimiento para Presentar una Solicitud ARCO
            </h2>
            <p>
              Para iniciar una solicitud de ejercicio de Derechos ARCO o revocación del consentimiento, el titular o su representante legal debidamente acreditado deberá remitir un escrito libre dirigido al <strong>[nombre del comité]</strong> a través de nuestro correo oficial de privacidad:
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-sm space-y-2">
              <p>
                <strong>Correo electrónico receptor:</strong>{" "}
                <a href="mailto:[correo de privacidad]" className="text-[var(--accent)] font-mono underline font-bold">
                  [correo de privacidad]
                </a>
              </p>
              <p>
                <strong>Asunto recomendado:</strong> &quot;SOLICITUD DE DERECHOS ARCO - [Nombre Completo del Titular]&quot;
              </p>
            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--head)] pt-2">
              Requisitos indispensables que debe contener la solicitud:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm pl-2">
              <li>
                <strong>Nombre completo del titular</strong> y dirección de correo electrónico con la que se registró en el evento a través de <strong>[dominio]</strong>.
              </li>
              <li>
                <strong>Acreditación de identidad:</strong> Copia digitalizada de una identificación oficial vigente (INE, pasaporte, credencial UNAM o documento oficial equivalente). En caso de representante legal, adjuntar instrumento público o carta poder simple firmada ante dos testigos.
              </li>
              <li>
                <strong>Descripción clara y precisa:</strong> Detallar con exactitud los datos personales respecto de los cuales se busca ejercer el derecho correspondiente y el derecho específico solicitado (Acceso, Rectificación, Cancelación u Oposición).
              </li>
              <li>
                <strong>Documentación de soporte:</strong> En el caso de Rectificación, anexar la constancia o documentación que respalde la modificación solicitada.
              </li>
              <li>
                <strong>Domicilio o medio digital:</strong> Confirmar el correo electrónico al cual se deberá notificar la determinación y respuesta respectiva.
              </li>
            </ol>
          </section>

          {/* 3. Plazos Legales Obligatorios */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              3. Plazos Legales de Atención y Respuesta
            </h2>
            <p>
              El comité organizador observará estrictamente los siguientes plazos legales en la tramitación de cualquier procedimiento ARCO ordinario:
            </p>

            <div className="space-y-3 pt-1">
              <div className="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 text-sm space-y-1">
                <p className="font-bold text-emerald-900">
                  1. Plazo de Respuesta (20 días hábiles):
                </p>
                <p className="text-emerald-800 text-xs sm:text-sm">
                  El comité comunicará al solicitante la determinación adoptada en un plazo máximo de <strong>veinte (20) días hábiles</strong>, contados a partir de la fecha en que se recibió fehacientemente la solicitud completa.
                </p>
              </div>

              <div className="border-l-4 border-amber-600 bg-amber-50/50 p-4 text-sm space-y-1">
                <p className="font-bold text-amber-900">
                  2. Prórroga Justificada (por 20 días hábiles adicionales):
                </p>
                <p className="text-amber-800 text-xs sm:text-sm">
                  Dicho plazo de 20 días podrá ser prorrogado <strong>por una sola ocasión y hasta por un periodo igual de veinte (20) días hábiles adicionales</strong>, siempre y cuando existan causas justificadas que así lo ameriten, lo cual será debidamente notificado al titular antes del vencimiento del primer término.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 bg-blue-50/50 p-4 text-sm space-y-1">
                <p className="font-bold text-blue-900">
                  3. Plazo de Efectividad (15 días hábiles):
                </p>
                <p className="text-blue-800 text-xs sm:text-sm">
                  De resultar procedente la solicitud de derechos ARCO, la determinación se hará efectiva dentro de los <strong>quince (15) días hábiles</strong> siguientes a la fecha en que se notifique formalmente la respuesta favorable al titular.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Política Especial de Retiro en 72 Horas */}
          <section id="retiro-72h" className="space-y-4 text-sm sm:text-base leading-relaxed scroll-mt-24">
            <h2 className="text-xl font-display text-[var(--accent)] border-b border-[var(--rule)] pb-2">
              4. Mecanismo Acelerado: Retiro de Imagen y Archivos en 72 Horas
            </h2>
            <p>
              Reconocemos que la soberanía sobre la propia imagen y el material académico de nuestras conferencistas requiere una respuesta expedita. Por ello, el comité organizador de <strong>Quetzalia</strong> opera un protocolo express:
            </p>

            <div className="border-2 border-[var(--head)] p-5 bg-white space-y-3 text-sm">
              <h3 className="font-bold text-base text-[var(--head)]">
                Pasos para el retiro acelerado de fotografía o diapositivas:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
                <li>
                  Envía un correo a <span className="font-mono font-bold text-[var(--accent)]">[correo de privacidad]</span>.
                </li>
                <li>
                  Asunto exacto: <strong>&quot;SOLICITUD URGENTE DE RETIRO DE IMAGEN / MATERIALES&quot;</strong>.
                </li>
                <li>
                  Indica tu nombre completo y el material específico que solicitas despublicar (por ejemplo: <em>&quot;Mi fotografía de semblanza en la sección de ponentes&quot;</em> o <em>&quot;Las diapositivas de la charla X&quot;</em>).
                </li>
                <li>
                  <strong>Ejecución técnica en 72 horas naturales:</strong> El comité organizador activará el endpoint de seguridad del sistema (<code>/api/admin/withdraw-media</code>), eliminando físicamente el archivo del bucket de almacenamiento y desvinculando de forma permanente la referencia en el sitio web oficial.
                </li>
              </ol>
            </div>

            <p className="text-xs opacity-85">
              * Nota de alcance técnico: La eliminación aplica para todos los sitios y repositorios controlados directamente por el comité en <strong>[dominio]</strong>. No aplica de forma retroactiva respecto de memorias impresas que hubiesen sido legalmente distribuidas con anterioridad a la fecha del retiro.
            </p>
          </section>

          {/* 5. Contacto e información del responsable */}
          <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-xs text-[var(--fg)] space-y-1">
            <p className="font-bold text-[var(--head)]">
              Unidad de Atención y Privacidad de Quetzalia STEM
            </p>
            <p>
              Responsable: <strong>[nombre del comité]</strong>
            </p>
            <p>
              Domicilio de recepción documental: <strong>[domicilio del responsable]</strong>
            </p>
            <p>
              Correo electrónico: <strong>[correo de privacidad]</strong> · Sitio: <strong>[dominio]</strong>
            </p>
          </div>
        </article>
      </main>

      <Greca />
      <Footer />
    </div>
  );
}
