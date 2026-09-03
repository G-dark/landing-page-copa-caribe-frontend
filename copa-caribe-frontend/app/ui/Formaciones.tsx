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

export default function Formaciones({
  distribution,
  distribution2,
  totalPlayers,
  starters1,
  starters2,
  subPlayers,
  subPlayers2,
  teamA,
  teamB,
  match,
}: {
  distribution: string;
  distribution2: string;
  totalPlayers: number;
  starters1: any;
  starters2: any;
  subPlayers: any[];
  subPlayers2: any[];
  teamA: any;
  teamB: any;
  match: any;
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

  const positions2 = useMemo(() => {
    const lines = distribution2.split("-");

    const verticalPositions = [800, 700, 600, 500];

    const generatedPositions2: Position[] = [];

    generatedPositions2.push({
      id: "gk",
      top: 925,
      left: 350,
    });

    lines.forEach((line, lineIndex) => {
      const amount = Number(line);

      for (let i = 0; i < amount; i++) {
        const spacing = 700 / (amount + 1);

        generatedPositions2.push({
          id: `${lineIndex}-${i}`,
          top: verticalPositions[lineIndex],
          left: spacing * (i + 1),
        });
      }
    });
   
    return generatedPositions2;
  }, [distribution2, totalPlayers]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex">
        <Image
          src={teamA.flag || default_escudo}
          width={20}
          height={20}
          alt={teamA.name}
        />{" "}
        <div className="ml-5">{teamA.name}</div>
      </div>
      <div className="relative w-[700px] h-[1000px] bg-green-300 rounded-2xl border-1 border-black overflow-hidden">
        <div className="absolute w-[350px] h-[130px] border-2 border-white left-1/2 -translate-x-1/2 top-0">
          <div className="absolute w-[175px] h-[70px] border-2 border-white left-1/2 -translate-x-1/2 top-0"></div>
        </div>
        {positions.map((position) => {
          const player = starters1[position.id];
          const goals =
            match.scorersA?.filter((scorer: any) => scorer === player?.id)
              .length || 0;
          const assists =
            match.assistersA?.filter((assister: any) => assister === player?.id)
              .length || 0;
          const yellowCards =
            match.yellowPlayersA?.filter((yellow: any) => yellow === player?.id)
              .length || 0;
          const redCards =
            match.redPlayersA?.filter((red: any) => red === player?.id).length ||
            0;
          const isSubstituited = match.finalFormacionA.subPlayers.some(
            (sub: any) => sub === player?.id,
          );
          return (
            <div
              key={position.id}
              className="absolute w-[70px] h-[70px] rounded-full text-black text-sm flex flex-col items-center justify-center font-bold cursor-pointer z-40"
              style={{
                fontSize: "12px",
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {match.redPlayersA.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
              )}
              {isSubstituited && (
                <div className="absolute w-[15px] h-[15px] rounded-full top-1 right-0 z-10 icon-arrow-down" />
              )}
              {match.yellowPlayersA.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-1 z-10" />
              )}
              {match.yellowPlayersA.includes(player?.id) && yellowCards == 2 && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-2 z-10" />
              )}
              {match.assistersA.includes(player.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 right-0 z-10 text-[12px] text-black flex">
                  {" "}
                  {assists} A
                </div>
              )}
              {match.scorersA.includes(player?.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 left-0 z-10 text-[12px] text-black flex">
                  {" "}
                  {goals} G
                </div>
              )}
              <div>{player?.dorsal || ""}</div>
              <Image
                className="rounded-full realative"
                src={player?.image || default_profile}
                width={40}
                height={40}
                alt={player?.name}
              />

              <div>{player?.name.substring(0, 7)}</div>
            </div>
          );
        })}
        <div className="absolute w-[1600px] h-[5px] border-2 border-white left-0 -translate-x-1/2 top-1/2"></div>
        <div className="absolute w-[250px] h-[250px] border-4 border-white left-1/2 -translate-x-1/2 top-[380px] rounded-full z-39"></div>
        <div className="absolute w-[350px] h-[130px] border-2 border-white left-1/2 -translate-x-1/2 bottom-0">
          <div className="absolute w-[175px] h-[70px] border-2 border-white left-1/2 -translate-x-1/2 bottom-0"></div>
        </div>
        {positions2.map((position) => {
          const player = starters2[position.id];
          const goals =
            match.scorersB?.filter((scorer: any) => scorer === player?.id)
              .length || 0;
          const assists =
            match.assistersB?.filter((assister: any) => assister === player?.id)
              .length || 0;
          const yellowCards =
            match.yellowPlayersB?.filter((yellow: any) => yellow === player?.id)
              .length || 0;
          const redCards =
            match.redPlayersB?.filter((red: any) => red === player?.id).length ||
            0;
          const isSubstituited = match.finalFormacionB.subPlayers.some(
            (sub: any) => sub === player?.id
          );
          return (
            <div
              key={position.id}
              className="absolute w-[35px] h-[35px] rounded-full text-black flex flex-col items-center justify-center font-bold cursor-pointer z-40"
              style={{
                fontSize: "12px",
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div>{player?.dorsal || ""}</div>
              {match.redPlayersB.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
              )}
              {isSubstituited && (
                <div className="absolute w-[15px] h-[15px] bg-blue-500 rounded-full top-1 right-0 z-10 icon-arrow-down" />
              )}
              {match.yellowPlayersB.includes(player?.id) && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-1 z-10" />
              )}
              {match.yellowPlayersB.includes(player?.id) && yellowCards == 2 && (
                <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-2 z-10" />
              )}
              {match.assistersB.includes(player?.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 right-0 z-10 text-[12px] text-black flex">
                  {" "}
                  {assists} A
                </div>
              )}
              {match.scorersB.includes(player?.id) && (
                <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 left-0 z-10 text-[12px] text-black flex">
                  {" "}
                  {goals} G
                </div>
              )}
              <Image
                className="rounded-full relative"
                src={player?.image || default_profile}
                width={40}
                height={40}
                alt={player?.name}
              />

              <div>{player?.name.substring(0, 7)}</div>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <Image
          src={teamB.flag || default_escudo}
          width={20}
          height={20}
          alt={teamB.name}
        />{" "}
        <div className="ml-5">{teamB.name}</div>
      </div>
      <div>
        <p className="text-center font-semibold mb-4">Suplentes</p>
        <div className="flex justify-center items-center mb-4">
          <div className="flex">
            <Image
              src={teamA.flag || default_escudo}
              width={20}
              height={20}
              alt={teamA.name}
            />{" "}
            <div className="ml-5 text-sm">{teamA.name}</div>
          </div>
          <div className="flex ml-20">
            <Image
              src={teamB.flag || default_escudo}
              width={20}
              height={20}
              alt={teamB.name}
            />{" "}
            <div className="ml-5">{teamB.name}</div>
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col gap-3 justify-center min-h-[100px] border-gray-400 rounded-2xl p-4">
            {subPlayers.map((player: any) => {
              const goals =
                match.scorersA?.filter((scorer: any) => scorer === player?.id)
                  .length || 0;
              const assists =
                match.assistersA?.filter(
                  (assister: any) => assister === player?.id,
                ).length || 0;
              const yellowCards =
                match.yellowPlayersA?.filter(
                  (yellow: any) => yellow === player?.id,
                ).length || 0;
              const redCards =
                match.redPlayersA?.filter((red: any) => red === player?.id)
                  .length || 0;
              const isSubIn = match.finalFormacionA.starters.some(
                (starter: any) => starter === player?.id,
              );

              return (
                <div
                  key={player?.id}
                  style={{ fontSize: "12px" }}
                  className="text-black px-4 py-2 rounded-2xl font-bold relative"
                >
                  <div className="flex">
                    <div>{player?.dorsal}</div>
                    {match.redPlayersA.includes(player.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
                    )}
                    {isSubIn && (
                      <div className="absolute border- border-black w-[15px] h-[15px] rounded-full top-1 right-0 z-10 icon-arrow-up" />
                    )}
                    {match.yellowPlayersA.includes(player?.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-1 z-10" />
                    )}
                    {match.yellowPlayersA.includes(player?.id) &&
                      yellowCards == 2 && (
                        <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-2 z-10" />
                      )}
                    {match.assistersA.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 right-0 z-10 text-[12px] text-black flex">
                        {" "}
                        {assists} A
                      </div>
                    )}
                    {match.scorersA.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 left-0 z-10 text-[12px] text-black flex">
                        {" "}
                        {goals} G
                      </div>
                    )}
                    <Image
                      className="rounded-full relative ml-2"
                      src={player?.image || default_profile}
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
          <div className="flex flex-col ml-auto gap-3 justify-center min-h-[100px]">
            {subPlayers2.map((player: any) => {
              const goals =
                match.scorersB?.filter((scorer: any) => scorer === player?.id)
                  .length || 0;
              const assists =
                match.assistersB?.filter(
                  (assister: any) => assister === player?.id,
                ).length || 0;
              const yellowCards =
                match.yellowPlayersB?.filter(
                  (yellow: any) => yellow === player?.id,
                ).length || 0;
              const redCards =
                match.redPlayersB?.filter((red: any) => red === player?.id)
                  .length || 0;
              const isSubIn = match.finalFormacionB.starters.some(
                (starter: any) => starter === player?.id,
              );

              return (
                <div
                  key={player?.id}
                  style={{ fontSize: "12px" }}
                  className="text-black px-4 py-2 rounded-2xl font-bold relative"
                >
                  <div className="flex">
                    <div>{player?.dorsal}</div>

                    {match.redPlayersB.includes(player?.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-red-500 rounded-full top-1 left-3 z-10" />
                    )}
                    {isSubIn && (
                      <div className="absolute w-[15px] h-[15px] rounded-full top-1 right-0 z-10 icon-arrow-up" />
                    )}
                    {match.yellowPlayersB.includes(player?.id) && (
                      <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-1 z-10" />
                    )}
                    {match.yellowPlayersB.includes(player?.id) &&
                      yellowCards == 2 && (
                        <div className="absolute w-[15px] h-[15px] bg-yellow-500 rounded-full top-1 left-2 z-10" />
                      )}
                    {match.assistersB.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 right-0 z-10 text-[12px] text-black flex">
                        {" "}
                        {assists} A
                      </div>
                    )}
                    {match.scorersB.includes(player?.id) && (
                      <div className="absolute w-[30px] h-[15px] rounded-full bottom-4 left-0 z-10 text-[12px] text-black flex">
                        {" "}
                        {goals} G
                      </div>
                    )}
                    <Image
                      className="rounded-full relative ml-2"
                      src={player?.image || default_profile}
                      width={40}
                      height={40}
                      alt={player?.name}
                    />{" "}
                    <div>{player.name}</div>
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
