"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useEffect, useState } from "react";
import NavBar from "../ui/NavBar";
import Modal from "../ui/Modal";
import { loginUser, updateUser } from "../lib/Services/UserService";
import { useRouter } from "next/navigation";
import { useHome } from "../lib/Contexts/HomeContexts";
export default function Cuenta(){
    const {setShow, setLogged, setRol} = useHome();
  const [user, setUser] = useState({
    username: "",
    password: "",
    rol: "",
    email: "",
    tel: "",
    team: [],
    managers: [],
  });
  // variables for the modals
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [isOpen3, setOpen3] = useState(false);
  const [isOpen4, setOpen4] = useState(false);
  // variables for the showing of passwords
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  // variables for updating process
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [pass3, setPass3] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");

  // errors texts
  const [pass23Error, setPass23Error] = useState("");
  const [pass1Error, setPass1Error] = useState("");
  const [emailError, setEmailError] = useState("");
  const [telError, setTelError] = useState("");
  // messages
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");

  // open and close modals
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const openModal2 = () => setOpen2(true);
  const closeModal2 = () => setOpen2(false);
  const openModal3 = () => setOpen3(true);
  const closeModal3 = () => setOpen3(false);
  const openModal4 = () => setOpen4(true);
  const closeModal4 = () => setOpen4(false);

  const router = useRouter();
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")!));
  }, []);

  const closeSession = () => {
    localStorage.removeItem("token");
    localStorage.setItem("message", "Hasta pronto, " + user.username);
    setShow(false);
    closeModal4();
    setLogged(false);
    setRol("");
    router.push("/");

  }
  {
    /* Method to change the password */
  }
  const changePass = async () => {
    const response = await loginUser(user.username, pass1);
    const data = await response.json();
    if ("success" in data) {
      setPass1Error("");
      if (pass2 == pass3) {
        if (pass2 !== "") {
          if (pass2 !== pass1) {
            user.password = pass2;
            const response2 = await updateUser(
              { user },
              localStorage.getItem("token")!,
              user.username,
            );
            const data2 = await response2.json();
            if ("success" in data2) {
              setMessage("Contraseña cambiada exitosamente");
            } else {
              setMessage("Error contraseña no actualizada");
            }

            setPass23Error("");
          } else {
            setPass23Error("La contraseña debe ser nueva");
          }
        } else {
          setPass23Error("La contraseña no puede ser vacia");
        }
      } else {
        setPass23Error("Las contraseñas no coinciden");
        setMessage("Error revise los valores de la nueva contraseña");
      }
    } else {
      setPass1Error("Contraseña incorrecta");
      setMessage("Error revise el valor de la contraseña actual");
    }
  };

  const changeEmail = async () => {
    const regExEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
    if (email !== "") {
      if (email.match(regExEmail)) {
        if (email !== user.email) {
          setEmailError("");
          user.email = email;
          const response = await updateUser(
            { user },
            localStorage.getItem("token")!,
            user.username,
          );
          const data = await response.json();
          if ("success" in data) {
            setMessage2("correo actualizado");
          } else {
            setMessage2("Error: correo no actualizado");
          }
        } else {
          setEmailError("El correo debe ser nuevo");
          setMessage2("Error: revisa el valor del correo");
        }
      } else {
        setEmailError("Correo invalido");
        setMessage2("Error: revisa el valor del correo");
      }
    } else {
      setEmailError("El correo no puede ser vacio");
      setMessage2("Error: revisa el valor del correo");
    }
  };

  const changeTel = async () => {
    if (tel !== "") {
      if (tel !== user.tel) {
        setTelError("");
        user.tel = tel;
        const response = await updateUser(
          { user },
          localStorage.getItem("token")!,
          user.username,
        );
        const data = await response.json();
        if ("success" in data) {
          setMessage3("Telefono actualizado");
        } else {
          setMessage3("Error: telefono no actualizado");
        }
      } else {
        setTelError("El # de telefono debe ser nuevo");
        setMessage3("Error: revisa el valor del telefono nuevo");
      }
    } else {
      setTelError("Telefono invalido");
      setMessage3("Error: revisa el valor del telefono nuevo");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center mt-50">
        <h1 className="text-3xl mb-20">Mi Cuenta</h1>
        <label>Username:</label>
        <input
          readOnly
          className="text-center mb-5 bg-gray-400 rounded-2xl"
          value={user.username}
        />
        <label>Correo:</label>
        <input
          readOnly
          className="text-center mb-5 bg-gray-400 rounded-2xl"
          type="text"
          value={user.email == "" || user.email! ? "No hay correo" : user.email}
        />

        <label>Rol:</label>
        <input
          readOnly
          className="text-center mb-5 bg-gray-400 rounded-2xl"
          type="text"
          value={user.rol}
        />

        <label>Telefono:</label>
        <input
          readOnly
          className="text-center mb-5 bg-gray-400 rounded-2xl"
          type="text"
          value={user.tel}
        />

        <div className="flex flex-col justify-center items-center">
          <div className="flex">
            <button
              className="bg-blue-500 focus:border-black rounded-2xl p-2 text-sm"
              type="button"
              onClick={openModal}
            >
              Cambiar contraseña
            </button>
            <button
              className="bg-blue-500 focus:border-black rounded-2xl p-2 text-sm ml-2"
              type="button"
              onClick={openModal2}
            >
              Cambiar correo
            </button>
            <button
              className="bg-blue-500 focus:border-black rounded-2xl p-2 text-sm ml-2"
              type="button"
              onClick={openModal3}
            >
              cambiar telefono
            </button>
          </div>
        </div>
        <button
          className="bg-red-500 focus:border-black rounded-2xl p-2 text-sm ml-2 w-fit mt-3 icon-logout"
          type="button"
          onClick={openModal4}
        >
        </button>
      </div>

      {/*  modal to change the password */}

      <Modal onClose={closeModal} isOpen={isOpen}>
        <div className="flex flex-col justify-center items-center">
          <label className="text-center">Contraseña Actual:</label>
          <div className="flex justify-center relative">
            <input
              className="text-center mb-10 bg-gray-200 rounded-2xl"
              type={showPass ? "text" : "password"}
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
            />
            <div
              onClick={() => {
                setShowPass(!showPass);
              }}
              className={showPass ? "icon-eye-hidden" : "icon-eye p-0 m-0"}
            ></div>
          </div>
          <div className="absolute text-sm text-red-500 top-22 left-43">
            {pass1Error}
          </div>

          <div
            className={
              pass23Error == ""
                ? "flex flex-col justify-center"
                : "border-1 border-red-500 rounded-2xl flex flex-col justify-center"
            }
          >
            <label className="text-center">Nueva contraseña:</label>
            <div className="flex justify-center">
              <input
                className="text-center mb-5 bg-gray-200 rounded-2xl"
                type={showPass2 ? "text" : "password"}
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              <div
                onClick={() => {
                  setShowPass2(!showPass2);
                }}
                className={showPass2 ? "icon-eye-hidden" : "icon-eye p-0 m-0"}
              ></div>
            </div>

            <label className="text-center">Repetir contraseña:</label>
            <div className="flex justify-center">
              <input
                className="text-center mb-7 bg-gray-200 rounded-2xl"
                type={showPass2 ? "text" : "password"}
                value={pass3}
                onChange={(e) => setPass3(e.target.value)}
              />
              <div
                onClick={() => {
                  setShowPass2(!showPass2);
                }}
                className={showPass2 ? "icon-eye-hidden" : "icon-eye p-0 m-0"}
              ></div>
            </div>
            <div className="absolute text-sm text-red-500 top-63 left-40">
              {pass23Error}
            </div>
          </div>
          <div
            className={
              message.includes("Error")
                ? "absolute text-sm text-red-500 top-75 left-25"
                : "absolute text-sm text-blue-600 top-75 left-35"
            }
          >
            {message}
          </div>
          <button
            onClick={changePass}
            className="bg-blue-500 rounded-2xl w-fit p-2 mt-15"
          >
            Actualizar
          </button>
        </div>
      </Modal>

      {/*  modal to change the email */}

      <Modal onClose={closeModal2} isOpen={isOpen2}>
        <div className="flex flex-col justify-center items-center">
          <label className="text-center">Correo actual:</label>
          <div className="flex justify-center relative">
            <input
              className="text-center mb-10 bg-gray-200 rounded-2xl"
              type="text"
              value={user.email}
              readOnly
            />
          </div>

          <label className="text-center">Nuevo correo:</label>
          <div className="flex justify-center">
            <input
              className="text-center mb-5 bg-gray-200 rounded-2xl"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="text-sm text-red-500">{emailError}</div>

          <div
            className={
              message2.includes("Error")
                ? "absolute text-sm text-red-500 top-60 left-40"
                : "absolute text-sm text-blue-600 top-55 left-48"
            }
          >
            {message2}
          </div>
          <button
            onClick={changeEmail}
            className="bg-blue-500 rounded-2xl w-fit p-2 mt-15"
          >
            Actualizar
          </button>
        </div>
      </Modal>

      {/*  modal to change the telephone */}

      <Modal onClose={closeModal3} isOpen={isOpen3}>
        <div className="flex flex-col justify-center items-center">
          <label className="text-center">Telefono actual:</label>
          <div className="flex justify-center relative">
            <input
              className="text-center mb-10 bg-gray-200 rounded-2xl"
              type="text"
              value={user.tel}
              readOnly
            />
          </div>

          <label className="text-center">Nuevo telefono:</label>
          <div className="flex justify-center">
            <PhoneInput
              country={"co"}
              value={tel}
              onChange={(value) => setTel(value)}
            />
          </div>
          <div className="text-sm text-red-500">{telError}</div>

          <div
            className={
              message3.includes("Error")
                ? "absolute text-sm text-red-500 top-60 left-40"
                : "absolute text-sm text-blue-600 top-55 left-48"
            }
          >
            {message3}
          </div>
          <button
            onClick={changeTel}
            className="bg-blue-500 rounded-2xl w-fit p-2 mt-15"
          >
            Actualizar
          </button>
        </div>
      </Modal>

      <Modal onClose={closeModal4} isOpen={isOpen4}>
        <div className="flex flex-col justify-center items-center">
          ¿Seguro que quieres cerrar sesión?
          <div className="flex mt-5">
            <div onClick={closeSession} className="icon-logout mr-10 text-sm flex flex-col">Salir</div>
            <div onClick={closeModal4} className="icon-return text-sm flex flex-col">Atrás</div>
          </div>
        </div>
      </Modal>
    </>
  );
}
