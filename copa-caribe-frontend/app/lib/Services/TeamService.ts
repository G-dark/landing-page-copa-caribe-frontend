import { UrlAPI } from "./SignedPeopleService";

export const getTeamByID = async (id: string) => {
  try {
    const team = await fetch(UrlAPI + "/team/" + id);
    return team;
  } catch (error) {
    return Response.json({ error: "Error al obtener el equipo" });
  }
};

export const createTeam = async (
  team: any,
  token: string,
  username: string,
) => {
  try {
    const created = await fetch(UrlAPI + "/team/create/" + username, {
      headers: {
        Authorization: "Bearer " + token,
      },
      body: team,
      method: "POST",
    });

    return created;
  } catch (error) {
    return Response.json({ error: "Error al crear el equipo" });
  }
};
export const updateTeam = async (
  team: any,
  id: string,
  token: string,
  username: string,
) => {
  try {
    const created = await fetch(
      UrlAPI + "/team/update/" + id + "/" + username,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        body: team,
        method: "PATCH",
      },
    );

    return created;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el equipo" });
  }
};

export const addCoach = async (teamID: string, token: string, coach: any) => {
  try {
    const added = await fetch(UrlAPI + "/team/addCoach/" + teamID, {
      headers: { Authorization: "Bearer " + token },
      body: coach,
      method: "PATCH",
    });
    return added;
  } catch (error) {
    return Response.json({ error: "Error al agregar el entrenador" });
  }
};
export const deleteCoach = async (
  teamID: string,
  token: string,
  coachID: string,
) => {
  try {
    const deleted = await fetch(
      UrlAPI + "/team/deleteCoach/" + teamID + "/" + coachID,
      {
        headers: { Authorization: "Bearer " + token },
        method: "PATCH",
      },
    );
    return deleted;
  } catch (error) {
    return Response.json({ error: "Error al eliminar el entrenador" });
  }
};
export const updateCoach = async (
  teamID: string,
  token: string,
  coach: any,
  coachID: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/team/updateCoach/" + teamID + "/" + coachID,
      {
        headers: { Authorization: "Bearer " + token },
        body: coach,
        method: "PATCH",
      },
    );
    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el entrenador" });
  }
};
export const addManager = async (
  teamID: string,
  token: string,
  manager: any,
  username: string,
) => {
  try {
    const added = await fetch(
      UrlAPI + "/team/makeManager/" + teamID + "/" + username,
      {
        headers: { Authorization: "Bearer " + token },
        body: manager,
        method: "PATCH",
      },
    );
    return added;
  } catch (error) {
    return Response.json({ error: "Error al agregar el manager" });
  }
};
export const deleteManager = async (
  teamID: string,
  token: string,
  managerID: string,
  username: string,
) => {
  try {
    const deleted = await fetch(
      UrlAPI +
        "/team/deleteManager/" +
        teamID +
        "/" +
        managerID +
        "/" +
        username,
      {
        headers: { Authorization: "Bearer " + token },
        method: "PATCH",
      },
    );
    return deleted;
  } catch (error) {
    return Response.json({ error: "Error al eliminar el manager" });
  }
};
export const updateManager = async (
  teamID: string,
  token: string,
  manager: any,
  managerID: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/team/updateManager/" + teamID + "/" + managerID,
      {
        headers: { Authorization: "Bearer " + token },
        body: manager,
        method: "PATCH",
      },
    );
    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el manager" });
  }
};
