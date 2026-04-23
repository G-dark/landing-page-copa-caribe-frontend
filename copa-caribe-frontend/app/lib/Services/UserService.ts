import { UrlAPI } from "./SignedPeopleService";

export const loginUser = async (username: string, password: string) => {
  try {
    const result = await fetch(UrlAPI + "/user/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      method: "POST",
    });

    return result;
  } catch (error) {
    return Response.json({ error: "Error al iniciar sesión" });
  }
};

export const getUser = async (username: string, token: string) => {
  try {
    const user = await fetch(UrlAPI + "/user/" + username, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      method: "GET",
    });

    return user;
  } catch (error) {
    return Response.json({ error: "Error al obtnener el usuario" });
  }
};

export const createUser4Signed = async (body: any, token: string) => {
  try {
    const user = await fetch(UrlAPI + "/user/createUser4Signed", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
      method: "POST",
    });

    return user;
  } catch (error) {
    return Response.json({ error: "Error al crear los usuarios para las personas inscritas" });
  }
};

export const updateUser = async (
  user: any,
  token: string,
  username: string,
) => {
  try {
    const updated = await fetch(UrlAPI + "/user/update/" + username, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(user),
      method: "PATCH",
    });

    return updated;
  } catch (error) {
    return Response.json({ error: "Error al actualizar el usuario" });
  }
};
