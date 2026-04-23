"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useEffect, useState } from "react";
import NavBar from "../ui/NavBar";
import {
  createSignedPeople,
  getSignedPeople,
  getSignedPeopleQuery,
  sendEmail,
} from "../lib/Services/SignedPeopleService";
import Image from "next/image";
import afiche from "../../public/fondo_inscripcion_CC.jpg";
import { useHome } from "../lib/Contexts/HomeContexts";
import Card from "../ui/Card";
import CountrySelector from "../ui/CountrySelector";
import { createTeam } from "../lib/Services/TeamService";
import Paginator from "../ui/Paginator";

export default function inscripcion() {
  const { islogged, rol, device, year } = useHome();
  const [id, setId] = useState("");
  const [errorId, setErrorId] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [tel, setTel] = useState("+57");
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorlastName, setErrorLastName] = useState("");
  const [team, setTeam] = useState("");
  const [categoryOne, setCategoryOne] = useState(false);
  const [categoryMultiple, setCategoryMultiple] = useState(false);
  const [errorCat, setErrorCat] = useState("");
  const [response, setResponse] = useState("");
  const [response2, setResponse2] = useState("");
  const [signed, setSigned] = useState([]);
  const [signedContacted, setSignedContacted] = useState([]);
  const [signedPendientes, setSignedPendientes] = useState([]);
  const [signedAcepted, setSignedAcepted] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [edition, setEdition] = useState(year.toString());
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [founded, setFounded] = useState("");
  const [foundedError, setFoundedError] = useState("");
  const [category, setCategory] = useState(year);
  const [logo, setLogo] = useState(new File([], ""));
  const [days, setDays] = useState("15");
  const [days2, setDays2] = useState("15");
  const [days3, setDays3] = useState("15");
  const [days4, setDays4] = useState("15");
  const fetchData = async () => {
    if (rol == "Admin") {
      const query = { fase: "Inscrito", date: days };
      const response = await getSignedPeopleQuery(
        localStorage.getItem("token")!,
        query,
      );
      const query2 = { fase: "Contactado", date: days2 };
      const response2 = await getSignedPeopleQuery(
        localStorage.getItem("token")!,
        query2,
      );
      const query3 = { fase: "Pendiente a pago", date: days3 };
      const response3 = await getSignedPeopleQuery(
        localStorage.getItem("token")!,
        query3,
      );
      const query4 = { fase: "Aceptado", date: days4 };
      const response4 = await getSignedPeopleQuery(
        localStorage.getItem("token")!,
        query4,
      );
      const signedP = await response.json();
      const signedPC = await response2.json();
      const signedPend = await response3.json();
      const signedAcept = await response4.json();

      setSigned(signedP);
      setSignedContacted(signedPC);
      setSignedPendientes(signedPend);
      setSignedAcepted(signedAcept);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

    useEffect(() => {
    fetchData();
  }, [days, days2, days3, days4]);

  const register = async () => {
    const validate = validateForm();

    if (validate) {
      const body = {
        id: id.trim(),
        email: email.trim(),
        name: name.trim(),
        tel: tel.trim(),
        lastName: lastName.trim(),
        teamName: team.trim(),
        oneCat: categoryOne,
        multiplesCat: categoryMultiple,
      };
      const created = await createSignedPeople(body);
      const data = await created.json();
      console.log(data);
      if ("success" in data) {
        // await sendEmail(name, email, "Touch");
        setResponse("Tus datos han sido registrados");
      } else {
        if (
          "error" in data &&
          data["error"].includes("That user already exists")
        ) {
          setResponse("Ya tenemos una solicitud tuya, pronto te contactaremos");
        } else {
          setResponse("Error procesando los datos");
        }
      }
    } else {
      setResponse("Valida los datos indicados");
    }
  };
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
  const validateForm = () => {
    let validate1 = false,
      validate2 = false,
      validate3 = false,
      validate4 = false,
      validate5 = false;
    const regExOletters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOletters2 = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regExOnumbers = /^[0-9]+$/;
    const regExEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

    const isCategoryWell = () => {
      console.log(categoryOne, categoryMultiple);
      if (categoryOne && categoryMultiple) {
        return false;
      } else if (!categoryOne && !categoryMultiple) {
        return false;
      } else {
        return true;
      }
    };
    if (id == "") {
      validate1 = false;
      setErrorId("Ingresa tu identificación");
    } else {
      validate1 = true;
      setErrorId("");
    }

    if (name == "") {
      validate2 = false;
      setErrorName("Ingresa tu nombre");
    } else {
      setErrorName("");
      validate2 = true;
    }

    if (lastName == "") {
      validate3 = false;
      setErrorLastName("Ingresa tus apellidos");
    } else {
      setErrorLastName("");
      validate3 = true;
    }

    if (email == "") {
      validate4 = false;
      setErrorEmail("Ingresa tu correo");
    } else {
      setErrorEmail("");
      validate4 = true;
    }

    if (!isCategoryWell()) {
      validate5 = false;
      setErrorCat("Selecciona una o una o más");
    } else {
      setErrorCat("");
      validate5 = true;
    }

    if (!id.trim().match(regExOnumbers)) {
      validate1 = false;
      setErrorId("Debes ingresar tu id solo con numeros");
    } else if (id !== "") {
      validate1 = true;
      setErrorId("");
    }
    if (!name.trim().match(regExOletters)) {
      validate2 = false;
      setErrorName("Nombres completos solo con letras");
    } else if (name !== "") {
      validate2 = true;
      setErrorName("");
    }
    if (!lastName.trim().match(regExOletters2)) {
      validate3 = false;
      setErrorLastName("Apellidos completos solo con letras");
    } else if (lastName !== "") {
      validate3 = true;
      setErrorLastName("");
    }
    if (!email.trim().match(regExEmail)) {
      validate4 = false;
      setErrorEmail("Correo invalido");
    } else if (email !== "") {
      validate4 = true;
      setErrorEmail("");
    }
    return validate1 && validate2 && validate3 && validate4 && validate5;
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

  if (!islogged) {
    if (device == "desktop") {
      return (
        <>
          <NavBar />

          <Image
            className="w-full h-auto relative"
            src={afiche}
            alt="Imagen de dos jovenes disputando un balón"
          ></Image>
          <div className=" absolute inset-0 flex justify-center items-center min-h-screen p-4 mt-30">
            <div className="w-full max-w-3xl bg-green-700 rounded-xl p-6">
              <h1 className="font-bold text-3xl text-white">Inscripción</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div>
                  <label className="text-white text-sm">Nombres</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorName}</p>
                </div>

                {/* Apellidos */}
                <div>
                  <label className="text-white text-sm">Apellidos</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorlastName}</p>
                </div>

                {/* Identificación */}
                <div>
                  <label className="text-white text-sm">Identificación</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorId}</p>
                </div>

                {/* Correo */}
                <div>
                  <label className="text-white text-sm">Correo</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorEmail}</p>
                </div>

                {/* Equipo */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">
                    Nombre del equipo
                  </label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setTeam(e.target.value)}
                    value={team}
                  />
                </div>

                {/* Categorías */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">Interesado en</label>

                  <div className="flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={categoryOne}
                        onChange={(e) => setCategoryOne(e.target.checked)}
                      />
                      1
                    </label>

                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={categoryMultiple}
                        onChange={(e) => setCategoryMultiple(e.target.checked)}
                      />
                      1+ Categorías
                    </label>
                  </div>

                  <p className="text-xs text-red-400 mt-1">{errorCat}</p>
                </div>

                {/* Teléfono */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">Teléfono</label>
                  <div className="mt-2">
                    <PhoneInput
                      country={"co"}
                      value={tel}
                      onChange={(value) => setTel(value)}
                    />
                  </div>
                </div>
              </div>

              {/* Respuesta */}
              <div
                className={`mt-4 text-sm ${
                  response.includes("Error") ? "text-red-400" : "text-blue-300"
                }`}
              >
                {response}
              </div>

              {/* Botón */}
              <button
                onClick={register}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </>
      );
    } else if (device == "mobile" || device == "tablet") {
      return (
        <>
          <NavBar />
          <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-3xl bg-green-700 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div>
                  <label className="text-white text-sm">Nombres</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorName}</p>
                </div>

                {/* Apellidos */}
                <div>
                  <label className="text-white text-sm">Apellidos</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorlastName}</p>
                </div>

                {/* Identificación */}
                <div>
                  <label className="text-white text-sm">Identificación</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorId}</p>
                </div>

                {/* Correo */}
                <div>
                  <label className="text-white text-sm">Correo</label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <p className="text-xs text-red-400 mt-1">{errorEmail}</p>
                </div>

                {/* Equipo */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">
                    Nombre del equipo
                  </label>
                  <input
                    className="w-full mt-1 p-2 bg-gray-200 rounded"
                    type="text"
                    onChange={(e) => setTeam(e.target.value)}
                    value={team}
                  />
                </div>

                {/* Categorías */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">Interesado en</label>

                  <div className="flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={categoryOne}
                        onChange={(e) => setCategoryOne(e.target.checked)}
                      />
                      1
                    </label>

                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={categoryMultiple}
                        onChange={(e) => setCategoryMultiple(e.target.checked)}
                      />
                      1+ Categorías
                    </label>
                  </div>

                  <p className="text-xs text-red-400 mt-1">{errorCat}</p>
                </div>

                {/* Teléfono */}
                <div className="md:col-span-2">
                  <label className="text-white text-sm">Teléfono</label>
                  <div className="mt-2">
                    <PhoneInput
                      country={"co"}
                      value={tel}
                      onChange={(value) => setTel(value)}
                    />
                  </div>
                </div>
              </div>

              {/* Respuesta */}
              <div
                className={`mt-4 text-sm ${
                  response.includes("Error") ? "text-red-400" : "text-blue-300"
                }`}
              >
                {response}
              </div>

              {/* Botón */}
              <button
                onClick={register}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </>
      );
    }
  } else if (islogged && rol == "Admin") {
    return (
      <>
        <NavBar />

        <div className="mt-40 ml-30 font-bold">Solicitudes sin respuesta</div>
        <div className="flex justify-center items-center">
          Ver solicitudes de
          <select
            name="recientesSigned"
            id="signed"
            onChange={(e) => {
              setDays(e.target.value);
            }}
          >
            <option value="15">Ultimos 15 dias</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="1y">Ultimo año</option>
          </select>
        </div>
        <div className="flex mt-15 ml-30 overflow-x-auto ">
          <br />

          {signed.length > 0
            ? signed.map((s: any) => {
                return (
                  <Card
                    key={s.id}
                    labels={[
                      "Nombres",
                      "Apellidos",
                      "Identificacion",
                      "Telefono",
                      "Correo",
                      "Una categoria",
                      "Multiples",
                      "Nombre del equipo",
                    ]}
                    values={[
                      s.name,
                      s.lastName,
                      s.id,
                      s.tel,
                      s.email,
                      s.oneCat ? "Sí" : "No",
                      s.multiplesCat ? "Sí" : "No",
                      s.teamName,
                    ]}
                    action="Contactar"
                  />
                );
              })
            : "No hay solicitudes"}
        </div>
        <div className="mt-15 ml-30 font-bold">
          Solicitudes en fase de contacto
        </div>
        <div className="flex justify-center items-center">
          Ver solicitudes de
          <select
            name="recientesSigned"
            id="signed"
            onChange={(e) => {
              setDays2(e.target.value);
            }}
          >
            <option value="15">Ultimos 15 dias</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="1y">Ultimo año</option>
          </select>
        </div>
        <div className="flex mt-15 ml-30 overflow-x-auto">
          {signedContacted.length > 0
            ? signedContacted.map((s: any) => {
                return (
                  <Card
                    key={s.id}
                    labels={[
                      "Nombres",
                      "Apellidos",
                      "Identificacion",
                      "Telefono",
                      "Correo",
                      "Una categoria",
                      "Multiples",
                      "Nombre del equipo",
                    ]}
                    values={[
                      s.name,
                      s.lastName,
                      s.id,
                      s.tel,
                      s.email,
                      s.oneCat ? "Sí" : "No",
                      s.multiplesCat ? "Sí" : "No",
                      s.teamName,
                    ]}
                    action="Pasar a pago"
                  />
                );
              })
            : "No hay solicitudes"}
        </div>

        <div className="mt-15 ml-30 font-bold">
          Solicitudes pendientes a pago
        </div>
        <div className="flex justify-center items-center">
          Ver solicitudes de
          <select
            name="recientesSigned"
            id="signed"
            onChange={(e) => {
              setDays3(e.target.value);
            }}
          >
            <option value="15">Ultimos 15 dias</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="1y">Ultimo año</option>
          </select>
        </div>
        <div className="flex mt-15 ml-30 overflow-x-auto">
          {signedPendientes.length > 0
            ? signedPendientes.map((s: any) => {
                return (
                  <Card
                    key={s.id}
                    labels={[
                      "Nombres",
                      "Apellidos",
                      "Identificacion",
                      "Telefono",
                      "Correo",
                      "Una categoria",
                      "Multiples",
                      "Nombre del equipo",
                    ]}
                    values={[
                      s.name,
                      s.lastName,
                      s.id,
                      s.tel,
                      s.email,
                      s.oneCat ? "Sí" : "No",
                      s.multiplesCat ? "Sí" : "No",
                      s.teamName,
                    ]}
                    action="Aceptar"
                  />
                );
              })
            : "No hay solicitudes"}
        </div>
        <div className="mt-15 ml-30 font-bold">Solicitudes aceptadas</div>
        <div className="flex justify-center items-center">
          Ver solicitudes de
          <select
            name="recientesSigned"
            id="signed"
            onChange={(e) => {
              setDays4(e.target.value);
            }}
          >
            <option value="15">Ultimos 15 dias</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="1y">Ultimo año</option>
          </select>
        </div>
        <div className="flex mt-15 ml-30 mb-15 overflow-x-auto">
          {signedAcepted.length > 0
            ? signedAcepted.map((s: any) => {
                return (
                  <Card
                    key={s.id}
                    labels={[
                      "Nombres",
                      "Apellidos",
                      "Identificacion",
                      "Telefono",
                      "Correo",
                      "Una categoria",
                      "Multiples",
                      "Nombre del equipo",
                    ]}
                    values={[
                      s.name,
                      s.lastName,
                      s.id,
                      s.tel,
                      s.email,
                      s.oneCat ? "Sí" : "No",
                      s.multiplesCat ? "Sí" : "No",
                      s.teamName,
                    ]}
                    action=""
                  />
                );
              })
            : "No hay solicitudes"}
        </div>
      </>
    );
  } else if (islogged && rol == "User") {
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
}
