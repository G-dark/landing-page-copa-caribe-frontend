"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import NavBar from "../ui/NavBar";
import { useEffect, useState } from "react";
import default_profile from "../../public/default_profile.png";
import CountrySelector from "../ui/CountrySelector";
import {
  getPlayerByID,
  getPlayerQuery,
  updatePlayer,
} from "../lib/Services/PlayerService";
import { useRouter } from "next/navigation";

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
  const validateDifferences = () => {
    const partes = player.birthYear.split("T");

    return (
      dorsal !== player.dorsal ||
      birthYear !== partes[0] ||
      country !== player.nation ||
      position !== player.position ||
      name !== player.name
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
  return (
    <>
      <NavBar />

      <div className="flex flex-col justify-center items-center mt-10 ml-30 min-h-screen">
        <div className="flex flex-col justify-center items-center bg-white p-5 rounded-2xl">
          <input
            className="w-1/2 ml-2 mb-3 mt-2 p-2 bg-gray-200 rounded text-center"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <p className="text-xs text-red-400 mt-1">{nameError}</p>
          <Image
            className="mb-5 rounded-full border-2 border-black"
            src={image == " " ? default_profile : image.trimStart()}
            alt="Foto del jugador"
            width={100}
            height={100}
          ></Image>
          <div>
            <input
              className="w-full mt-1 p-2 bg-gray-200 rounded"
              type="file"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="p-5 bg-white w-full max-w-3xl rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-black text-sm">País</label>
              <CountrySelector
                value={country}
                setValue={setCountry}
              ></CountrySelector>
              <p className="text-xs text-red-400 mt-1">{countryError}</p>
            </div>

            <div>
              <label className="text-black text-sm">Edicion</label>

              <input
                type="text"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.editionPlayed}
              />
            </div>

            <div>
              <label className="text-black text-sm">Nacimiento</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="date"
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
              <p className="text-xs text-red-400 mt-1">{birthYearError}</p>
            </div>
            <div>
              <label className="text-black text-sm mr-17">Posición</label>

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
              <label className="text-black text-sm">Edad</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="number"
                readOnly
                value={age}
              />
            </div>

            <div>
              <label className="text-black text-sm">Nombre del equipo</label>

              <input
                type="text"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.teamName}
              />
            </div>
            <div>
              <label className="text-black text-sm">Dorsal</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                onChange={(e) => setDorsal(e.target.value)}
                value={dorsal}
              />
              <p className="text-xs text-red-400 mt-1">{dorsalError}</p>
            </div>

            <div>
              <label className="text-black text-sm">Goles</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.goals}
              />
            </div>
            <div>
              <label className="text-black text-sm">Asistencias</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.assists}
              />
            </div>
            <div>
              <label className="text-black text-sm">
                Partidos jugados de titular
              </label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.starterGames}
              />
            </div>
            <div>
              <label className="text-black text-sm">
                Partidos jugados ingresando desde el banco
              </label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.subInGames}
              />
            </div>
            <div>
              <label className="text-black text-sm">Minutos jugados</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.minutesPlayed}
              />
            </div>
            <div>
              <label className="text-black text-sm">Tarjetas amarillas</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.yellowCards}
              />
            </div>

            <div>
              <label className="text-black text-sm">Tarjetas rojas</label>

              <input
                type="number"
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                readOnly
                value={player.redCards}
              />
            </div>
          </div>

          <div
            className={`text-sm mt-10 ml-60 ${
              response.includes("Error") ? "text-red-400" : "text-blue-300"
            }`}
          >
            {response}
          </div>
        </div>
        <button
          onClick={updatePlayerF}
          className="w-1/2 mb-7 bg-blue-500 hover:bg-blue-300 text-white py-2 rounded-lg transition"
        >
          Actualizar Jugador
        </button>
      </div>
    </>
  );
}
