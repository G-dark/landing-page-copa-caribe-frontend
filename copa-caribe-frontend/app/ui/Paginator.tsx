"use client";
import { useState } from "react";

export default function Paginator({
  array,
  CardItem,
}: {
  array: any[];
  CardItem: React.ComponentType<{
    item: any;
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
      <div className="flex justify-center items-center w-full">
        <div onClick={goBack} className="icon-left-arrow mr-3"></div>

        {currentItems.map((item, index) => (
          <CardItem key={index} item={item} />
        ))}

        <div onClick={goAhead} className="icon-right-arrow ml-3"></div>
      </div>

      <div className="flex">
        {currentPage}/{totalPages}
      </div>
    </>
  );
}