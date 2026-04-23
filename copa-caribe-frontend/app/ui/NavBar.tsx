"use client";
import Image from "next/image";
import copaLogo from "../../public/copa-caribe-logo.png";
import Link from "next/link";
import { useHome } from "../lib/Contexts/HomeContexts";

export default function NavBar() {
  const { isActive, setActive, islogged, rol } = useHome();

  const burgerBottonOnClick = () => {
    if (isActive) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  return (
    <header>
      <nav>
        <ul className="nav-bar fixed z-50 w-full flex justify-evenly pt-5 pb-5 pl-100  bg-blue-500/70 font-bold rounded-lg">
          <li
            className={
              isActive
                ? `strip absolute top-0 left-0 w-14 min-h-screen bg-blue-500/70`
                : "strip absolute top-0 left-0 w-14 h-full bg-blue-500 hidden"
            }
          >
            <div
              className={
                isActive
                  ? "login-access absolute top-25 left-2 text-xs z-41"
                  : "login-access absolute top-6 left-0 hidden"
              }
            >
              <Link href={!islogged ? "/login" : "/cuenta"}>{!islogged ? "Login" : "Cuenta"}</Link>
            </div>
            <div
              className={
                isActive && islogged
                  ? "myTeam-access absolute top-32 left-2 text-xs z-41"
                  : "myTeam-access absolute top-6 left-0 hidden"
              }
            >
              <Link href="/equipo">
                {rol == "Admin" ? "Equipos" : "Mi equipo"}
              </Link>
            </div>
          </li>

          <li
            className="buger-button absolute top-4 left-3 text-4xl cursor-pointer"
            onClick={burgerBottonOnClick}
          >
            ☰
          </li>

          <li>
            <Link href="/"> Home</Link>
          </li>
          <li>
            {" "}
            <Link href="/inscripcion">
              {rol == "User" ? "Crear Equipos" : "Inscripción"}
            </Link>{" "}
          </li>

          <li>Tablas</li>
          <li>Historico</li>
          <li>
            <Link href="/">
              <Image
                className="image-logo rounded-full p-0 absolute top-2 right-3"
                src={copaLogo}
                alt="Imagen de un escudo, un balón y una palmera"
                width={40}
                height={60}
              ></Image>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
