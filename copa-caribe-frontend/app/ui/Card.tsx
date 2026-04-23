"use client";

import { useState } from "react";
import {
  sendEmail,
  updateSignedPeople,
} from "../lib/Services/SignedPeopleService";
import { createUser4Signed } from "../lib/Services/UserService";

export default function Card({
  labels,
  values,
  action,
}: {
  labels: string[];
  values: string[];
  action: string;
}) {
  const [response, setResponse] = useState("");
  const cardAction = async () => {
    if (action == "Contactar") {
      const response = await sendEmail(values[0], values[4], "Contact");
      const data = await response.json();
      const body = {
        id: values[2],
        tel: values[3],
        email: values[4],
        name: values[0],
        lastName: values[1],
        oneCat: values[5] == "Sí" ? true : false,
        multiplesCat: values[6] == "Sí" ? true : false,
        teamName: values[7],
        fase: "Contactado",
      };
      const response2 = await updateSignedPeople(
        body,
        localStorage.getItem("token")!,
        values[2],
      );
      const data2 = await response2.json();

      if ("success" in data && "success" in data2) {
        //"success" in data

        setResponse("Se ha hecho contacto por correo");
      } else {
        setResponse("Error haciendo contacto por correo");
      }
    }

    if (action == "Pasar a pago") {
      const response = await sendEmail(values[0], values[4], "Pendiente");
      const data = await response.json();

      const body = {
        id: values[2],
        tel: values[3],
        email: values[4],
        name: values[0],
        lastName: values[1],
        oneCat: values[5] == "Sí" ? true : false,
        multiplesCat: values[6] == "Sí" ? true : false,
        teamName: values[7],
        fase: "Pendiente a pago",
      };
      const response2 = await updateSignedPeople(
        body,
        localStorage.getItem("token")!,
        values[2],
      );
      const data2 = await response2.json();
      if ("success" in data && "success" in data2) {
        //"success" in data

        setResponse("Se ha pasado la información de pago por correo");
      } else {
        setResponse("Error pasando la información de pago");
      }
    }
    if (action == "Aceptar") {

      const bodyy = {
        name: values[0],
        lastName: values[1],
        id: values[2],
        email: values[4],
        tel:values[3]
      };
      const response = await createUser4Signed(bodyy,localStorage.getItem("token")!);
      const data = await response.json();

      const body = {
        id: values[2],
        tel: values[3],
        email: values[4],
        name: values[0],
        lastName: values[1],
        oneCat: values[5] == "Sí" ? true : false,
        multiplesCat: values[6] == "Sí" ? true : false,
        teamName: values[7],
        fase: "Aceptado",
      };
      const response2 = await updateSignedPeople(
        body,
        localStorage.getItem("token")!,
        values[2],
      );
      const data2 = await response2.json();
      if ("success" in data && "success" in data2) {
        //"success" in data

        setResponse("Se ha aceptado y notificado por correo");
      } else {
        setResponse("Error aceptando al candidato");
      }
    }
  };
  return (
    <>
      <div className=" w-max h-fit flex gap-4 justify-center">
        <div className="w-100 shrink-0 flex flex-col bg-blue-500 p-5 pb-1 rounded-3xl mr-15">
          {labels.map((label, key) => {
            return (
              <div className="">
                {label + ":"} <input type="text" readOnly value={values[key]} />
              </div>
            );
          })}
          <button
            onClick={cardAction}
            className={action !== "" ? "mt-2 bg-red-500 rounded-3xl" : "hidden"}
            type="button"
          >
            {action}
          </button>
          {response}
        </div>
      </div>
    </>
  );
}
