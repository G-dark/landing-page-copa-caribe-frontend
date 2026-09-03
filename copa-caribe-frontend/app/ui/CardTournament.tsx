"use client";

import { useRouter } from "next/navigation";
export default function CardTournament({ item }: { item: any }) {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        router.push("/tournamentDetail?id=" + item.id);
      }}
      key={item.id}
    >
      <div className="flex flex-col justify-center items-center bg-blue-800 w-[170px] h-[200px] mr-5 ml-5 text-white p-5 rounded-2xl">
        <div>{item.name}</div>
        <div>{"Cat-" + item.category}</div>
        <div>{item.edition}</div>
        <div>{item.city}</div>
      </div>
    </div>
  );
}
