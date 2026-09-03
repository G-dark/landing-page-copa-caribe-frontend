"use client";
import default_profile from "../../public/default_profile.png";
import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg";

import { useMemo } from "react";

interface Position {
  id: string;
  top: number;
  left: number;
}

export default function Formacion({
  distribution,
  totalPlayers,
  starters,
  subPlayers,
  setSelect1,
  match,
  team,
}: {
  distribution: string;
  totalPlayers: number;
  starters: any;
  subPlayers: any[];
  setSelect1: (value: any[] | ((prev: any[]) => any[])) => void;
  match: any;
  team: string;
}) {
  const positions = useMemo(() => {
    const lines = distribution.split("-");

    const verticalPositions = [160, 260, 360, 460];

    const generatedPositions: Position[] = [];

    generatedPositions.push({
      id: "gk",
      top: 50,
      left: 350,
    });

    lines.forEach((line, lineIndex) => {
      const amount = Number(line);

      for (let i = 0; i < amount; i++) {
        const spacing = 700 / (amount + 1);

        generatedPositions.push({
          id: `${lineIndex}-${i}`,
          top: verticalPositions[lineIndex],
          left: spacing * (i + 1),
        });
      }
    });

    return generatedPositions;
  }, [distribution, totalPlayers]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[700px] h-[500px] bg-green-300 rounded-2xl border-1 border-black overflow-hidden">
        <div className="absolute w-[350px] h-[130px] border-2 border-white left-1/2 -translate-x-1/2 top-0">
          <div className="absolute w-[175px] h-[70px] border-2 border-white left-1/2 -translate-x-1/2 top-0"></div>
        </div>
        {positions.map((position) => {
          const player = starters[position.id];

          let goals, assists, yellowCards, redCards, isSubIn;
          if (team === "A") {
            goals =
              match.scorersA?.filter((scorer: any) => scorer === player?.id)
                .length || 0;
            assists =
              match.assistersA?.filter(
                (assister: any) => assister === player?.id,
              ).length || 0;
            yellowCards =
              match.yellowPlayersA?.filter(
                (yellow: any) => yellow === player?.id,
              ).length || 0;
            redCards =
              match.redPlayersA?.filter((red: any) => red === player?.id)
                .length || 0;
            isSubIn = match.formacionA.subPlayers.some(
              (sub: any) => sub === player?.id,
            );
          }

          if (team === "B") {
            goals =
              match.scorersB?.filter((scorer: any) => scorer === player?.id)
                .length || 0;
            assists =
              match.assistersB?.filter(
                (assister: any) => assister === player?.id,
              ).length || 0;
            yellowCards =
              match.yellowPlayersB?.filter(
                (yellow: any) => yellow === player?.id,
              ).length || 0;
            redCards =
              match.redPlayersB?.filter((red: any) => red === player?.id)
                .length || 0;
            isSubIn = match.formacionB.subPlayers.some(
              (sub: any) => sub === player?.id,
            );
          }

          const scorers =
            team === "A" ? (match.scorersA ?? []) : (match.scorersB ?? []);

          const assisters =
            team === "A" ? (match.assistersA ?? []) : (match.assistersB ?? []);

          const yellowPlayers =
            team === "A"
              ? (match.yellowPlayersA ?? [])
              : (match.yellowPlayersB ?? []);

          const redPlayers =
            team === "A"
              ? (match.redPlayersA ?? [])
              : (match.redPlayersB ?? []);
          return (
            <div
              onClick={() =>
                setSelect1((prev) =>
                  prev.some((p) => p.id === player.id)
                    ? prev
                    : [...prev, player],
                )
              }
              key={position.id}
              className="absolute w-[35px] h-[35px] rounded-full text-black text-sm flex flex-col items-center justify-center font-bold cursor-pointer"
              style={{
                fontSize: "12px",
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div>{player?.dorsal || ""}</div>

              {redPlayers.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
              )}
              {isSubIn && (
                <div className="absolute w-[15px] h-[15px]  rounded-full top-1 right-0 z-10 icon-arrow-up" />
              )}
              {yellowPlayers.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-0 left-1 z-10" />
              )}
              {yellowPlayers.includes(player?.id) && yellowCards == 2 && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-0 left-2 z-10" />
              )}
              {assisters.includes(player?.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-0 left-7 z-10 text-[12px] text-black flex">
                  {" "}
                  {assists} A
                </div>
              )}
              {scorers.includes(player?.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-0 left-0 z-10 text-[12px] text-black flex">
                  {" "}
                  {goals} G
                </div>
              )}
              <Image
                className="relative rounded-full"
                src={player?.image || default_profile}
                width={40}
                height={40}
                alt={"Player image"}
              />

              <div>{player?.name.substring(0, 7)}</div>
            </div>
          );
        })}
      </div>

      <p className="text-center font-semibold mb-4">Suplentes</p>
      <div className="flex justify-center items-center">
        <div className="flex">
          <div className="flex flex-col gap-3 justify-center min-h-[100px] border-gray-400 rounded-2xl p-4">
            {subPlayers.map((player: any) => {
              let goals, assists, yellowCards, redCards, isSentOff;
              if (team === "A") {
                goals =
                  match.scorersA?.filter((scorer: any) => scorer === player?.id)
                    .length || 0;
                assists =
                  match.assistersA?.filter(
                    (assister: any) => assister === player?.id,
                  ).length || 0;
                yellowCards =
                  match.yellowPlayersA?.filter(
                    (yellow: any) => yellow === player?.id,
                  ).length || 0;
                redCards =
                  match.redPlayersA?.filter((red: any) => red === player?.id)
                    .length || 0;
                isSentOff = match.formacionA.starters.some(
                  (sub: any) => sub === player?.id,
                );
              }

              if (team === "B") {
                goals =
                  match.scorersB?.filter((scorer: any) => scorer === player?.id)
                    .length || 0;
                assists =
                  match.assistersB?.filter(
                    (assister: any) => assister === player?.id,
                  ).length || 0;
                yellowCards =
                  match.yellowPlayersB?.filter(
                    (yellow: any) => yellow === player?.id,
                  ).length || 0;
                redCards =
                  match.redPlayersB?.filter((red: any) => red === player?.id)
                    .length || 0;
                isSentOff = match.formacionB.starters.some(
                  (sub: any) => sub === player?.id,
                );
              }

              const scorers =
                team === "A" ? (match.scorersA ?? []) : (match.scorersB ?? []);

              const assisters =
                team === "A"
                  ? (match.assistersA ?? [])
                  : (match.assistersB ?? []);

              const yellowPlayers =
                team === "A"
                  ? (match.yellowPlayersA ?? [])
                  : (match.yellowPlayersB ?? []);

              const redPlayers =
                team === "A"
                  ? (match.redPlayersA ?? [])
                  : (match.redPlayersB ?? []);

              return (
                <div
                  onClick={() =>
                    setSelect1((prev) =>
                      prev.some((p) => p.id === player.id)
                        ? prev
                        : [...prev, player],
                    )
                  }
                  key={player?.id}
                  style={{ fontSize: "10px" }}
                  className="relative text-black px-4 py-2 rounded-2xl font-bold"
                >
                  <div className="flex">
                    <div>{player?.dorsal}</div>
                    {redPlayers.includes(player?.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
                    )}
                    {isSentOff && (
                      <div className="absolute w-[15px] h-[15px] rounded-full top-1 right-0 z-10 icon-arrow-down" />
                    )}
                    {yellowPlayers.includes(player?.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-0 left-1 z-10" />
                    )}
                    {yellowPlayers.includes(player?.id) && yellowCards == 2 && (
                      <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-0 left-2 z-10" />
                    )}
                    {assisters.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-0 left-14 z-10 text-[12px] text-black flex">
                        {" "}
                        {assists} A
                      </div>
                    )}
                    {scorers.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-0 left-3 z-10 text-[12px] text-black flex">
                        {" "}
                        {goals} G
                      </div>
                    )}
                    <Image
                      src={player?.image || default_profile}
                      className="relative rounded-full"
                      width={40}
                      height={40}
                      alt={player?.name}
                    />{" "}
                    <div>{player?.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
