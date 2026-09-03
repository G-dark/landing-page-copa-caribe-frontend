"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  addReferee,
  deleteReferee,
  editReferee,
  getMatchByID,
  updateMatch,
} from "../lib/Services/MatchService";
import { getTeamByID } from "../lib/Services/TeamService";
import default_escudo from "../../public/default_escudo.jpg";
import NavBar from "../ui/NavBar";
import Modal2 from "../ui/Modal2";
import MiniCard2 from "../ui/Minicard2";
import MiniCard from "../ui/MiniCard";
import { getTournamentByID } from "../lib/Services/TournamentService";
import { getPlayerByID } from "../lib/Services/PlayerService";
import TeamBoard from "../ui/TeamBoard";
import MiniCard5 from "../ui/MiniCard5";
import Modal from "../ui/Modal";
import { useRouter } from "next/navigation";
import Formaciones from "../ui/Formaciones";
import { useHome } from "../lib/Contexts/HomeContexts";
import { table } from "console";

export default function matchDetail() {
  const searchParams = useSearchParams();
  const matchID = searchParams.get("id");
  const router = useRouter();
  const { rol } = useHome();

  // variables
  const [teamA, setTeamA] = useState<any>({});
  const [teamB, setTeamB] = useState<any>({});
  const [match, setMatch] = useState<any>({});
  const [menu, setMenu] = useState("stats");
  const [dateH, setDateH] = useState("");
  const [dateD, setDateD] = useState("");
  const [distribution, setDistribution] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("Central");
  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [loading, setLoading] = useState(true);
  const [teamsNTS, setTeamsNTS] = useState<any>([]);
  const [teamsTS, setTeamsTS] = useState<any>([]);
  const [playersNTS, setPlayersNTS] = useState<any>([]);
  const [starters, setStarters] = useState<any>([]);
  const [subPlayers, setSubPlayers] = useState<any>([]);
  const [showBoard, setShowBoard] = useState(false);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [startersA, setStartersA] = useState<any>([]);
  const [subPlayersA, setSubPlayersA] = useState<any>([]);
  const [startersB, setStartersB] = useState<any>([]);
  const [subPlayersB, setSubPlayersB] = useState<any>([]);
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setTeamsTS([]);
    setDistribution("");
    setShowBoard(false);
    setPlayersNTS([]);
    setStarters([]);
    setSubPlayers([]);
  };
  const [isOpen2, setOpen2] = useState(false);
  const openModal2 = () => setOpen2(true);
  const closeModal2 = () => {
    setMessage3("");
    setOpen2(false);
  };
  const [isOpen3, setOpen3] = useState(false);
  const openModal3 = () => setOpen3(true);
  const closeModal3 = () => {
    setMessage4("");
    setOpen3(false);
  };
  const [isOpen4, setOpen4] = useState(false);
  const openModal4 = () => setOpen4(true);
  const closeModal4 = () => setOpen4(false);
  const [penaltiesA, setPenaltiesA] = useState<any>([]);
  const [penaltiesB, setPenaltiesB] = useState<any>([]);

  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    fetchMatch();
  }, []);

  useEffect(() => {
    fetchMatch();
  }, [refresh]);

  useEffect(() => {
    fetchMatch();
    fetchPlayers();
  }, [teamsTS]);

  const fetchPlayers = async () => {
    if (teamsTS[0]) {
      let players = [];
      const resTN = await getTournamentByID(match.tournament);
      const tournament = await resTN.json();
      const teamInTN = tournament[0].playersInTournament.find(
        (pit: any) => pit.team == teamsTS[0].id,
      );
      for (let player of teamInTN.players) {
        const resPlayer = await getPlayerByID(
          player,
          localStorage.getItem("token")!,
        );
        const dataPlayer = await resPlayer.json();

        players.push(dataPlayer[0]);
      }

      setPlayersNTS(players);
    }
  };

  const fetchMatch = async () => {
    setLoading(true);
    const res = await getMatchByID(matchID!);
    const data = await res.json();
    setMatch(data[0]);

    const resA = await getTeamByID(data[0].teamA);
    const dataA = await resA.json();
    setTeamA(dataA[0]);

    const resB = await getTeamByID(data[0].teamB);
    const dataB = await resB.json();
    setTeamB(dataB[0]);
    const zuluDate1 = new Date(data[0].date);

    // Obtener el desplazamiento local en minutos
    const offset1 = zuluDate1.getTimezoneOffset() * 60000;
    const localTime1 = new Date(zuluDate1.getTime() - offset1);

    // Formatear a YYYY-MM-DDTHH:mm (formato válido para datetime-local)
    const datetimeLocal1 = localTime1.toISOString().slice(0, 16);
    setDateD(datetimeLocal1.split("T")[0]);
    console.log(data[0].date);
    setDateH(
      new Date(data[0].date).toLocaleString("es-co", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    setLugar(data[0].location);
    // La fecha original en formato Zulu
    const zuluDate = new Date(data[0].date);

    // Obtener el desplazamiento local en minutos
    const offset = zuluDate.getTimezoneOffset() * 60000;
    const localTime = new Date(zuluDate.getTime() - offset);

    // Formatear a YYYY-MM-DDTHH:mm (formato válido para datetime-local)
    const datetimeLocal = localTime.toISOString().slice(0, 16);

    setFecha(datetimeLocal);

    const teamsNTSlocal = [];

    for (let team of [data[0].teamA, data[0].teamB]) {
      if (user.team.includes(team)) {
        if (team == data[0].teamA) {
          teamsNTSlocal.push(dataA[0]);
        }
        if (team == data[0].teamB) {
          teamsNTSlocal.push(dataB[0]);
        }
      }
    }
    setTeamsNTS(teamsNTSlocal);
    if (
      data[0].formacionA.starters.length !== 0 &&
      data[0].formacionB.starters.length !== 0
    ) {
      setStartersA(
        await translateToPositions(
          data[0].formacionA.starters,
          data[0].formacionA.distribution,
        ),
      );
      setStartersB(
        await translateToPositions(
          data[0].formacionB.starters,
          data[0].formacionB.distribution,
        ),
      );
      let substitutesA = [];
      for (let sub of data[0].formacionA.subPlayers) {
        const res = await getPlayerByID(sub, localStorage.getItem("token")!);
        const data = await res.json();
        substitutesA.push(data[0]);
      }
      let substitutesB = [];
      for (let sub of data[0].formacionB.subPlayers) {
        const res = await getPlayerByID(sub, localStorage.getItem("token")!);
        const data = await res.json();
        substitutesB.push(data[0]);
      }
      setSubPlayersA(substitutesA);
      setSubPlayersB(substitutesB);
    }

    if (data[0].penalties) {
      let penaltiesAT = [],
        penaltiesBT = [];
      for (let taker of data[0].penaltyTakersA) {
        const res = await getPlayerByID(
          taker.player,
          localStorage.getItem("token")!,
        );
        const data2 = await res.json();
        const penalty = data[0].penalties.find(
          (penal: any) => penal.id == taker.penalty,
        );
        if (penalty) {
          penalty.player = data2[0];
          penaltiesAT.push(penalty);
        }
      }
      setPenaltiesA(penaltiesAT);

      for (let taker of data[0].penaltyTakersB) {
        const res = await getPlayerByID(
          taker.player,
          localStorage.getItem("token")!,
        );
        const data2 = await res.json();
        const penalty = data[0].penalties.find(
          (penal: any) => penal.id == taker.penalty,
        );
        if (penalty) {
          penalty.player = data2[0];
          penaltiesBT.push(penalty);
        }
      }
      setPenaltiesB(penaltiesBT);
    }

    setLoading(false);
  };

  const agregarFormacion = async () => {
    if (validateFormation()) {
      let formacion;
      const startsIDs = translatePositions(starters);
      const subIDs = subPlayers.map((subplayer: any) => subplayer.id);

      if (teamA.id == teamsTS[0].id) {
        formacion = {
          match: {
            formacionA: {
              starters: startsIDs,
              subPlayers: subIDs,
              distribution,
            },
            finalFormacionA: {
              starters: startsIDs,
              subPlayers: subIDs,
              distribution,
            },
          },
        };
        const res = await updateMatch(
          JSON.stringify(formacion),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data = await res.json();
        if ("success" in data) {
          closeModal();
        } else {
          if (res.status == 401) {
            router.push("/login?refreshToken=" + true);
          }
          setMessage2("Ha ocurrido un error");
        }
      }
      if (teamB.id == teamsTS[0].id) {
        formacion = {
          match: {
            formacionB: {
              starters: startsIDs,
              subPlayers: subIDs,
              distribution,
            },
            finalFormacionB: {
              starters: startsIDs,
              subPlayers: subIDs,
              distribution,
            },
          },
        };
        const res = await updateMatch(
          JSON.stringify(formacion),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data = await res.json();
        if ("success" in data) {
          closeModal();
        } else {
          if (res.status == 401) {
            router.push("/login?refreshToken=" + true);
          }
          setMessage2("Ha ocurrido un error");
        }
      }
    } else {
      setMessage2("Faltan jugadores en tu formación");
    }
  };

  const validateFormation = () => {
    return (
      Object.keys(starters).length !== 0 &&
      Object.keys(subPlayers).length !== 0 &&
      Object.keys(starters).length == match.rules.players
    );
  };

  const addRefereeF = async () => {
    if (validateRefereeF()) {
      const referee = { referee: { id, name, lastName, position } };
      const res = await addReferee(
        JSON.stringify(referee),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        closeModal3();
        setId("");
        setName("");
        setLastName("");
        setRefresh((prev) => !prev);
      } else {
        if (res.status == 401) {
          router.push("/login?refreshToken=" + true);
        }
        setMessage4("Error: Ha ocurrido un error");
      }
    } else {
      setMessage4("Error: Revisa los datos indicados");
    }
  };

  const editRefereeF = async (refereeID: string) => {
    if (validateDifferencesR()) {
      if (validateRefereeF()) {
        const referee = { referee: { id, name, lastName, position } };
        const res = await editReferee(
          JSON.stringify(referee),
          matchID!,
          refereeID,
          localStorage.getItem("token")!,
        );
        const data = await res.json();
        if ("success" in data) {
          closeModal4();
          setId("");
          setName("");
          setLastName("");
          setRefresh((prev) => !prev);
        } else {
          if (res.status == 401) {
            router.push("/login?refreshToken=" + true);
          }
          setMessage4("Error: Ha ocurrido un error");
        }
      } else {
        setMessage4("Error: Revisa los datos indicados");
      }
    } else {
      setMessage4("No se han detectado cambios");
    }
  };

  const deleteRefereeF = async (refereeID: string) => {
    const res = await deleteReferee(
      matchID!,
      refereeID,
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
  };

  const validateRefereeF = () => {
    let validate = false,
      validate2 = false,
      validate3 = false;

    const regExOletters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOletters2 = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOnumbers = /^[0-9]+$/;

    // id error handling
    if (id !== "") {
      validate = true;
      setIdError("");
    } else {
      setIdError("Escribe un valor para la id");
    }
    if (id.match(regExOnumbers)) {
      validate = true;
      setIdError("");
    } else {
      validate = false;
      setIdError("Debe contener solo numeros");
    }

    // name error handling
    if (name !== "") {
      validate2 = true;
      setNameError("");
    } else {
      setNameError("Escribe un valor para el nombre");
    }
    if (name.match(regExOletters)) {
      validate2 = true;
      setNameError("");
    } else {
      validate2 = false;
      setNameError("Debe contener solo letras");
    }

    // lastname Error handling
    if (lastName !== "") {
      validate3 = true;
      setLastNameError("");
    } else {
      setLastNameError("Escribe un valor para el apellido");
    }
    if (lastName.match(regExOletters2)) {
      validate3 = true;
      setLastNameError("");
    } else {
      validate3 = false;
      setLastNameError("Debe contener solo letras");
    }

    return validate && validate2 && validate3;
  };

  const translatePositions = (players: any) => {
    if (!players) return;

    let startersSorted = Object.values(players).map(
      (starter: any) => starter.id,
    );
    startersSorted[0] = players["gk"].id;
    let index = 1,
      j = 0;
    for (let line of distribution.split("-")) {
      for (let i = 0; i < Number(line); i++) {
        startersSorted[index] = players[j + "-" + i].id;
        index++;
      }
      j++;
    }
    return startersSorted;
  };

  const translateToPositions = async (players: any, distribution: string) => {
    if (!players) return;

    let startersInPositions: any = {};
    const res1 = await getPlayerByID(
      players[0],
      localStorage.getItem("token")!,
    );
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
        const data = await res.json();

        startersInPositions[`${j}-${i}`] = data[0];
        index++;
      }
      j++;
    }
    return startersInPositions;
  };

  const validateDifferencesR = () => {
    return (
      match.referee[0].name !== name ||
      match.referee[0].lastName !== lastName ||
      match.referee[0].position !== position
    );
  };

  const validateDifferences = () => {
    // La fecha original en formato Zulu
    const zuluDate = new Date(match.date);

    // Obtener el desplazamiento local en minutos
    const offset = zuluDate.getTimezoneOffset() * 60000;
    const localTime = new Date(zuluDate.getTime() - offset);

    // Formatear a YYYY-MM-DDTHH:mm (formato válido para datetime-local)
    const datetimeLocal = localTime.toISOString().slice(0, 16);
    return match.location !== lugar || datetimeLocal !== fecha;
  };
  const changeEditableData = async () => {
    if (validateDifferences()) {
      const info = { match: { location: lugar, date: new Date(fecha) } };
      const res = await updateMatch(
        JSON.stringify(info),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        closeModal2();
        setRefresh((prev) => !prev);
        setMessage3("");
      } else {
        setMessage3("Error: Ha ocurrido un error");
      }
    } else {
      setMessage3("Error: No se han detectado cambios");
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
        <div className="flex flex-col mt-40 justify-center items-center">
          <div className="flex justify-between relative">
            {user.rol == "Admin" && (
              <div
                onClick={openModal2}
                className="absolute icon-pencil2 left-60 cursor-pointer"
              ></div>
            )}
            {user.rol == "Admin" &&
              new Date(Date.now()) >=
                new Date(new Date(match.date).getTime() - 2 * 60 * 60 * 1000) &&
              new Date(Date.now()) <= new Date(match.date) &&
              match.formacionA.starters.length > 0 &&
              match.formacionB.starters.length > 0 && (
                <div
                  onClick={() => router.push("/streamingMatch?id=" + matchID)}
                  className="absolute bg-red-500 rounded-full p-2 right-60 cursor-pointer"
                ></div>
              )}
            {/* Fecha */}
            <div className="flex flex-col">
              <div className="text-sm mb-1">{dateD}</div>
              <div className="text-sm">{dateH}</div>
            </div>
          </div>

          {/* Partido */}
          <div className="flex items-center justify-center gap-16">
            {/* Equipo A */}
            <div className="flex flex-col items-center w-32">
              <Image
                className="rounded-full"
                src={teamA.flag || default_escudo}
                width={70}
                height={70}
                alt={teamA.name}
              />

              <div className="mt-2 text-center font-semibold">{teamA.name}</div>
            </div>

            {/* Centro */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500">{match.phase}</div>

              <div className="text-3xl font-bold">
                {match.status !== "Programado"
                  ? `${match.result.split("-")[0]} - ${match.result.split("-")[1]}`
                  : "VS"}
              </div>
              {(match.penaltieResult !== "0-0" ||
                match.penaltyStarter !== "NA") && (
                <div className="text-[12px] font-semibold">
                  {`${match.penaltieResult.split("-")[0]} - ${match.penaltieResult.split("-")[1]}`}
                </div>
              )}

              <div className="text-sm mt-1">{match.location}</div>
              <div className="text-sm mt-1">
                {match.status == "En vivo"
                  ? match.status + " " + match.eventos.at(-1).minute
                  : match.status}
              </div>
            </div>

            {/* Equipo B */}
            <div className="flex flex-col items-center w-32">
              <Image
                className="rounded-full"
                src={teamB.flag || default_escudo}
                width={70}
                height={70}
                alt={teamB.name}
              />

              <div className="mt-2 text-center font-semibold">{teamB.name}</div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-10 w-full">
            <span
              onClick={() => setMenu("stats")}
              className={
                menu == "stats"
                  ? "mr-5 ml-5 font-semibold rounded-2xl px-3 bg-gray-200 cursor-pointer"
                  : "mr-5 ml-5 font-semibold rounded-2xl px-3 hover:bg-gray-200 cursor-pointer"
              }
            >
              Estadisticas
            </span>
            <span
              onClick={() => setMenu("formaciones")}
              className={
                menu == "formaciones"
                  ? "mr-5 font-semibold rounded-2xl px-3 bg-gray-200 cursor-pointer"
                  : "mr-5 font-semibold rounded-2xl px-3 hover:bg-gray-200 cursor-pointer"
              }
            >
              Alineaciones
            </span>{" "}
            <span
              onClick={() => setMenu("referees")}
              className={
                menu == "referees"
                  ? "mr-5 font-semibold rounded-2xl px-3 bg-gray-200 cursor-pointer"
                  : "mr-5 font-semibold rounded-2xl px-3 hover:bg-gray-200 cursor-pointer"
              }
            >
              Arbitros
            </span>
            {match.status !== "Programado" ? (
              <span
                onClick={() => setMenu("cronologia")}
                className={
                  menu == "cronologia"
                    ? "font-semibold rounded-2xl px-3 bg-gray-200 cursor-pointer"
                    : "font-semibold rounded-2xl px-3 hover:bg-gray-200 cursor-pointer"
                }
              >
                Cronologia
              </span>
            ) : (
              ""
            )}
          </div>
          {menu == "stats" && (
            <div className="mt-10">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="px-8 py-2">
                      <div className="flex justify-center">
                        <Image
                          className="rounded-full"
                          src={teamA.flag || default_escudo}
                          width={20}
                          height={20}
                          alt={teamA.name}
                        />
                      </div>
                    </th>

                    <th className="px-10 py-2 text-center">Estadísticas</th>

                    <th className="px-8 py-2">
                      <div className="flex justify-center">
                        <Image
                          className="rounded-full"
                          src={teamB.flag || default_escudo}
                          width={20}
                          height={20}
                          alt={teamB.name}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="text-center">
                    <td className="py-3">{match.cornersA}</td>
                    <td className="py-3">Corners</td>
                    <td className="py-3">{match.cornersB}</td>
                  </tr>

                  <tr className="text-center">
                    <td className="py-3">{match.yellowPlayersA.length}</td>

                    <td className="py-3">Amarillas</td>

                    <td className="py-3">{match.yellowPlayersB.length}</td>
                  </tr>

                  <tr className="text-center">
                    <td className="py-3">{match.redPlayersA.length}</td>

                    <td className="py-3">Rojas</td>

                    <td className="py-3">{match.redPlayersB.length}</td>
                  </tr>

                  <tr className="text-center">
                    <td className="py-3">{match.faultsA}</td>

                    <td className="py-3">Faltas</td>

                    <td className="py-3">{match.faultsB}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {menu == "cronologia" && (
            <div className="mt-10 max-h-100 overflow-y-auto w-1/2">
              {match.penaltyStarter !== "NA" && (
                <>
                  <h1 className="text-center">Penales</h1>
                  <table className="w-1/2 text-[8px] mx-auto mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">#</th>
                        <th className="p-2">{teamA.name}</th>
                        <th className="p-2">{teamB.name}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.from({
                        length: Math.max(penaltiesA.length, penaltiesB.length),
                      }).map((_, index) => (
                        <tr key={index}>
                          <td className="p-2 text-center">{index + 1}</td>

                          <td className="text-center p-2">
                            {penaltiesA[index] && (
                              <>
                                {penaltiesA[index].result === "Goal" && "⚽"}
                                {penaltiesA[index].result === "Saved" && "🧤"}
                                {penaltiesA[index].result === "Fail" &&
                                  "❌"}{" "}
                                {penaltiesA[index].player.name}
                              </>
                            )}
                          </td>

                          <td className="text-center p-2">
                            {penaltiesB[index] && (
                              <>
                                {penaltiesB[index].result === "Goal" && "⚽"}
                                {penaltiesB[index].result === "Saved" && "🧤"}
                                {penaltiesB[index].result === "Fail" &&
                                  "❌"}{" "}
                                {penaltiesB[index].player.name}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {match.eventos.length > 0 ? (
                <div>
                  {[...match.eventos]
                    .reverse()
                    .map((evento: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-300 mb-5 p-5 rounded-2xl justify-center items-center flex flex-col"
                      >
                        <div className="text-sm">{evento.description}</div>
                        <div>{evento.minute}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No hay eventos registrados</p>
              )}
            </div>
          )}
          {match.status && menu == "formaciones" && (
            <div className="mt-10 flex flex-col justify-center items-center">
              {(user.team.includes(match.teamA) ||
                user.team.includes(match.teamB)) &&
                new Date(Date.now()) < new Date(match.date) && (
                  <div
                    onClick={openModal}
                    className="bg-blue-300 rounded-xl w-fit p-1 text-3xl cursor-pointer"
                  >
                    +
                  </div>
                )}
              {match.formacionA.starters.length !== 0 &&
              match.formacionB.starters.length !== 0 ? (
                <div>
                  <Formaciones
                    starters1={startersA}
                    distribution={match.formacionA.distribution}
                    distribution2={match.formacionB.distribution}
                    starters2={startersB}
                    subPlayers={subPlayersA}
                    subPlayers2={subPlayersB}
                    teamA={teamA}
                    teamB={teamB}
                    totalPlayers={match.rules.players}
                    match={match}
                  />
                </div>
              ) : (
                <p>Aún no hay formaciones iniciales</p>
              )}
            </div>
          )}

          {menu == "referees" && (
            <>
              {match.referee.length < 4 && rol == "Admin" && (
                <div
                  onClick={openModal3}
                  className="bg-blue-300 rounded-xl w-fit p-1 text-3xl cursor-pointer mt-10"
                >
                  +
                </div>
              )}
              <div className="mt-20">
                {match.referee.length > 0 ? (
                  match.referee.map((ref: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="bg-gray-300 mb-5 p-5 rounded-2xl flex flex-col justify-center items-center"
                      >
                        <div>{ref.name + " " + ref.lastName}</div>
                        <div>{ref.position}</div>
                        {rol == "Admin" && (
                          <div className="flex">
                            <span
                              onClick={() => deleteRefereeF(ref.id)}
                              className="icon-trash3 cursor-ponter"
                            ></span>{" "}
                            <span
                              onClick={() => {
                                setId(ref.id);
                                setName(ref.name);
                                setLastName(ref.lastName);
                                setPosition(ref.position);
                                openModal4();
                              }}
                              className="icon-pencil3 ml-5 cursor-pointer"
                            ></span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>No hay arbitros registrados</p>
                )}
              </div>
            </>
          )}
        </div>

        <Modal2 isOpen={isOpen} onClose={closeModal}>
          <div className="flex flex-col justify-center items-center">
            ¿A cuál equipo le quieres agregar formacion?
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
            {teamsTS.length > 0 && (
              <div className="mt-5 flex-col justify-center items-center">
                <div className="flex">
                  Distribución{" "}
                  <input
                    value={distribution}
                    className="text-center"
                    onChange={(e) => setDistribution(e.target.value)}
                    type="text"
                    placeholder="4-3-3"
                  />
                </div>
                <p className="text-sm text-green-400 mb-5">
                  Nota: recuerde que el equipo es de {match.rules.players}{" "}
                  jugadores
                </p>
                <button
                  onClick={() => setShowBoard(true)}
                  style={{ fontSize: "10px" }}
                  className="w-30 rounded-2xl bg-green-400 p-2 ml-25 cursor-pointer"
                >
                  Cargar tablero
                </button>
              </div>
            )}
            {showBoard && teamsTS.length !== 0 && (
              <div className="mt-6 flex flex-col items-center w-full">
                <TeamBoard
                  distribution={distribution}
                  totalPlayers={match.rules.players}
                  starters={starters}
                  subPlayers={subPlayers}
                  setStarters={setStarters}
                  setSubPlayers={setSubPlayers}
                />

                <div className="mt-8 w-full">
                  <p className="text-center font-semibold mb-4">
                    Jugadores disponibles
                  </p>

                  <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="flex">
                      {playersNTS.length > 0 ? (
                        playersNTS.map((player: any, index: number) => (
                          <div
                            key={index}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <MiniCard5 item={player} />
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <p>No hay jugadores a elegir</p>
                          <p>Inscribe a tu equipo primero</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="text-sm text-red-500 mt-5">
                        {message2}
                      </div>
                      <button
                        onClick={agregarFormacion}
                        className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                      >
                        Agregar formacion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal2>

        <Modal isOpen={isOpen2} onClose={closeModal2}>
          <div className="flex flex-col justify-center items-center">
            <h1 className="mb-2 font-bold text-lg">Actualizar partido</h1>
            <label className="mt-5" htmlFor="lugar">
              Lugar
            </label>
            <input
              id="lugar"
              name="lugar"
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Estadio Romelio Martinez"
            />
            <label className="mt-5" htmlFor="fechaPartido">
              Fecha
            </label>
            <input
              type="datetime-local"
              name="fechaPartido"
              id="fechaPartido"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <div
              className={
                message3.includes("Error")
                  ? "text-sm mt-2 mb-2 text-red-500"
                  : "text-sm mt-2 mb-2 text-green-500"
              }
            >
              {message3}
            </div>

            <button
              onClick={changeEditableData}
              className="w-[200px] mt-10 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Actualizar
            </button>
          </div>
        </Modal>

        <Modal isOpen={isOpen3} onClose={closeModal3}>
          <div className="flex flex-col justify-center items-center">
            <h1 className="mb-2 font-bold text-lg">Agregar arbitro</h1>

            <div className="grid grid-cols-2"></div>
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="id">Identificación</label>
              <input
                name="id"
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="1005626465"
              />
              <div className="text-sm text-red-500">{idError}</div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <label htmlFor="name">Nombre</label>
              <input
                name="name"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Edison J."
              />
              <div className="text-sm text-red-500">{nameError}</div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <label htmlFor="lastname">Apellidos</label>
              <input
                name="lastname"
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pacheco Oviedo"
              />
              <div className="text-sm text-red-500">{lastNameError}</div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="position">Posicion</label>
              <select
                onChange={(e) => setPosition(e.target.value)}
                name="position"
                id="position"
              >
                <option value="Central">Central</option>
                <option value="Linea">Linea</option>
                <option value="Cuarto">Cuarto</option>
              </select>
            </div>

            <div className="text-sm text-red-500 mt-5">{message4}</div>

            <button
              onClick={addRefereeF}
              className="w-[200px] mt-10 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Agregar
            </button>
          </div>
        </Modal>

        <Modal isOpen={isOpen4} onClose={closeModal4}>
          <div className="flex flex-col justify-center items-center">
            <h1 className="mb-2 font-bold text-lg">Editar arbitro</h1>

            <div className="grid grid-cols-2"></div>
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="id">Identificación</label>
              <input
                name="id"
                id="id"
                type="text"
                value={id}
                readOnly
                placeholder="1005626465"
              />
              <div className="text-sm text-red-500">{idError}</div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <label htmlFor="name">Nombre</label>
              <input
                name="name"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Edison J."
              />
              <div className="text-sm text-red-500">{nameError}</div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <label htmlFor="lastname">Apellidos</label>
              <input
                name="lastname"
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pacheco Oviedo"
              />
              <div className="text-sm text-red-500">{lastNameError}</div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="position">Posicion</label>
              <select
                onChange={(e) => setPosition(e.target.value)}
                name="position"
                id="position"
                value={position}
              >
                <option value="Central">Central</option>
                <option value="Linea">Linea</option>
                <option value="Cuarto">Cuarto</option>
              </select>
            </div>

            <div className="text-sm text-red-500 mt-5">{message4}</div>

            <button
              onClick={() => editRefereeF(id)}
              className="w-[200px] mt-10 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Agregar
            </button>
          </div>
        </Modal>
      </>
    );
  }
}
