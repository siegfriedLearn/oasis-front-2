import { urlApi } from "./api/api"

  export const getHistorico = async (token) => {

    const url = `${urlApi}/api/ejecucion_servicios/getHistorico`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      });
      const confirmacion = await response.json();
    
    return confirmacion;
    }