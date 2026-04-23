"use client";

import { ReactNode } from "react";

export default function Modal({
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
      <div className="modal-overlay fixed w-full min-h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50">
        <div className="modal-content bg-white p-10  shadow-md max-w-[500px] w-full rounded-2xl relative min-w-100">
          <button className="modal close absolute top-2 right-2 bg-none border-none cursor-pointer text-sm" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
