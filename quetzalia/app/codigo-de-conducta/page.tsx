import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Greca from "@/components/ui/Greca";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Código de Conducta | Quetzalia 2027",
  description:
    "Código de Conducta del Encuentro de Mujeres en STEM, Quetzalia. Pautas de convivencia, respeto, inclusión y protocolos de atención ante cualquier eventualidad en la FES Acatlán.",
};

export default function CodigoDeConductaPage() {
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
              className="hidden sm:inline text-[var(--fg)] hover:text-[var(--accent)]"
            >
              Aviso de Privacidad
            </Link>
            <Link
              href="/mi-registro"
              className="text-[var(--accent)] hover:underline"
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
              Documento Normativo 08 · Convivencia e Integridad
            </span>
            <h1 className="text-2xl sm:text-4xl font-display text-[var(--head)]">
              Código de Conducta
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg)] opacity-75">
              Encuentro Quetzalia STEM · Comunidad FES Acatlán
            </p>
          </div>

          {/* Declaración de principios */}
          <div className="p-4 sm:p-5 bg-[var(--bg-alt)] border-l-4 border-[var(--accent)] text-sm space-y-2 leading-relaxed">
            <h2 className="font-semibold text-base text-[var(--head)]">
              1. Propósito y Filosofía del Encuentro
            </h2>
            <p>
              El encuentro <strong>Quetzalia</strong> nace con el firme objetivo de crear un entorno seguro, enriquecedor, igualitario e inspirador para las mujeres y disidencias que estudian, ejercen e impulsan la ciencia, la tecnología, la ingeniería y las matemáticas (STEM) en la <strong>FES Acatlán, UNAM</strong>.
            </p>
            <p>
              El <strong>[nombre del comité]</strong> y todas las personas que forman parte de esta comunidad nos comprometemos a garantizar una experiencia libre de discriminación, acoso y cualquier forma de violencia, independientemente del género, identidad o expresión de género, orientación sexual, discapacidad, apariencia física, origen étnico, edad, nivel académico o trayectoria técnica.
            </p>
          </div>

          {/* 2. Ámbito de Aplicación */}
          <section className="space-y-3 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              2. Ámbito de Aplicación
            </h2>
            <p>
              Este código de conducta rige de forma obligatoria e incondicional para:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              <li>Asistentes generales y estudiantes de todas las facultades.</li>
              <li>Ponentes, talleristas, expositoras y panelistas invitadas.</li>
              <li>Empresas, organizaciones patrocinadoras y sus representantes.</li>
              <li>Comunidades estudiantiles y colectivas colaboradoras.</li>
              <li>Equipo voluntario, staff y personal del comité organizador.</li>
            </ul>
            <p className="text-xs opacity-85">
              Aplica tanto en todos los espacios físicos de la sede (auditorios, salas de cómputo, pasillos, explanadas y áreas de acreditación) como en los canales digitales del evento (plataformas de transmisión, redes sociales y sitio web oficial en <strong>[dominio]</strong>).
            </p>
          </section>

          {/* 3. Comportamientos Esperados */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              3. Comportamientos Esperados
            </h2>
            <p>
              Para fomentar una comunidad de crecimiento y respaldo recíproco, promovemos y valoramos:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm pt-2">
              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">✓ Respeto a la Identidad y Nombre Elegido</p>
                <p className="text-xs opacity-90">
                  Respetar irrestrictamente el nombre social y los pronombres con los que cada participante elija presentarse, tanto verbalmente como en acreditaciones y listas.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">✓ Escucha Activa y Crítica Constructiva</p>
                <p className="text-xs opacity-90">
                  Participar en las rondas de preguntas con interés genuino y empatía, fomentando debates técnicos estimulantes y libres de descalificaciones.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">✓ Inclusión de Principiantes</p>
                <p className="text-xs opacity-90">
                  Ser receptivas y generosas con quienes se inician en la programación, matemáticas o ciencias, reconociendo que cada trayectoria es valiosa y única.
                </p>
              </div>

              <div className="border border-[var(--rule)] p-4 bg-white/50 space-y-1">
                <p className="font-bold text-[var(--head)]">✓ Cuidado del Entorno Común</p>
                <p className="text-xs opacity-90">
                  Preservar la limpieza, los equipos tecnológicos y el orden de los auditorios de la facultad, siguiendo las indicaciones de los comités de logística.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Comportamientos Inaceptables */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2 text-rose-800">
              4. Comportamientos Estrictamente Inaceptables (Tolerancia Cero)
            </h2>
            <p>
              No toleraremos ningún comportamiento que vulnere la dignidad, seguridad o integridad de nuestras participantes. Se consideran faltas graves y sancionables:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>
                <strong>Acoso verbal o físico:</strong> Comentarios de tono sexual o romántico no solicitados, bromas sexistas, lenguaje misógino, homofóbico o transfóbico, o cualquier alusión humillante a la apariencia personal.
              </li>
              <li>
                <strong>Contacto físico no consentido:</strong> Cualquier aproximación corporal invasiva o contacto sin el consentimiento expreso de la otra persona.
              </li>
              <li>
                <strong>Fotografías y grabaciones intrusivas:</strong> Tomar fotos o videos en primer plano a personas individuales sin su consentimiento explícito previo, o continuar haciéndolo si la persona solicita retirarse.
              </li>
              <li>
                <strong>Intimidación, acecho o seguimiento:</strong> Perseguir, vigilar persistentemente o acorralar a participantes dentro de las instalaciones o en redes sociales.
              </li>
              <li>
                <strong>Boicot o interrupciones deliberadas:</strong> Interrumpir de forma reiterada y maliciosa las exposiciones, talleres prácticos o paneles de diálogo.
              </li>
              <li>
                <strong>Exposición no consentida de datos privados (Doxxing):</strong> Publicar datos personales, números celulares, domicilios o redes personales de cualquier participante sin autorización.
              </li>
              <li>
                <strong>Spam o proselitismo no autorizado:</strong> Difundir propaganda comercial agresiva o proselitismo político/partidista ajeno al espíritu científico y académico del evento.
              </li>
            </ul>
          </section>

          {/* 5. Protocolo de Denuncia y Soporte */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              5. Procedimiento de Denuncia y Canal de Ayuda
            </h2>
            <p>
              Si estás experimentando alguna situación de acoso, observas que alguien está siendo vulnerada o tienes cualquier inquietud relacionada con tu bienestar durante el evento:
            </p>
            
            <div className="border border-[var(--rule)] p-5 bg-[var(--bg-alt)] space-y-3 text-sm">
              <p className="font-bold text-[var(--head)]">
                Canales oficiales de reporte inmediato:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Reporte presencial:</strong> Acude de inmediato con cualquier integrante del <strong>[nombre del comité]</strong> o del equipo de voluntariado, quienes portarán gafetes e insignias distintivas de organización.
                </li>
                <li>
                  <strong>Reporte digital confidencial:</strong> Envía un correo con el asunto <strong>&quot;REPORTE URGENTE DE CÓDIGO DE CONDUCTA&quot;</strong> a:{" "}
                  <a href="mailto:[correo de privacidad]" className="text-[var(--accent)] font-mono underline font-bold">
                    [correo de privacidad]
                  </a>.
                </li>
              </ol>
              <p className="text-xs opacity-90 pt-1">
                Todas las quejas y reportes serán atendidos de forma estrictamente confidencial, con enfoque de género, empatía y garantizando la seguridad de la persona denunciante.
              </p>
            </div>
          </section>

          {/* 6. Medidas y Sanciones */}
          <section className="space-y-4 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              6. Consecuencias y Medidas Disciplinarias
            </h2>
            <p>
              Ante cualquier transgresión confirmada al Código de Conducta, el comité organizador ejercerá de manera inmediata y definitiva las siguientes medidas proporcionales a la gravedad del acto:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm pl-2">
              <li>Exigencia de cese inmediato de la conducta infractora y amonestación formal.</li>
              <li>Suspensión del acceso a conferencias, talleres o salas de cómputo específicas.</li>
              <li><strong>Expulsión inmediata y definitiva de las instalaciones del evento</strong> con retiro de gafete oficial de acreditación.</li>
              <li>Cancelación irrevocable del folio de registro y anulación del derecho a recibir constancia oficial de participación o de impartición de ponencia.</li>
              <li>En caso de conductas que constituyan faltas a la Legislación Universitaria de la UNAM o posibles delitos, el comité dará vista inmediata a las autoridades de Seguridad de la FES Acatlán y a las instancias legales conducentes.</li>
            </ol>
          </section>

          {/* 7. Compromiso de la Comunidad */}
          <div className="p-4 bg-[var(--card)] border border-[var(--rule)] text-center text-xs sm:text-sm space-y-2">
            <p className="font-semibold text-[var(--head)]">
              ¡Construyamos juntos un Quetzalia inolvidable!
            </p>
            <p className="opacity-80">
              Gracias por hacer de este encuentro un espacio de orgullo, fraternidad, rigor intelectual y sororidad para todas las científicas, ingenieras y matemáticas de hoy y del futuro.
            </p>
          </div>
        </article>
      </main>

      <Greca />
      <Footer />
    </div>
  );
}
