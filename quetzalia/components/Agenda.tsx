import React from "react";
import SectionHead from "./ui/SectionHead";

export default function Agenda() {
  const agendaItems = [
    {
      time: "09:30",
      title: "Registro y bienvenida",
      desc: "Acreditación e ingreso de las asistentes.",
      soft: true,
    },
    {
      time: "10:00",
      title: "Conferencia de apertura",
      desc: "Ponencia inaugural y presentación del programa.",
      soft: false,
    },
    {
      time: "11:00",
      title: "Talleres por nivel",
      desc: "Tres talleres al mismo tiempo, cada uno pensado para su público. Los temas se anunciarán pronto.",
      chips: ["Secundaria", "Bachillerato", "Licenciatura"],
      soft: false,
    },
    {
      time: "12:00",
      title: "Coffee break y networking",
      desc: "Descanso, refrigerio y convivencia.",
      soft: true,
    },
    {
      time: "12:30",
      title: "Feria STEM y stands de comunidades",
      desc: "Colectivos y aliadas de la comunidad STEM presentan su trabajo y te invitan a probar, preguntar y conocer.",
      soft: false,
    },
    {
      time: "14:00",
      title: "Panel de mujeres en ciencia y tecnología",
      desc: "Conversatorio con especialistas sobre sus trayectorias, con espacio para tus preguntas.",
      soft: false,
    },
    {
      time: "15:00",
      title: "Conferencia magistral y clausura",
      desc: "Ponencia principal de cierre y palabras finales. La jornada termina a las 16:00.",
      soft: false,
    },
  ];

  return (
    <section className="section" id="agenda">
      <div className="wrap">
        <SectionHead eyebrow="Agenda" title="Un día completo, de 9:30 a 16:00" />
        <ol className="agenda">
          {agendaItems.map((item, idx) => (
            <li key={idx} className={item.soft ? "soft" : ""}>
              <time dateTime={item.time}>{item.time}</time>
              <div className="body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {item.chips && (
                  <div className="chips">
                    {item.chips.map((chip, cIdx) => (
                      <span className="chip" key={cIdx}>
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="note">
          Agenda preliminar: los horarios pueden ajustarse antes del evento.
        </p>
      </div>
    </section>
  );
}

