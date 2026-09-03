"use client";
import { useSearchParams } from "next/navigation";
import NavBar from "../../ui/NavBar";
import { useEffect, useState } from "react";
import {
  addEvent,
  deleteEvent,
  editEvent,
  getMatchByID,
  updateMatch,
} from "../../lib/Services/MatchService";
import { getTeamByID } from "../../lib/Services/TeamService";
import Image from "next/image";
import default_escudo from "../../../public/default_escudo.jpg";
import Popup from "../../ui/Popup";
import { getTournamentByID } from "../../lib/Services/TournamentService";
import Modal from "../../ui/Modal";
import Modal2 from "../../ui/Modal2";
import MiniCard2 from "../../ui/Minicard2";
import MiniCard from "../../ui/MiniCard";
import Formacion from "../../ui/Formacion";
import { getPlayerByID } from "../../lib/Services/PlayerService";
import { useRouter } from "next/navigation";

export default function StreamingMatchContent() {
  const searchParams = useSearchParams();
  const matchID = searchParams.get("id");
  const router = useRouter();
  const [teamA, setTeamA] = useState<any>({});
  const [teamB, setTeamB] = useState<any>({});
  const [match, setMatch] = useState<any>({});
  const [tournament, setTournament] = useState<any>({});
  const [distribution, setDistribution] = useState("");
  const [description, setDescription] = useState("");
  const [minute, setMinute] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);
  const [isOpen2, setOpen2] = useState(false);
  const openModal = () => setOpen2(true);
  const closeModal = () => setOpen2(false);
  const [isOpen3, setOpen3] = useState(false);
  const openModal2 = () => setOpen3(true);
  const closeModal2 = () => setOpen3(false);
  const [isOpen4, setOpen4] = useState(false);
  const openModal3 = () => setOpen4(true);
  const closeModal3 = () => setOpen4(false);
  const [isOpen5, setOpen5] = useState(false);
  const openModal4 = () => setOpen5(true);
  const closeModal4 = () => setOpen5(false);
  const [isOpen6, setOpen6] = useState(false);
  const openModal5 = () => setOpen6(true);
  const closeModal5 = () => setOpen6(false);
  const [isOpen7, setOpen7] = useState(false);
  const openModal6 = () => setOpen7(true);
  const closeModal6 = () => setOpen7(false);
  const [isOpen8, setOpen8] = useState(false);
  const openModal7 = () => setOpen8(true);
  const closeModal7 = () => setOpen8(false);
  const [teamsNTS, setTeamsNTS] = useState<any>([]);
  const [teamsTS, setTeamsTS] = useState<any>([]);
  const [playersTS, setPlayersTS] = useState<any>([]);
  const [starters, setStarters] = useState<any>([]);
  const [subPlayers, setSubPlayers] = useState<any>([]);
  const [eventID, setEventID] = useState("");
  const [tipo, setTipo] = useState("");
  const [actualMinute, setActualMinute] = useState("");
  const [extratime, setExtratime] = useState("");
  const [time, setTime] = useState("1");

  useEffect(() => {
    fetchMatch();
  }, []);

  useEffect(() => {
    fetchMatch();
  }, [refresh]);

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
        console.log(match.finalFormacionB.starters);
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

    const resTN = await getTournamentByID(data[0].tournament);
    const dataTN = await resTN.json();

    setTournament(dataTN[0]);
    setTeamsNTS([dataA[0], dataB[0]]);
    setLoading(false);
  };
  // function to start the match
  const startMatch = async () => {
    if (!match.eventos.find((event: any) => event.tipo == "Start")) {
      const playersRelated = match.formacionA.starters.concat(
        match.formacionB.starters,
      );
      const event = {
        event: {
          description: `Empieza el partido entre ${teamA.name} y ${teamB.name} en ${match.location} en la ciudad de ${tournament.city}`,
          team: "NA",
          tipo: "Start",
          playersRelated,
          minute: "0",
        },
      };
      const res = await addEvent(
        JSON.stringify(event),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        setMessage("Evento registrado");
        setRefresh((prev) => !prev);
        openPopup();
      } else {
        setMessage("Error: Evento no registrado");
        openPopup();
      }
    }
  };

  // function to start the match
  const startSecondTime = async () => {
    if (
      match.eventos.find((event: any) => event.tipo == "Start") &&
      !match.eventos.find((event: any) => event.tipo == "Start2")
    ) {
      const event = {
        event: {
          description: `Empieza el segundo tiempo entre ${teamA.name} y ${teamB.name} en ${match.location} en la ciudad de ${tournament.city}`,
          team: "NA",
          tipo: "Start2",
          playersRelated: [],
          minute: match.rules.minutesPerTime,
        },
      };
      const res = await addEvent(
        JSON.stringify(event),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();
      if ("success" in data) {
        setMessage("Evento registrado");
        setRefresh((prev) => !prev);
        openPopup();
      } else {
        setMessage("Error: Evento no registrado");
        openPopup();
      }
    }
  };
  const editEventF = async (eventID: string) => {
    if (validateDiferencesEvent(eventID)) {
      const regexOfMinutes = /^[0-9+]+$/;
      if (minute.match(regexOfMinutes)) {
        const event = { event: { minute, description } };
        const res = await editEvent(
          eventID,
          matchID!,
          JSON.stringify(event),
          localStorage.getItem("token")!,
        );
        const data = await res.json();
        if ("success" in data) {
          closeModal();
          setRefresh((prev) => !prev);
        } else {
          setMessage2("Error: Ha ocurrido un error");
        }
      } else {
        setMessage2(
          "El formato debe ser numerico o alfanumerico con el literal +, ejemplo: 45+3",
        );
      }
    } else {
      setMessage2("No se han detectado cambios");
    }
  };

  const deleteEventF = async (eventID: string) => {
    const res = await deleteEvent(
      eventID,
      matchID!,
      localStorage.getItem("token")!,
    );
    const data = await res.json();
    if ("success" in data) {
      setRefresh((prev) => !prev);
      closeModal2();
    } else {
      setMessage3("Ha ocurrido un error");
    }
  };

  const validateDiferencesEvent = (eventID: string) => {
    const evento = match.eventos.find((event: any) => event.id == eventID);
    return evento.minute !== minute || evento.description !== description;
  };

  const penales = () => {
    if (
      match.result.split("-")[0] == match.result.split("-")[1] &&
      !match.eventos.find((evento: any) => evento.tipo == "Final")
    ) {
      router.push(`penales/?matchID=${matchID}`);
    }
  };

  // function to substitute a player
  const substitution = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (playersTS[0] && playersTS[1]) {
        if (actualMinute.match(regexOfMinutes)) {
          if (teamsTS[0].id == teamA.id) {
            if (
              match.finalFormacionA.starters.includes(playersTS[0].id) &&
              match.finalFormacionA.subPlayers.includes(playersTS[1].id)
            ) {
              const playersRelated = [playersTS[0].id, playersTS[1].id];
              const event = {
                event: {
                  description: `Cambio en el equipo ${teamA.name} sale con el numero ${playersTS[0].dorsal}, ${playersTS[0].name} y entra con el numero ${playersTS[1].dorsal}, ${playersTS[1].name}`,
                  team: "A",
                  tipo: "Substitution",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
                openPopup();
              }
            } else {
              setMessage4(
                "El que sale debe ser un titular y el que entra un suplente",
              );
            }
          }
          if (teamsTS[0].id == teamB.id) {
            if (
              match.finalFormacionB.starters.includes(playersTS[0].id) &&
              match.finalFormacionB.subPlayers.includes(playersTS[1].id)
            ) {
              const playersRelated = [playersTS[0].id, playersTS[1].id];
              const event = {
                event: {
                  description: `Cambio en el equipo ${teamB.name} sale con el numero ${playersTS[0].dorsal}, ${playersTS[0].name} y entra con el numero ${playersTS[1].dorsal}, ${playersTS[1].name}`,
                  team: "B",
                  tipo: "Substitution",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                openPopup();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
                closeModal3();
              }
            } else {
              setMessage4(
                "Error: El que sale debe ser un titular y el que entra un suplente",
              );
            }
          }
        } else {
          setMessage4(
            "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
          );
        }
      } else {
        setMessage4(
          "Error: Debes seleccionar un jugador saliente y uno entrante",
        );
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // function to finish the game
  const Final = async () => {
    if (!match.eventos.find((event: any) => event.tipo == "Final")) {
      if (
        match.eventos.find((event: any) => event.tipo == "Start") &&
        match.eventos.find((event: any) => event.tipo == "Start2")
      ) {
        const playersRelated = match.finalFormacionA.starters.concat(
          match.finalFormacionB.starters,
        );

        let event;
        if (
          match.result.split("-")[0] !== match.result.split("-")[1] ||
          match.penaltieResult.split("-")[0] !==
            match.penaltieResult.split("-")[1]
        ) {
          if (match.result.split("-")[0] !== match.result.split("-")[1]) {
            event = {
              event: {
                description: `Final del partido entre ${teamA.name} y ${teamB.name} en ${match.location} en la ciudad de ${tournament.city} con un resultado de ${match.result}`,
                team: "NA",
                tipo: "Final",
                playersRelated,
                minute: match.rules.minutesPerTime * 2 + "+" + match.extraTime2,
              },
            };
          } else if (
            match.penaltieResult.split("-")[0] !==
            match.penaltieResult.split("-")[1]
          ) {
            event = {
              event: {
                description: `Final del partido entre ${teamA.name} y ${teamB.name} en ${match.location} en la ciudad de ${tournament.city} con un resultado de empate por ${match.result} y ${match.penaltieResult} por penales`,
                team: "NA",
                tipo: "Final",
                playersRelated,
                minute: "Post-penales",
              },
            };
          }
        } else {
          event = {
            event: {
              description: `Final del partido entre ${teamA.name} y ${teamB.name} en ${match.location} en la ciudad de ${tournament.city} con un resultado de ${match.result} nos vamos a penales`,
              team: "NA",
              tipo: "Penales",
              playersRelated: [],
              minute: match.rules.minutesPerTime * 2 + "+" + match.extraTime2,
            },
          };
        }

        const res = await addEvent(
          JSON.stringify(event),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data = await res.json();

        if ("success" in data) {
          setMessage("Evento registrado");
          setRefresh((prev) => !prev);
          openPopup();
          closeModal3();
          setActualMinute("");
        } else {
          setMessage("Error: Evento no registrado");
          openPopup();
          closeModal3();
        }
      }
    }
  };

  // function to add a comment
  const Comment = async () => {
    const event = {
      event: {
        description,
        team: "NA",
        tipo: "Comment",
        playersRelated: [],
        minute: actualMinute,
      },
    };
    const res = await addEvent(
      JSON.stringify(event),
      matchID!,
      localStorage.getItem("token")!,
    );
    const data = await res.json();

    if ("success" in data) {
      setMessage("Evento registrado");
      setRefresh((prev) => !prev);
      openPopup();
      closeModal6();
      setActualMinute("");
    } else {
      setMessage("Error: Evento no registrado");
      openPopup();
      closeModal6();
      if (res.status == 401) {
        router.push("/login?refreshToken=" + true);
      }
    }
  };

  const CalculatePositions = async () => {
    let event2;
    if (match.result.split("-")[0] !== match.result.split("-")[1]) {
      event2 = {
        event: {
          description: `el partido finalizó ${match.result} veremos como afecta esto las tablas y llaves`,
          team: "NA",
          tipo: "Positions",
          playersRelated: [],
          minute: match.rules.minutesPerTime * 2 + "+" + match.extraTime2,
        },
      };
    } else if (
      match.penaltieResult.split("-")[0] !== match.penaltieResult.split("-")[1]
    ) {
      event2 = {
        event: {
          description: `El partido finalizó con empate por ${match.result} y ${match.penaltieResult} por penales, veremos como afecta esto las tablas y llaves`,
          team: "NA",
          tipo: "Positions",
          playersRelated: [],
          minute: "Post-penales",
        },
      };
    }

    const res2 = await addEvent(
      JSON.stringify(event2),
      matchID!,
      localStorage.getItem("token")!,
    );
    const data2 = await res2.json();

    if ("success" in data2) {
      setMessage("Evento registrado");
      setRefresh((prev) => !prev);
      openPopup();
    } else {
      setMessage("Error: Evento no registrado");
      openPopup();
    }
  };
  // function to add the extratime for the match
  const Extratime = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (actualMinute.match(regexOfMinutes)) {
      let match;
      console.log(time);
      if (time == "1") {
        match = { match: { extraTime: Number(extratime) } };
      } else if (time == "2") {
        match = { match: { extraTime2: Number(extratime) } };
      }

      const res1 = await updateMatch(
        JSON.stringify(match),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data1 = await res1.json();
      const event = {
        event: {
          description: extratime + " minutos más",
          team: "NA",
          tipo: "Comment",
          playersRelated: [],
          minute: actualMinute,
        },
      };

      const res = await addEvent(
        JSON.stringify(event),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();

      if ("success" in data && "success" in data1) {
        setMessage("Evento registrado");
        setRefresh((prev) => !prev);
        openPopup();
        closeModal5();
        setActualMinute("");
      } else {
        setMessage("Error: Evento no registrado");
        openPopup();
        closeModal5();
        setRefresh((prev) => !prev);
        setActualMinute("");
      }
    } else {
      setMessage4(
        "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
      );
    }
  };

  const RestTime = async () => {
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      const event = {
        event: {
          description: "Final de la primera parte",
          team: "NA",
          tipo: "RestTime",
          playersRelated: [],
          minute: match.rules.minutesPerTime + "+" + match.extraTime,
        },
      };

      const res = await addEvent(
        JSON.stringify(event),
        matchID!,
        localStorage.getItem("token")!,
      );
      const data = await res.json();

      if ("success" in data) {
        setMessage("Evento registrado");
        openPopup();
        setRefresh((prev) => !prev);
      } else {
        setMessage("Error: Evento no registrado");
        openPopup();
      }
    }
  };
  // function to register a goal and an asisst
  const registerAGoalAndAssist = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (
        !(
          playersTS.some((player: any) =>
            match.finalFormacionA.subPlayers.includes(player.id),
          ) ||
          playersTS.some((player: any) =>
            match.finalFormacionB.subPlayers.includes(player.id),
          )
        )
      ) {
        if (playersTS[0]) {
          if (actualMinute.match(regexOfMinutes)) {
            if (teamsTS[0].id == teamA.id) {
              let pass = false;
              const playersRelated = [playersTS[0].id];
              const event = {
                event: {
                  description: `Gol del equipo ${teamA.name} del jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                  team: "A",
                  tipo: "Goal",
                  playersRelated,
                  minute: actualMinute,
                },
              };
              if (playersTS[1]) {
                const event2 = {
                  event: {
                    description: `Asistencia del jugador ${playersTS[1].dorsal}, ${playersTS[0].name} por el Equipo ${teamA.name}`,
                    team: "A",
                    tipo: "Assist",
                    playersRelated: [playersTS[1].id],
                    minute: actualMinute,
                  },
                };

                const res2 = await addEvent(
                  JSON.stringify(event2),
                  matchID!,
                  localStorage.getItem("token")!,
                );
                const data2 = await res2.json();
                pass = "success" in data2;
              } else {
                pass = true;
              }
              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data && pass) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado completamente");
                openPopup();
                closeModal3();
              }
            }
            if (teamsTS[0].id == teamB.id) {
              let pass = false;
              const playersRelated = [playersTS[0].id];
              const event = {
                event: {
                  description: `Gol del equipo ${teamB.name} del jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                  team: "B",
                  tipo: "Goal",
                  playersRelated,
                  minute: actualMinute,
                },
              };
              if (playersTS[1]) {
                const event2 = {
                  event: {
                    description: `Asistencia del jugador ${playersTS[1].dorsal}, ${playersTS[0].name} por el Equipo ${teamB.name}`,
                    team: "B",
                    tipo: "Assist",
                    playersRelated: [playersTS[1].id],
                    minute: actualMinute,
                  },
                };

                const res2 = await addEvent(
                  JSON.stringify(event2),
                  matchID!,
                  localStorage.getItem("token")!,
                );
                const data2 = await res2.json();
                pass = "success" in data2;
              } else {
                pass = true;
              }

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data && pass) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                openPopup();
                closeModal3();
              }
            }
          } else {
            setMessage4(
              "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
            );
          }
        } else {
          setMessage4(
            "Error: Debes seleccionar por lo menos un jugador, el que marca el gol",
          );
        }
      } else {
        setMessage4("Error: Los jugadores deben estar en el campo");
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };

  const PenaltyMissed = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (playersTS[0]) {
        if (actualMinute.match(regexOfMinutes)) {
          if (teamsTS[0].id == teamA.id) {
            const playersRelated = [playersTS[0].id];
            const event = {
              event: {
                description: `Penal errado de ${teamA.name} por el jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                team: "A",
                tipo: "Penalty Missed",
                playersRelated,
                minute: actualMinute,
              },
            };

            const res = await addEvent(
              JSON.stringify(event),
              matchID!,
              localStorage.getItem("token")!,
            );
            const data = await res.json();
            if ("success" in data) {
              setMessage("Evento registrado");
              setRefresh((prev) => !prev);
              openPopup();
              closeModal3();
              setActualMinute("");
              setPlayersTS([]);
              setTeamsTS([]);
            } else {
              setMessage("Error: Evento no registrado");
              openPopup();
              closeModal3();
            }
          }
          if (teamsTS[0].id == teamB.id) {
            const playersRelated = [playersTS[0].id];
            const event = {
              event: {
                description: `Penal errado de ${teamB.name} por el jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                team: "B",
                tipo: "Penalty Missed",
                playersRelated,
                minute: actualMinute,
              },
            };

            const res = await addEvent(
              JSON.stringify(event),
              matchID!,
              localStorage.getItem("token")!,
            );
            const data = await res.json();
            if ("success" in data) {
              setMessage("Evento registrado");
              setRefresh((prev) => !prev);
              openPopup();
              closeModal3();
              setActualMinute("");
              setPlayersTS([]);
              setTeamsTS([]);
            } else {
              setMessage("Error: Evento no registrado");
              openPopup();
              closeModal3();
            }
          }
        } else {
          setMessage4(
            "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
          );
        }
      } else {
        setMessage4("Error: Debes seleccionar al jugador que erra");
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // functions to register a penalty goal
  const PenaltyGoal = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (playersTS[0]) {
        if (actualMinute.match(regexOfMinutes)) {
          if (teamsTS[0].id == teamA.id) {
            let pass = false;
            const playersRelated = [playersTS[0].id];
            const event = {
              event: {
                description: `Gol de penal del equipo ${teamA.name} del jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                team: "A",
                tipo: "Penalty Goal",
                playersRelated,
                minute: actualMinute,
              },
            };

            const res = await addEvent(
              JSON.stringify(event),
              matchID!,
              localStorage.getItem("token")!,
            );
            const data = await res.json();
            if ("success" in data) {
              setMessage("Evento registrado");
              setRefresh((prev) => !prev);
              openPopup();
              closeModal3();
              setActualMinute("");
              setPlayersTS([]);
              setTeamsTS([]);
            } else {
              setMessage("Error: Evento no registrado");
              openPopup();
              closeModal3();
            }
          }
          if (teamsTS[0].id == teamB.id) {
            const playersRelated = [playersTS[0].id];
            const event = {
              event: {
                description: `Gol de penal del equipo ${teamB.name} del jugador ${playersTS[0].dorsal}, ${playersTS[0].name}`,
                team: "B",
                tipo: "Penalty Goal",
                playersRelated,
                minute: actualMinute,
              },
            };

            const res = await addEvent(
              JSON.stringify(event),
              matchID!,
              localStorage.getItem("token")!,
            );
            const data = await res.json();
            if ("success" in data) {
              setMessage("Evento registrado");
              setRefresh((prev) => !prev);
              openPopup();
              closeModal3();
              setActualMinute("");
              setPlayersTS([]);
              setTeamsTS([]);
            } else {
              setMessage("Error: Evento no registrado");
              openPopup();
              closeModal3();
            }
          }
        } else {
          setMessage4(
            "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
          );
        }
      } else {
        setMessage4("Error: Debes seleccionar al jugador que marca");
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // anulation of the last event
  const Anulation = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (actualMinute.match(regexOfMinutes)) {
        const event = {
          event: {
            description: "Se anula la ultima acción",
            team: "NA",
            tipo: "Anulation",
            playersRelated: [],
            minute: actualMinute,
          },
        };

        const res = await addEvent(
          JSON.stringify(event),
          matchID!,
          localStorage.getItem("token")!,
        );
        const data = await res.json();
        if ("success" in data) {
          setMessage("Evento registrado");
          setRefresh((prev) => !prev);
          openPopup();
          closeModal7();
          setActualMinute("");
          setPlayersTS([]);
          setTeamsTS([]);
        } else {
          setMessage("Error: Evento no registrado");
          openPopup();
          closeModal7();
        }
      } else {
        setMessage4(
          "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
        );
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // function to register yellow cards
  const yellowCard = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (playersTS.length > 0) {
        if (actualMinute.match(regexOfMinutes)) {
          if (teamsTS[0].id == teamA.id) {
            if (
              !playersTS.some((player: any) =>
                match.redPlayersA.includes(player.id),
              )
            ) {
              const playersRelated = playersTS.map((player: any) => player.id);
              let desc = `Amarilla para el equipo ${teamA.name}`;
              for (let i = 0; i < playersTS.length - 1; ++i) {
                desc += `el jugador ${playersTS[i].name} con el dorsal ${playersTS[i].dorsal}`;
              }
              if (playersTS.length > 1) {
                desc += ` y el jugador ${playersTS[playersTS.length - 1].name} con el dorsal ${playersTS[playersTS.length - 1].dorsal}`;
              }
              if (playersTS.length == 1) {
                desc += `el jugador ${playersTS[0].name} con el dorsal ${playersTS[0].dorsal}`;
              }
              const event = {
                event: {
                  description: desc,
                  team: "A",
                  tipo: "Yellow",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                openPopup();
                closeModal3();
              }
            } else {
              setMessage4(
                "Error: Uno de los jugadores seleccionados ya tiene roja, no se le puede poner amarilla",
              );
            }
          }
          if (teamsTS[0].id == teamB.id) {
            if (
              !playersTS.some((player: any) =>
                match.redPlayersB.includes(player.id),
              )
            ) {
              const playersRelated = playersTS.map((player: any) => player.id);
              let desc = `Amarilla para el equipo ${teamB.name}`;
              for (let i = 0; i < playersTS.length - 1; ++i) {
                desc += `el jugador ${playersTS[i].name} con el dorsal ${playersTS[i].dorsal}`;
              }
              if (playersTS.length > 1) {
                desc += ` y el jugador ${playersTS[playersTS.length - 1].name} con el dorsal ${playersTS[playersTS.length - 1].dorsal}`;
              }
              if (playersTS.length == 1) {
                desc += `el jugador ${playersTS[0].name} con el dorsal ${playersTS[0].dorsal}`;
              }
              const event = {
                event: {
                  description: desc,
                  team: "B",
                  tipo: "Yellow",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                openPopup();
                closeModal3();
              }
            } else {
              setMessage4(
                "Error: Uno de los jugadores seleccionados ya tiene roja, no se le puede poner amarilla",
              );
            }
          }
        } else {
          setMessage4(
            "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
          );
        }
      } else {
        setMessage4("Error: Debes seleccionar por lo menos un jugador");
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // function to register a red card
  const RedCard = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (playersTS.length > 0) {
        if (actualMinute.match(regexOfMinutes)) {
          if (teamsTS[0].id == teamA.id) {
            if (
              !playersTS.some((player: any) =>
                match.redPlayersA.includes(player.id),
              )
            ) {
              const playersRelated = playersTS.map((player: any) => player.id);
              let desc = `Roja para el equipo `;
              for (let i = 0; i < playersTS.length - 1; ++i) {
                desc += `el jugador ${playersTS[i].name} con el dorsal ${playersTS[i].dorsal}`;
              }
              if (playersTS.length > 1) {
                desc += ` y el jugador ${playersTS[playersTS.length - 1].name} con el dorsal ${playersTS[playersTS.length - 1].dorsal}`;
              }

              if (playersTS.length == 1) {
                desc += `el jugador ${playersTS[0].name} con el dorsal ${playersTS[0].dorsal}`;
              }

              const event = {
                event: {
                  description: desc,
                  team: "A",
                  tipo: "Red",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                openPopup();
                closeModal3();
              }
            } else {
              setMessage4(
                "Error: Uno de los jugadores seleccionados ya tiene roja, no se le puede poner otra roja",
              );
            }
          }
          if (teamsTS[0].id == teamB.id) {
            if (
              !playersTS.some((player: any) =>
                match.redPlayersB.includes(player.id),
              )
            ) {
              const playersRelated = playersTS.map((player: any) => player.id);
              let desc = `Roja para `;
              for (let i = 0; i < playersTS.length - 1; ++i) {
                desc += `el jugador ${playersTS[i].name} con el dorsal ${playersTS[i].dorsal}`;
              }
              if (playersTS.length == 1) {
                desc += `el jugador ${playersTS[0].name} con el dorsal ${playersTS[0].dorsal}`;
              }
              if (playersTS.length > 1) {
                desc += ` y el jugador ${playersTS[playersTS.length - 1].name} con el dorsal ${playersTS[playersTS.length - 1].dorsal}`;
              }
              const event = {
                event: {
                  description: desc,
                  team: "B",
                  tipo: "Red",
                  playersRelated,
                  minute: actualMinute,
                },
              };

              const res = await addEvent(
                JSON.stringify(event),
                matchID!,
                localStorage.getItem("token")!,
              );
              const data = await res.json();
              if ("success" in data) {
                setMessage("Evento registrado");
                setRefresh((prev) => !prev);
                openPopup();
                closeModal3();
                setMessage4("");
                setActualMinute("");
                setPlayersTS([]);
                setTeamsTS([]);
              } else {
                setMessage("Error: Evento no registrado");
                setMessage4("");
                openPopup();
                closeModal3();
              }
            } else {
              setMessage4(
                "Error: Uno de los jugadores seleccionados ya tiene roja, no se le puede poner otra roja",
              );
            }
          }
        } else {
          setMessage4(
            "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
          );
        }
      } else {
        setMessage4("Error: Debes seleccionar por lo menos un jugador");
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };
  // function to register a fault
  const fault = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (actualMinute.match(regexOfMinutes)) {
        if (teamsTS[0].id == teamA.id) {
          const event = {
            event: {
              description: `Falta del equipo ${teamA.name}`,
              team: "A",
              tipo: "Fault",
              playersRelated: [],
              minute: actualMinute,
            },
          };

          const res = await addEvent(
            JSON.stringify(event),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            setMessage("Evento registrado");
            setRefresh((prev) => !prev);
            openPopup();
            closeModal4();
            setActualMinute("");
            setMessage4("");
            setPlayersTS([]);
            setTeamsTS([]);
          } else {
            setMessage("Error: Evento no registrado");
            openPopup();
            setActualMinute("");
            setMessage4("");
            setPlayersTS([]);
            setTeamsTS([]);
            closeModal4();
          }
        }
        if (teamsTS[0].id == teamB.id) {
          const event = {
            event: {
              description: `Falta del equipo ${teamB.name}`,
              team: "B",
              tipo: "Fault",
              playersRelated: [],
              minute: actualMinute,
            },
          };

          const res = await addEvent(
            JSON.stringify(event),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            setMessage("Evento registrado");
            setRefresh((prev) => !prev);
            openPopup();
            closeModal4();
            setActualMinute("");
            setPlayersTS([]);
            setMessage4("");
            setTeamsTS([]);
          } else {
            setMessage("Error: Evento no registrado");
            openPopup();
            setActualMinute("");
            setPlayersTS([]);
            setTeamsTS([]);
            setMessage4("");
            closeModal4();
          }
        }
      } else {
        setMessage4(
          "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
        );
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
  };

  // function to register a corner
  const corner = async () => {
    const regexOfMinutes = /^[0-9+]+$/;
    if (match.eventos.find((event: any) => event.tipo == "Start")) {
      if (actualMinute.match(regexOfMinutes)) {
        if (teamsTS[0].id == teamA.id) {
          const event = {
            event: {
              description: `Corner a favor del equipo ${teamA.name}`,
              team: "A",
              tipo: "Corner",
              playersRelated: [],
              minute: actualMinute,
            },
          };

          const res = await addEvent(
            JSON.stringify(event),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            setMessage("Evento registrado");
            setRefresh((prev) => !prev);
            openPopup();
            closeModal4();
            setActualMinute("");
            setPlayersTS([]);
            setMessage4("");
            setTeamsTS([]);
          } else {
            setMessage("Error: Evento no registrado");
            openPopup();
            setActualMinute("");
            setPlayersTS([]);
            setTeamsTS([]);
            setMessage4("");
            closeModal4();
          }
        }
        if (teamsTS[0].id == teamB.id) {
          const event = {
            event: {
              description: `Corner a favor del equipo ${teamB.name}`,
              team: "B",
              tipo: "Corner",
              playersRelated: [],
              minute: actualMinute,
            },
          };

          const res = await addEvent(
            JSON.stringify(event),
            matchID!,
            localStorage.getItem("token")!,
          );
          const data = await res.json();
          if ("success" in data) {
            setMessage("Evento registrado");
            setRefresh((prev) => !prev);
            openPopup();
            closeModal4();
            setActualMinute("");
            setPlayersTS([]);
            setMessage4("");
            setTeamsTS([]);
          } else {
            setMessage("Error: Evento no registrado");
            openPopup();
            setActualMinute("");
            setPlayersTS([]);
            setTeamsTS([]);
            setMessage4("");
            closeModal4();
          }
        }
      } else {
        setMessage4(
          "Error: El minuto debe ser numerico o alfanumerico con el literal +, ejemplo: 45+5",
        );
      }
    } else {
      setMessage4("Error: El partido no ha iniciado aún");
    }
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
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="flex justify-center items-center relative">
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
              <div className="flex text-4xl">{match.result}</div>
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

          <div
            onClick={startMatch}
            className="bg-red-500 rounded-2xl p-3 mt-20 cursor-pointer"
          >
            Empezar
          </div>

          <div className="flex mt-10">
            <div
              onClick={RestTime}
              className="bg-gray-300 rounded-2xl p-3 cursor-pointer"
            >
              Entretiempo
            </div>
            <div
              onClick={startSecondTime}
              className="bg-red-500 ml-5 rounded-2xl p-3 cursor-pointer"
            >
              Empezar 2do
            </div>
            <div
              onClick={() => {
                setTipo("Cambio");
                setTeamsTS([]);
                setPlayersTS([]);
                setMessage4("");
                openModal3();
              }}
              className="bg-gray-300 rounded-2xl p-3 ml-5 text-sm cursor-pointer"
            >
              Cambio
            </div>

            <div
              onClick={() => {
                setTipo("Falta");
                setTeamsTS([]);
                setMessage4("");
                openModal4();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Falta
            </div>

            <div
              onClick={() => {
                setTipo("Gol y asistencia");
                setTeamsTS([]);
                setMessage4("");
                setPlayersTS([]);
                openModal3();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Gol
            </div>

            <div
              onClick={() => {
                setTipo("Corner");
                setTeamsTS([]);
                setMessage4("");
                openModal4();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Corner
            </div>
          </div>
          <div className="flex mt-10">
            <div
              onClick={() => {
                setTipo("Tarjeta amarilla");
                setMessage4("");
                setTeamsTS([]);
                setPlayersTS([]);
                openModal3();
              }}
              className="bg-yellow-300 rounded-2xl p-3 text-sm cursor-pointer"
            ></div>

            <div
              onClick={() => {
                setTipo("Tarjeta roja");
                setMessage4("");
                setTeamsTS([]);
                setPlayersTS([]);
                openModal3();
              }}
              className="bg-red-500 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            ></div>

            <div
              onClick={() => {
                setMessage4("");
                openModal7();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Anular
            </div>

            <div
              onClick={() => {
                setTipo("Gol de penal");
                setMessage4("");
                setTeamsTS([]);
                setPlayersTS([]);
                openModal3();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Gol de penal
            </div>
            <div
              onClick={() => {
                setTipo("Penal errado");
                setMessage4("");
                setTeamsTS([]);
                setPlayersTS([]);
                openModal3();
              }}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Penal errado
            </div>
          </div>

          <div className="flex mt-10">
            <div
              onClick={() => {
                setMessage4("");
                openModal6();
              }}
              className="bg-green-500 rounded-2xl p-3 text-sm cursor-pointer"
            >
              Comentar
            </div>

            <div
              onClick={() => openModal5()}
              className="bg-purple-500 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Extratime
            </div>

            <div
              onClick={penales}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Penales
            </div>

            <div
              onClick={CalculatePositions}
              className="bg-gray-300 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Calcular posiciones
            </div>

            <div
              onClick={Final}
              className="bg-red-500 rounded-2xl p-3 text-sm ml-5 cursor-pointer"
            >
              Finalizar
            </div>
          </div>

          <div className="flex flex-col justify-center items-center flex-1 mt-20 w-[400px] h-[600px] p-4 overflow-y-auto border-dashed border-2 border-black rounded-2xl">
            {[...match.eventos].reverse().map((event: any) => (
              <div
                key={event.id}
                className="bg-gray-300 flex flex-col justify-center items-center px-2 pb-2 rounded-2xl w-[400px] mb-5"
              >
                {" "}
                <div className="text-sm bg-red-500 w-full flex justify-center items-center rounded-2xl px-4">
                  {" "}
                  Minuto: {event.minute}
                </div>
                <div>{event.description}</div>{" "}
                <div className="flex">
                  <span
                    onClick={() => {
                      setEventID(event.id);
                      openModal2();
                    }}
                    className="icon-trash3 cursor-pointer"
                  ></span>{" "}
                  <span
                    onClick={() => {
                      setEventID(event.id);
                      setMinute(event.minute);
                      setDescription(event.description);
                      openModal();
                    }}
                    className="icon-pencil3 ml-5 cursor-pointer"
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Popup isOpen={isOpen} onClose={closePopup}>
          <div
            className={
              message.includes("Error")
                ? "text-sm text-red-500"
                : "text-sm text-black"
            }
          >
            {message}
          </div>
        </Popup>
        {/* modal para comment */}
        <Modal isOpen={isOpen7} onClose={closeModal6}>
          <div className="flex flex-col justify-center items-center">
            <div className="font-semibold">Comentario</div>
            <div className="grid grid-cols-1">
              <div className="flex flex-col justify-center items-center">
                <label htmlFor="minute">Minuto</label>
                <input
                  className="text-center"
                  name="minute"
                  id="minute"
                  type="number"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
              <div className=" mt-5 flex flex-col justify-center items-center">
                <label htmlFor="desc">Comentario</label>
                <textarea
                  name="desc"
                  id="desc"
                  value={description}
                  cols={40}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                message2.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message2}
            </div>
            <button
              onClick={Comment}
              className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Comentar
            </button>
          </div>
        </Modal>
        {/* Modal para editar eventos */}
        <Modal isOpen={isOpen2} onClose={closeModal}>
          <div className="flex flex-col justify-center items-center">
            <div className="font-semibold">Actualizar evento</div>
            <div className="grid grid-cols-1">
              <div className="flex flex-col justify-center items-center">
                <label htmlFor="minute">Minuto</label>
                <input
                  className="text-center"
                  name="minute"
                  id="minute"
                  type="number"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                />
              </div>
              <div className=" mt-5 flex flex-col justify-center items-center">
                <label htmlFor="desc">Descripcion</label>
                <textarea
                  name="desc"
                  id="desc"
                  value={description}
                  cols={40}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div
              className={
                message2.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message2}
            </div>
            <button
              onClick={() => editEventF(eventID)}
              className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Actualizar
            </button>
          </div>
        </Modal>
        {/* modal para corner fault etc */}
        <Modal isOpen={isOpen5} onClose={closeModal4}>
          <div className="flex flex-col justify-center items-center">
            <div className="font-semibold">{tipo}</div>
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
              <div className="grid grid-cols-1">
                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="minute">Minuto</label>
                  <input
                    className="text-center"
                    name="minute"
                    id="minute"
                    type="text"
                    value={actualMinute}
                    onChange={(e) => setActualMinute(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div
              className={
                message4.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message4}
            </div>

            {tipo == "Corner" && (
              <button
                onClick={corner}
                className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition cursor-pointer"
              >
                Registrar
              </button>
            )}
            {tipo == "Falta" && (
              <button
                onClick={fault}
                className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition cursor-pointer"
              >
                Registrar
              </button>
            )}

            {tipo == "Anular" && (
              <button
                onClick={Anulation}
                className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition cursor-pointer"
              >
                Registrar
              </button>
            )}
          </div>
        </Modal>

        <Modal isOpen={isOpen3} onClose={closeModal2}>
          <div className="flex flex-col justify-center items-center">
            Estás seguro que quieres eliminar este evento para siempre
            <div className="flex">
              <div
                onClick={() => deleteEventF(eventID)}
                className="icon-trash2 mr-10 text-sm flex flex-col justify-center items-center cursor-pointer"
              >
                Eliminar
              </div>
              <div
                onClick={closeModal2}
                className="icon-return text-sm flex flex-col cursor-pointer"
              >
                Atrás
              </div>
            </div>
            <div
              className={
                message3.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message3}
            </div>
          </div>
        </Modal>
        {/* modal para extratime */}
        <Modal isOpen={isOpen6} onClose={closeModal5}>
          <div className="flex flex-col justify-center items-center">
            <div>Asignar tiempo extra</div>
            <label htmlFor="time">Tiempo de juego</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              name="time"
              id="time"
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <label htmlFor="minute">Minuto</label>
            <input
              type="text"
              className="bg-gray-300 rounded-2xl text-center"
              value={actualMinute}
              onChange={(e) => setActualMinute(e.target.value)}
              name="minute"
              id="minute"
            />
            <label htmlFor="extratime">Adición</label>
            <input
              value={extratime}
              onChange={(e) => setExtratime(e.target.value)}
              type="number"
              name="extratime"
              id="extratime"
            />
            <div
              className={
                message4.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message4}
            </div>

            <button
              onClick={Extratime}
              className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition cursor-pointer"
            >
              Asignar
            </button>
          </div>
        </Modal>
        {/* modal para anular */}
        <Modal isOpen={isOpen8} onClose={closeModal7}>
          <div className="flex flex-col justify-center items-center">
            <div>Anular</div>

            <label htmlFor="minute">Minuto</label>
            <input
              type="text"
              className="bg-gray-300 rounded-2xl text-center"
              value={actualMinute}
              onChange={(e) => setActualMinute(e.target.value)}
              name="minute"
              id="minute"
            />

            <div
              className={
                message4.includes("Error")
                  ? "text-sm text-red-500"
                  : "text-sm text-green-500"
              }
            >
              {message4}
            </div>

            <button
              onClick={Anulation}
              className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition cursor-pointer"
            >
              Anular ultima acción
            </button>
          </div>
        </Modal>

        <Modal2 isOpen={isOpen4} onClose={closeModal3}>
          <div className="flex flex-col justify-center items-center">
            <div>{tipo}</div>
            <div>¿En cual equipo vas a realizar la acción?</div>
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
            {tipo == "Cambio" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div>Jugador que sale</div>{" "}
                <div className="bg-red-500 rounded-2xl px-2 text-center">
                  {playersTS[0] ? playersTS[0].dorsal : "Selecciona un jugador"}
                </div>
                <div>Jugador que entra</div>{" "}
                <div className="bg-green-500 rounded-2xl px-2 text-center">
                  {playersTS[1] ? playersTS[1].dorsal : "Selecciona un jugador"}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
                Minuto
                <input
                  className="bg-gray-300 rounded-2xl text-center"
                  type="text"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
            )}

            {tipo == "Gol y asistencia" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div>Jugador que marca</div>{" "}
                <div className="bg-gray-500 rounded-2xl px-2 text-center">
                  {playersTS[0] ? playersTS[0].dorsal : "Selecciona un jugador"}
                </div>
                <div>Jugador que asiste</div>{" "}
                <div className="bg-gray-500 rounded-2xl px-2 text-center">
                  {playersTS[1] ? playersTS[1].dorsal : "Selecciona un jugador"}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
                Minuto
                <input
                  type="text"
                  className="bg-gray-300 rounded-2xl text-center"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
            )}

            {tipo == "Tarjeta roja" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-wrap">
                  {playersTS.map((player: any) => (
                    <div className="bg-red-500 p-2 ml-1">{player.dorsal}</div>
                  ))}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
                Minuto
                <input
                  type="text"
                  className="bg-gray-300 rounded-2xl text-center"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
            )}
            {tipo == "Tarjeta amarilla" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div className="flex flex-wrap">
                  {playersTS.map((player: any) => (
                    <div className="bg-yellow-500 p-2 ml-1">
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
                Minuto
                <input
                  type="text"
                  className="bg-gray-300 rounded-2xl text-center"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
            )}

            {tipo == "Gol de penal" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div>Jugador que marca</div>{" "}
                <div className="bg-gray-500 rounded-2xl px-2 text-center">
                  {playersTS[0] ? playersTS[0].dorsal : "Selecciona un jugador"}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
                Minuto
                <input
                  type="text"
                  className="bg-gray-300 rounded-2xl text-center"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
              </div>
            )}

            {tipo == "Penal errado" && teamsTS.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <div>Jugador que falla</div>{" "}
                <div className="bg-gray-500 rounded-2xl px-2 text-center">
                  {playersTS[0] ? playersTS[0].dorsal : "Selecciona un jugador"}
                </div>
                <div
                  className="bg-gray-300 rounded-2xl px-2 mt-3 mb-3 cursor-pointer"
                  onClick={() => setPlayersTS([])}
                >
                  Limpiar
                </div>
                Minuto
                <input
                  type="text"
                  className="bg-gray-300 rounded-2xl text-center"
                  value={actualMinute}
                  onChange={(e) => setActualMinute(e.target.value)}
                />
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
                message4.includes("Error") ? "text-sm text-red-500" : "text-sm"
              }
            >
              {message4}
            </div>
            {teamsTS.length !== 0 && tipo == "Cambio" && (
              <>
                <button
                  onClick={substitution}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}
            {teamsTS.length !== 0 && tipo == "Gol y asistencia" && (
              <>
                <button
                  onClick={registerAGoalAndAssist}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}

            {teamsTS.length !== 0 && tipo == "Tarjeta amarilla" && (
              <>
                <button
                  onClick={yellowCard}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}

            {teamsTS.length !== 0 && tipo == "Tarjeta roja" && (
              <>
                <button
                  onClick={RedCard}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}

            {teamsTS.length !== 0 && tipo == "Gol de penal" && (
              <>
                <button
                  onClick={PenaltyGoal}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}

            {teamsTS.length !== 0 && tipo == "Penal errado" && (
              <>
                <button
                  onClick={PenaltyMissed}
                  className="w-[200px] mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                  Registrar
                </button>
              </>
            )}
          </div>
        </Modal2>
      </>
    );
  }
}