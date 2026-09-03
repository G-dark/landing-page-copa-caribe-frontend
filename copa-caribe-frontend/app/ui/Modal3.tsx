"use client";

import { ReactNode } from "react";

export default function Modal3({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onClose} className="modal-overlay fixed w-full min-h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-md">
        <div className="modal-content shadow-md max-h-[600px] overflow-y-auto touch-pan-y w-[500px] w-max rounded-2xl relative min-w-100">
          <button className="modal close absolute top-2 right-2 bg-none border-none cursor-pointer text-sm" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
