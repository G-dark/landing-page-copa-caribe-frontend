import { UrlAPI } from "./SignedPeopleService";

export const getMatchByID = async (id: string) => {
  try {
    const match = await fetch(UrlAPI + "/match/" + id);
    return match;
  } catch (error) {
    return Response.json({ error: "Error al obtener el partido" });
  }
};

export const updateMatch = async (match: any, id: string, token: string) => {
  try {
    const updated = await fetch(UrlAPI + "/match/update/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: match,
      method: "PATCH",
    });

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el partido" });
  }
};

export const addReferee = async (referee: any, id: string, token: string) => {
  try {
    const updated = await fetch(UrlAPI + "/match/addReferee/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: referee,
      method: "PATCH",
    });

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al agregar el arbitro al partido" });
  }
};

export const editReferee = async (
  referee: any,
  id: string,
  refereeID: string,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/editReferee/" + id + "/" + refereeID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: referee,
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el arbitro" });
  }
};

export const deleteReferee = async (
  id: string,
  refereeID: string,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/deleteReferee/" + id + "/" + refereeID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al eliminar el arbitro del partido" });
  }
};

export const addEvent = async (event: any, id: string, token: string) => {
  try {
    const updated = await fetch(UrlAPI + "/match/addEvent/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: event,
      method: "PATCH",
    });

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al agregar el evento dentro del partido",
    });
  }
};

export const deleteEvent = async (
  eventID: string,
  id: string,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/deleteEvent/" + id + "/" + eventID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al eliminar el evento dentro del partido",
    });
  }
};

export const editEvent = async (
  eventID: string,
  id: string,
  event: any,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/editEvent/" + id + "/" + eventID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: event,
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al editar el evento dentro del partido",
    });
  }
};


export const addPenalty = async (penalty: any, id: string, token: string) => {
  try {
    const updated = await fetch(UrlAPI + "/match/addPenalty/" + id, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: penalty,
      method: "PATCH",
    });

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al agregar el penal",
    });
  }
};

export const deletePenalty= async (
  penaltyID: string,
  id: string,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/deletePenalty/" + id + "/" + penaltyID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al agregar el eliminar el penal",
    });
  }
};

export const editPenalty = async (
  penaltyID: string,
  id: string,
  penalty: any,
  token: string,
) => {
  try {
    const updated = await fetch(
      UrlAPI + "/match/editPenalty/" + id + "/" + penaltyID,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: penalty,
        method: "PATCH",
      },
    );

    return updated;
  } catch (error) {
    return Response.json({
      error: "Error al agregar el penal",
    });
  }
};