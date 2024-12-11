import { urlApi } from "./api/api";

export const postCrearPropietario = async (data, token) => {
  const url = `${urlApi}/api/propietarios/crear`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: token,"ngrok-skip-browser-warning": "69420" },
    body: JSON.stringify(data),
  });
  const confirmacion = await response.json();
  console.log(confirmacion);

  return confirmacion;
};

export const getPropietario = async (telefono, token) => {
  const url = `${urlApi}/api/propietarios/byTelefono/${telefono}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: token,"ngrok-skip-browser-warning": "69420" },
  });
  const result = await response.json();
  //console.log(result)

  return result;
};

export const getColaboradores = async ( token ) => {
  const url = `${urlApi}/api/users/all`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: token,"ngrok-skip-browser-warning": "69420" },
  });
  const result = await response.json();
  //console.log(result)

  return result;
};
