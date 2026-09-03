"use client";
import { useSearchParams } from "next/navigation";
import { getTournamentByID } from "../lib/Services/TournamentService";
import { getTeamByID } from "../lib/Services/TeamService";
import { useEffect, useRef, useState } from "react";
import { getPlayerByID } from "../lib/Services/PlayerService";
import NavBar from "../ui/NavBar";
import EscarapelaJ from "../ui/EscarapelaJ";
import EscarapelaE from "../ui/EscarapelaE";
import { useReactToPrint } from "react-to-print";
export default function Escarapelas() {
  const searchParams = useSearchParams();
  const teamID = searchParams.get("teamID");
  const tournamentID = searchParams.get("tournamentID");
  const [tournament, setTournament] = useState<any>({});
  const [team, setTeam] = useState<any>({});
  const [players, setPlayers] = useState<any>([]);
  const contentRef = useRef<any>(null);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const handleToPrint = useReactToPrint({ contentRef });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTournamentByID(tournamentID!);
    const data = await res.json();
    setTournament(data[0]);
    const res2 = await getTeamByID(teamID!);
    const data2 = await res2.json();
    setTeam(data2[0]);
    console.log(data2[0]);
    const playersInTournament = data[0].playersInTournament.find(
      (pit: any) => pit.team == teamID,
    );
    let playersTemp = [];

    for (let player of playersInTournament.players) {
      const res3 = await getPlayerByID(player, localStorage.getItem("token")!);
      const data3 = await res3.json();
      playersTemp.push(data3[0]);
    }
    setPlayers(playersTemp);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col flex-wrap justify-center items-center">
        <div
          onClick={scrollToBottom}
          className="icon-arrow-down2 bg-blue-500 rounded-full fixed top-25 left-40 p-3 cursor-pointer"
        ></div>
        <div
          ref={contentRef}
          className="flex flex-col justify-center items-center mt-25"
        >
          {players.map((player: any) => (
            <div
              key={player?.id}
              className="print:flex print:justify-center print:items-center"
              style={{
                width: "210mm",
                height: "297mm",
                pageBreakAfter: "always",
              }}
            >
              <EscarapelaJ
                item={player}
                tournament={tournament}
                team={team}
              />
            </div>
          ))}

          {team.coach?.map((coach: any) => (
            <div
              key={coach?.id}
              className="print:flex print:justify-center print:items-center"
              style={{
                width: "210mm",
                height: "297mm",
                pageBreakAfter: "always",
              }}
            >
              <EscarapelaE
                item={coach}
                tournament={tournament}
                team={team}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleToPrint}
          className="bg-blue-500 rounded-2xl p-2 hover:bg-blue-600 fixed top-50 right-150"
        >
          Imprimir
        </button>
      </div>
    </>
  );
}
