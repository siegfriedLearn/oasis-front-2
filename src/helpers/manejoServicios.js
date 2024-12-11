import { urlApi } from "./api/api"

export const postIniciarServicio = async (data, token) => {

  const url = `${urlApi}/api/ejecucion_servicios/postIniciarServicio`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      body: JSON.stringify(data),
    });
    const confirmacion = await response.json();
  
  return confirmacion;
  }

  export const postFinalizarServicio = async (data, token) => {

    const url = `${urlApi}/api/ejecucion_servicios/postFinalizarServicio`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
        body: JSON.stringify(data),
      });
      const confirmacion = await response.json();
      console.log(confirmacion)
    return confirmacion;
    }

  export const getEjecucion = async (token) => {

    const url = `${urlApi}/api/ejecucion_servicios/getEjecucion`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      });
      const confirmacion = await response.json();
    
    return confirmacion;
    }