"use client";

import { useEffect, useState } from "react";
import NavBar from "../ui/NavBar";
import { getTeamByID } from "../lib/Services/TeamService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHome } from "../lib/Contexts/HomeContexts";
import Paginator from "../ui/Paginator";
import CardTeam from "../ui/CardTeam";
import { getTournaments } from "../lib/Services/TournamentService";
import CardTournament from "../ui/CardTournament";

export default function MyTeam() {
  const { rol } = useHome();
  const [myteams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const user = JSON.parse(localStorage.getItem("user")!);
    let teams: any = [];
    for (let team of user.team) {
      const response = await getTeamByID(team);
      if (response.status == 401) {
        router.push("/login");
      }
      const tm = await response.json();
      teams.push(tm);
    }

    const res = await getTournaments();
    const data = await res.json();

    setTournaments(data);
    setTeams(teams.flat());
    setLoading(false);
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
    if (rol == "User") {
      return (
        <>
          <NavBar />
          <div className="text-xl font-bold mb-5 mt-25 ml-20">Mis equipos</div>
          <div className="flex justify-center items-center ">
            <div className="flex flex-col">
              {myteams.length > 0 ? (
                <Paginator array={myteams} CardItem={CardTeam} />
              ) : (
                "No hay equipos creados aún"
              )}
            </div>
          </div>
           <div className="mt-5 flex justify-center items-center ">
            <div
              onClick={() => router.push("/crearEquipo")}
              className="bg-blue-700 w-fit p-2 rounded-2xl text-sm text-white hover:bg-blue-500 cursor-pointer"
            >
              Crear Equipo
            </div>
          </div>
          <div className="text-xl font-bold mb-5 mt-10 ml-20">Torneos</div>
          <div className="flex justify-center items-center ">
            {tournaments.length > 0 ? (
              <Paginator array={tournaments} CardItem={CardTournament} />
            ) : (
              <p>No hay torneos creados aún</p>
            )}
          </div>

        </>
      );
    }
    if (rol == "Admin") {
      return (
        <>
          <NavBar />
          <div className="text-xl font-bold mb-5 mt-20 ml-20">Mis equipos</div>
          <div className="flex justify-center items-center ">
            {myteams.length > 0 ? (
              <Paginator array={myteams} CardItem={CardTeam} />
            ) : (
              <p> No hay equipos creados aún</p>
            )}
          </div>
          <div className="mt-5 flex justify-center items-center ">
            <div
              onClick={() => router.push("/crearEquipo")}
              className="bg-blue-700 w-fit p-2 rounded-2xl text-sm text-white hover:bg-blue-500 cursor-pointer mr-5"
            >
              Crear Equipo
            </div>
          </div>
          <div className="text-xl font-bold mb-5 mt-10 ml-20">Torneos</div>
          <div className="flex justify-center items-center ">
            {tournaments.length > 0 ? (
              <Paginator array={tournaments} CardItem={CardTournament} />
            ) : (
              <p>No hay torneos creados aún</p>
            )}
          </div>
          <div className="mt-5 flex justify-center items-center ">
            <div
              onClick={() => router.push("/crearTorneo?isParent=" + true)}
              className="bg-blue-700 w-fit p-2 rounded-2xl text-sm text-white hover:bg-blue-500 cursor-pointer"
            >
              Crear torneo
            </div>
          </div>
        </>
      );
    }
  }
}
