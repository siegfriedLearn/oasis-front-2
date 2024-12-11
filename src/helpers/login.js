import { urlApi } from "./api/api"

//AUTH
export const auth = async (obj) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420" //Esta línea es para evitar la alerta de ngrock al hacer la petición
        // "authorization": token
      },
      body: JSON.stringify(obj),
    };
  
    const data = await fetch(`${urlApi}/api/auth/login`, options);
    const resp = await data.json();
    //console.log(resp)
  
    return resp;
  };