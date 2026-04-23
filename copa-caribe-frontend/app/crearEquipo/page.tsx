"use client";
import { useState } from "react";
import NavBar from "../ui/NavBar";
import CountrySelector from "../ui/CountrySelector";
import { useHome } from "../lib/Contexts/HomeContexts";
import { createTeam } from "../lib/Services/TeamService";
export default function crearEquipo() {
  const { year } = useHome();
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [edition, setEdition] = useState(year.toString());
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [founded, setFounded] = useState("");
  const [foundedError, setFoundedError] = useState("");
  const [category, setCategory] = useState(year);
  const [logo, setLogo] = useState(new File([], ""));
  const [response2, setResponse2] = useState("");

  const registerTeam = async () => {
      if (validateTeamForm()) {
        const formData = new FormData();
        formData.append("name", teamName);
        formData.append("edition", edition);
        formData.append("country", country);
        formData.append("founded", founded);
        formData.append("category", String(category));
        if (logo.name !== "") {
          formData.append("flag", logo);
        }
        const user = JSON.parse(localStorage.getItem("user")!);
        const res = await createTeam(
          formData,
          localStorage.getItem("token")!,
          user.username,
        );
        const data = await res.json();

        if ("success" in data) {
          setResponse2("Equipo creado");
        } else {
          setResponse2("Error creando el equipo");
        }
      } else {
        setResponse2("Revise los datos indicados");
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
    setLogo(file);
  };
  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center mt-10 ml-30 min-h-screen">
        <div className="p-5 bg-green-700 w-full max-w-3xl rounded-2xl">
          <div className="text-white font-bold">Creación de equipos</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm">Nombre</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="text"
                onChange={(e) => setTeamName(e.target.value)}
                value={teamName}
              />
              <p className="text-xs text-red-400 mt-1">{teamNameError}</p>
            </div>

            <div>
              <label className="text-white text-sm">País</label>
              <CountrySelector
                value={country}
                setValue={setCountry}
              ></CountrySelector>
              <p className="text-xs text-red-400 mt-1">{countryError}</p>
            </div>

            <div>
              <label className="text-white text-sm">Edicion</label>

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
              <label className="text-white text-sm">Fundación</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="date"
                onChange={(e) => setFounded(e.target.value)}
                value={founded}
              />
              <p className="text-xs text-red-400 mt-1">{foundedError}</p>
            </div>

            <div>
              <label className="text-white text-sm">Categoria</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="number"
                onChange={(e) => setCategory(Number(e.target.value))}
                value={category}
              />
            </div>

            <div>
              <label className="text-white text-sm">Logo</label>
              <input
                className="w-full mt-1 p-2 bg-gray-200 rounded"
                type="file"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div
            className={`mt-4 text-sm ${
              response2.includes("Error") ? "text-red-400" : "text-blue-300"
            }`}
          >
            {response2}
          </div>

          <button
            onClick={registerTeam}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Crear Equipo
          </button>
        </div>
      </div>
    </>
  );
}
