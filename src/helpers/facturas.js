import { urlApi } from "./api/api"

export const postCrearFactura = async (data, token) => {

  const url = `${urlApi}/api/facturas/postCrearFactura`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
      body: JSON.stringify(data),
    });
    const confirmacion = await response.json();
    console.log(confirmacion)
  
  return confirmacion;
  }

  export const postPagarFacturas = async (data, token) => {

    const url = `${urlApi}/api/facturas/postPagarFactura`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "authorization": token,"ngrok-skip-browser-warning": "69420"},
        body: JSON.stringify(data),
      });
      const confirmacion = await response.json();
      console.log(confirmacion)
    
    return confirmacion;
    }

    export const getFacturasGeneradas = async (token) => {

      const url = `${urlApi}/api/facturas/getGeneradas`;
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json", "authorization": token},
        });
        const confirmacion = await response.json();
        console.log(confirmacion)
      
      return confirmacion;
      }