"use client";

import Image from "next/image";

export default function playersStats({
  players,
  item,
}: {
  players: any[];
  item: string;
}) {
  let indexated: string;
  if (item == "Goles") {
    indexated = "goals";
  }
  if (item == "Asistencias") {
    indexated = "assists";
  }
  if (item == "Amarillas") {
    indexated = "yellowCards";
  }
  if (players.length > 0) {
    return (
      <>
        <table>
          <thead>
            <tr>
              <td className="p-2 border-1">#</td>
              <td className="p-2 border-1">Nombre</td>
              <td className="p-2 border-1">{item}</td>
              <td className="p-2 border-1">Equipo</td>
              <td className="p-2 border-1">Escudo</td>
            </tr>
          </thead>

          <tbody>
            {players.map((player: any, index: number) => (
              <tr key={player.player.id}>
                {" "}
                <td className="p-2 border-1">{index + 1}</td>
                <td className="p-2 border-1">{player.player.name}</td>
                <td className="p-2 border-1 text-center">
                  {player[indexated]}
                </td>
                <td className="p-2 border-1 text-center">{player.team.name}</td>
                <td className="p-2 border-1 justify-end items-center ">
                  <Image
                    className= "mx-auto"
                    src={player.team.flag}
                    alt={player.team.name}
                    width={30}
                    height={30}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  } else {
    return <p className="text-2xl">No hay jugadores para mostrar</p>;
  }
}
