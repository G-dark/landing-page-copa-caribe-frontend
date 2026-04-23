"use client";
import { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import default_profile from "../../public/default_profile.png";
import {
  deleteCoach,
  deleteManager,
  updateCoach,
  updateManager,
} from "../lib/Services/TeamService";

export default function CardCM({
  values,
  labels,
  id,
  tipo,
  setRefresh,
  refresh,
}: {
  values: string[];
  labels: string[];
  id: string;
  tipo: string;
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
    setResponse("");
  };
  const closeModal = () => setOpen(false);
  const [isOpen2, setOpen2] = useState(false);
  const openModal2 = () => {
    setOpen2(true);
    setResponse2("");
  };
  const closeModal2 = () => setOpen2(false);
  const [response, setResponse] = useState("");
  const [response2, setResponse2] = useState("");
  const [value1, setValue1] = useState(values[0]);
  const [value2, setValue2] = useState(values[1]);
  const [value3, setValue3] = useState(values[2]);
  let setValues = [setValue1, setValue2, setValue3];
  let Values = [value1, value2, value3];
  const [image, setImage] = useState(new File([], ""));
  const setValue = (index: number, value: string) => {
    const setValor = setValues[index];
    setValor(value);
  };
  const validate = () => {
    const regExOletters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value2.trim() == "") {
      return false;
    }
    if (value2.length > 30) {
      return false;
    }
    if (!value2.match(regExOletters)) {
      return false;
    }
    if (value2 == values[1]) {
      return false;
    }
    return true;
  };

  const goToPlayerPage = ()=>{
    if(tipo == "Player"){
      router.push("/playerDetail?id=" + values[2]);
    }
  }

  const editValues = async () => {
    if (tipo == "Entrenador") {
      if (validate()) {
        const formData = new FormData();
        formData.append("name", value2);
        formData.append("image", image);

        const response = await updateCoach(
          id,
          localStorage.getItem("token")!,
          formData,
          values[2],
        );
        const data = await response.json();
        if ("success" in data) {
          closeModal();
          setRefresh(!refresh);
        } else {
          setResponse("Error al actualizar el entrenador");
        }
      } else {
        setResponse("Error: revise los datos ingresados");
      }
    }
    if (tipo == "Manager") {
      if (validate()) {
        const formData = new FormData();
        formData.append("name", value2.trim());
        formData.append("image", image);

        const response = await updateManager(
          id,
          localStorage.getItem("token")!,
          formData,
          values[2],
        );
        const data = await response.json();
        if ("success" in data) {
          setRefresh(!refresh);
          closeModal();
        } else {
          setResponse("Error al actualizar el manager");
        }
      } else {
        setResponse("Error: revise los datos ingresados");
      }
    }
  };
  const deleteValues = async () => {
    if (tipo == "Entrenador") {
      const response = await deleteCoach(
        id,
        localStorage.getItem("token")!,
        values[2],
      );
      const data = await response.json();
      if ("success" in data) {
        setRefresh(!refresh);
        closeModal2();
      } else {
        setResponse2("Error al eliminar el entrenador");
      }
    }

    if (tipo == "Manager") {
      const user = JSON.parse(localStorage.getItem("user")!);
      const response = await deleteManager(
        id,
        localStorage.getItem("token")!,
        values[2],
        user.username,
      );
      const data = await response.json();
      if ("success" in data) {
        setRefresh(!refresh);
        closeModal2();
      } else {
        setResponse2("Error al eliminar el manager");
      }
    }
  };
  return (
    <>
      <div
      onClick={goToPlayerPage}
        className={
          tipo == "Player"
            ? "flex flex-col justify-center items-center bg-blue-800 w-[200px] h-[280px] p-5 rounded-2xl mr-5 cursor-pointer"
            : "flex flex-col justify-center items-center bg-blue-800 w-[200px] h-[280px] p-5 rounded-2xl mr-5"
        }
      >
        {values.map((value, index) => {
          return (
            <div key={index}>
              {labels[index] == "Image" ? (
                <Image
                  className="rounded-full"
                  src={value !== " " && value !== undefined ? value.trimStart() : default_profile}
                  alt="Coach"
                  width={100}
                  height={100}
                ></Image>
              ) : (
                <div className="text-white">{value}</div>
              )}
            </div>
          );
        })}
        {tipo == "Player" ? (
          ""
        ) : (
          <div className="flex gap-3 mt-3">
            <button onClick={openModal}>
              <div className="icon-pencil"></div>
            </button>
            <button onClick={openModal2}>
              <div className="icon-trash"></div>
            </button>
          </div>
        )}
      </div>

      {/* Modal para editar */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col justify-center items-center">
          {Values.map((value, key) => {
            return (
              <div key={key}>
                {labels[key] == "Image" ? (
                  <div className="rounded-2xl ml-30">
                    <Image
                      src={value !== " " && value !== undefined ? value.trimStart() : default_profile}
                      alt="Coach"
                      width={100}
                      height={100}
                    ></Image>
                  </div>
                ) : (
                  ""
                )}
                {labels[key] !== "ID" ? (
                  <input
                    className="bg-grey-400 rounded-2xl text-center"
                    type={labels[key] !== "Image" ? "text" : "file"}
                    value={labels[key] !== "Image" ? value : undefined}
                    onChange={(e) => {
                      labels[key] !== "Image"
                        ? setValue(key, e.target.value)
                        : setImage(e.target.files![0]);
                      if (labels[key] == "Image") {
                        setValue(key, URL.createObjectURL(e.target.files![0]));
                      }
                    }}
                  />
                ) : (
                  <input
                    className="bg-gray-400 rounded-2xl text-center"
                    type="text"
                    readOnly
                    value={value}
                  />
                )}
              </div>
            );
          })}

          <p
            className={
              response.includes("Error") ? "text-red-500" : "text-green-500"
            }
          >
            {response}
          </p>

          <button
            onClick={editValues}
            className="bg-blue-500 text-white py-2 px-4 mt-3 rounded-2xl"
          >
            Actualizar
          </button>
        </div>
      </Modal>

      <Modal isOpen={isOpen2} onClose={closeModal2}>
        <div className="flex flex-col justify-center items-center">
          ¿Estás seguro de que quieres eliminar este {tipo}?
          <div className="flex gap-4 mt-3">
            <div onClick={deleteValues} className="icon-trash mt-1 mb-2"></div>
            <div onClick={closeModal2} className="icon-return"></div>
          </div>
          <p
            className={
              response2.includes("Error") ? "text-red-500" : "text-green-500"
            }
          >
            {response2}
          </p>
        </div>
      </Modal>
    </>
  );
}
