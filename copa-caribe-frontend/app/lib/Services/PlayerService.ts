import { UrlAPI } from "./SignedPeopleService";

export const getPlayerByID = async (id: string, token:string) => {
  try {
    const player = await fetch(UrlAPI + "/playerWID/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
    return player;
  } catch (error) {
    return Response.json({ error: "Error al obtener el jugador" });
  }
};
export const getPlayerQuery = async (token: String, query: any) => {
  let qry = "?";
  let i = 0;
  for (let field in query) {
    if (i > 0) {
      qry += "&";
    }
    qry += field + "=" + query[field];
    ++i;
  }
  try {
    const result = await fetch(UrlAPI + "/players/" + qry, {
      headers: { Authorization: "Bearer " + token },
      method: "GET",
    });
    return result;
  } catch (error) {
    return Response.json({ error: "Error al obtener los jugadores" });
  }
};
export const createPlayer = async (
  player: any,
  token: string
) => {
  try {
    const created = await fetch(UrlAPI + "/player/create/", {
      headers: {
        Authorization: "Bearer " + token,
      },
      body: player,
      method: "POST",
    });

    return created;
  } catch (error) {
    return Response.json({ error: "Error al crear el jugador" });
  }
};
export const updatePlayer = async (
  player: any,
  id: string,
  editionPlayed: string,
  token: string
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/player/update/" + id + "/" + editionPlayed,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        body: player,
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el equipo" });
  }
};