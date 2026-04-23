"use client";
import { useEffect, useState } from "react";

export default function PaginatorCM({
  array,
  labels,
  id,
  tipo,
  setRefresh,
  refresh,
  CardItem,
}: {
  array: any[];
  labels: string[];
  id: string;
  tipo: string;
  setRefresh: (value: boolean) => void;
  refresh: boolean;

  CardItem: React.ComponentType<{
    values: string[];
    labels: string[];
    id: string;
    tipo: string;
    setRefresh: (value: boolean) => void;
    refresh: boolean;
  }>;
}) {
  const itemsPerPage = array.length > 5 ? 5 : array.length;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(array.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = array.slice(startIndex, endIndex);

  const goAhead = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  useEffect(() => {
    goBack();
  }, [array, refresh]);
  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div onClick={goBack} className="icon-left-arrow mr-3"></div>
        {currentItems.map((item, index) => (
          <CardItem
            key={index}
            values={
              tipo == "Player"
                ? [item.image, item.name, item.id, item.dorsal]
                : [item.image, item.name, item.id]
            }
            labels={labels}
            id={id}
            setRefresh={setRefresh}
            refresh={refresh}
            tipo={tipo}
          />
        ))}
        <div onClick={goAhead} className="icon-right-arrow"></div>
      </div>
    </>
  );
}
