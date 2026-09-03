"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTournamentByID } from "../lib/Services/TournamentService";
import { getPlayerByID } from "../lib/Services/PlayerService";
import {
  addEvent,
  addPenalty,
  deleteEvent,
  deletePenalty,
  editEvent,
  editPenalty,
  getMatchByID,
  updateMatch,
} from "../lib/Services/MatchService";
import { getTeamByID } from "../lib/Services/TeamService";
import NavBar from "../ui/NavBar";
import Modal from "../ui/Modal";
import MiniCard from "../ui/MiniCard";
import MiniCard2 from "../ui/Minicard2";
import Modal2 from "../ui/Modal2";
import Formacion from "../ui/Formacion";
import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg";

export default function Penales() {
  const searchParams = useSearchParams();
  const matchID = searchParams.get("matchID");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);
  const [teamA, setTeamA] = useState<any>(null);
  const [teamB, setTeamB] = useState<any>(null);
  const [tournament, setTournament] = useState<any>(null);
  const [teamsNTS, setTeamsNTS] = useState<any>([]);
  const [starter, setStarter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [isOpen2, setOpen2] = useState(false);
  const openModal2 = () => setOpen2(true);
  const closeModal2 = () => setOpen2(false);
  const [isOpen3, setOpen3] = useState(false);
  const openModal3 = () => setOpen3(true);
  const closeModal3 = () => setOpen3(false);
  const [isOpen4, setOpen4] = useState(false);
  const openModal4 = () => setOpen4(true);
  const closeModal4 = () => setOpen4(false);
  const [isOpen5, setOpen5] = useState(false);
  const openModal5 = () => setOpen5(true);
  const closeModal5 = () => setOpen5(false);
  const [teamsTS, setTeamsTS] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [playersTS, setPlayersTS] = useState<any>([]);
  const [starters, setStarters] = useState<any>([]);
  const [subPlayers, setSubPlayers] = useState<any>([]);
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [distribution, setDistribution] = useState<any>("");
  const [penaltyTakersA, setPenaltyTakersA] = useState<any>([]);
  const [penaltyTakersB, setPenaltyTakersB] = useState<any>([]);
  const [penaltiesA, setPenaltiesA] = useState<any>([]);
  const [penaltiesB, setPenaltiesB] = useState<any>([]);
  const [penaltyResult, setPenaltyResult] = useState("");
  const [indexP, setIndexP] = useState<any>([]);
  const [selectedPenaltiesA, setSelectedPenaltiesA] = useState<any>({});
  const [selectedPenaltiesB, setSelectedPenaltiesB] = useState<any>({});

  useEffect(() => {
    determineTeams();
  }, [teamsTS]);

  const determineTeams = async () => {
    if (teamsTS[0]) {
      if (teamA.id == teamsTS[0].id) {
        setStarters(
          await translateToPositions(
            match.finalFormacionA.starters,
            match.formacionA.distribution,
          ),
        );
        let subsA = [];
        for (let sub of match.finalFormacionA.subPlayers) {
          const res = await getPlayerByID(sub, localStorage.getItem("token")!);
          const data = await res.json();
          subsA.push(data[0]);
        }
        setSubPlayers(subsA);
        setDistribution(match.formacionA.distribution);
      }

      if (teamB.id == teamsTS[0].id) {
        setStarters(
          await translateToPositions(
            match.finalFormacionB.starters,
            match.formacionB.distribution,
          ),
        );

        let subsB = [];
        for (let sub of match.finalFormacionB.subPlayers) {
          const res = await getPlayerByID(sub, localStorage.getItem("token")!);
          const data = await res.json();
          subsB.push(data[0]);
        }
        setSubPlayers(subsB);
        setDistribution(match.formacionB.distribution);
      }
    }
  };
  useEffect(() => {
    fetchMatch();
  }, []);

  useEffect(() => {
    fetchMatch();
  }, [refresh]);

  const fetchMatch = async () => {
    setLoading(true);
    const res = await getMatchByID(matchID!);
    if (res.status == 401) {
      router.push("/login?refreshToken=" + true);
    }
    const data = await res.json();
    setMatch(data[0]);

    const resA = await getTeamByID(data[0].teamA);
    const dataA = await resA.json();
    setTeamA(dataA[0]);

    const resB = await getTeamByID(data[0].teamB);
    const dataB = await resB.json();
    setTeamB(dataB[0]);

    const resTN = await getTournamentByID(data[0].tournament);
    const dataTN = await resTN.json();
    if (data[0].penaltyStarter == "A") {
      setStarter(dataA[0].name);
    } else if (data[0].penaltyStarter == "B") {
      setStarter(dataB[0].name);
    } else if (data[0].penaltyStarter == "NA") {
      setStarter("NA");
    }

    setTournament(dataTN[0]);
    setTeamsNTS([dataA[0], dataB[0]]);
    setPenaltiesA(data[0].penalties.filter((p: any) => p.team === "A"));
    setPenaltiesB(data[0].penalties.filter((p: any) => p.team === "B"));
    if (data[0].penaltyTakersA?.length > 0) {
      let takersA = [];
      for (let taker of data[0].penaltyTakersA) {
        const res = await getPlayerByID(
          taker.player,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data2 = await res.json();
        takersA.push({ player: data2[0], penalty: taker.penalty });
      }

      setPenaltyTakersA(takersA);
    }

    if (data[0].penaltyTakersB?.length > 0) {
      let takersB = [];
      for (let taker of data[0].penaltyTakersB) {
        const res = await getPlayerByID(
          taker.player,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data2 = await res.json();
        takersB.push({ player: data2[0], penalty: taker.penalty });
      }

      setPenaltyTakersB(takersB);
    }

    setLoading(false);
  };

  // select who start with the penalty shoots
  const selectStarter = async () => {
    if (teamsTS.length == 1) {
      const starter = teamsTS[0].id == teamA.id ? "A" : "B";
      const match = { match: { penaltyStarter: starter } };
      const res = await updateMatch(
        JSON.stringify(match),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();

      if ("success" in data) {
        closeModal();
        setRefresh((prev) => !prev);
        setPlayersTS([]);
        setTeamsTS([]);
      } else {
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        setMessage("Error al seleccionar el equipo");
      }
    }
  };

  const registerPenalty = async (index: number) => {
    if (selectedPenaltiesA[index]) {
      const penalty = {
        player: penaltyTakersA[index]?.player.id,
        goalkeeper: match.finalFormacionB.starters[0],
        result: selectedPenaltiesA[index],
        team: "A",
      };
      const res = await addPenalty(
        JSON.stringify({ penalty }),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        setRefresh((prev) => !prev);
      } else {
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
      }
      setSelectedPenaltiesA({});
    }
    if (selectedPenaltiesB[index]) {
      const penalty = {
        player: penaltyTakersB[index]?.player.id,
        goalkeeper: match.finalFormacionB.starters[0],
        result: selectedPenaltiesB[index],
        team: "B",
      };
      const res = await addPenalty(
        JSON.stringify({ penalty }),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        setRefresh((prev) => !prev);
      } else {
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
      }
      setSelectedPenaltiesB({});
    }
  };
  const editPenaltyF = async (ID: string) => {
    const penal = match.penalties.find((penal: any) => penal.id == ID);
    const penalty = {
      goalkeeper: penal.goalkeeper,
      team: penal.team,
      result: penaltyResult,
      player: penal.player,
    };
    const res = await editPenalty(
      ID,
      matchID!,
      JSON.stringify({ penalty }),
      localStorage.getItem("token")!,
    );
    const data = await res.json();
    if ("success" in data) {
      closeModal3();
      setRefresh((prev) => !prev);
    } else {
      setMessage3("Error: Ha ocurrido un error");
      if (res.status == 401) {
        router.push("/login?refreshToken=" + true);
      }
    }
  };
  const deletePenaltyF = async (ID: string) => {
    if (teamsTS[0]) {
      if (teamA.id == teamsTS[0].id) {
        const penaltyTakers = match.penaltyTakersA.filter(
          (pt: any) => pt.penalty !== ID,
        );
        const res = await deletePenalty(
          ID,
          matchID!,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data = await res.json();
        const match1 = { match: { penaltyTakersA: penaltyTakers } };
        const res1 = await updateMatch(
          JSON.stringify(match1),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data1 = await res1.json();
        if ("success" in data && "success" in data1) {
          closeModal4();
          setRefresh((prev) => !prev);
        } else {
          setMessage4("Error: Ha ocurrido un error");
        }
      }

      if (teamB.id == teamsTS[0].id) {
        const penaltyTakers = match.penaltyTakersB.filter(
          (pt: any) => pt.penalty !== ID,
        );
        const res = await deletePenalty(
          ID,
          matchID!,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data = await res.json();
        const match1 = { match: { penaltyTakersB: penaltyTakers } };
        const res1 = await updateMatch(
          JSON.stringify(match1),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data1 = await res1.json();
        if ("success" in data && "success" in data1) {
          closeModal4();
          setRefresh((prev) => !prev);
        } else {
          setMessage4("Error: Ha ocurrido un error");
        }
      }
    }
  };

  const registerPlayers = async () => {
    if (teamsTS[0]) {
      if (teamA.id == teamsTS[0].id) {
        const penaltyTakers = playersTS.map((player: any) => {
          return { player: player.id, penalty: null };
        });
        if (
          penaltyTakers.every((taker: any) =>
            match.finalFormacionA.starters.includes(taker.player),
          )
        ) {
          const match1 = { match: { penaltyTakersA: penaltyTakers } };
          const res = await updateMatch(
            JSON.stringify(match1),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            closeModal2();
            setRefresh((prev) => !prev);
            setTeamsTS([]);
            setPlayersTS([]);
            setMessage2("");
          } else {
            setMessage2("Error al registrar los jugadores");
            if (res.status == 401) {
              router.push("/login?refreshToken=" + true);
            }
          }
        } else {
          setMessage2("Error: solo jugadores titulares");
        }
      }

      if (teamB.id == teamsTS[0].id) {
        const penaltyTakers = playersTS.map((player: any) => {
          return { player: player.id, penalty: null };
        });

        if (
          penaltyTakers.every((taker: any) =>
            match.finalFormacionB.starters.includes(taker.player),
          )
        ) {
          const match1 = { match: { penaltyTakersB: penaltyTakers } };
          const res = await updateMatch(
            JSON.stringify(match1),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            closeModal2();
            setRefresh((prev) => !prev);
            setTeamsTS([]);
            setPlayersTS([]);
            setMessage2("");
          } else {
            setMessage2("Error al registrar los jugadores");
            if (res.status == 401) {
              router.push("/login?refreshToken=" + true);
            }
          }
        } else {
          setMessage2("Error: solo jugadores titulares");
        }
      }
    }
  };

  const addPlayers = async () => {
    if (teamsTS[0]) {
      if (teamA.id == teamsTS[0].id) {
        let penaltyTakers = match.penaltyTakersA;
        penaltyTakers = penaltyTakers.concat(
          playersTS.map((player: any) => {
            return { player: player.id, penalty: null };
          }),
        );

        const match1 = { match: { penaltyTakersA: penaltyTakers } };
        const res = await updateMatch(
          JSON.stringify(match1),
          matchID!,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data = await res.json();
        if ("success" in data) {
          closeModal5();
          setRefresh((prev) => !prev);
          setPlayersTS([]);
          setTeamsTS([]);
        } else {
          setMessage2("Error al agregar los jugadores");
        }
      }

      if (teamB.id == teamsTS[0].id) {
        let penaltyTakers = match.penaltyTakersB;
        penaltyTakers = penaltyTakers.concat(
          playersTS.map((player: any) => {
            return { player: player.id, penalty: null };
          }),
        );
        const match2 = { match: { penaltyTakersB: penaltyTakers } };
        const res = await updateMatch(
          JSON.stringify(match2),
          matchID!,
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data = await res.json();
        if ("success" in data) {
          closeModal5();
          setRefresh((prev) => !prev);
          setPlayersTS([]);
          setTeamsTS([]);
        } else {
          setMessage2("Error al agregar los jugadores");
        }
      }
    }
  };

  const translateToPositions = async (players: any, distribution: string) => {
    if (!players) return;

    let startersInPositions: any = {};
    const res1 = await getPlayerByID(
      players[0],
      localStorage.getItem("token")!,
    );
    if (res1.status == 401) {
      router.push("/login?refreshToken=" + true);
    }
    const data1 = await res1.json();
    startersInPositions["gk"] = data1[0];
    let index = 1,
      j = 0;
    for (let line of distribution.split("-")) {
      for (let i = 0; i < Number(line); i++) {
        const res = await getPlayerByID(
          players[index],
          localStorage.getItem("token")!,
        );
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        const data = await res.json();

        startersInPositions[`${j}-${i}`] = data[0];
        index++;
      }
      j++;
    }
    return startersInPositions;
  };

  const mustRegist = (index: number) => {
    const findPenaltyB = penaltiesB.find(
      (p: any) =>
        p.id === penaltyTakersB[index]?.penalty &&
        p.player === penaltyTakersB[index]?.player.id,
    );

    const findPenaltyA = penaltiesA.find(
      (p: any) =>
        p.id === penaltyTakersA[index]?.penalty &&
        p.player === penaltyTakersA[index]?.player.id,
    );

    if (findPenaltyA && !findPenaltyB) {
      return true;
    }
    if (findPenaltyA && findPenaltyB) {
      return false;
    }

    if (!findPenaltyA && !findPenaltyB) {
      return true;
    }

    if (!findPenaltyA && findPenaltyB) {
      return true;
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <div className="flex flex-col justify-center items-center">
          <h1 className="mt-20 text-5xl font-bold mb-10">Penales</h1>
          <div className="flex justify-center items-center mb-10 relative">
            <div className="flex flex-col justify-center items-center mr-20">
              <Image
                src={teamA.flag || default_escudo}
                width={40}
                height={40}
                alt={teamA.name}
              />
              <div className="mt-auto text-center font-semibold">
                {teamA.name}
              </div>
            </div>

            <div className="flex justify-center items-start absolute top-1/2 left-40">
              <div className="flex text-4xl">{match.penaltieResult}</div>
              {match.status + " " + match.status == "En vivo"
                ? match.eventos.at(-1).minute
                : ""}
            </div>

            <div className="flex flex-col justify-center items-center ml-20">
              <Image
                src={teamB.flag || default_escudo}
                width={40}
                height={40}
                alt={teamB.name}
              />
              <div className=" text-center font-semibold">{teamB.name}</div>
            </div>
          </div>

          <label htmlFor="starter">Quien empieza</label>
          <input
            className="cursor-pointer text-center bg-gray-300 rounded-2xl mb-10"
            onClick={openModal}
            type="text"
            value={starter}
            readOnly
          />

          <div className="cursor-pointer mb-10" onClick={openModal2}>
            Seleccionar tiradores ⚽
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Turno</th>

                  <th className="border p-2">{teamA?.name}</th>
                  <th className="border p-2">Resultado</th>

                  <th className="border p-2">{teamB.name}</th>
                  <th className="border p-2">Resultado</th>
                  <th className="border p-2">Registrar</th>
                  <th className="border p-2">Editar</th>
                  <th className="border p-2">Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {Array.from({
                  length: Math.max(
                    penaltyTakersA.length,
                    penaltyTakersB.length,
                  ),
                }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="border p-2 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="border p-2">
                      {penaltyTakersA[index]?.player.name || "-"}
                    </td>

                    <td className="border p-2">
                      <select
                        disabled={
                          penaltiesA?.find(
                            (p: any) =>
                              p.player === penaltyTakersA[index]?.player.id &&
                              p.id === penaltyTakersA[index]?.penalty,
                          ) || !penaltyTakersA[index]?.player
                        }
                        className="w-full border rounded px-2 py-1"
                        value={selectedPenaltiesA[index] || ""}
                        onChange={(e) =>
                          setSelectedPenaltiesA((prev: any) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        <option value="Goal">⚽ Gol</option>
                        <option value="Saved">🧤 Atajado</option>
                        <option value="Fail">❌ Fallado</option>
                      </select>
                    </td>

                    <td className="border p-2">
                      {penaltyTakersB[index]?.player.name || "-"}
                    </td>

                    <td className="border p-2">
                      <select
                        disabled={
                          penaltiesB?.find(
                            (p: any) =>
                              p.id === penaltyTakersB[index]?.penalty &&
                              p.player === penaltyTakersB[index]?.player.id,
                          ) || !penaltyTakersB[index]?.player
                        }
                        className="w-full border rounded px-2 py-1"
                        value={selectedPenaltiesB[index] || ""}
                        onChange={(e) =>
                          setSelectedPenaltiesB((prev: any) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Seleccionar</option>
                        <option value="Goal">⚽ Gol</option>
                        <option value="Saved">🧤 Atajado</option>
                        <option value="Fail">❌ Fallado</option>
                      </select>
                    </td>
                    <td>
                      {mustRegist(index) && (
                        <button
                          onClick={() => registerPenalty(index)}
                          className="bg-blue-500 rounded-2xl hover:bg-blue-800 px-2 ml-2"
                        >
                          Registrar
                        </button>
                      )}
                    </td>
                    {((!mustRegist(index) ||
                      !penaltyTakersB[index]?.player ||
                      !penaltyTakersA[index]?.player) && (
                        <td
                          onClick={() => {
                            setIndexP([
                              penaltyTakersA[index]?.penalty,
                              penaltyTakersB[index]?.penalty,
                            ]);
                            openModal3();
                          }}
                          className="ml-2 text-center p-2 icon-pencil2"
                        ></td>
                      ))}
                    {((!mustRegist(index) ||
                      !penaltyTakersB[index]?.player ||
                      !penaltyTakersA[index]?.player) &&(
                        <td
                          onClick={() => {
                            setIndexP([
                              penaltyTakersA[index]?.penalty,
                              penaltyTakersB[index]?.penalty,
                            ]);
                            openModal4();
                          }}
                          className="ml-2 text-center p-2 icon-trash2 disabled:bg-gray-300"
                        ></td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              onClick={() => {
                openModal5();
                setMessage2("");
              }}
              className="text-4xl cursor-pointer"
            >
              +
            </div>
          </div>
        </div>
        {/* selecciona quien empieza pateando */}
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="flex flex-col gap-4 mt-4 justify-center items-center">
            <h2>Selecciona el equipo que empieza</h2>
            {teamsTS.length > 0
              ? teamsTS.map((team: any, index: number) => {
                  return (
                    <MiniCard
                      key={index}
                      item={team}
                      index={index}
                      showNumbers={false}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                    />
                  );
                })
              : teamsNTS.map((team: any, index: number) => {
                  return (
                    <MiniCard2
                      key={index}
                      item={team}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                      setMessage={setMessage}
                    />
                  );
                })}

            <div className="text-sm text-red-500">{message}</div>

            <button
              onClick={selectStarter}
              className="bg-blue-300 hover:bg-blue-500 rounded-2xl p-2"
            >
              Seleccionar
            </button>
          </div>
        </Modal>
        {/* modal para editar un penal */}
        <Modal isOpen={isOpen3} onClose={closeModal3}>
          <div className="flex flex-col gap-4 mt-4 justify-center items-center">
            <h2>Editar penal</h2>
            <h2>Selecciona el equipo al cual le deseas editar el penal</h2>
            {teamsTS.length > 0
              ? teamsTS.map((team: any, index: number) => {
                  return (
                    <MiniCard
                      key={index}
                      item={team}
                      index={index}
                      showNumbers={false}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                    />
                  );
                })
              : teamsNTS.map((team: any, index: number) => {
                  return (
                    <MiniCard2
                      key={index}
                      item={team}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                      setMessage={setMessage}
                    />
                  );
                })}
            <select
              value={penaltyResult}
              onChange={(e) => setPenaltyResult(e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="Goal">⚽ Gol</option>
              <option value="Saved">🧤 Atajado</option>
              <option value="Fail">❌ Fallado</option>
            </select>
            <div className="text-sm text-red-500">{message}</div>

            <button
              onClick={() => {
                editPenaltyF(teamsTS[0].id == teamA.id ? indexP[0] : indexP[1]);
                setTeamsTS([]);
              }}
              className="bg-blue-300 hover:bg-blue-500 rounded-2xl p-2"
            >
              Editar
            </button>
          </div>
        </Modal>
        {/* modal para eliminar un penal */}
        <Modal isOpen={isOpen4} onClose={closeModal4}>
          <div className="flex flex-col gap-4 mt-4 justify-center items-center">
            <h2>Eliminar penal</h2>
            <h2>Selecciona el equipo al cual le deseas eliminar el penal</h2>
            {teamsTS.length > 0
              ? teamsTS.map((team: any, index: number) => {
                  return (
                    <MiniCard
                      key={index}
                      item={team}
                      index={index}
                      showNumbers={false}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                    />
                  );
                })
              : teamsNTS.map((team: any, index: number) => {
                  return (
                    <MiniCard2
                      key={index}
                      item={team}
                      teams={teamsTS}
                      setTeams={setTeamsTS}
                      setMessage={setMessage}
                    />
                  );
                })}

            <div className="text-sm text-red-500">{message4}</div>

            <button
              onClick={() =>
                deletePenaltyF(
                  teamsTS[0].id == teamA.id ? indexP[0] : indexP[1],
                )
              }
              className="bg-blue-300 hover:bg-blue-500 rounded-2xl p-2"
            >
              Eliminar
            </button>
          </div>
        </Modal>
        {/* selecciona los tiradores iniciales */}
        <Modal2 isOpen={isOpen2} onClose={closeModal2}>
          <div className="flex flex-col justify-center items-center">
            <div>¿En cual equipo vas a seleccionar los jugadores?</div>
            <div className="flex">
              {teamsTS.length > 0
                ? teamsTS.map((team: any, index: number) => {
                    return (
                      <MiniCard
                        key={index}
                        item={team}
                        index={index}
                        showNumbers={false}
                        teams={teamsTS}
                        setTeams={setTeamsTS}
                      />
                    );
                  })
                : teamsNTS.map((team: any, index: number) => {
                    return (
                      <MiniCard2
                        key={index}
                        item={team}
                        teams={teamsTS}
                        setTeams={setTeamsTS}
                        setMessage={setMessage}
                      />
                    );
                  })}
            </div>

            {teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div className="flex flex-wrap">
                  {playersTS.map((player: any) => (
                    <div className="bg-blue-500 p-2 ml-1 rounded-2xl">
                      {player.dorsal}
                    </div>
                  ))}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
              </div>
            )}

            {teamsTS.length !== 0 && (
              <div className="mt-6 flex flex-col items-center w-full">
                <Formacion
                  distribution={distribution}
                  totalPlayers={match.rules.players}
                  starters={starters}
                  subPlayers={subPlayers}
                  setSelect1={setPlayersTS}
                  match={match}
                  team={teamsTS[0].id === teamA.id ? "A" : "B"}
                />
              </div>
            )}
            <div
              className={
                message2.includes("Error") ? "text-sm text-red-500" : "text-sm"
              }
            >
              {message2}
            </div>

            {teamsTS.length !== 0 && (
              <>
                <button
                  onClick={registerPlayers}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}
          </div>
        </Modal2>
        {/* modal para agregar más jugadores */}
        <Modal2 isOpen={isOpen5} onClose={closeModal5}>
          <div className="flex flex-col justify-center items-center">
            <div>¿En cual equipo vas a seleccionar los jugadores?</div>
            <div className="flex">
              {teamsTS.length > 0
                ? teamsTS.map((team: any, index: number) => {
                    return (
                      <MiniCard
                        key={index}
                        item={team}
                        index={index}
                        showNumbers={false}
                        teams={teamsTS}
                        setTeams={setTeamsTS}
                      />
                    );
                  })
                : teamsNTS.map((team: any, index: number) => {
                    return (
                      <MiniCard2
                        key={index}
                        item={team}
                        teams={teamsTS}
                        setTeams={setTeamsTS}
                        setMessage={setMessage}
                      />
                    );
                  })}
            </div>

            {teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div className="flex flex-wrap">
                  {playersTS.map((player: any) => (
                    <div className="bg-blue-500 p-2 ml-1 rounded-2xl">
                      {player.dorsal}
                    </div>
                  ))}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
              </div>
            )}

            {teamsTS.length !== 0 && (
              <div className="mt-6 flex flex-col items-center w-full">
                <Formacion
                  distribution={distribution}
                  totalPlayers={match.rules.players}
                  starters={starters}
                  subPlayers={subPlayers}
                  setSelect1={setPlayersTS}
                  match={match}
                  team={teamsTS[0].id === teamA.id ? "A" : "B"}
                />
              </div>
            )}
            <div
              className={
                message2.includes("Error") ? "text-sm text-red-500" : "text-sm"
              }
            >
              {message2}
            </div>

            {teamsTS.length !== 0 && (
              <>
                <button
                  onClick={addPlayers}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Agregar
                </button>
              </>
            )}
          </div>
        </Modal2>
      </>
    );
  }
}
