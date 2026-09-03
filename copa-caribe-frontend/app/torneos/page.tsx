"use client";
import { useState } from "react";
import { useHome } from "../lib/Contexts/HomeContexts";
import NavBar from "../ui/NavBar";
import depandcities from "../../public/departmentsAndCities.json";
import { getTournamentByQuery } from "../lib/Services/TournamentService";
import Paginator from "../ui/Paginator";
import CardTournament from "../ui/CardTournament";
export default function Torneos() {
  const { year } = useHome();
  const [edition, setEdition] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDeparment] = useState("Atlántico");
  const [city, setCity] = useState("");
  const [tournaments, setTournaments] = useState<any>([]);
  const [message, setMessage] = useState("");

  const getTournaments = async () => {
    let query: any = {};
    if (edition.trim() !== "") {
      query.edition = edition;
    }
    if (fechaInicio !== "") {
      query.date = fechaInicio;
    }
    if (category !== "") {
      query.category = category;
    }
    if (city !== "") {
      query.city = city;
    }

    const res = await getTournamentByQuery(query);
    const data = await res.json();

    if (!("error" in data)) {
      setTournaments(data);
    } else {
      if (data["error"].includes("There are no tournaments")) {
        setMessage("No hay torneos con esas caracteristicas");
      } else {
        setMessage("Hubo un error");
      }
    }
    console.log(data);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col mt-40 ml-20 justify-center items-center">
        <h1 className="text-8xl">Torneos</h1>
        <div className="flex mt-20">
          <input type="text" placeholder="Copa Caribe" />
          <div onClick={getTournaments} className="icon-search"></div>
        </div>
        <div className="flex">
          <div className="flex flex-col mt-10">
            <label htmlFor="edition">Edicion</label>
            <select
              onChange={(e) => setEdition(e.target.value)}
              name="selectEdition"
              id="edition"
            >
              <option value={year.toString()}>{year}</option>
              <option value={(year + 1).toString()}>{year + 1}</option>
              <option value={(year + 2).toString()}>{year + 2}</option>
            </select>
          </div>
          <div className="flex flex-col mt-10 ml-5">
            <label htmlFor="finicio">Fecha de inicio</label>
            <input
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              type="date"
              name="finicio"
              id="finicio"
            />
          </div>

          <div className="flex flex-col mt-10 ml-5">
            <label htmlFor="category">Categoria</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="number"
              name="category"
              id="category"
            />
          </div>
          <div className="flex flex-col mt-10 ml-5">
            <label htmlFor="selectDeparment" className="text-black text-sm">
              Departamento
            </label>
            <select
              name="selectDepartment"
              id="selectDeparment"
              value={department}
              onChange={(e) => setDeparment(e.target.value)}
              className="w-full mt-1 rounded text-black"
            >
              {depandcities.map((department) => (
                <option key={department.id} value={department.departamento}>
                  {department.departamento}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col mt-10 ml-5">
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
              className={"w-full mt-1 rounded"}
            />
          </div>
        </div>
        {tournaments.length > 0 ? (
          <div className="mt-20">
            <Paginator array={tournaments} CardItem={CardTournament} />
          </div>
        ) : (
          <div className="mt-10">{message}</div>
        )}
      </div>
    </>
  );
}
