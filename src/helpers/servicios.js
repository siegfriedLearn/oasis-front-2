import { urlApi } from "./api/api"



  export const getServicios = async (token) => {

    const url = `${urlApi}/api/servicios/all`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      });
      const confirmacion = await response.json();
    
    return confirmacion;
    }