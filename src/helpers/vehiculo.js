import { urlApi } from "./api/api"

export const postVehiculo = async (data, token) => {
  

  const url = `${urlApi}/api/vehiculos/postVehiculo`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      body: JSON.stringify(data),
    });
    const confirmacion = await response.json();
  
  return confirmacion;
  }


export const getVehiculo = async (placa, token) => {
  console.log(urlApi)
    const url = `${urlApi}/api/vehiculos/getVehiculo/${placa}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      });
      const result = await response.json();
    
    return result;
    }