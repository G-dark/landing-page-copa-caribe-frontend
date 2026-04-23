"use client";
import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg"
import { useRouter } from "next/navigation";
export default function CardTeam({ item }: { item: any }) {
  const router = useRouter();
  return (
    <div onClick={() => router.push("/teamDetail?id=" + item.id )} key={item.id}>
      <div className="flex flex-col justify-center items-center bg-blue-800 w-[170px] h-[200px] mr-10 text-white p-5 rounded-2xl">
        <Image
          className="rounded-full"
          src={item.flag !== " " ? item.flag : default_escudo}
          width={50}
          height={50}
          alt="Escudo de equipo"
        ></Image>
        <div>{item.name}</div>
        <div>{"Cat-" + item.category}</div>
        <div>{item.edition}</div>
      </div>
    </div>
  );
}
