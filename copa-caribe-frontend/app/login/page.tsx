"use client";

import { useHome } from "../lib/Contexts/HomeContexts";
import NavBar from "../ui/NavBar";
import { getUser, loginUser } from "../lib/Services/UserService";
import { useEffect, useState } from "react";
import cesped from "../../public/cesped.jpg";
import { useRouter } from "next/navigation";
import Popup from "../ui/Popup";
import Image from "next/image";

export default function login() {
  const { device, setLogged, setRol, rol, setShow } = useHome();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [responseU, setResponseU] = useState("");
  const [isOpenPopup, setOpenUp] = useState(false);
  const openPopup = () => setOpenUp(true);
  const closePopup = () => setOpenUp(false);
  const router = useRouter();
  const login = async () => {
    const response = await loginUser(username, password);
    const data = await response.json();

    if ("success" in data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("message", "Bienvenido, " + username);
      setShow(false);
      const token = localStorage.getItem("token");
      const response = await getUser(username, token!);
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      setRol(user.rol);
      setLogged(true);
      router.push("/");
    } else {
      if (data["error"].includes("User and password don't match")) {
        setResponseU("El usuario y contraseña no coinciden");
      } else {
        setResponseU("Error al iniciar sesión");
      }

      openPopup();
    }
  };

  useEffect(() => {
    console.log(rol);
  }, [rol]);

  if (device == "desktop") {
    return (
      <>
        <NavBar />
        <div className="relative">
          <Image
            className="w-full h-auto"
            src={cesped}
            height={300}
            alt="Cesped"
          ></Image>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          <div className="absolute inset-0 flex justify-center items-center w-full min-h-screen">
            <div className="border-t-10 border-white w-100 md:w-300 lg:w-1/2"></div>
            <div className="relative flex justify-center items-center w-100 h-100 rounded-full border-10 border-white">
              <div className="absolute top-6/32 text-sm font-bold text-white">
                Usuario:
              </div>
              <input
                className="absolute top-9/32 text-sm bg-white rounded-lg text-center"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="border-t-10 border-white w-45"></div>
              <div
                className="flex justify-center p-2 w-fit h-10 rounded-full bg-white z-50 cursor-pointer"
                onClick={login}
              >
                Ingresar
              </div>
              <div className="border-t-10 border-white w-45"></div>
              <div className="absolute top-89/128 text-sm font-bold text-white">
                Contraseña:
              </div>
              <input
                className="absolute top-100/128 text-sm bg-white rounded-lg text-center"
                type={showPass ? "password" :"text" }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                onClick={() => setShowPass(!showPass)}
                className={
                  showPass
                    ? "icon-eye absolute top-98/128 left-70 bg-white w-fit rounded-2xl"
                    : "icon-eye-hidden absolute top-98/128 left-70 bg-white w-fit rounded-2xl"
                }
              ></div>
            </div>
            <div className="border-t-10 border-white w-100 md:w-300 lg:w-1/2"></div>
          </div>
        </div>

        <Popup onClose={closePopup} isOpen={isOpenPopup}>
          {responseU}
        </Popup>
      </>
    );
  }

  if (device == "tablet" || device == "mobile") {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-green-700">
          <div className="flex flex-col items-center justify-center w-80 h-80 rounded-full border-4 border-white bg-green-800 p-6">
            <input
              type="text"
              placeholder="Usuario"
              className="w-full mb-3 p-2 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full mb-4 p-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
              onClick={login}
            >
              Ingresar
            </button>
          </div>
        </div>
        <Popup onClose={closePopup} isOpen={isOpenPopup}>
          {responseU}
        </Popup>
      </>
    );
  }
}
