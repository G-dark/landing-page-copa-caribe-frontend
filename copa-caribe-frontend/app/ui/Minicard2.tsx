"use client";

export default function MiniCard2({
  item,
  teams,
  setTeams,
  setMessage,
}: {
  item: any;
  teams: any[];
  setTeams: (elements: any) => void;
  setMessage: (value: string) => void;
}) {
  const handleAddTeam = () => {
    if (
      !teams.find((team) => {
        return team.id == item.id;
      })
    ) {
      setMessage("");
      setTeams((e: any) => [...e, item]);
    } else {
      setMessage("Ese equipo ya está agregado");
    }
  };
  return (
    <>
      <div
        className="text-sm bg-blue-800 text-white rounded-2xl p-2 m-2 hover:bg-red-500 cursor-pointer"
        key={item.id}
        onClick={handleAddTeam}
      >
        {item.name}
      </div>
    </>
  );
}
