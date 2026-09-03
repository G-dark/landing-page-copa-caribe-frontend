"use client";

import header from "../../public/headerEscarapela.png";
import footer from "../../public/footerEscarapela.png";
import fondo from "../../public/fondoEscarapela.png";
import default_profile from "../../public/default_profile.png";
import Image from "next/image";

export default function EscarapelaE({
  item,
  tournament,
  team,
}: {
  item: any;
  tournament: any;
  team: any;
}) {
  return (
    <>
      <div style={{ width: "100mm", height: "150mm" }} className="flex flex-col justify-start items-center mb-5 bg-blue-500 relative rounded-2xl">
        <div className="text-2xl mt-15 text-white font-bold z-41">
          {tournament.name}
        </div>
        <div className="text-[12px]  text-white z-41">
          {tournament.city + " " + tournament.edition}
        </div>

        <Image
          className="mt-10 mb-10 z-41"
          src={item.image || default_profile}
          width={100}
          height={120}
          alt="Imagen de un jugador"
        />
        <Image
          className="absolute top-0 left-0 z-41"
          src={header}
          width={397}
          height={200}
          alt="Imagen de cabecera"
        />
        <Image
          className="absolute bottom-0 left-0 z-41"
          src={footer}
          width={397}
          height={200}
          alt="Imagen de piecero"
        />

        <Image
          className="absolute top-0 left-0"
          src={fondo}
          width={397}
          height={600}
          alt="Imagen de fondo"
        />
        <div className="bg-white p-2 rounded-2xl w-[300px] h-[30px] flex items-center z-41">
          Entrenador: {item.name}
        </div>
        <div className="bg-white p-2 rounded-2xl w-[300px] h-[30px] flex items-center mt-5 z-41">
          ID: {item.id}
        </div>
        <div className="bg-white p-2 rounded-2xl w-[300px] h-[30px] flex items-center mt-5 z-41">
          Club: {team.name}
        </div>
      </div>
    </>
  );
}