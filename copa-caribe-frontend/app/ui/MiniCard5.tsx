"use client";

export default function MiniCard5({
  item,
}: {
  item: any;
}) {
  if (!item) return null;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "player",
          JSON.stringify(item)
        );
      }}
      className="text-sm bg-blue-800 text-white rounded-2xl p-3 m-2 hover:bg-red-500 cursor-grab active:cursor-grabbing transition-colors select-none"
    >
      {item?.dorsal}
    </div>
  );
}