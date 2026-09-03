"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import NavBar from "../ui/NavBar";
import { useEffect, useState } from "react";
import default_profile from "../../public/default_profile.png";
import CountrySelector from "../ui/CountrySelector";
import {
  deletePlayer,
  getPlayerByID,
  getPlayerQuery,
  updatePlayer,
} from "../lib/Services/PlayerService";
import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";

export default function PlayerDetail() {
  const searchParams = useSearchParams();
  const playerid = searchParams.get("id");
  const router = useRouter();
  const [name, setName] = useState("");
  const [player, setPlayer] = useState<any>({});
  const [id, setId] = useState("");
  const [country, setCountry] = useState("");
  const [dorsal, setDorsal] = useState("0");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [image, setImage] = useState("");
  const [logo, setLogo] = useState(new File([], ""));
  const [response, setResponse] = useState("");
  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [dorsalError, setDorsalError] = useState("");
  const [birthYearError, setBirthYearError] = useState("");
  const [talla, setTalla] = useState("");
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user")!),
  );
  const [isOpen, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  const [loading, setLoading] = useState(true);

  const handleImageChange = (e: any) => {
    const file = e.target.files![0];
    setImage(URL.createObjectURL(file));
    setLogo(file);
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {
    const response = await getPlayerByID(
      playerid!,
      localStorage.getItem("token")!,
    );
    if (response.status == 401) {
      router.push("/login");
    }
    const player = await response.json();
    setName(player[0].name);
    setId(player[0].id);
    setCountry(player[0].nation);
    setDorsal(player[0].dorsal);
    setPosition(player[0].position);
    const partes = player[0].birthYear.split("T");
    setBirthYear(partes[0]);
    setImage(player[0].image);
    setPlayer(player[0]);
    setAge(player[0].age);
    setTalla(player[0].talla);
    setLoading(false);
  };

  const updatePlayerF = async () => {
    if (validateDifferences()) {
      if (await validatePlayerForm()) {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("id", id);
        formData.append("age", age);
        formData.append("editionPlayed", player.editionPlayed);
        formData.append("teamName", player.teamName);
        formData.append("team", player.team);
        formData.append("dorsal", dorsal);
        formData.append("position", position);
        formData.append("birthYear", birthYear);
        formData.append("nation", country);
        formData.append("talla", talla);
        if (logo.name !== "") {
          formData.append("image", logo);
        }

        const res = await updatePlayer(
          formData,
          id,
          player.editionPlayed,
          localStorage.getItem("token")!,
        );
        const data = await res.json();

        if ("success" in data) {
          setResponse("Jugador actualizado correctamente");
        } else {
          if (res.status == 401) {
            router.push("/login");
          } else {
            setResponse("Error actualizando el jugador");
          }
        }
      } else {
        setResponse("Revise los datos indicados");
      }
    } else {
      setResponse("Error: No hay cambios que actualizar");
    }
  };

  const deletePlayerF = async () => {
    const res = await deletePlayer(
      id,
      player.editionPlayed,
      localStorage.getItem("token")!,
    );
    const data = await res.json();
    console.log(data);
    if ("success" in data) {
      router.back();
    }
  };
  const validateDifferences = () => {
    const partes = player.birthYear.split("T");

    return (
      dorsal !== player.dorsal ||
      birthYear !== partes[0] ||
      country !== player.nation ||
      position !== player.position ||
      name !== player.name ||
      talla !== player.talla
    );
  };
  const validatePlayerForm = async () => {
    let validate = false,
      validate2 = false,
      validate3 = false,
      validate4 = false,
      validate5 = false;

    const regExOletters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOnumbers = /^[0-9]+$/;
    if (id == "") {
      validate = false;
      setIdError("Debes ingresar una identificacion");
    } else {
      validate = true;
      setIdError("");
    }

    if (!id.match(regExOnumbers)) {
      validate = false;
      setIdError("Debes ingresar solo numeros en la identificacion");
    } else {
      validate = true;
      setIdError("");
    }
    if (name == "") {
      validate2 = false;
      setNameError("Debes nombrar al entrenador");
    } else {
      validate2 = true;
      setNameError("");
    }
    if (!name.match(regExOletters)) {
      validate2 = false;
      setNameError("Debes ingresar solo letras en el nombre");
    } else {
      validate2 = true;
      setNameError("");
    }

    if (name.length > 30) {
      validate2 = false;
      setNameError("El nombre no puede tener mas de 30 caracteres");
    } else {
      validate2 = true;
      setNameError("");
    }
    if (birthYear == "") {
      validate3 = false;
      setBirthYearError("Debes ingresar el año de nacimiento");
    } else {
      validate3 = true;
      setBirthYearError("");
    }

    if (Number(age) < 1) {
      validate3 = false;
      setBirthYearError("Debes ingresar una edad valida");
    } else {
      validate3 = true;
      setBirthYearError("");
    }

    if (Number(dorsal) == 0) {
      validate4 = false;
      setDorsalError("Debes ingresar el dorsal del jugador");
    } else {
      validate4 = true;
      setDorsalError("");
    }
    const query = {
      dorsal: dorsal,
      team: player.team,
    };
    const response = await getPlayerQuery(
      localStorage.getItem("token")!,
      query,
    );

    const isDorsalTaken = await response.json();

    if ("error" in isDorsalTaken || dorsal == player.dorsal) {
      validate4 = true;
      setDorsalError("");
    } else {
      validate4 = false;
      setDorsalError("El dorsal ya está en uso");
    }

    if (country == "") {
      validate5 = false;
      setCountryError("Debes Seleccionar un país");
    } else {
      validate5 = true;
      setCountryError("");
    }

    return validate && validate2 && validate3 && validate4 && validate5;
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

        <div className="flex flex-col justify-center items-center mt-10 ml-30 min-h-screen">
          <div className="flex flex-col justify-center items-center bg-white p-5 rounded-2xl">
            {(user.team?.includes(player.team) || user.rol == "Admin") && (
              <>
                <input
                  className="w-1/2 ml-2 mb-3 mt-2 p-2 bg-gray-200 rounded text-center"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  id="name1"
                  name="name1"
                />
                <p className="text-xs text-red-400 mt-1">{nameError}</p>
              </>
            )}

            {(!user.team?.includes(player.team) || user.rol !== "Admin") && (
              <>
                <input
                  className="w-1/2 ml-2 mb-3 mt-2 p-2 bg-gray-200 rounded text-center"
                  type="text"
                  readOnly
                  value={name}
                  name="name2"
                  id="name2"
                />
                <p className="text-xs text-red-400 mt-1">{nameError}</p>
              </>
            )}

            <Image
              className="mb-5 rounded-full border-2 border-black"
              src={image || default_profile}
              alt="Foto del jugador"
              width={100}
              height={100}
            ></Image>
            {(user.team?.includes(player.team) || user.rol == "Admin") && (
              <div>
                <input
                  id="fileSelector"
                  name="fileSelector"
                  className="w-full mt-1 p-2 bg-gray-200 rounded"
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          <div className="p-5 bg-white w-full max-w-3xl rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(user.team?.includes(player.team) || user.rol == "Admin") && (
                <>
                  <div>
                    <label htmlFor="country1" className="text-black text-sm">
                      País
                    </label>
                    <CountrySelector
                      readOnly={false}
                      value={country}
                      setValue={setCountry}
                    ></CountrySelector>
                    <p className="text-xs text-red-400 mt-1">{countryError}</p>
                  </div>

                  <div>
                    <label htmlFor="edition1" className="text-black text-sm">
                      Edicion
                    </label>

                    <input
                      type="text"
                      id="edition1"
                      name="edition1"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.editionPlayed}
                    />
                  </div>

                  <div>
                    <label htmlFor="nacimiento1" className="text-black text-sm">
                      Nacimiento
                    </label>
                    <input
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      type="date"
                      id="nacimiento1"
                      name="nacimiento1"
                      onChange={(e) => {
                        setBirthYear(e.target.value);
                        setAge(
                          (
                            new Date().getFullYear() -
                            new Date(e.target.value).getFullYear()
                          ).toString(),
                        );
                      }}
                      value={birthYear}
                    />
                    <p className="text-xs text-red-400 mt-1">
                      {birthYearError}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="selectPosition"
                      className="text-black text-sm mr-17"
                    >
                      Posición
                    </label>

                    <select
                      className="rounded bg-gray-200 w-full h-11/18"
                      name="selectPosition"
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      <option value="Delantero">Delantero</option>
                      <option value="Medio">Mediocampista</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Arquero">Arquero</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edad1" className="text-black text-sm">
                      Edad
                    </label>
                    <input
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      type="number"
                      id="edad1"
                      name="edad1"
                      readOnly
                      value={age}
                    />
                  </div>

                  <div>
                    <label htmlFor="teamName" className="text-black text-sm">
                      Nombre del equipo
                    </label>

                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      id="teamName"
                      name="teamName"
                      value={player.teamName}
                    />
                  </div>
                  <div>
                    <label htmlFor="dorsal1" className="text-black text-sm">
                      Dorsal
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      onChange={(e) => setDorsal(e.target.value)}
                      value={dorsal}
                      id="dorsal1"
                      name="dorsal1"
                    />
                    <p className="text-xs text-red-400 mt-1">{dorsalError}</p>
                  </div>

                  <div>
                    <label htmlFor="talla1" className="text-black text-sm">
                      Talla
                    </label>

                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      onChange={(e) => setTalla(e.target.value)}
                      value={talla}
                      id="talla1"
                      name="talla1"
                    />
                  </div>

                  <div>
                    <label htmlFor="goals1" className="text-black text-sm">
                      Goles
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.goals}
                      id="goals1"
                      name="goals1"
                    />
                  </div>
                  <div>
                    <label htmlFor="assists1" className="text-black text-sm">
                      Asistencias
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.assists}
                      id="assists1"
                      name="assists1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="starterGames1"
                      className="text-black text-sm"
                    >
                      Partidos jugados de titular
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.starterGames}
                      id="starterGames1"
                      name="starterGames1"
                    />
                  </div>
                  <div>
                    <label htmlFor="subInGames1" className="text-black text-sm">
                      Partidos jugados ingresando desde el banco
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.subInGames}
                      id="subInGames1"
                      name="subInGames1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="minutesPlayed1"
                      className="text-black text-sm"
                    >
                      Minutos jugados
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.minutesPlayed}
                      id="minutesPlayed1"
                      name="minutesPlayed1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="yellowCards1"
                      className="text-black text-sm"
                    >
                      Tarjetas amarillas
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.yellowCards}
                      id="yellowCards1"
                      name="yellowCards1"
                    />
                  </div>

                  <div>
                    <label htmlFor="redCards1" className="text-black text-sm">
                      Tarjetas rojas
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.redCards}
                      id="redCards1"
                      name="redCards1"
                    />
                  </div>
                </>
              )}

              {(!user.team?.includes(player.team) || user.rol !== "Admin") && (
                <>
                  <div>
                    <label htmlFor="country2" className="text-black text-sm">
                      País
                    </label>
                    <CountrySelector
                      readOnly={true}
                      value={country}
                      setValue={setCountry}
                    ></CountrySelector>
                  </div>

                  <div>
                    <label htmlFor="edition2" className="text-black text-sm">
                      Edicion
                    </label>

                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.editionPlayed}
                      id="edition2"
                      name="edition2"
                    />
                  </div>

                  <div>
                    <label htmlFor="nacimiento2" className="text-black text-sm">
                      Nacimiento
                    </label>
                    <input
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      type="date"
                      readOnly
                      id="nacimiento2"
                      name="nacimiento2"
                      value={birthYear}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="position"
                      className="text-black text-sm mr-17"
                    >
                      Posición
                    </label>

                    <input
                      className="rounded bg-gray-200 w-full h-11/18"
                      name="Position"
                      id="position"
                      value={position}
                      type="text"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="edad2" className="text-black text-sm">
                      Edad
                    </label>
                    <input
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      type="number"
                      readOnly
                      id="edad2"
                      name="edad2"
                      value={age}
                    />
                  </div>

                  <div>
                    <label htmlFor="teamName2" className="text-black text-sm">
                      Nombre del equipo
                    </label>

                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.teamName}
                      id="teamName2"
                      name="teamName2"
                    />
                  </div>
                  <div>
                    <label htmlFor="dorsal2" className="text-black text-sm">
                      Dorsal
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={dorsal}
                      id="dorsal2"
                      name="dorsal2"
                    />
                  </div>

                  <div>
                    <label htmlFor="talla2" className="text-black text-sm">
                      Talla
                    </label>

                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={talla}
                      id="talla2"
                      name="talla2"
                    />
                  </div>

                  <div>
                    <label htmlFor="goals2" className="text-black text-sm">
                      Goles
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.goals}
                      id="goals2"
                      name="goals2"
                    />
                  </div>
                  <div>
                    <label htmlFor="assists2" className="text-black text-sm">
                      Asistencias
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.assists}
                      id="assists2"
                      name="assists2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="starterGames2"
                      className="text-black text-sm"
                    >
                      Partidos jugados de titular
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.starterGames}
                      id="starterGames2"
                      name="starterGames2"
                    />
                  </div>
                  <div>
                    <label htmlFor="subInGames2" className="text-black text-sm">
                      Partidos jugados ingresando desde el banco
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.subInGames}
                      id="subInGames2"
                      name="subInGames2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="minutesPlayed2"
                      className="text-black text-sm"
                    >
                      Minutos jugados
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.minutesPlayed}
                      id="minutesPlayed2"
                      name="minutesPlayed2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="yellowCards2"
                      className="text-black text-sm"
                    >
                      Tarjetas amarillas
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.yellowCards}
                      id="yellowCards2"
                      name="yellowCards2"
                    />
                  </div>

                  <div>
                    <label htmlFor="redCards2" className="text-black text-sm">
                      Tarjetas rojas
                    </label>

                    <input
                      type="number"
                      className="w-full mt-1 p-2 bg-gray-200 rounded"
                      readOnly
                      value={player.redCards}
                      id="redCards2"
                      name="redCards2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className={`text-sm mt-5 mb-5 ${
              response.includes("Error") ? "text-red-400" : "text-blue-300"
            }`}
          >
            {response}
          </div>
          {(user.team?.includes(player.team) || user.rol == "Admin") && (
            <button
              onClick={updatePlayerF}
              className="w-1/2 mb-7 bg-blue-500 hover:bg-blue-300 text-white py-2 rounded-lg transition"
            >
              Actualizar Jugador
            </button>
          )}
          {(user.team?.includes(player.team) || user.rol == "Admin") && (
            <button
              onClick={openModal}
              className="icon-trash2 w-1/2 mb-7 bg-red-500 hover:bg-red-300 text-white py-2 rounded-lg transition"
            ></button>
          )}
          {player.editedBy && (
            <p className="text-sm mt-10">
              Editado por ultima vez por: {player.editedBy}
            </p>
          )}
          {player.editedBy && (
            <p className="text-sm">
              Editado por ultima vez el: {player.editedAt}
            </p>
          )}
        </div>

        <Modal onClose={closeModal} isOpen={isOpen}>
          <div className="flex flex-col justify-center items-center">
            ¿Seguro que quieres eliminar este jugador?
            <div className="flex mt-5">
              <div
                onClick={deletePlayerF}
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
      </>
    );
  }
}
