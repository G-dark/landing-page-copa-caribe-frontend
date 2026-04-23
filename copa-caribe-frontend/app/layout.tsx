"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./ui/globals.css";
import { HomeContext } from "./lib/Contexts/HomeContexts";
import { useEffect, useState } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import Script from "next/script";
import useDeviceType from "./lib/Utils/UseDeviceType";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isActive, setActive] = useState(false);
  const [year, setYear] = useState(0);
  const [islogged, setLogged] = useState(false);
  const [show, setShow] = useState(true);
  const [rol, setRol] = useState("");
  const device = useDeviceType();
  // obtener el año
  useEffect(() => {
    const time = new Date();
    setYear(time.getFullYear());
  }, []);
  return (
    <HomeContext.Provider
      value={{
        isActive,
        setActive,
        year,
        islogged,
        setLogged,
        show,
        setShow,
        device,
        rol,
        setRol
      }}
    >
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Script src="http://localhost:8097"></Script>
          {children}
        </body>
      </html>
    </HomeContext.Provider>
  );
}
