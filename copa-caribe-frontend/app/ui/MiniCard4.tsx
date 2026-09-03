export default function MiniCard4({
  item,
  players,
  setPlayers
}: {
  item: any;
  players: any[];
  setPlayers: (elements: any) => void;
}) {
  const handleDeleteTeam = () => {
    setPlayers(
      players.filter((player: any) => {
        return player.id !== item.id;
      }),
    );
  };
  return (
    <div className="flex">

      <div
        className="flex text-sm w-full bg-blue-800 text-white rounded-2xl p-2 m-2"
        key={item.id}
      >
        {item.dorsal}
        <div className="ml-auto cursor-pointer " onClick={handleDeleteTeam}>&times;</div>
      </div>

    </div>
  );
}
