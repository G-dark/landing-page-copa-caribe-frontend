export default function MiniCard({
  item,
  teams,
  setTeams,
  showNumbers,
  index
}: {
  item: any;
  teams: any[];
  setTeams: (elements: any) => void;
  showNumbers: boolean;
  index:number;
}) {
  const handleDeleteTeam = () => {
    setTeams(
      teams.filter((team: any) => {
        return team.id !== item.id;
      }),
    );
  };
  return (
    <div className="flex">
      {showNumbers ? index+1: ""}
      <div
        className="flex text-sm w-full bg-blue-800 text-white rounded-2xl p-2 m-2"
        key={item.id}
      >
        {item.name}
        <div className="ml-auto cursor-pointer " onClick={handleDeleteTeam}>&times;</div>
      </div>

    </div>
  );
}
