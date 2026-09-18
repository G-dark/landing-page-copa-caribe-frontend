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
  const [islogged, setLogged] = useState(false);
  const [show, setShow] = useState(true);
  const [rol, setRol] = useState("");
  const device = useDeviceType();
  return (
    <HomeContext.Provider
      value={{
        isActive,
        setActive,
        islogged,
        setLogged,
        show,
        setShow,
        device,
        rol,
        setRol,
      }}
    >
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          {" "}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          ></link>
          <link rel="manifest" href="/site.webmanifest"></link>
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </HomeContext.Provider>
  );
}
