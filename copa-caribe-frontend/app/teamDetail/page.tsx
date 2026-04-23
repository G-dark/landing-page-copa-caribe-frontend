"use client";

import { useEffect, useState } from "react";
import NavBar from "../ui/NavBar";
import { useSearchParams } from "next/navigation";
import {
  addCoach,
  addManager,
  getTeamByID,
  updateTeam,
} from "../lib/Services/TeamService";
import { useHome } from "../lib/Contexts/HomeContexts";
import CountrySelector from "../ui/CountrySelector";
import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg";
import CardCM from "../ui/CardCM";
import PaginatorCM from "../ui/PaginatorCM";
import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";
import {
  createPlayer,
  getPlayerByID,
  getPlayerQuery,
} from "../lib/Services/PlayerService";

export default function TeamDetail() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("id");
  const router = useRouter();
  const { year } = useHome();
  // local variables and states
  const [team, setTeam] = useState<any>({});
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [edition, setEdition] = useState("");
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [country2, setCountry2] = useState("");
  const [countryError2, setCountryError2] = useState("");
  const [founded, setFounded] = useState("");
  const [foundedError, setFoundedError] = useState("");
  const [category, setCategory] = useState(year);
  const [logo, setLogo] = useState(new File([], ""));
  const [image, setImage] = useState("");
  const [coachs, setCoachs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [response, setResponse] = useState("");
  const [response2, setResponse2] = useState("");
  const [response4, setResponse4] = useState("");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [image2, setImage2] = useState(new File([], ""));
  const [id3, setId3] = useState("");
  const [idError3, setIdError3] = useState("");
  const [name3, setName3] = useState("");
  const [nameError3, setNameError3] = useState("");
  const [image4, setImage4] = useState(new File([], ""));
  const [dorsal, setDorsal] = useState(0);
  const [dorsalError, setDorsalError] = useState("");
  const [position, setPosition] = useState("Delantero");
  const [age, setAge] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthYearError, setBirthYearError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const [isOpen3, setOpen3] = useState(false);
  const openModal3 = () => setOpen3(true);
  const closeModal3 = () => setOpen3(false);

  // useEffect for fetch team data and refresh when updates are made
  useEffect(() => {
    fetchTeam();
  }, [refresh, setRefresh]);
  useEffect(() => {
    fetchTeam();
  }, []);
  const fetchTeam = async () => {
    const response = await getTeamByID(teamId!);
    const data = await response.json();

    console.log(data);
    setTeamName(data[0].name);
    setEdition(data[0].edition);
    setCountry(data[0].country);
    setImage(data[0].flag);
    const partes = data[0].founded.split("T");
    setFounded(partes[0]);
    setCategory(Number(data[0].category));
    setCoachs(data[0].coach);

    const idPlayers = data[0].players;
    if (team.players !== idPlayers) {
      let playersT: any = [];
      for (let id of idPlayers) {
        const response = await getPlayerByID(
          id,
          localStorage.getItem("token")!,
        );
        const player = await response.json();
        playersT.push(player);
      }
      setPlayers(playersT.flat());
    }

    setTeam(data[0]);
  };
  const addTheCoach = async () => {
    if (validateCoachForm()) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("id", id.trim());
      if (image2.name !== "") {
        formData.append("image", image2);
      }

      const res = await addCoach(
        teamId!,
        localStorage.getItem("token")!,
        formData,
      );
      const data = await res.json();

      if ("success" in data) {
        setRefresh(!refresh);
        setResponse2("Entrenador agregado correctamente");
        closeModal();
      } else {
        if (res.status == 401) {
          router.push("/login");
        }
        if (data["error"].includes("already exists")) {
          setResponse2("El entrenador ya existe en el equipo");
        } else {
          setResponse2("Error agregando el entrenador");
        }
      }
    } else {
      setResponse2("Revise los datos indicados");
    }
  };

  const createPlayerF = async () => {
    if (await validatePlayerForm()) {
      const formData = new FormData();
      formData.append("name", name3.trim());
      formData.append("id", id3.trim());
      formData.append("age", age);
      formData.append("editionPlayed", team.edition);
      formData.append("teamName", team.name);
      formData.append("team", team.id);
      formData.append("dorsal", String(dorsal));
      formData.append("position", position);
      formData.append("birthYear", birthYear);
      formData.append("nation", country2);
      if (image4.name !== "") {
        formData.append("image", image4);
      }

      const user = JSON.parse(localStorage.getItem("user")!);
      const res = await createPlayer(formData, localStorage.getItem("token")!);
      const data = await res.json();

      if ("success" in data) {
        setRefresh(!refresh);
        setResponse4("Jugador agregado correctamente");
        closeModal3();
      } else {
        if (res.status == 401) {
          router.push("/login");
        }
        if (data["error"].includes("already exists")) {
          setResponse4("El jugador ya existe en el equipo");
        } else {
          setResponse4("Error agregando el jugador");
        }
      }
    } else {
      setResponse4("Revise los datos indicados");
    }
  };
  const updateTeamF = async () => {
    if (validateTeamForm()) {
      if (validateDifferences()) {
        const formData = new FormData();
        formData.append("name", teamName.trim());
        formData.append("edition", edition);
        formData.append("country", country);
        formData.append("founded", founded);
        formData.append("category", String(category));
        if (logo.name !== "") {
          formData.append("flag", logo);
        }
        const user = JSON.parse(localStorage.getItem("user")!);
        const res = await updateTeam(
          formData,
          teamId!,
          localStorage.getItem("token")!,
          user.username,
        );
        const data = await res.json();

        if ("success" in data) {
          setResponse("Equipo actualizado correctamente");
        } else {
          if (res.status == 401) {
            router.push("/login");
          }
          setResponse("Error actualizando el equipo");
        }
      } else {
        setResponse("No se han detectado cambios en el formulario");
      }
    } else {
      setResponse("Revise los datos indicados");
    }
  };
  const validateTeamForm = () => {
    let validate = false,
      validate2 = false,
      validate3 = false;

    if (teamName == "") {
      validate = false;
      setTeamNameError("Debes nombrar el equipo");
    } else {
      validate = true;
      setTeamNameError("");
    }
    if (founded == "") {
      validate2 = false;
      setFoundedError("Debes ingresar una fecha de fundacion");
    } else {
      validate2 = true;
      setFoundedError("");
    }
    if (country == "") {
      validate3 = false;
      setCountryError("Debes Seleccionar un país");
    } else {
      validate3 = true;
      setCountryError("");
    }
    return validate && validate2 && validate3;
  };
  const validateDifferences = () => {
    return (
      teamName !== team.name ||
      founded !== team.founded ||
      country !== team.country
    );
  };

  const validateCoachForm = () => {
    let validate = false,
      validate2 = false;
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
    return validate && validate2;
  };


  const validatePlayerForm = async () => {
    let validate = false,
      validate2 = false,
      validate3 = false,
      validate4 = false,
      validate5 = false;

    const regExOletters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOnumbers = /^[0-9]+$/;
    if (id3 == "") {
      validate = false;
      setIdError3("Debes ingresar una identificacion");
    } else {
      validate = true;
      setIdError3("");
    }

    if (!id3.match(regExOnumbers)) {
      validate = false;
      setIdError3("Debes ingresar solo numeros en la identificacion");
    } else {
      validate = true;
      setIdError3("");
    }
    if (name3 == "") {
      validate2 = false;
      setNameError3("Debes nombrar al entrenador");
    } else {
      validate2 = true;
      setNameError3("");
    }
    if (!name3.match(regExOletters)) {
      validate2 = false;
      setNameError3("Debes ingresar solo letras en el nombre");
    } else {
      validate2 = true;
      setNameError3("");
    }

    if (name3.length > 30) {
      validate2 = false;
      setNameError3("El nombre no puede tener mas de 30 caracteres");
    } else {
      validate2 = true;
      setNameError3("");
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

    if (dorsal == 0) {
      validate4 = false;
      setDorsalError("Debes ingresar el dorsal del jugador");
    } else {
      validate4 = true;
      setDorsalError("");
    }
    const query = {
      dorsal: dorsal,
      team: teamId
    };
    const response = await getPlayerQuery(
      localStorage.getItem("token")!,
      query,
    );

    const isDorsalTaken = await response.json();

    if ("error" in isDorsalTaken) {
      validate4 = true;
      setDorsalError("");
    } else {
      validate4 = false;
      setDorsalError("El dorsal ya está en uso");
    }

    if (country2 == "") {
      validate5 = false;
      setCountryError2("Debes Seleccionar un país");
    } else {
      validate5 = true;
      setCountryError2("");
    }

    return validate && validate2 && validate3 && validate4 && validate5;
  };

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

  const handleImageChange = (e: any) => {
    const file = e.target.files![0];
    setImage(URL.createObjectURL(file));
    setLogo(file);
  };
  return (
    <>
      <NavBar />

      <div className="flex flex-col justify-center items-center mt-10 ml-30 min-h-screen">
        <div className="flex flex-col justify-center items-center bg-white p-5 rounded-2xl">
          <input
            className="w-1/2 ml-2 mb-3 mt-2 p-2 bg-gray-200 rounded text-center"
            type="text"
            onChange={(e) => setTeamName(e.target.value)}
            value={teamName}
          />
          <p className="text-xs text-red-400 mt-1">{teamNameError}</p>
          <Image
            className="mb-5 rounded-full border-2 border-black"
            src={image !== "" ? image : default_escudo}
            alt="Escudo de equipo de futbol"
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

              <select
                onChange={handleEditionChange}
                className="w-full mt-1 p-2 bg-gray-200 rounded"
              >
                <option value="1">{year}</option>
                <option value="2">{Number(year + 1)}</option>
                <option value="3">{Number(year + 2)}</option>
              </select>
            </div>

            <div>
              <label className="text-black text-sm">Fundación</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="date"
                onChange={(e) => setFounded(e.target.value)}
                value={founded}
              />
              <p className="text-xs text-red-400 mt-1">{foundedError}</p>
            </div>

            <div>
              <label className="text-black text-sm">Categoria</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="number"
                onChange={(e) => setCategory(Number(e.target.value))}
                value={category}
              />
            </div>
          </div>

          <div
            className={`text-sm ${
              response.includes("Error") ? "text-red-400" : "text-blue-300"
            }`}
          >
            {response}
          </div>
        </div>
        <button
          onClick={updateTeamF}
          className="w-1/2 mb-7 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          Actualizar Equipo
        </button>
        <h1 className="font-bold text-lg">Entrenadores</h1>
        <div className="flex mt-10 mb-10">
          {coachs.length > 0 ? (
            <PaginatorCM
              array={coachs}
              tipo={"Entrenador"}
              id={teamId!}
              labels={["Image", "Nombre", "ID"]}
              CardItem={CardCM}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          ) : (
            "No hay coaches agregados aún"
          )}
        </div>

        <div
          className="flex text-sm text-blue-500 cursor-pointer  items-center"
          onClick={openModal}
        >
          <div className="text-5xl font-bold text-blue-500 mr-2 ">+</div>{" "}
          Agregar Entrenador
        </div>



        <h1 className="font-bold text-lg mt-10">Jugadores</h1>
        <div className="flex mt-10 mb-10">
          {players.length > 0 ? (
            <PaginatorCM
              array={players}
              tipo={"Player"}
              id={teamId!}
              labels={["Image", "Nombre", "ID"]}
              CardItem={CardCM}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          ) : (
            "No hay jugadores agregados aún"
          )}
        </div>
        <div
          className="flex text-sm text-blue-500 cursor-pointer  items-center"
          onClick={openModal3}
        >
          <div className="text-5xl font-bold text-blue-500 mr-2 ">+</div>{" "}
          Agregar Jugador
        </div>
      </div>
      {/* Primer modal para agregar entrenador */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="flex">
          <div className="grid grid-cols-1 gap-4">
            <div className="ml-40">Agregar Entrenador</div>
            <div className="flex">
              <label className="text-black text-sm mr-2">Nombre completo</label>
              <input
                value={name}
                onChange={(e) => {
                  return setName(e.target.value);
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="text"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{nameError}</p>
            <div className="flex">
              <label className="text-black text-sm mr-9">Identificación</label>
              <input
                value={id}
                onChange={(e) => {
                  return setId(e.target.value);
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="text"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{idError}</p>
            <div className="flex">
              <label className="text-black text-sm mr-17">Imagen</label>
              <input
                className="w-1/2 mt-1 p-1 bg-gray-200 rounded"
                type="file"
                onChange={(e) => setImage2(e.target.files![0])}
              />
            </div>
            <div
              className={`mt-2 ml-32 text-sm ${
                response2.includes("Error") ? "text-red-400" : "text-blue-300"
              }`}
            >
              {response2}
            </div>
            <button
              onClick={addTheCoach}
              className="w-1/2 mt-1 ml-30 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Agregar
            </button>
          </div>
        </div>
      </Modal>



      {/* 2do modal para agregar player */}

      <Modal isOpen={isOpen3} onClose={closeModal3}>
        <div className="flex flex-col">
          <div className="ml-40">Agregar jugador</div>
          <div className="grid grid-cols-1 gap-4">

            <div className="flex">
              <label className="text-black text-sm mr-2">Nombre completo</label>
              <input
                value={name3}
                onChange={(e) => {
                  return setName3(e.target.value);
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="text"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{nameError3}</p>
            <div className="flex">
              <label className="text-black text-sm mr-9">Identificación</label>
              <input
                value={id3}
                onChange={(e) => {
                  return setId3(e.target.value);
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="text"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{idError3}</p>
            <div className="flex">
              <label className="text-black text-sm mr-17">Imagen</label>
              <input
                className="w-1/2 mt-1 p-1 bg-gray-200 rounded"
                type="file"
                onChange={(e) => setImage4(e.target.files![0])}
              />
            </div>
            <div className="flex">
              <label className="text-black text-sm mr-19">Dorsal</label>
              <input
                value={dorsal}
                onChange={(e) => {
                  return setDorsal(Number(e.target.value));
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="number"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{dorsalError}</p>
            <div className="flex">
              <label className="text-black text-sm mr-24">País</label>
              <CountrySelector
              containerClassName="flex w-full items-center gap-2 "
                className="w-1/2 bg-gray-200 rounded"
                value={country2}
                setValue={setCountry2}
              ></CountrySelector>
              <p className="text-xs text-red-400 mt-1">{countryError2}</p>
            </div>

            <div className="flex">
              <label className="text-black text-sm mr-17">Posición</label>

              <select
                className="rounded-2xl"
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
            <div className="flex">
              <label className="text-black text-sm mr-12">Nacimiento</label>
              <input
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                  setAge(
                    String(
                      new Date().getFullYear() -
                        new Date(e.target.value).getFullYear(),
                    ),
                  );
                }}
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="date"
              />
            </div>
            <p className="text-xs text-red-400 mt-1 ml-32">{birthYearError}</p>

            <div className="flex">
              <label className="text-black text-sm mr-21">Edad</label>
              <input
                value={age}
                readOnly
                className="w-1/2 mt-1 p-2 bg-gray-200 rounded"
                type="number"
              />
            </div>
            <div
              className={`mt-2 ml-32 text-sm ${
                response4.includes("Error") ? "text-red-400" : "text-blue-300"
              }`}
            >
              {response4}
            </div>
            <button
              onClick={createPlayerF}
              className="w-1/2 mt-0 ml-30 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Agregar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
