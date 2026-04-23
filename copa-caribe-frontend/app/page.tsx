"use client";

import { useEffect, useState } from "react";
import NavBar from "./ui/NavBar";
import Image from "next/image";
import trophy from "../public/trofeo.png";
import ball from "../public/ball.png";
import barranquilla from "../public/Barranquilla.jpg";
import futbol from "../public/inicio_foto.jpg";
import diagonal_shapes from "../public/geometrical_pattern.png";
import { useHome } from "./lib/Contexts/HomeContexts";
import Popup from "./ui/Popup";

export default function Home() {
  // declaraciones e inicializaciones
  const { year, show, setShow, rol, setRol } = useHome();
  const [isOpenPopup, setOpenUp] = useState(false);
  const [message, setMessage] = useState("");

  const openPopup = () => setOpenUp(true);
  const closePopup = () => setOpenUp(false);
  useEffect(() => {
    const message = localStorage.getItem("message");
    if (message !== null && !show) {
      setMessage(message);
      setShow(true);

      openPopup();
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className="relative">
        <Image
          className="image-futbol h-auto w-full "
          src={futbol}
          width={200}
          alt="Dos jovenes jugando futbol"
        ></Image>
       <div className="absolute inset-0 bg-gradient-to-l from-blue-900/80 via-blue-800/60 to-transparent"></div>

        {/* Forma diagonal */}
        <div className="absolute inset-0 bg-blue-900/50 clip-diagonal"></div>
        <div className=""></div>
        <div className="absolute inset-0 flex flex-col items-end justify-center">
          <div className="flex flex-col justify-center items-end mr-20">
            <h1 className="text-9xl flex ml-5">
              {" "}
              <span className="text-white">Copa</span>{" "}
              <span className="text-white">Caribe </span>
            </h1>
            <div className="text-5xl text-red-500">{year}</div>
          </div>
          <br />
          <br />
          <br />
          <br />

          <p className="text-white pl-150">
            La REGIÓN CARIBE se convertirá en la referencia mundial de futbol
            formativo, celebrando la mayor fiesta del deporte base
            internacional. Copa caribe es un emocionante torneo Infantil anual
            que reúne a niños de todo el país para celebrar el fútbol en
            su forma más pura: con alegría, pasión y compañerismo. Un evento
            diseñado para formar deportistas y personas con valores.
          </p>
        </div>
      </div>

      <div className="intro pr-30 pl-30">
        <div className="linechar flex p-10">
          <div className="char flex flex-col p-5 bg-red-300 m-5 rounded-lg">
            <div className="diana-flecha text-5xl text-center">🎯</div>
            <div className="text-center">Objetivo</div>
            <br />
            Promover el desarrollo deportivo infantil, la integración regional y
            los valores del juego limpio, ofreciendo una experiencia única para
            los pequeños talentos del fútbol.
          </div>
          <div className="char2 flex flex-col p-5 m-5 bg-gray-300 rounded-lg">
            <div className="tuerca text-5xl text-center">⚙️</div>
            <div className="text-center">Formato del torneo</div>
            <br />

            <p>
              Fase de grupos y rondas eliminatorias. Mínimo de 3 partidos
              garantizados por equipo. Árbitros capacitados y reglamento
              adaptado a cada categoría. Premiación especial por categoría:
              campeón, subcampeón, goleador y mejor jugador.
            </p>
          </div>

          <div className="char3 flex flex-col p-5 m-5 bg-green-300 rounded-lg">
            <div className="stadium text-5xl text-center">🏟️</div>
            <div className="text-center">Sedes del torneo</div>
            <br />
            Escenarios deportivos en óptimas condiciones dentro de Barranquilla,
            con canchas de grama natural y sintética, seguridad, y zonas de
            hidratación y descanso.
          </div>

          <div className="char4 flex flex-col p-5 m-5 bg-blue-300 rounded-lg">
            <div className="stadium text-5xl text-center">🥇</div>
            <div className="text-center">Beneficios</div>
            <br />
            Para los participantes Medallas y trofeos por equipo e individuales.
            Hidratación durante los partidos. Cobertura audiovisual (fotografía
            y video). Actividades recreativas y ambiente familiar. Participación
            en la ceremonia inaugural y clausura
          </div>
        </div>
        <div className="font-bold">Versiones</div>
        <div className="flex justify-center">
          <div className="flex flex-col">
            <Image
              className="BQ-image mt-10 rounded-lg"
              src={barranquilla}
              width={250}
              alt="Imagen de la ventana al mundo"
            ></Image>
            <div className="text-center">Barranquilla</div>
          </div>
        </div>
        <div className="font-bold">Redes sociales</div>
        <div className="flex justify-center">
          <div className="instagram icon-instagram m-10"></div>
          <div className="instagram icon-facebook m-10"></div>
          <div className="instagram icon-whatsapp m-10"></div>
        </div>
        <div className="font-bold">Galeria</div>
        <div className="font-bold">Como llegar</div>
        <div className="flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.594082113432!2d-74.8095081252312!3d10.993980355143742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d0c6305e38d%3A0x3afafa54d274168e!2sEstadio%20Romelio%20Mart%C3%ADnez!5e0!3m2!1ses!2sco!4v1774105971882!5m2!1ses!2sco"
            width="600"
            height="450"
            className="border-0 rounded-lg pb-10"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="flex justify-center bg-blue-300 h-fit p-2">
        <footer>
          {" "}
          Copa Caribe {year} &copy; Todos los derechos reservados{" "}
        </footer>
      </div>
      <Popup onClose={closePopup} isOpen={isOpenPopup}>
        {message}
      </Popup>
    </>
  );
}
