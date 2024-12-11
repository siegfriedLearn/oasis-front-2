const auth = 'EAAQDP5PNsZBkBOx3Ed8BZCSbmOlExHxO6bNZAAWZAvmOyRzAs8h9dBgZB9ZCmGynYqNAVaInT9dn5OAjdgArOvESdwmdJKxDBmYiGXmz388HxPHAw4KtTlovFgQUUSQoZA0RHo2ZBk275L8pZB5V3RwBmFR8lWzVCMCu49FUJqZAPQVFIbCXEjWW2ekqP2tDyA4beSHudIx3q51TfNqKSHlbBrR8wf8fR8ZBZBHI02cZD'

export const postEnvioMensaje = async (telefono, placa) => {


  const url = `https://graph.facebook.com/v21.0/135156339670715/messages`;
  // console.log(telefono, placa)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json",
       "Authorization": `Bearer ${auth}`
      },
      body: `{
        "messaging_product": "whatsapp",
        "to": ${telefono},
        "type": "template",
        "template": {
            "name": "inicio",
            "language": {
                "code": "es_MX"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": "de placa ${placa}"
                        },
                        {
                            "type": "text",
                            "text": "Lavado"
                        }
                    ]
                }
            ]
        }
    }`,
    });
    const envioMensaje = await response.json();
    
  
  return envioMensaje;
  };

  
export const postEnvioMensajeFinalizado = async (telefono) => {


  const url = `https://graph.facebook.com/v21.0/135156339670715/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json",
       "Authorization": `Bearer ${auth}`
      },
      body: `{
        "messaging_product": "whatsapp",
        "to": ${telefono},
        "type": "template",
        "template": {
            "name": "ok",
            "language": {
                "code": "ES"
            }
        }
    }`,
    });
    const envioMensaje = await response.json();
    
  
  return envioMensaje;
  }