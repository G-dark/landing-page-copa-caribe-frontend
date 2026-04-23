"use client";

import { useState } from "react";
import countries from "../../public/countries.json";
import icons from "rendered-country-flags";
import Image from "next/image";
export default function countrySelector({
  value,
  setValue,
  className,
  containerClassName,
}: {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  containerClassName?: string;
}) {
  const [country, setCountry] = useState({
    name: "Colombia",
    code: "CO",
    phoneCode: "+57",
    flagEmoji: "🇨🇴",
  });

  const searchCountry = () => {
    for (let country of countries) {
      if (country.name.includes(value)) {
        setCountry(country);
      }
    }
  };

  return (
    <>
      <div className={ containerClassName !== undefined ? containerClassName :"flex items-center gap-2 bg-gray-200 rounded"}>
        <Image
          className="h-auto"
          src={icons[country.code]!}
          alt={country.name}
          height={30}
          width={20}
        ></Image>
        <input
          list="paises"
          className={ className !== undefined ? className :"w-full mt-1 p-2 bg-gray-200 rounded"}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            searchCountry();
          }}
        />
        <datalist id="paises">
          {countries.map((country) => (
            <option key={country.code} value={country.name} />
          ))}
        </datalist>
      </div>
    </>
  );
}
