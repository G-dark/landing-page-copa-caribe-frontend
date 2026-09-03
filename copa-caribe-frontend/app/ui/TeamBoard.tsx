"use client";

import { useMemo } from "react";

interface Position {
  id: string;
  top: number;
  left: number;
}

export default function TeamBoard({
  distribution,
  totalPlayers,
  starters,
  setStarters,
  subPlayers,
  setSubPlayers,
}: {
  distribution: string;
  totalPlayers: number;

  starters: any;

  setStarters: (value: any | ((prev: any) => any)) => void;

  subPlayers: any[];

  setSubPlayers: (value: any[] | ((prev: any[]) => any[])) => void;
}) {
  const isWellFormed = (distribution: string) => {
    const regex = /^[1-9-]+$/;

    if (!regex.test(distribution)) return false;

    const lines = distribution.split("-");

    if (lines.length > 4) return false;

    let total = 1;

    for (const line of lines) {
      total += Number(line);
    }

    return total === totalPlayers;
  };

  const positions = useMemo(() => {

    if (!isWellFormed(distribution)) return [];

    const lines = distribution.split("-");

    const verticalPositions = [220, 160, 100, 40];

    const generatedPositions: Position[] = [];

    generatedPositions.push({
      id: "gk",
      top: 260,
      left: 190,
    });

    lines.forEach((line, lineIndex) => {
      const amount = Number(line);

      for (let i = 0; i < amount; i++) {
        const spacing = 380 / (amount + 1);

        generatedPositions.push({
          id: `${lineIndex}-${i}`,
          top: verticalPositions[lineIndex],
          left: spacing * (i + 1),
        });
      }
    });

    return generatedPositions;
  }, [distribution, totalPlayers]);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    positionId: string,
  ) => {
    e.preventDefault();
    const rawPlayer = e.dataTransfer.getData("player");

    if (!rawPlayer) return;

    const player = JSON.parse(rawPlayer);
    if (
      !Object.values(starters).some((starter: any) => starter.id == player.id)
    ) {
      setStarters((prev: any) => ({
        ...prev,
        [positionId]: player,
      }));
    }

    setSubPlayers((prev: any[]) => prev.filter((p) => p.id !== player.id));
  };

  const removeStarter = (positionId: string) => {
    setStarters((prev: any) => {
      const updated = { ...prev };

      delete updated[positionId];

      return updated;
    });
  };

  const removeSub = (player: any) => {
    setSubPlayers((prev: any[]) => prev.filter((p) => p.id !== player.id));
  };

  if (!isWellFormed(distribution)) {
    return (
      <div className="text-sm text-center mt-5">
        La distribución debe ser válida.
        <br />
        Ejemplos:
        <br />
        4-3-3
        <br />
        4-4-2
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[400px] h-[300px] bg-green-300 rounded-2xl border-4 border-white overflow-hidden">
        <div className="absolute w-[200px] h-[75px] border-4 border-white left-1/2 -translate-x-1/2 bottom-0">
          <div className="absolute w-[100px] h-[35px] border-4 border-white left-1/2 -translate-x-1/2 bottom-0"></div>
        </div>

        {positions.map((position) => {
          const player = starters[position.id];

          return (
            <div
              key={position.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, position.id)}
              onClick={() => {
                if (player) {
                  removeStarter(position.id);
                }
              }}
              className="absolute w-[35px] h-[35px] rounded-full bg-black text-white flex items-center justify-center font-bold cursor-pointer"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {player?.dorsal || ""}
            </div>
          );
        })}
      </div>

      <div className="w-full">
        <p className="text-center font-semibold mb-4">Titulares</p>

        <div className="flex flex-wrap gap-3 justify-center max-w-[500px]">
          {Object.entries(starters).map(([positionId, player]: any) => (
            <div
              key={positionId}
              className="bg-black text-white px-4 py-2 rounded-2xl shadow-lg flex gap-2 items-center"
            >
              <span className="font-bold">#{player.dorsal}</span>

              <span className="text-sm opacity-80">{positionId}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="text-center font-semibold mb-4">Suplentes</p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            const rawPlayer = e.dataTransfer.getData("player");

            if (!rawPlayer) return;

            const player = JSON.parse(rawPlayer);

            const alreadyStarter = Object.values(starters).find(
              (p: any) => p.id === player.id,
            );

            if (alreadyStarter) return;

            setSubPlayers((prev: any[]) => {
              const exists = prev.find((p) => p.id === player.id);

              if (exists) return prev;

              return [...prev, player];
            });
          }}
          className="flex flex-wrap gap-3 justify-center min-h-[100px] max-w-[500px] border-2 border-dashed border-gray-400 rounded-2xl p-4"
        >
          {subPlayers.map((player: any) => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("player", JSON.stringify(player));
              }}
              onClick={() => removeSub(player)}
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl cursor-grab active:cursor-grabbing font-bold shadow-lg"
            >
              #{player.dorsal}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
