import { UrlAPI, fromJSONToQueryParams } from "./SignedPeopleService";

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
  try {
    const result = await fetch(UrlAPI + "/players/" + fromJSONToQueryParams(query), {
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
    return Response.json({ error: "Error al actualizar el jugador" });
  }
};

export const deletePlayer = async (id: string, edition: string, token: string) => {
  try {
    const deleted = await fetch(UrlAPI + "/player/delete/" + id + "/" + edition, {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "DELETE",
    });
    return deleted;
  } catch (error) {
    return Response.json({ error: "Error al eliminar el jugador" });
  }
};