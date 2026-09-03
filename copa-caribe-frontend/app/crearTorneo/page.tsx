"use client";

import { Suspense } from "react";
import CrearTorneoContent from "../lib/Utils/CrearTorneoContent";

export default function crearTorneo() {


  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    >
     <CrearTorneoContent/>
    </Suspense>
  );
}
