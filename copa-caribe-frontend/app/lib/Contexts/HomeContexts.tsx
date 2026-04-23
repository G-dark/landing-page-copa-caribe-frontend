"use client";

import { createContext, useContext } from "react";

type HomeContextType = {
  isActive: boolean;
  setActive: (value: boolean) => void;
  year: number;
  islogged: boolean;
  setLogged: (value: boolean) => void;
  show: boolean;
  setShow: (value: boolean) => void;
  device: string;
  rol: string;
  setRol: (value: string) => void;
};
export const HomeContext = createContext<HomeContextType | null>(null);

export function useHome() {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("useHome debe usarse dentro de HomeContext.Provider");
  }

  return context;
}
