import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  postCrearFactura,
  getFacturasGeneradas,
  postPagarFacturas,
} from "../helpers/facturas";
import { postCrearPropietario, getPropietario, getColaboradores } from "../helpers/propietario";
import {
  postIniciarServicio,
  getEjecucion,
  postFinalizarServicio,
} from "../helpers/manejoServicios";
import { getServicios } from "../helpers/servicios";
import { getVehiculo, postVehiculo } from "../helpers/vehiculo";
import { postEnvioMensaje, postEnvioMensajeFinalizado } from "../helpers/postEnvioMensaje";
import { DialogDescription } from '@radix-ui/react-dialog';




const VehicleEntry = () => {
  const token = localStorage.getItem("token");


  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    nombres: '',
    apellidos: '',
    telefono: '',
  });
  const [formServiciosPrestados, setformServiciosPrestados] = useState({
    servicio: "",
    colaborador: ""
  });
  //ACÁ SE GUARDA LO QUE VIENE DE LA TABLA SERVICIOS
  const [preciosServicios, setPreciosServicios] = useState([
    {
      id: "",
    },
  ]);
     //ACÁ SE GUARDA EL LISTADO DE COLABORADORES
     const [colaboradores, setColaboradores] = useState([
      {
        id: "",
      },
    ]);
    
    const [activeServices, setActiveServices] = useState([
    ]);
    
    const [datosFinalizacion, setDatosFinalizacion] = useState("");
    
    const { servicio,  colaborador} = formServiciosPrestados;
  const [showBillingModal, setShowBillingModal] = useState(false);
  // const [selectedVehicle, setSelectedVehicle] = useState(null);

  const marcas = ['Chevrolet', 'Renault', 'Toyota', 'Mazda', 'Ford', 'Kia', 'Nissan', 'Volkswagen', 'BMW', 'Mercedes-Benz','Suzuki', 'Hyundai', 'Honda', 'Audi','Jeep','Mitsubishi','Dodge','Peugeut','Volvo','Citroen', 'Subaru', 'Fiat', 'JAC', 'Land Rover', 'Ssangyong', 'Daihatsu', 'RAM', 'BYD', 'Moto', 'Otro'];
  const colors = ['Amarillo', 'Azul', 'Beige', 'Blanco', 'Celeste', 'Dorado', 'Gris', 'Naranja', 'Negro', 'Rojo','Verde', 'Violeta', 'Otro' ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onInputChangeFinalizacion = ({ target }) => {
    const { name, value } = target;
    setformServiciosPrestados({
      ...formServiciosPrestados,
      [name]: value,
    });
  };

  // REGISTRO DE VEHÍCULO
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData.placa)
    if(formData.placa.length != 6){
      toast.warning('El número de caracteres no corresponde a una placa')
      return
    }
    if (!formData.marca || formData.marca==="SELECCIONE UNA MARCA") {
      (toast.warning("Por favor seleccione una marca"));
      return;
    }
    if (!formData.color || formData.color==="SELECCIONE UN COLOR") {
      (toast.warning("Por favor seleccione un color"));
      return;
    }
    // console.log('Form submitted:', formData);
    if (activeServices.find(vehiculo => vehiculo.placa==formData.placa)) {
      toast.warning('Este vehículo ya se encuentra en  ejecución de servicio')
      return;
    }
    if(formData.telefono.length != 10){
      toast.warning('Revisa el número de teléfono')
      return
    }

    const infoCarro = {
      placa: formData.placa.toUpperCase(),
      marca: formData.marca,
      modelo: formData.modelo,
      color: formData.color,
    };

    const infoPropietario = {
      telefono: formData.telefono,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      rol: "client",
    };


    let consultaVehiculo = await getVehiculo(formData.placa, token);
    let consultarPropietario = await getPropietario(formData.telefono, token);

    if (consultaVehiculo.data.length === 0) {
      await postVehiculo(infoCarro, token);
    }
    if (consultarPropietario.data.length === 0) {
      await postCrearPropietario(infoPropietario, token);
    }

    consultaVehiculo = await getVehiculo(formData.placa, token);
    let fk_id_vehiculo = consultaVehiculo.data[0].id;

    consultarPropietario = await getPropietario(formData.telefono, token);
    let fk_id_persona = consultarPropietario.data[0].id;

    const infoEjecucionServicio = {
      fk_id_vehiculo,
      fk_id_persona,
    };
    //console.log(infoEjecucionServicio);
    await postIniciarServicio(infoEjecucionServicio, token);

    toast.success('Vehículo registrado exitosamente');
    envioMensaje(formData.telefono, formData.placa);

    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      nombres: '',
      apellidos: '',
      telefono: '',
    });
    serviciosActivos();
  };

  const finalizarServicio = async (id) => {

    if (!formServiciosPrestados.servicio) {
      toast.warning('Verifique el servicio seleccionado');
      return;
    }
    if (!formServiciosPrestados.colaborador) {
      toast.warning('Verifique el colaborador seleccionado');
      return;
    }

    const servicioFinalizar = { id };
    await postFinalizarServicio(servicioFinalizar, token);
    const infoDetallesServicios = {};

    infoDetallesServicios.fk_id_ejecucion_servicios = datosFinalizacion.id;
    infoDetallesServicios.fk_id_servicios = formServiciosPrestados.servicio;
    infoDetallesServicios.fk_id_persona_operario = formServiciosPrestados.colaborador;
    await postCrearFactura(infoDetallesServicios, token);
    //console.log(infoDetallesServicios)
    //Revisar plantilla
    //postEnvioMensajeFinalizado('573012671359')
    serviciosActivos();
    setformServiciosPrestados({
      servicio: "",
      colaborador: ""
    })
    toast.success('Servicio finalizado correctamente')
  };

  useEffect(() => {
    listadoServicios();
    serviciosActivos();
    listadoColaboradores();
  }, []);
  const listadoServicios = async () => {
    const ejecucion = await getServicios(token);
    //console.log(ejecucion.data[0]);
    setPreciosServicios(ejecucion.data);
  };
  const serviciosActivos = async () => {
    const ejecucion = await getEjecucion(token);
    //console.log(ejecucion.data[0])
    setActiveServices(ejecucion.data);
  };
  const listadoColaboradores = async () => {
    const ejecucion = await getColaboradores(token);
    //console.log(ejecucion.data[0]);
    setColaboradores(ejecucion.data);
  };

  const handleBilling = (vehicle) => {
    // setSelectedVehicle(vehicle);
    setDatosFinalizacion(vehicle);
    setShowBillingModal(true);
  };

  //NOTIFICACIÓN INICIO SERVICIO
  const envioMensaje = async (telefono, placa) => {
    //console.log(telefono)
    postEnvioMensaje(`57${telefono}`, placa);
  };

  //NOTIFICACIÓN FINALIZACIÓN SERVICIO
  const handleNotify = async(vehicle) => {
    const response = await postEnvioMensajeFinalizado(`57${vehicle.telefono}`);
    //console.log(response.messages.length)
    if (response.error.code === 190) {
      toast.warning('Error en el token de Meta');
      return
    }
    if (response.messages.length > 0) {
      toast.success('Mensaje enviado correctamente');
      return;
    }else{
      toast.warning('No se pudo enviar el mensaje'); 
    }
  };


  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Registro de vehículos</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Placa</label>
            <Input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <select
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              required
            >
              <option value="">SELECCIONE UNA MARCA</option>
              {marcas.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Modelo</label>
            <Input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              required
            >
              <option value="">SELECCIONE UN COLOR</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <Input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <Input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <Input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button variant="outline" type="submit" className="w-full sm:w-auto">
              Registrar
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Servicios activos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notificar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finalizar servicio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.placa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.nombres} {service.apellidos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" onClick={() => handleNotify(service)}>
                      Notificar
                    </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" onClick={() => {
                      handleBilling(service)
                      // enviarInfoModal(servicio)
                      }}>
                      Finalizar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
        <DialogContent className="DialogContent">
          <DialogHeader>
            <DialogTitle>Detalles servicio</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {datosFinalizacion && (
            <div className="space-y-4">
              <p>Placa: {datosFinalizacion.placa} </p>
              <p>Propietario: {datosFinalizacion.nombres} {datosFinalizacion.apellidos}</p>
            </div>
          )}
          <form>
                  <div className="form-group">
                    <label htmlFor="servicio">Servicio:</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="servicio"
                      id="servicio"
                      onChange={onInputChangeFinalizacion}
                      value={servicio}
                    >
                    <option value="SELECCIONE UN SERVICIO">SELECCIONE UN SERVICIO</option>
                      {preciosServicios.map((serv) => (
                        <option
                          key={serv.id}
                          value={serv.id}
                        >{`${serv.tipo_vehiculo}-${serv.servicio}-${serv.valor}`}</option>
                      ))}
                    </select>
                    <br /><br />
                    <label htmlFor="colaborador">Colaborador:</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="colaborador"
                      id="colaborador"
                      onChange={onInputChangeFinalizacion}
                      value={colaborador}
                    >
                      <option value="SELECCIONE UN COLABORADOR">SELECCIONE UN COLABORADOR</option>
                      {colaboradores.map((colaborador) => (
                        <option
                          key={colaborador.id}
                          value={colaborador.id}
                        >{`${colaborador.nombres} ${colaborador.apellidos}`}</option>
                      ))}
                    </select>
                    {/* <hr />
                    <div className="space-y-4">
              <p>Total: {serv.valor}</p>
            </div> */}
                  </div>
                </form>
          <DialogFooter>
            {/* <Button variant="outline" onClick={() => setShowBillingModal(false)}>
              Cancelar
            </Button> */}
            <Button
            variant="outline"
              onClick={() => {
                finalizarServicio(datosFinalizacion.id)
                setShowBillingModal(false);
              }}
            >
              Completar Servicio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       
    </div>
  );
};

export default VehicleEntry;