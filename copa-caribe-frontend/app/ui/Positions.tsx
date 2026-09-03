import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg";

export default function Positions({
  boardGroups,
}: {
  boardGroups: any[][];
}) {
  const groupNames = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {boardGroups.map((group, index) => (
        <div key={index} className="flex flex-col">
          <h4 className="mb-2 text-center text-base">
            Grupo {groupNames[index]}
          </h4>

          <table className="border border-gray-300 border-collapse text-sm shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2">#</th>
                <th className="border border-gray-300 px-3 py-2">
                  Escudo
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left min-w-[160px]">
                  Club
                </th>
                <th className="border border-gray-300 px-3 py-2">PJ</th>
                <th className="border border-gray-300 px-3 py-2">PG</th>
                <th className="border border-gray-300 px-3 py-2">PE</th>
                <th className="border border-gray-300 px-3 py-2">PP</th>
                <th className="border border-gray-300 px-3 py-2">Pts</th>
                <th className="border border-gray-300 px-3 py-2">GF</th>
                <th className="border border-gray-300 px-3 py-2">GC</th>
                <th className="border border-gray-300 px-3 py-2">DG</th>
                <th className="border border-gray-300 px-3 py-2">TA</th>
                <th className="border border-gray-300 px-3 py-2">TR</th>
              </tr>
            </thead>

            <tbody>
              {group.map((team: any, teamIndex: number) => (
                <tr
                  key={teamIndex}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="border border-gray-300 px-3 py-2">
                    {teamIndex + 1}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    <div className="flex justify-center">
                      <Image
                        src={team.team?.flag || default_escudo}
                        alt={team.team?.name}
                        width={24}
                        height={24}
                      />
                    </div>
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                    {team.team?.name}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.gamesPlayed}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.gamesWon}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.gamesDraw}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.gamesLost}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 font-semibold">
                    {team?.points}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.goalsP}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.goalsC}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.goalDifference}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.yellowCards}
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {team?.redCards}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}