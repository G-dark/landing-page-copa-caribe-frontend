import { fromJSONToQueryParams, UrlAPI } from "./SignedPeopleService";

export const createTournament = async (tournament: any, token: string) => {
  try {
    const created = await fetch(UrlAPI + "/tournament/create", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournament),
      method: "POST",
    });

    return created;
  } catch (error) {
    return Response.json({ error: "Error al crear el torneo" });
  }
};

export const getTournaments = async () => {
  try {
    const tournament = await fetch(UrlAPI + "/tournaments");
    return tournament;
  } catch (error) {
    return Response.json({ error: "Error al obtener los torneos" });
  }
};

export const getTournamentByID = async (id: string) => {
  try {
    const tournament = await fetch(UrlAPI + "/tournament/" + id);
    return tournament;
  } catch (error) {
    return Response.json({ error: "Error al obtener el torneo" });
  }
};

export const updateTournament = async (
  id: string,
  token: string,
  tournament: any,
) => {
  try {
    const updated = await fetch(UrlAPI + "/tournament/update/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: tournament,
      method: "PATCH",
    });
    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el torneo" });
  }
};

export const deleteTournament = async (id: string, token: string) => {
  try {
    const deleted = await fetch(UrlAPI + "/tournament/delete/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    return deleted;
  } catch (error) {
    return Response.json({ error: "Error al eliminar el torneo" });
  }
};

export const inscribeTeamToTournament = async (
  id: string,
  token: string,
  data: any,
) => {
  try {
    const updated = await fetch(UrlAPI + "/tournament/inscribeTeam/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: data,
      method: "PATCH",
    });
    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el torneo" });
  }
};
export const getTournamentByQuery = async (query: any) => {

  try {
    const team = await fetch(UrlAPI + "/tournamentQuery/" + fromJSONToQueryParams(query));
    return team;
  } catch (error) {
    return Response.json({ error: "Error al obtener los torneos" });
  }
};