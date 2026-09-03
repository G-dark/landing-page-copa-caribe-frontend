import default_escudo from "../../public/default_escudo.jpg";
import Image from "next/image";
export default function Brackets({
  numberTeamsPerGroup,
  numberGroups,
  matches,
}: {
  numberTeamsPerGroup: string;
  numberGroups: string;
  matches: any[];
}) {
  const octavos = matches.filter((match) => match.phase === "Octavos de Final");
  const quarterfinals = matches.filter(
    (match) => match.phase === "Cuartos de Final",
  );
  const semifinals = matches.filter((match) => match.phase === "Semifinal");
  const finale = matches.filter((match) => match.phase === "Final");

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="font-bold text-lg mt-4 mb-4">Llaves</div>
      <div className="flex flex-col justify-center items-center">
        {/* Brackets content */}
        {Number(numberTeamsPerGroup) * Number(numberGroups) == 8 && (
          <>
            <div className="flex flex-col justify-start items-start relative">
              <div className="flex justify-space-between items-center mt-4 mb-12">
                {typeof semifinals[0].teamA === "string" ? (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={default_escudo}
                      alt="Escudo de equipo A"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[0].teamA}
                    </div>{" "}
                  </div>
                ) : (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={semifinals[0]?.teamA?.flag || default_escudo}
                      alt="Escudo de equipo A"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[0].teamA.name}
                      {semifinals[0].status === "Finalizado"
                        ? semifinals[0].result.split("-")[0]
                        : ""}
                    </div>{" "}
                  </div>
                )}

                {typeof semifinals[0].teamB === "string" ? (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={default_escudo}
                      alt="Escudo de equipo B"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[0].teamB}
                    </div>{" "}
                  </div>
                ) : (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={semifinals[0]?.teamB?.flag || default_escudo}
                      alt="Escudo de equipo B"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[0].teamB.name}
                      {semifinals[0].status === "Finalizado"
                        ? semifinals[0].result.split("-")[1]
                        : ""}
                    </div>{" "}
                  </div>
                )}

                <div className="bg-black h-[4px] w-[200px]"></div>
              </div>
              <div className="flex justify-space-between items-center mt-4">
                {typeof semifinals[1].teamA === "string" ? (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={default_escudo}
                      alt="Escudo de equipo A"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[1].teamA}
                    </div>{" "}
                  </div>
                ) : (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={semifinals[1]?.teamA?.flag || default_escudo}
                      alt="Escudo de equipo A"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[1].teamA.name}
                      {semifinals[1].status === "Finalizado"
                        ? semifinals[1].result.split("-")[0]
                        : ""}
                    </div>{" "}
                  </div>
                )}

                {typeof semifinals[1].teamB === "string" ? (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={default_escudo}
                      alt="Escudo de equipo B"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[1].teamB}
                    </div>{" "}
                  </div>
                ) : (
                  <div className="flex flex-col mr-6 justify-center items-center">
                    {" "}
                    <Image
                      width={30}
                      height={30}
                      src={semifinals[1]?.teamB?.flag || default_escudo}
                      alt="Escudo de equipo B"
                      className="rounded-full"
                    />
                    <div style={{ fontSize: "10px" }}>
                      {semifinals[1].teamB.name}
                      {semifinals[1].status === "Finalizado"
                        ? semifinals[1].result.split("-")[1]
                        : ""}
                    </div>{" "}
                  </div>
                )}

                <div className="bg-black h-[4px] w-[200px]"></div>
                <div className="text-sm absolute top-22 left-1">
                  Semifinales{" "}
                </div>
                <div className="bg-black h-[105px] w-[4px] absolute top-10 left-126/128"></div>
                <div className="bg-black h-[4px] w-[200px] absolute top-22 left-63/64"></div>
                <div className="text-sm absolute top-10 left-138">
                  Final
                </div>
                {/* final  */}

                <div className="flex justify-space-between items-center mt-4 mb-1 2 absolute top-15 left-135">
                  {typeof finale[0].teamA === "string" ? (
                    <div className="flex flex-col mr-6 ">
                      {" "}
                      <Image
                        width={30}
                        height={30}
                        src={default_escudo}
                        alt="Escudo de equipo A"
                        className="rounded-full"
                      />
                      <div style={{ fontSize: "10px" }}>
                        {finale[0].teamA}
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex flex-col mr-6 justify-center items-center">
                      {" "}
                      <Image
                        width={30}
                        height={30}
                        src={finale[0]?.teamA?.flag || default_escudo}
                        alt="Escudo de equipo A"
                        className="rounded-full"
                      />
                      <div style={{ fontSize: "10px" }}>
                        {finale[0].teamA.name}
                        {finale[0].status === "Finalizado"
                          ? finale[0].result.split("-")[0]
                          : ""}
                      </div>{" "}
                    </div>
                  )}

                  {typeof finale[0].teamB === "string" ? (
                    <div className="flex flex-col mr-6 justify-center items-center">
                      {" "}
                      <Image
                        width={30}
                        height={30}
                        src={default_escudo}
                        alt="Escudo de equipo B"
                        className="rounded-full"
                      />
                      <div style={{ fontSize: "10px" }}>
                        {finale[0].teamB}
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex flex-col mr-6 justify-center items-center">
                      {" "}
                      <Image
                        width={30}
                        height={30}
                        src={finale[0]?.teamB?.flag || default_escudo}
                        alt="Escudo de equipo A"
                        className="rounded-full"
                      />
                      <div style={{ fontSize: "10px" }}>
                        {finale[0].teamB.name}
                        {finale[0].status === "Finalizado"
                          ? finale[0].result.split("-")[1]
                          : ""}
                      </div>{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
