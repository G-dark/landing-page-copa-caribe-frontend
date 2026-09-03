"use client";

import { useState } from "react";
import { useHome } from "../../lib/Contexts/HomeContexts";
import depandcities from "../../../public/departmentsAndCities.json";
import NavBar from "../../ui/NavBar";
import MiniCard from "../../ui/MiniCard";
import { getTeamByQuery } from "../../lib/Services/TeamService";
import MiniCard2 from "../../ui/Minicard2";
import { createTournament } from "../../lib/Services/TournamentService";
import { useSearchParams } from "next/navigation";

export default function CrearTorneoContent() {
  const searchParams = useSearchParams();
  const parent = searchParams.get("parent");
  const isParentText = searchParams.get("isParent");
  const isParent = isParentText == "true" ? true : false;
  const { year } = useHome();
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

  const [automatedSorteo, setAutomated] = useState(true);
  const [searchedTeam, setSearched] = useState("");
  const [teams, setTeams] = useState<any>([]);
  const [teamsNoChosen, setTeamsNC] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [groupsInput, setGroupsInput] = useState("");

  // declare states for error variables for form management
  const [nameError, setNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [startError, setStartError] = useState("");
  const [endError, setEndError] = useState("");
  const [matchDurationError, setMatchDurationError] = useState("");
  const [numberPlayersError, setNumberPlayersError] = useState("");
  const [numberTeamsError, setNumberTeamsError] = useState("");
  const [numberTeamsCError, setNumberTeamsCError] = useState("");
  const [groupsInputError, setGroupsInputError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const handleEditionChange = (e: any) => {
    if (e.target.value == "1") {
      setEdition(year.toString());
    }
    if (e.target.value == "2") {
      setEdition((Number(year) + 1).toString());
    }
    if (e.target.value == "3") {
      setEdition((Number(year) + 2).toString());
    }
  };

  const fetchTeams = async () => {
    const query = { category: category, name: searchedTeam, edition };
    const res = await getTeamByQuery(query);
    const data = await res.json();
    setTeamsNC(data);

    if (
      "error" in data &&
      data["error"].includes("Not team(s) found") &&
      searchedTeam !== ""
    ) {
      setCategoryError("No hay equipos con esa categoría");
    } else {
      setCategoryError("");
    }
  };

  const transformInput2groups = (textInput: string) => {
    const groupsList = teams.map((team: any) => {
      return team.id;
    });
    let Groups = Array.from(
      { length: Number(numberGroups) },
      () => [] as any[],
    );
    const partes = textInput.split(" ");
    let i = 0;
    for (let parte of partes) {
      const teams = parte.split("-");
      for (let team of teams) {
        Groups[i].push(groupsList[Number(team) - 1]);
      }
      i++;
    }
    return Groups;
  };
  const createTournamentF = async () => {
    if (validateTournamentForm()) {
      const tournament = {
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
        isParent,
        parent,
        department,
        AutomatedSorteo: automatedSorteo,
        boardGroups: transformInput2groups(groupsInput),
      };
      const resp = await createTournament(
        tournament,
        localStorage.getItem("token")!,
      );
      const data = await resp.json();
      if ("success" in data) {
        setMessage("Torneo creado correctamente");
      } else {
        setMessage("Error: Un error ha ocurrido");
      }
    } else {
      setMessage("Error: Revise los datos indicados");
    }
  };

  const validateTournamentForm = () => {
    let validate = false,
      validate2 = false,
      validate3 = false,
      validate4 = false,
      validate5 = false,
      validate6 = false,
      validate7 = false,
      validate8 = false,
      validate9 = false,
      validate10 = false;

    const regexGroupsFormat = /^[0-9-\s]+$/;

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

    if (Number(matchDuration) <= 0) {
      setMatchDurationError("La duración debe ser mayor que 0");
      validate5 = false;
    } else {
      setMatchDurationError("");
      validate5 = true;
    }

    if (Number(numberPlayers) < 4) {
      setNumberPlayersError("Un equipo debe tener más de 4");
      validate6 = false;
    } else {
      setNumberPlayersError("");
      validate6 = true;
    }

    if (Number(teamsPerGroup) * Number(numberGroups) < 8) {
      setNumberTeamsError("Al menos 8 equipos para crear un torneo");
      validate7 = false;
    } else {
      setNumberTeamsError("");
      validate7 = true;
    }

    if (teams.length < Number(teamsPerGroup) * Number(numberGroups)) {
      setNumberTeamsCError("Faltan equipos por seleccionar");
      validate8 = false;
    } else {
      setNumberTeamsCError("");
      validate8 = true;
    }
    if (!automatedSorteo) {
      if (groupsInput.match(regexGroupsFormat)) {
        validate9 = true;
        setGroupsInputError("");
      } else {
        validate9 = false;
        setGroupsInputError("El formato no es el indicado");
      }
      const size = teams.map((team: any) => {
        return team.id;
      }).length;
      for (let i = 1; i <= size; i++) {
        if (!groupsInput.includes(String(i))) validate10 = false;
      }
    } else {
      validate9 = true;
      validate10 = true;
    }

    if (isParent) {
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
        validate8 &&
        validate9
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="mt-30 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl">Crear torneo</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm" htmlFor="name">
              Nombre
            </label>
            <input
              className={
                nameError == ""
                  ? "w-full mt-1 bg-gray-200 rounded p-2"
                  : "w-full mt-1 bg-gray-200 rounded p-2 border-2 border-red-500"
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

          {!isParent ? (
            <div className="flex flex-col">
              <label className="text-sm" htmlFor="category">
                Categoria
              </label>
              <input
                type="number"
                value={category}
                id="category"
                onChange={(e) => setCategory(e.target.value)}
                className={
                  categoryError == ""
                    ? "w-full mt-1 p-2 bg-gray-200 rounded"
                    : "w-full mt-1 p-2 bg-gray-200 rounded border-2 border-red-500"
                }
              />
              <div className="text-sm text-red-500">{categoryError}</div>
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
              <option value="1">{year}</option>
              <option value="2">{Number(year + 1)}</option>
              <option value="3">{Number(year + 2)}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="selectDeparment" className="text-black text-sm">
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
                <option key={department.id} value={department.departamento}>
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
          {!isParent ? (
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
                onChange={(e) => setNumberGroups(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}

          {!isParent ? (
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
                onChange={(e) => setTeamsPG(e.target.value)}
              />
              <div className="text-sm text-red-500">{numberTeamsError}</div>
            </div>
          ) : (
            ""
          )}
          {!isParent ? (
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
                onChange={(e) => setNumberPlayers(e.target.value)}
              />
              <div className="text-sm text-red-500">{numberPlayersError}</div>
            </div>
          ) : (
            ""
          )}

          {!isParent ? (
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
                onChange={(e) => setMatchDuration(e.target.value)}
              />
              <div className="text-sm text-red-500">{matchDurationError}</div>
            </div>
          ) : (
            ""
          )}
        </div>
        {!isParent && (
          <>
            <div className="mt-4 mb-4">Agregar Equipos</div>
            <div className="flex flex-col">
              <div className="flex">
                <input
                  value={searchedTeam}
                  onChange={(e) => setSearched(e.target.value)}
                  type="search"
                  name="searchbar"
                  id="searchbar"
                  className="border-2 rounded"
                />
                <div onClick={fetchTeams} className="icon-search ml-2"></div>
              </div>

              <div className="flex flex-col justify-center items-center rounded mt-5 mb-5">
                {teamsNoChosen.length > 0
                  ? teamsNoChosen.map((team: any, index: number) => {
                      return (
                        <MiniCard2
                          item={team}
                          setTeams={setTeams}
                          teams={teams}
                          key={index}
                          setMessage={setMessage2}
                        />
                      );
                    })
                  : "No hay coincidencias"}
                {message2}
              </div>
            </div>
            <div className="text-sm text-red-500">{numberTeamsCError}</div>
            <div className="flex flex-col m-3 text-sm">
              Equipos:
              {teams.length +
                "/" +
                Number(teamsPerGroup) * Number(numberGroups) +
                " "}
              {teams.length > 0
                ? teams.map((team: any, index: number) => {
                    return (
                      <MiniCard
                        item={team}
                        teams={teams}
                        setTeams={setTeams}
                        index={index}
                        key={index}
                        showNumbers={!automatedSorteo}
                      />
                    );
                  })
                : "Agrega equipos"}
            </div>
            <div className="flex flex-col">
              <label className="text-sm" htmlFor="sorteocb">
                Sorteo automático
              </label>

              <input
                type="checkbox"
                name="sorteocb"
                id="sorteocb"
                onChange={(e) => setAutomated(e.target.checked)}
                checked={automatedSorteo}
              />
            </div>

            {!automatedSorteo && (
              <div className="flex flex-col justify-content items-center">
                <div className="text-sm">Sorteo manual:</div>
                <div className="text-sm">Ingresar grupos ordenados</div>

                <input
                  value={groupsInput}
                  onChange={(e) => setGroupsInput(e.target.value)}
                  type="text"
                  className="text-center"
                  placeholder="1-2-3-4 5-6-7-8"
                />
                <div className="text-sm text-red-500">{groupsInputError}</div>
              </div>
            )}
          </>
        )}

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
          onClick={createTournamentF}
          className="w-[200px] mb-7 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          Crear torneo
        </button>
      </div>
    </>
  );
}