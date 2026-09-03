"use client";
import default_escudo from "../../public/default_escudo.jpg";
import { useRouter } from "next/navigation";

import Image from "next/image";
export default function CardMatch({ item }: { item: any }) {
  const router = useRouter();
  if (typeof item.teamA === "object" && typeof item.teamB === "object") {
    if (item.status === "Programado") {
      return (
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push("/matchDetail?id=" + item.id);
          }}
          key={item.id}
        >
          <div className="flex flex-col justify-center items-center bg-gray-800 w-[230px] h-[100px] mr-5 ml-5 text-white p-5 rounded-2xl">
            <div className="flex">
              <div className="flex flex-col items-start justify-start">
                <Image
                  width={30}
                  height={30}
                  src={item.teamA.flag || default_escudo}
                  alt="Escudo de equipo A"
                  className="rounded-full"
                />
                <div className="flex text-sm text-start mt-auto">
                  {item.teamA.name.substring(0, 14)}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start">
                {" "}
                <div>{item.phase}</div>{" "}
                <div
                  style={{ fontSize: "10px" }}
                  className="text-sm text-center"
                >
                  {item.date.split("T")[0]}
                </div>
              </div>
              <div className="flex flex-col items-end justify-start">
                <Image
                  width={30}
                  height={30}
                  src={item.teamB.flag || default_escudo}
                  alt="Escudo de equipo B"
                  className="rounded-full"
                />
                <div className="flex text-sm text-end mt-auto">
                  {item.teamB.name.substring(0, 14)}
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (item.status === "En vivo") {
      return (
        <div
          className="cursor-pointer relative"
          onClick={() => {
            router.push("/matchDetail?id=" + item.id);
          }}
          key={item.id}
        >
          <div className="flex flex-col justify-center items-center bg-green-800 w-[230px] h-[100px] mr-5 ml-5 text-white p-5 rounded-2xl">
            <div className="flex">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-start justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamA.flag || default_escudo}
                    alt="Escudo de equipo A"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-start mt-auto">
                    {item.teamA.name.substring(0, 14)}
                  </div>
                </div>
                <div className="ml-1">{item.result.split("-")[0]}</div>
              </div>
              <div className="flex flex col">
                <div>{item.phase}</div>{" "}
                <div
                  style={{ fontSize: "10px" }}
                  className="absolute bottom-3 left-26 "
                >
                  <div>{"En vivo" + " " + item.eventos.at(-1).minute}</div>{" "}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="mr-1">{item.result.split("-")[1]}</div>
                <div className="flex flex-col items-end justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamB.flag || default_escudo}
                    alt="Escudo de equipo B"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-end mt-auto">
                    {item.teamB.name.substring(0, 14)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.status === "Entretiempo") {
      return (
        <div
          className="cursor-pointer relative"
          onClick={() => {
            router.push("/matchDetail?id=" + item.id);
          }}
          key={item.id}
        >
          <div className="flex flex-col justify-center items-center bg-gray-500 w-[230px] h-[100px] mr-5 ml-5 text-white p-5 rounded-2xl">
            <div className="flex">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-start justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamA.flag || default_escudo}
                    alt="Escudo de equipo A"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-start mt-auto">
                    {item.teamA.name.substring(0, 14)}
                  </div>
                </div>
                <div className="ml-1">{item.result.split("-")[0]}</div>
              </div>
              <div className="flex flex col">
                <div>{item.phase}</div>{" "}
                <div
                  style={{ fontSize: "10px" }}
                  className="absolute bottom-3 left-26 "
                >
                  <div>Entretiempo </div>{" "}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="mr-1">{item.result.split("-")[1]}</div>
                <div className="flex flex-col items-end justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamB.flag || default_escudo}
                    alt="Escudo de equipo B"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-end mt-auto">
                    {item.teamB.name.substring(0, 14)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.status === "Penales") {
      return (
        <div
          className="cursor-pointer relative"
          onClick={() => {
            router.push("/matchDetail?id=" + item.id);
          }}
          key={item.id}
        >
          <div className="flex flex-col justify-center items-center bg-green-500 w-[230px] h-[100px] mr-5 ml-5 text-white p-5 rounded-2xl">
            <div className="flex">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-start justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamA.flag || default_escudo}
                    alt="Escudo de equipo A"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-start mt-auto">
                    {item.teamA.name.substring(0, 14)}
                  </div>
                </div>
                {item.penaltyStarter !== "NA" && (
                  <div className="ml-1 mt-4 text-[10px]">
                    {item.penaltieResult.split("-")[0]}
                  </div>
                )}
                <div className="ml-1">{item.result.split("-")[0]}</div>
              </div>
              <div className="flex flex col">
                <div>{item.phase}</div>{" "}
                <div
                  style={{ fontSize: "10px" }}
                  className="absolute bottom-3 left-28 "
                >
                  <div>Penales</div>{" "}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="mr-1">{item.result.split("-")[1]}</div>
                {item.penaltyStarter !== "NA" && (
                  <div className="mr-1 mt-4 text-[10px]">
                    {item.penaltieResult.split("-")[1]}
                  </div>
                )}
                <div className="flex flex-col items-end justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamB.flag || default_escudo}
                    alt="Escudo de equipo B"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-end mt-auto">
                    {item.teamB.name.substring(0, 14)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.status === "Finalizado") {
      return (
        <div
          className="cursor-pointer relative"
          onClick={() => {
            router.push("/matchDetail?id=" + item.id);
          }}
          key={item.id}
        >
          <div className="flex flex-col justify-center items-center bg-red-800 w-[230px] h-[100px] mr-5 ml-5 text-white p-5 rounded-2xl">
            <div className="flex">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-start justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamA.flag || default_escudo}
                    alt="Escudo de equipo A"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-start mt-auto">
                    {item.teamA.name.substring(0, 14)}
                  </div>
                </div>
                 {item.penaltieResult !== 0 - 0 && (
                  <div className="ml-1 mt-4 text-[10px]">
                    {item.penaltieResult.split("-")[0]}
                  </div>
                )}
                <div className="ml-1">{item.result.split("-")[0]}</div>
              </div>
              <div className="flex flex col">
                <div>{item.phase}</div>{" "}
                <div
                  style={{ fontSize: "10px" }}
                  className="absolute bottom-3 left-28 "
                >
                  <div>{item.status}</div>{" "}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="mr-1">{item.result.split("-")[1]}</div>
                {item.penaltieResult !== 0 - 0 && (
                  <div className="mr-1 mt-4 text-[10px]">
                    {item.penaltieResult.split("-")[1]}
                  </div>
                )}

                <div className="flex flex-col items-end justify-start">
                  <Image
                    width={30}
                    height={30}
                    src={item.teamB.flag || default_escudo}
                    alt="Escudo de equipo B"
                    className="rounded-full"
                  />
                  <div className="flex text-sm text-end mt-auto">
                    {item.teamB.name.substring(0, 14)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  if (typeof item.teamA === "string" || typeof item.teamB === "string") {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          router.push("/matchDetail?id=" + item.id);
        }}
        key={item.id}
      >
        <div className="flex flex-col justify-center items-center bg-gray-800 w-[200px] h-[80px] mr-5 ml-5 text-white p-5 rounded-2xl">
          <div className="flex">
            <div className="flex flex-col items-start justify-start">
              <Image
                width={30}
                height={30}
                src={default_escudo}
                alt="Escudo de equipo A"
                className="rounded-full"
              />
              <div className="flex text-sm text-start mt-auto">
                {item.teamA}
              </div>
            </div>
            <div className="flex m-2">{item.phase}</div>
            <div className="flex flex-col items-end justify-start">
              <Image
                width={30}
                height={30}
                src={default_escudo}
                alt="Escudo de equipo B"
                className="rounded-full"
              />
              <div className="flex text-sm text-end mt-auto">
                {item.teamB}
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
