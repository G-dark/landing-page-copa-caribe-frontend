export const UrlAPI = "http://localhost:0509/API";

/**
 * @param id
 * @returns Promise<Response>
 */
export const getSignedPeopleID = async (id: string, token: string) => {
  try {
    const result = await fetch(UrlAPI + "/signed/" + id, {
      headers: { Authorization: "Bearer " + token },
      method: "GET",
    });

    return result;
  } catch (error) {
    return Response.json({ error: "Error al obtener la persona inscrita" });
  }
};
/**
 * @param token
 * @returns Promise<Response>
 */
export const getSignedPeople = async (token: String) => {
  try {
    const result = await fetch(UrlAPI + "/signed", {
      headers: { Authorization: "Bearer " + token },
      method: "GET",
    });
    return result;
  } catch (error) {
    return Response.json({ error: "Error al obtener las personas inscritas" });
  }
};

export const getSignedPeopleQuery = async (token: String, query: any) => {
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
    const result = await fetch(UrlAPI + "/signedQuery/" + qry, {
      headers: { Authorization: "Bearer " + token },
      method: "GET",
    });
    return result;
  } catch (error) {
    return Response.json({ error: "Error al obtener las personas inscritas" });
  }
};
export const createSignedPeople = async (signed: any) => {
  try {
    const result = await fetch(UrlAPI + "/signed/create", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signed),
      method: "POST",
    });

    return result;
  } catch (error) {
    return Response.json({ error: "Error al crear la persona inscrita" });
  }
};
export const sendEmail = async (name: string, email: string, tipo: string) => {
  try {
    const result = await fetch(
      UrlAPI + "/signedSendEmail/" + name + "/" + tipo + "/" + email,
    );

    return result;
  } catch (error) {
    return Response.json({ error: "Error al enviar el correo electrónico" });
  }
};

export const updateSignedPeople = async (
  signed: any,
  token: String,
  id: string,
) => {
  try {
    const result = await fetch(UrlAPI + "/signed/update/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(signed),
      method: "PATCH",
    });
    return result;
  } catch (error) {
    return Response.json({ error: "Error al actualizar la persona inscrita" });
  }
};
