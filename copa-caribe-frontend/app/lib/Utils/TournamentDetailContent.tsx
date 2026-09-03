"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "../../ui/NavBar";
import { useEffect, useState } from "react";
import { useHome } from "../Contexts/HomeContexts";

import depandcities from "../../../public/departmentsAndCities.json";

import {
  deleteTournament,
  getTournamentByID,
  inscribeTeamToTournament,
  updateTournament,
} from "../Services/TournamentService";
import Paginator from "../../ui/Paginator";
import CardTeam from "../../ui/CardTeam";
import CardTournament from "../../ui/CardTournament";
import { getTeamByID } from "../Services/TeamService";
import Modal from "../../ui/Modal";
import Paginator2 from "../../ui/Paginator2";
import CardMatch from "../../ui/CardMatch";
import { getMatchByID } from "../Services/MatchService";
import Brackets from "../../ui/Brackets";
import Positions from "../../ui/Positions";
import Modal2 from "../../ui/Modal2";
import MiniCard2 from "../../ui/Minicard2";
import MiniCard from "../../ui/MiniCard";
import { getPlayerByID } from "../Services/PlayerService";
import MiniCard3 from "../../ui/Minicard3";
import PlayersStats from "../../ui/PlayersStats";

export default function TournamentDetailContent() {
  const searchParams = useSearchParams();
  const tournamentID = searchParams.get("id");
  const router = useRouter();
  const { year, rol } = useHome();
  // declare states for variables
  const [edition, setEdition] = useState(year.toString());
  const [name, setName] = useState("");
  const [category, setCategory] = useState(year.toString());
  const [department, setDeparment] = useState("Atlántico");
  const [city, setCity] = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");
  const [teamsPerGroup, setTeamsPG] = useState("");
  const [numberGroups, setNumberGroups] = useState("");
  const [numberPlayers, setNumberPlayers] = useState("");
  const [matchDuration, setMatchDuration] = useState("");
  const [teams, setTeams] = useState<any>([]);
  const [tournament, setTournament] = useState<any>({});
  const [children, setChildren] = useState<any>([]);
  const [matches, setMatches] = useState<any>([]);
  const user = JSON.parse(localStorage.getItem("user")!);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  const [isOpen2, setOpen2] = useState(false);
  const closeModal2 = () => {
    setOpen2(false);
    setPlayersTS([]);
    setMessage3("");
    setTeamsTS([]);
  };
  const openModal2 = () => setOpen2(true);
  const [isOpen3, setOpen3] = useState(false);
  const closeModal3 = () => {
    setTeamsTS([]);
    setMessage4("");
    setOpen3(false);
  };
  const openModal3 = () => setOpen3(true);
  const [teamsTS, setTeamsTS] = useState<any>([]);
  const [playersNTS, setPlayersNTS] = useState<any>([]);
  const [playersTS, setPlayersTS] = useState<any>([]);
  const [teamsNTS, setTeamsNTS] = useState<any>([]);
  const [selectedView, setSelectedView] = useState("Posiciones");

  // declare states for error variables for form management
  const [nameError, setNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [startError, setStartError] = useState("");
  const [endError, setEndError] = useState("");
  const [matchDurationError, setMatchDurationError] = useState("");
  const [numberPlayersError, setNumberPlayersError] = useState("");
  const [numberTeamsError, setNumberTeamsError] = useState("");
  const [numberTeamsCError, setNumberTeamsCError] = useState("");

  const handleEditionChange = (e: any) => {
    if (e.target.value == "1") {
      setEdition(edition);
    }
    if (e.target.value == "2") {
      setEdition(year.toString());
    }
    if (e.target.value == "3") {
      setEdition((Number(year) + 1).toString());
    }
    if (e.target.value == "4") {
      setEdition((Number(year) + 2).toString());
    }
  };
  // initial load
  useEffect(() => {
    fetchTournament();
  }, []);

  // refresh in case of a request to the same page
  useEffect(() => {
    fetchTournament();
  }, [tournamentID]);

  // initial load
  useEffect(() => {
    fetchTournament();
  }, [refresh]);

  useEffect(() => {
    setPlayersTS([]);
    fetchPlayers();
  }, [teamsTS]);

  const fetchPlayers = async () => {
    let players = [];
    if (teamsTS[0]) {
      for (let player of teamsTS[0].players) {
        const res = await getPlayerByID(player, localStorage.getItem("token")!);
        const playerR = await res.json();
        players.push(playerR);
      }
      setPlayersNTS(players.flat());
    }
  };
  const fetchTournament = async () => {
    setMessage("");
    const response = await getTournamentByID(tournamentID!);
    const data = await response.json();
    setEdition(data[0].edition);
    setName(data[0].name);
    setCategory(data[0].category);
    setCity(data[0].city);

    const partes = data[0].startDate.split("T");
    const partes2 = data[0].endDate.split("T");
    setStart(partes[0]);
    setEnd(partes2[0]);
    setNumberGroups(data[0].numberGroups);
    setTeamsPG(data[0].numberTeamsPerGroup);
    setMatchDuration(data[0].matchDuration);
    setNumberPlayers(data[0].numberPlayers);
    setDeparment(data[0].department);
    let teamsR = [];
    for (let team of data[0].teams) {
      const res = await getTeamByID(team);
      const teamR = await res.json();
      teamsR.push(teamR);
    }
    setTeams(teamsR.flat());
    const teamtmp = teamsR.flat();

    if (!data[0].isParent) {
      let matchess = [];
      for (let match of data[0].matches) {
        const res = await getMatchByID(match);
        const mach = await res.json();
        matchess.push(mach);
      }

      let tmp = matchess.flat();
      let teamsRawr: any[] = [];

      for (let match of tmp) {
        const zuluDate1 = new Date(match.date);

        // Obtener el desplazamiento local en minutos
        const offset1 = zuluDate1.getTimezoneOffset() * 60000;
        const localTime1 = new Date(zuluDate1.getTime() - offset1);

        // Formatear a YYYY-MM-DDTHH:mm (formato válido para datetime-local)
        const datetimeLocal1 = localTime1.toISOString().slice(0, 16);
        match.date = datetimeLocal1;
        const teamA = teamtmp.find((team: any) => team.id == match.teamA);
        const teamB = teamtmp.find((team: any) => team.id == match.teamB);
        if (teamA) {
          match.teamA = teamA;
        }
        if (teamB) {
          match.teamB = teamB;
        }
      }

      setMatches(tmp);
    }
    // children tournaments
    if (data[0].isParent) {
      let tournaments = [];
      for (let child of data[0].children) {
        const res = await getTournamentByID(child);
        const tn = await res.json();
        tournaments.push(tn);
      }
      setChildren(tournaments.flat());
    }

    // pass the team info to the boardgroups
    for (let group of data[0].boardGroups) {
      for (let equipo of group) {
        const teamR = teamtmp.find((team: any) => team.id == equipo.team);
        if (teamR) {
          equipo.team = teamR;
        }
      }
    }

    let intersection = [];
    // intersection of user teams with teams
    for (let team of user.team) {
      if (data[0].teams.includes(team)) {
        intersection.push(team);
      }
    }

    //intersection with details
    let interWithDetails = [];
    for (let team of intersection) {
      for (let tmpteam of teamtmp) {
        if (tmpteam.id == team) {
          interWithDetails.push(tmpteam);
        }
      }
    }
    setTeamsNTS(interWithDetails);
    setTournament(data[0]);
    for (const gs of data[0].goalscorers) {
      const res = await Promise.allSettled([
        getPlayerByID(gs.player, localStorage.getItem("token")!),
        getTeamByID(gs.team),
      ]);
      if (res[0].status == "fulfilled" && res[1].status == "fulfilled") {
        const data = await res[0].value.json();
        gs.player = data[0];
        const data2 = await res[1].value.json();
        gs.team = data2[0];
      }
    }
    for (const as of data[0].assisters) {
       const res = await Promise.allSettled([
        getPlayerByID(as.player, localStorage.getItem("token")!),
        getTeamByID(as.team),
      ]);
      if (res[0].status == "fulfilled" && res[1].status == "fulfilled") {
        const data = await res[0].value.json();
        as.player = data[0];
        const data2 = await res[1].value.json();
        as.team = data2[0];
      }
    }
    for (const plyc of data[0].playerWithMostYellowCards) {
      const res = await Promise.allSettled([
        getPlayerByID(plyc.player, localStorage.getItem("token")!),
        getTeamByID(plyc.team),
      ]);
      if (res[0].status == "fulfilled" && res[1].status == "fulfilled") {
        const data = await res[0].value.json();
        plyc.player = data[0];
        const data2 = await res[1].value.json();
        plyc.team = data2[0];
      }
    }
    setLoading(false);
  };

  const updateTournamentF = async () => {
    if (validateTournamentForm()) {
      if (validateDifferences()) {
        const tournamentE = {
          name,
          category,
          edition,
          city,
          startDate,
          endDate,
          teams: teams.map((team: any) => {
            return team.id;
          }),
          teamsPerGroup,
          numberGroups,
          numberPlayers,
          matchLong: matchDuration,
          isParent: tournament.isParent,
          parent: tournament.parent,
        };
        const resp = await updateTournament(
          tournamentID!,
          localStorage.getItem("token")!,
          JSON.stringify({ tournament: tournamentE }),
        );
        const data = await resp.json();
        if ("success" in data) {
          setMessage("Torneo actualizado correctamente");
          setRefresh((prev) => !prev);
        } else {
          setMessage("Error: Un error ha ocurrido");
        }
      } else {
        setMessage("No se han detectado cambios");
      }
    } else {
      setMessage("Error: Revise los datos indicados");
    }
  };
  const inscribeTeamToTournamentF = async () => {
    if (playersTS.length <= 20) {
      const info = {
        players: playersTS.map((player: any) => player.id),
        team: teamsTS[0].id,
      };
      const res = await inscribeTeamToTournament(
        tournamentID!,
        localStorage.getItem("token")!,
        JSON.stringify(info),
      );
      const data = await res.json();
      if ("success" in data) {
        closeModal2();
        setMessage3("");
      } else {
        setMessage3("Ha ocurrido un error");
      }
    } else {
      setMessage3("Máximo 20 jugadores por equipo");
    }
  };
  const deleteTournamentF = async () => {
    const res = await deleteTournament(
      tournamentID!,
      localStorage.getItem("token")!,
    );
    const data = await res.json();
    if ("success" in data) {
      router.push("/equipo");
    }
  };
  const validateDifferences = () => {
    return (
      name !== tournament.name ||
      category !== tournament.category ||
      edition !== tournament.edition ||
      city !== tournament.city ||
      department !== tournament.department ||
      startDate !== tournament.startDate.split("T")[0] ||
      endDate !== tournament.endDate.split("T")[0]
    );
  };

  const validateTournamentForm = () => {
    let validate = false,
      validate2 = false,
      validate3 = false,
      validate4 = false,
      validate5 = false,
      validate6 = false,
      validate7 = false,
      validate8 = false;

    if (name == "") {
      setNameError("Debe tener un nombre");
      validate = false;
    } else {
      validate = true;
      setNameError("");
    }

    if (city == "") {
      setCityError("Elige una ciudad");
      validate2 = false;
    } else {
      validate2 = true;
      setCityError("");
    }

    if (startDate == "") {
      setStartError("Elige una fecha de inicio");
      validate3 = false;
    } else {
      if (new Date(startDate) > new Date(endDate)) {
        setStartError("Elige una fecha diferente");
        validate3 = false;
      } else {
        setStartError("");
        validate3 = true;
      }
    }

    if (endDate == "") {
      setEndError("Elige una fecha de fín");
      validate4 = false;
    } else {
      if (new Date(startDate) > new Date(endDate)) {
        setEndError("Elige una fecha diferente");
        validate4 = false;
      } else {
        setEndError("");
        validate4 = true;
      }
    }

    if (Number(matchDuration) <= 0 && !tournament.isParent) {
      setMatchDurationError("La duración debe ser mayor que 0");
      validate5 = false;
    } else {
      setMatchDurationError("");
      validate5 = true;
    }

    if (Number(numberPlayers) < 4 && !tournament.isParent) {
      setNumberPlayersError("Un equipo debe tener más de 4");
      validate6 = false;
    } else {
      setNumberPlayersError("");
      validate6 = true;
    }

    if (
      Number(teamsPerGroup) * Number(numberGroups) < 8 &&
      !tournament.isParent
    ) {
      setNumberTeamsError("Al menos 8 equipos para crear un torneo");
      validate7 = false;
    } else {
      setNumberTeamsError("");
      validate7 = true;
    }

    if (
      teams.length < Number(teamsPerGroup) * Number(numberGroups) &&
      !tournament.isParent
    ) {
      setNumberTeamsCError("Faltan equipos por seleccionar");
      validate8 = false;
    } else {
      setNumberTeamsCError("");
      validate8 = true;
    }
    if (tournament.isParent) {
      return validate && validate2 && validate3 && validate4;
    } else {
      return (
        validate &&
        validate2 &&
        validate3 &&
        validate4 &&
        validate5 &&
        validate6 &&
        validate7 &&
        validate8
      );
    }
  };

  const generateCards = () => {
    if (
      tournament.playersInTournament.some(
        (team: any) => team.numberPlayers > 0 && team.team == teamsTS[0].id,
      )
    ) {
      router.push(
        "/escarapelas?teamID=" +
          teamsTS[0].id +
          "&tournamentID=" +
          tournamentID,
      );
      setMessage4("");
    } else {
      setMessage4("No hay jugadores inscritos para ese equipo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  } else {
    return (
      <>
        <NavBar />
        <div className="mt-30 flex flex-col justify-center items-center">
          {rol == "Admin" && (
            <>
              <div className="flex flex-col">
                <input
                  className={
                    nameError == ""
                      ? "w-full mt-1 bg-white rounded p-2 text-4xl font-bold text-center mb-10"
                      : "w-full mt-1 bg-white rounded p-2  text-4xl font-bold text-center mb-10 border-2 border-red-500"
                  }
                  type="text"
                  value={name}
                  id="name"
                  autoComplete="Copa Caribe"
                  placeholder="Copa Caribe"
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="text-sm text-red-500">{nameError}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category !== "Padre" ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="category">
                      Categoria
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      value={category}
                      id="category"
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col">
                  <label htmlFor="selectEdition" className="text-black text-sm">
                    Edición
                  </label>

                  <select
                    name="selectEdition"
                    id="selectEdition"
                    onChange={handleEditionChange}
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                  >
                    <option value="1">{edition}</option>
                    <option value="2">{year}</option>
                    <option value="3">{Number(year + 1)}</option>
                    <option value="4">{Number(year + 2)}</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="selectDeparment"
                    className="text-black text-sm"
                  >
                    Departamento
                  </label>
                  <select
                    name="selectDepartment"
                    id="selectDeparment"
                    value={department}
                    onChange={(e) => setDeparment(e.target.value)}
                    className="w-full h-20/32 mt-1 p-2 bg-gray-200 rounded text-black"
                  >
                    {depandcities.map((department) => (
                      <option
                        key={department.id}
                        value={department.departamento}
                      >
                        {department.departamento}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <datalist id="cities">
                    {depandcities
                      .find((dep) => {
                        return dep.departamento == department;
                      })!
                      .ciudades.map((city) => (
                        <option key={city} value={city}></option>
                      ))}
                  </datalist>
                  <label htmlFor="city" className="text-black text-sm">
                    Ciudad
                  </label>
                  <input
                    list="cities"
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={
                      cityError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                  <div className="text-sm text-red-500">{cityError}</div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fechainicio">Fecha de inicio</label>
                  <input
                    value={startDate}
                    onChange={(e) => setStart(e.target.value)}
                    type="date"
                    name="fechainicio"
                    id="fechainicio"
                    className={
                      startError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                  <div className="text-sm text-red-500">{startError}</div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fechafin">Fecha de fin</label>
                  <input
                    value={endDate}
                    onChange={(e) => setEnd(e.target.value)}
                    type="date"
                    name="fechafin"
                    id="fechafin"
                    className={
                      startError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                  <div className="text-sm text-red-500">{endError}</div>
                </div>
                {Number(numberGroups) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#groups">
                      Numero de grupos
                    </label>
                    <input
                      autoComplete="2"
                      type="number"
                      className={
                        numberTeamsError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={numberGroups}
                      id="#groups"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}

                {Number(teamsPerGroup) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#teamspergroup">
                      Equipos por grupo
                    </label>
                    <input
                      autoComplete="4"
                      type="number"
                      className={
                        numberTeamsError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={teamsPerGroup}
                      id="#teamspergroup"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
                {Number(numberPlayers) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#players">
                      Jugadores por equipo
                    </label>
                    <input
                      autoComplete="11"
                      type="number"
                      className={
                        numberPlayersError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={numberPlayers}
                      id="#players"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
                {Number(matchDuration) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="matchDuration">
                      Duración del partido
                    </label>
                    <input
                      autoComplete="45"
                      type="number"
                      className={
                        matchDurationError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={matchDuration}
                      id="matchDuration"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                className={
                  message.includes("Error")
                    ? "text-red-500 p-5"
                    : "text-green-500 p-5"
                }
              >
                {message}
              </div>
              <button
                onClick={updateTournamentF}
                className="w-[200px] mb-7 mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Actualizar torneo
              </button>
            </>
          )}

          {teams.some((team: any) => {
            return user.team.includes(team.id);
          }) &&
            rol == "Admin" &&
            !tournament.isParent &&
            new Date(Date.now()) < new Date(tournament.startDate) && (
              <button
                onClick={openModal2}
                className="w-[200px] bg-yellow-500 hover:bg-yellow-600 mb-7 text-white py-2 rounded-lg transition"
              >
                Confirmar inscripción
              </button>
            )}

          {teams.some((team: any) => {
            return user.team.includes(team.id);
          }) &&
            rol == "Admin" &&
            !tournament.isParent &&
            new Date(Date.now()) < new Date(tournament.startDate) && (
              <button
                onClick={openModal3}
                className="w-[200px] bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Generar Escarapelas
              </button>
            )}

          {rol !== "Admin" && (
            <>
              <div className="flex flex-col">
                <input
                  className={
                    nameError == ""
                      ? "w-full mt-1 bg-white rounded p-2 text-4xl font-bold text-center mb-10"
                      : "w-full mt-1 bg-white rounded p-2 text-4xl font-bold text-center mb-10 border-2 border-red-500"
                  }
                  type="text"
                  value={name}
                  id="name"
                  autoComplete="Copa Caribe"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category !== "Padre" ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="category">
                      Categoria
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      value={category}
                      id="category"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col">
                  <label htmlFor="selectEdition" className="text-black text-sm">
                    Edición
                  </label>

                  <input
                    name="selectEdition"
                    id="selectEdition"
                    readOnly
                    value={edition}
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="selectDeparment"
                    className="text-black text-sm"
                  >
                    Departamento
                  </label>
                  <input
                    name="selectDepartment"
                    id="selectDeparment"
                    value={department}
                    readOnly
                    className="w-full h-20/32 mt-1 p-2 bg-gray-200 rounded text-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="city" className="text-black text-sm">
                    Ciudad
                  </label>
                  <input
                    list="cities"
                    type="text"
                    id="city"
                    value={city}
                    readOnly
                    className={
                      cityError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fechainicio">Fecha de inicio</label>
                  <input
                    value={startDate}
                    readOnly
                    type="date"
                    name="fechainicio"
                    id="fechainicio"
                    className={
                      startError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fechafin">Fecha de fin</label>
                  <input
                    value={endDate}
                    readOnly
                    type="date"
                    name="fechafin"
                    id="fechafin"
                    className={
                      startError == ""
                        ? "w-full mt-1 p-2 bg-gray-200 rounded"
                        : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                    }
                  />
                </div>
                {Number(numberGroups) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#groups">
                      Numero de grupos
                    </label>
                    <input
                      autoComplete="2"
                      type="number"
                      className={
                        numberTeamsError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={numberGroups}
                      id="#groups"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}

                {Number(teamsPerGroup) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#teamspergroup">
                      Equipos por grupo
                    </label>
                    <input
                      autoComplete="4"
                      type="number"
                      className={
                        numberTeamsError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={teamsPerGroup}
                      id="#teamspergroup"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
                {Number(numberPlayers) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="#players">
                      Jugadores por equipo
                    </label>
                    <input
                      autoComplete="11"
                      type="number"
                      className={
                        numberPlayersError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={numberPlayers}
                      id="#players"
                      readOnly
                    />
                    <div className="text-sm text-red-500"></div>
                  </div>
                ) : (
                  ""
                )}
                {Number(matchDuration) !== 0 ? (
                  <div className="flex flex-col">
                    <label className="text-sm" htmlFor="matchDuration">
                      Duración del partido
                    </label>
                    <input
                      autoComplete="45"
                      type="number"
                      className={
                        matchDurationError == ""
                          ? "w-full mt-1 p-2 bg-gray-200 rounded"
                          : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                      }
                      value={matchDuration}
                      id="matchDuration"
                      readOnly
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          )}

          {teams.some((team: any) => {
            return user.team.includes(team.id);
          }) &&
            rol == "User" &&
            !tournament.isParent &&
            new Date(Date.now()) < new Date(tournament.startDate) && (
              <button
                onClick={openModal2}
                className="w-[200px] bg-yellow-500 hover:bg-yellow-600 mb-7 text-white py-2 rounded-lg transition"
              >
                Confirmar inscripción
              </button>
            )}

          {teams.some((team: any) => {
            return user.team.includes(team.id);
          }) &&
            rol == "User" &&
            !tournament.isParent &&
            new Date(Date.now()) < new Date(tournament.startDate) && (
              <button
                onClick={openModal3}
                className="w-[200px] bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Generar Escarapelas
              </button>
            )}

          {!tournament.isParent ? (
            <>
              <div className="font-bold text-lg mt-4 mb-4">Equipos</div>
              <div className="flex flex-col">
                <div className="flex">
                  <Paginator array={teams} CardItem={CardTeam} />
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {tournament.isParent ? (
            <div className="flex flex-col justify-center items-center">
              <div className="font-bold text-lg mt-20 mb-4">
                Torneos asociados
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex">
                  {children.length > 0 ? (
                    <Paginator array={children} CardItem={CardTournament} />
                  ) : (
                    <p>No hay torneos aún</p>
                  )}
                </div>
                {rol == "Admin" && (
                  <div
                    onClick={() =>
                      router.push(
                        "/crearTorneo?isParent=false" +
                          "&parent=" +
                          tournamentID,
                      )
                    }
                    className="text-5xl text-blue-500 cursor-pointer"
                  >
                    +
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* posiciones and more options */}
          {!tournament.isParent && (
            <div className="flex flex-col justify-center items-center">
              <div className="flex">
                <div
                  onClick={() => setSelectedView("Posiciones")}
                  className={
                    selectedView == "Posiciones"
                      ? "font-bold text-lg mt-4 mb-4 mr-4 bg-gray-300 rounded-2xl p-1 cursor-pointer"
                      : "font-bold text-lg mt-4 mb-4 mr-4 cursor-pointer"
                  }
                >
                  Posiciones
                </div>
                <div
                  onClick={() => setSelectedView("Goleadores")}
                  className={
                    selectedView == "Goleadores"
                      ? "font-bold text-lg mt-4 mb-4 mr-4 bg-gray-300 rounded-2xl p-1 cursor-pointer"
                      : "font-bold text-lg mt-4 mb-4 mr-4 cursor-pointer"
                  }
                >
                  Goleadores
                </div>
                <div
                  onClick={() => setSelectedView("Asistidores")}
                  className={
                    selectedView == "Asistidores"
                      ? "font-bold text-lg mt-4 mb-4 mr-4 bg-gray-300 rounded-2xl p-1 cursor-ponter"
                      : "font-bold text-lg mt-4 mb-4 mr-4 cursor-pointer"
                  }
                >
                  Asistidores
                </div>
                <div
                  onClick={() => setSelectedView("Amarillas")}
                  className={
                    selectedView == "Amarillas"
                      ? "font-bold text-lg mt-4 mb-4 mr-4 bg-gray-300 rounded-2xl p-1 cursor-pointer"
                      : "font-bold text-lg mt-4 mb-4 mr-4 cursor-pointer"
                  }
                >
                  Jugadores con más amarillas
                </div>
              </div>

              {selectedView == "Posiciones" && (
                <div className="flex flex-col justify-center items-center">
                  <Positions boardGroups={tournament.boardGroups} />
                </div>
              )}

              {selectedView == "Goleadores" && (
                <div className="flex flex-col justify-center items-center">
                  <PlayersStats players={tournament.goalscorers} item="Goles" />
                </div>
              )}

              {selectedView == "Asistidores" && (
                <div className="flex flex-col justify-center items-center">
                  <PlayersStats
                    players={tournament.assisters}
                    item="Asistencias"
                  />
                </div>
              )}

              {selectedView == "Amarillas" && (
                <div className="flex flex-col justify-center items-center">
                  <PlayersStats
                    players={tournament.playerWithMostYellowCards}
                    item="Amarillas"
                  />
                </div>
              )}
            </div>
          )}

          {/* Partidos */}
          {!tournament.isParent && (
            <div className="flex flex-col justify-center items-center">
              <div className="font-bold text-lg mt-4 mb-4">Partidos</div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex">
                  {matches.length > 0 ? (
                    <Paginator2 array={matches} CardItem={CardMatch} />
                  ) : (
                    <p>No hay partidos aún</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {!tournament.isParent && (
            <Brackets
              numberTeamsPerGroup={tournament.numberTeamsPerGroup}
              numberGroups={tournament.numberGroups}
              matches={matches}
            />
          )}
          {/* btn for delete tournament only visible for admin */}
          {rol == "Admin" && (
            <div
              onClick={openModal}
              className="icon-trash2 mt-15 bg-red-500 rounded-xl p-2 hover:bg-red-600 cursor-pointer"
            ></div>
          )}
        </div>
        <Modal onClose={closeModal} isOpen={isOpen}>
          <div className="flex flex-col justify-center items-center">
            ¿Seguro que quieres eliminar este torneo?
            <div className="flex mt-5">
              <div
                onClick={deleteTournamentF}
                className="icon-trash2 mr-10 text-sm flex flex-col justify-center items-center cursor-pointer"
              >
                Eliminar
              </div>
              <div
                onClick={closeModal}
                className="icon-return text-sm flex flex-col cursor-pointer"
              >
                Atrás
              </div>
            </div>
          </div>
        </Modal>
        <Modal2 onClose={closeModal2} isOpen={isOpen2}>
          <div className="flex flex-col justify-center items-center">
            <p>¿Cual equipo quieres inscibir?</p>
            <div className="flex flex-wrap max-w-[400px] justify-center items-center">
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
                        setMessage={setMessage2}
                      />
                    );
                  })}
            </div>
            {teamsTS.length > 0 && (
              <>
                <p>Elige tus jugadores</p>
                <div className="flex flex-wrap max-h-[200px] overflow-y-auto  max-w-[500px]">
                  {playersNTS.length > 0 ? (
                    playersNTS.map((player: any, index: number) => {
                      return (
                        <MiniCard3
                          key={index}
                          item={player}
                          setItems={setPlayersTS}
                          array={playersTS}
                          setMessage={setMessage2}
                        />
                      );
                    })
                  ) : (
                    <p>No hay jugadores a elegir</p>
                  )}
                </div>
                <div className="text-sm text-red-500 mb-5">{message2}</div>
                <p>Jugadores elegidos</p>
                <div className="flex flex-wrap max-h-[200px] overflow-y-auto max-w-[500px]">
                  {playersTS.length > 0 ? (
                    playersTS.map((player: any, index: number) => {
                      return (
                        <MiniCard
                          key={index}
                          item={player}
                          setTeams={setPlayersTS}
                          teams={playersTS}
                          showNumbers={false}
                          index={index}
                        />
                      );
                    })
                  ) : (
                    <p>No hay jugadores elegidos</p>
                  )}
                </div>
              </>
            )}
            <div className="text-red-500 text-sm">{message3}</div>
            {playersTS.length > 0 && (
              <button
                onClick={inscribeTeamToTournamentF}
                className="w-[200px] mt-10 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
              >
                Confirmar inscripción
              </button>
            )}
          </div>
        </Modal2>
        {/* Modal para elegir equipo al que generarle las escarapelas */}
        <Modal2 onClose={closeModal3} isOpen={isOpen3}>
          <div className="flex flex-col justify-center items-center">
            <p>¿A cual equipo le deseas generar las escarapelas?</p>
            <div className="flex flex-wrap max-w-[400px] justify-center items-center">
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
                        setMessage={setMessage2}
                      />
                    );
                  })}
            </div>
            <div className="text-red-500 text-sm mt-5">{message4}</div>
            {teamsTS.length > 0 && (
              <button
                onClick={generateCards}
                className="w-[200px] mt-5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Generar escarapelas
              </button>
            )}
          </div>
        </Modal2>
      </>
    );
  }
}