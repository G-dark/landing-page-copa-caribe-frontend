"use client";
import { useState } from "react";

export default function Paginator3({
  array,
  CardItem,
  setMessage1
}: {
  array: any[];
  CardItem: React.ComponentType<{
    item: any;
    setMessage: (id:number) => void;
  }>;
  setMessage1: (id:number) => void;
}) {
  const itemsPerPage = array.length > 5 ? 5 : array.length;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(array.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = array.slice(startIndex, endIndex);

  const goAhead = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <>
    <div className="flex flex-col">
       <div className="flex justify-center items-center w-full">
        <div onClick={goBack} className="icon-left-arrow mr-3"></div>

        {currentItems.map((item, index) => (
          <CardItem key={index} item={item} setMessage={setMessage1} />
        ))}

        <div onClick={goAhead} className="icon-right-arrow ml-3"></div>
      </div>

      
    </div>
    </>
  );
}