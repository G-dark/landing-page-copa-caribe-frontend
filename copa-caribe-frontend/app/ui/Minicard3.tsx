"use client";

export default function MiniCard3({
  item,
  array,
  setItems,
  setMessage,
}: {
  item: any;
  array: any[];
  setItems: (elements: any) => void;
  setMessage: (value: string) => void;
}) {
  const handleAddPlayer = () => {
    if (
      !array.find((element) => {
        return element.id == item.id;
      })
    ) {
      setMessage("");
      setItems((e: any) => [...e, item]);
    } else {
      setMessage("Ese jugador ya está agregado");
    }
  };
  return (
    <>
      <div
        className="text-sm bg-blue-800 text-white rounded-2xl p-3 m-2 hover:bg-red-500 cursor-pointer"
        key={item.id}
        onClick={handleAddPlayer}
      >
        {item.dorsal}
      </div>
    </>
  );
}