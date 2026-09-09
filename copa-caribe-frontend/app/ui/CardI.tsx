"use client";
import Image from "next/image";
import default_escudo from "../../public/default_escudo.jpg"

export default function CardI({ item, setMessage }: { item: any; setMessage: (id:number) => void }) {

  return (
    <div onClick={()=>setMessage(item.id)}  key={item.id}>
      <div className="flex flex-col w-full h-auto justify-center items-center mr-5 ml-5 text-white p-5 rounded-2xl cursor-pointer">
        <Image
          className="rounded-2xl w-auto h-auto"
          src={item.image !== null ? item.image : default_escudo}
          width={200}
          height={200}
          alt="imagen del equipo"
        />
      </div>
    </div>
  );
}
