import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { 
    faPhoneAlt,
    faPhoneSlash,
    faBackspace,
    faHandPointer,
    faForward,
    faPause
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from 'react-bootstrap/Modal';
import LoginRedirect from './LoginRedirect';
import io from 'socket.io-client';
import axios from 'axios';
import lodash from 'lodash';
 
let socket = io('http://localhost:5000');
socket = io.connect();

class EditarGestion extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            comentario: this.props.cliente.cliente.gestiones[0][0].comentarios,
            codigoAccion: this.props.cliente.cliente.gestiones[0][0].codigoAccion,
            codigoResultado: this.props.cliente.cliente.gestiones[0][0].codigoResultado,
            codigoContacto: this.props.cliente.cliente.gestiones[0][0].codigoContacto,
            creditos: [this.props.cliente.cliente.creditos[0].numCredito],
            fechaPromesa: '',
            montoPromesa: '',
            validated: false,
            today: '',
            todayDate: '',
            todayHour: ''
        }

        this.handleComentario = this.handleComentario.bind(this);
        this.handleCodigoContacto = this.handleCodigoContacto.bind(this);
        this.handleCodigoAccion = this.handleCodigoAccion.bind(this);
        this.handleCodigoResultado = this.handleCodigoResultado.bind(this);
        this.handleCredito = this.handleCredito.bind(this);
        this.guardarReporte = this.guardarReporte.bind(this);
        this.handleFechaPromesa = this.handleFechaPromesa.bind(this);
        this.handleMontoPromesa = this.handleMontoPromesa.bind(this);
        this.insertGestion = this.insertGestion.bind(this);
    }

    insertGestion(){
        for(let i = 0; i < this.state.creditos.length; i++){
            //let fechaHoraGestion = new Date(Date.parse(this.state.today));
            let today = new Date();
            let fechaHoraGestion = today.toISOString().slice(0, 19).replace('T', ' ');
            console.log(fechaHoraGestion);
            axios.post('/updateGestion', null, {
                params: {
                    idGestion: this.props.cliente.cliente.gestiones[0][0].idGestion,
                    idEmpleadoAsignado: this.props.cliente.cliente.gestiones[0][0].idEmpleadoAsignado,
                    idEmpleadoAtendido: this.props.idUsuarioAtendido,
                    numCredito: parseInt(this.state.creditos[i]),
                    fechaHoraGestion: fechaHoraGestion,
                    numeroContacto: this.props.telefono,
                    comentarios: this.state.comentario,
                    codigoAccion: this.state.codigoAccion,
                    codigoResultado: this.state.codigoResultado,
                    codigoContacto: this.state.codigoContacto
                }
            }).then(response => {
                console.log(response.data[0]);
                
                if(this.state.fechaPromesa !== ''){
                    let fechaPromesa = this.state.fechaPromesa  + ' 00:00:00';
                    console.log(fechaPromesa);
                    axios.post('/updatePromesa', null, {
                        params: {
                            idGestion: this.props.cliente.cliente.gestiones[0][0].idGestion,
                            fechaPromesa: fechaPromesa,
                            montoPromesa: this.state.montoPromesa
                        }
                    })
                }
            });
        }
    }

    componentDidUpdate(){
        let now = new Date();
        let nowHour = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        if(nowHour != this.state.todayHour){
            let today = new Date();
            let todayDate = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear();
            let todayHour = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.setState({
                today: today,
                todayDate: todayDate,
                todayHour: todayHour
            });
        }
    }

    handleComentario(event){this.setState({comentario: event.target.value});}

    handleCodigoContacto(event){this.setState({codigoContacto: event.target.value});}
    handleCodigoAccion(event){this.setState({codigoAccion: event.target.value});}
    handleCodigoResultado(event){this.setState({codigoResultado: event.target.value});}
    handleMontoPromesa(event){this.setState({montoPromesa: event.target.value});}
    handleFechaPromesa(event){this.setState({fechaPromesa: event.target.value});}
    handleCredito(event){
        let clon = lodash.cloneDeep(this.state.creditos);
        let i = clon.indexOf(event.target.value);
        if (i > -1) {
            clon.splice(i, 1);
        } else {
            clon.push(event.target.value);
        }
        this.setState({creditos: clon});
    }

    guardarReporte(event){
        event.preventDefault();
        if(this.state.comentario === '' || this.state.creditos.length === 0 || this.state.codigoAccion === '--' || this.state.codigoResultado === '--' || this.state.codigoContacto === '--'){
            alert('Revise que todos los campos han sido llenados correctamente');
        } else {
            console.log(this.state);
            this.insertGestion();
            //Agregar reporte a la base de datos
            this.props.onHide();
            //this.props.nextClient();
        }
    }
    
    render(){
        return (
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Form onSubmit={this.guardarReporte}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Reporte de llamada
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><b>Nombre: </b>{this.props.cliente.nombre}</p>
                        <p><b>Teléfono marcado:</b> {this.props.telefono}</p>
                        <p><b>Créditos:</b> (Selecciona todos los que hayas gestionado)</p>{/* mostrar todos los creditos del broder este */}
                        {this.state.creditos.map((credito) => (
                            <div key={credito} className="mb-3">
                                <Form.Check 
                                    type='checkbox'
                                    id={credito}
                                    label={credito}
                                    onChange={this.handleCredito}
                                    value={credito}
                                    checked
                                />
                            </div>
                        ))}
                        <p><b>Fecha: (mm-dd-aaaa)</b> {this.state.todayDate}</p>
                        <p><b>Hora:</b> {this.state.todayHour}</p>
                        <Form.Group controlId="comentario">
                            <Form.Label><b>Comentario:</b></Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows="3"
                                value={this.state.comentario} 
                                onChange={this.handleComentario} 
                                placeholder="Comentario"
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Acción</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoAccion} value={this.state.codigoAccion} required>
                                <option>{this.state.codigoAccion}</option>
                                <option>Llamada a casa</option>
                                <option>Llamada a referencia</option>
                                <option>Llamada a sucursal</option>
                                <option>Llamada a laboral</option>
                                <option>Llamada a celular</option>
                                <option>Whatsapp chat</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Resultado</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoResultado} value={this.state.codigoResultado} required>
                                <option>{this.state.codigoResultado}</option>
                                <option>Aclaración</option>
                                <option>Buzón</option>
                                <option>Convenio de liquidación</option>
                                <option>Familiar</option>
                                <option>Fuera de servicio</option>
                                <option>Hijo</option>
                                <option>No contestan</option>
                                <option>No existe</option>
                                <option>Padre</option>
                                <option>Referencia</option>
                                <option>Tercero</option>
                                <option>Titular</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Contacto</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoContacto} value={this.state.codigoContacto} required>
                                <option>{this.state.codigoContacto}</option>
                                <option>Cobro a destiempo</option>
                                <option>Cobro de más</option>
                                <option>Contacto no efectivo</option>
                                <option>Desconoce ser referencia</option>
                                <option>Evasivo</option>
                                <option>Inconformidad con la domiciliación</option>
                                <option>Interesado en Liquidar</option>
                                <option>No conoce al titular</option>
                                <option>No contacto</option>
                                <option>Nuevos datos</option>
                                <option>Pago no reflejado</option>
                                <option>Pago recibido</option>
                                <option>Promesa de pago</option>
                                <option>Promesa incumplida</option>
                                <option>Referencia sin información</option>
                                <option>Seguimiento a PP</option>
                                <option>Sin recursos</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            this.state.codigoContacto ===  'Promesa de pago' ? 
                            <>
                                <Form.Group controlId="fechaPromesa">
                                    <Form.Label><b>Fecha de promesa:</b></Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={this.state.fechaPromesa} 
                                        onChange={this.handleFechaPromesa}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="montoPromesa">
                                    <Form.Label><b>Monto de promesa:</b></Form.Label>
                                    <Form.Control 
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={this.state.montoPromesa} 
                                        onChange={this.handleMontoPromesa}
                                        required
                                    />
                                </Form.Group>
                            </>
                            : 
                            <></>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" onClick={() => this.guardarReporte}>Guardar gestión</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        );
    }
}

class GenerarReporte extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            comentario: '',
            codigoAccion: '--',
            codigoResultado: '--',
            codigoContacto: '--',
            creditos: [],
            fechaPromesa: '',
            montoPromesa: '',
            validated: false,
            today: '',
            todayDate: '',
            todayHour: ''
        }

        this.handleComentario = this.handleComentario.bind(this);
        this.handleCodigoContacto = this.handleCodigoContacto.bind(this);
        this.handleCodigoAccion = this.handleCodigoAccion.bind(this);
        this.handleCodigoResultado = this.handleCodigoResultado.bind(this);
        this.handleCredito = this.handleCredito.bind(this);
        this.guardarReporte = this.guardarReporte.bind(this);
        this.handleFechaPromesa = this.handleFechaPromesa.bind(this);
        this.handleMontoPromesa = this.handleMontoPromesa.bind(this);
        this.insertGestion = this.insertGestion.bind(this);
    }

    insertGestion(){
        for(let i = 0; i < this.state.creditos.length; i++){
            //let fechaHoraGestion = new Date(Date.parse(this.state.today));
            
            let fechaHoraGestion = this.state.today.toISOString().slice(0, 19).replace('T', ' ');
            console.log(fechaHoraGestion);
            axios.post('/insertGestion', null, {
                params: {
                    idEmpleadoAsignado: this.props.idUsuarioAsignado,
                    idEmpleadoAtendido: this.props.idUsuarioAtendido,
                    numCredito: parseInt(this.state.creditos[i]),
                    fechaHoraGestion: fechaHoraGestion,
                    numeroContacto: this.props.telefono,
                    comentarios: this.state.comentario,
                    codigoAccion: this.state.codigoAccion,
                    codigoResultado: this.state.codigoResultado,
                    codigoContacto: this.state.codigoContacto
                }
            }).then(response => {
                console.log(response.data[0]);
                
                if(this.state.fechaPromesa !== ''){
                    let fechaPromesa = this.state.fechaPromesa  + ' 00:00:00';
                    console.log(fechaPromesa);
                    axios.post('/insertPromesa', null, {
                        params: {
                            idGestion: response.data[0][0].idGestion,
                            fechaPromesa: fechaPromesa,
                            montoPromesa: this.state.montoPromesa
                        }
                    })
                }
                this.setState({
                    comentario: '',
                    codigoAccion: '--',
                    codigoResultado: '--',
                    codigoContacto: '--',
                    creditos: [],
                    fechaPromesa: '',
                    montoPromesa: '',
                    validated: false,
                    today: '',
                    todayDate: '',
                    todayHour: ''
                });
            });
        }
    }

    componentDidUpdate(){
        let now = new Date();
        let nowHour = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        if(nowHour != this.state.todayHour){
            let today = new Date();
            let todayDate = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear();
            let todayHour = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.setState({
                today: today,
                todayDate: todayDate,
                todayHour: todayHour
            });
        }
    }

    handleComentario(event){this.setState({comentario: event.target.value});}

    handleCodigoContacto(event){this.setState({codigoContacto: event.target.value});}
    handleCodigoAccion(event){this.setState({codigoAccion: event.target.value});}
    handleCodigoResultado(event){this.setState({codigoResultado: event.target.value});}
    handleMontoPromesa(event){this.setState({montoPromesa: event.target.value});}
    handleFechaPromesa(event){this.setState({fechaPromesa: event.target.value});}
    handleCredito(event){
        let clon = lodash.cloneDeep(this.state.creditos);
        let i = clon.indexOf(event.target.value);
        if (i > -1) {
            clon.splice(i, 1);
        } else {
            clon.push(event.target.value);
        }
        this.setState({creditos: clon});
    }

    guardarReporte(event){
        event.preventDefault();
        if(this.state.comentario === '' || this.state.creditos.length === 0 || this.state.codigoAccion === '--' || this.state.codigoResultado === '--' || this.state.codigoContacto === '--'){
            alert('Revise que todos los campos han sido llenados correctamente');
        } else {
            console.log(this.state);
            this.insertGestion();
            //Agregar reporte a la base de datos
            this.props.onHide();
            this.props.nextClient();
        }
    }
    
    render(){
        return (
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Form onSubmit={this.guardarReporte}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Reporte de llamada
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><b>Nombre: </b>{this.props.cliente.nombre}</p>
                        <p><b>Teléfono marcado:</b> {this.props.telefono}</p>
                        <p><b>Créditos:</b> (Selecciona todos los que hayas gestionado)</p>{/* mostrar todos los creditos del broder este */}
                        {this.props.cliente.cliente.creditos.map((credito) => (
                            <div key={credito.numCredito} className="mb-3">
                                <Form.Check 
                                    type='checkbox'
                                    id={credito.numCredito}
                                    label={credito.numCredito}
                                    onChange={this.handleCredito}
                                    value={credito.numCredito}
                                />
                            </div>
                        ))}
                        <p><b>Fecha: (mm-dd-aaaa)</b> {this.state.todayDate}</p>
                        <p><b>Hora:</b> {this.state.todayHour}</p>
                        <Form.Group controlId="comentario">
                            <Form.Label><b>Comentario:</b></Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows="3"
                                value={this.state.comentario} 
                                onChange={this.handleComentario} 
                                placeholder="Comentario"
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Acción</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoAccion} value={this.state.codigoAccion} required>
                                <option>--</option>
                                <option>Llamada a casa</option>
                                <option>Llamada a referencia</option>
                                <option>Llamada a sucursal</option>
                                <option>Llamada a laboral</option>
                                <option>Llamada a celular</option>
                                <option>Whatsapp chat</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Resultado</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoResultado} value={this.state.codigoResultado} required>
                                <option>--</option>
                                <option>Aclaración</option>
                                <option>Buzón</option>
                                <option>Convenio de liquidación</option>
                                <option>Familiar</option>
                                <option>Fuera de servicio</option>
                                <option>Hijo</option>
                                <option>No contestan</option>
                                <option>No existe</option>
                                <option>Padre</option>
                                <option>Referencia</option>
                                <option>Tercero</option>
                                <option>Titular</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Contacto</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoContacto} value={this.state.codigoContacto} required>
                                <option>--</option>
                                <option>Cobro a destiempo</option>
                                <option>Cobro de más</option>
                                <option>Contacto no efectivo</option>
                                <option>Desconoce ser referencia</option>
                                <option>Evasivo</option>
                                <option>Inconformidad con la domiciliación</option>
                                <option>Interesado en Liquidar</option>
                                <option>No conoce al titular</option>
                                <option>No contacto</option>
                                <option>Nuevos datos</option>
                                <option>Pago no reflejado</option>
                                <option>Pago recibido</option>
                                <option>Promesa de pago</option>
                                <option>Promesa incumplida</option>
                                <option>Referencia sin información</option>
                                <option>Seguimiento a PP</option>
                                <option>Sin recursos</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            this.state.codigoContacto ===  'Promesa de pago' ? 
                            <>
                                <Form.Group controlId="fechaPromesa">
                                    <Form.Label><b>Fecha de promesa:</b></Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={this.state.fechaPromesa} 
                                        onChange={this.handleFechaPromesa}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="montoPromesa">
                                    <Form.Label><b>Monto de promesa:</b></Form.Label>
                                    <Form.Control 
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={this.state.montoPromesa} 
                                        onChange={this.handleMontoPromesa}
                                        required
                                    />
                                </Form.Group>
                            </>
                            : 
                            <></>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" onClick={() => this.guardarReporte}>Guardar gestión</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        );
    }
}

class Llamar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gestiones: [],
            clientes: [],
            cliente: {},
            telefonoMarcar: '',
            segundosLamada: 0,
            minutosLlamada: 0,
            telefonoNuevo: '',
            referenciaNueva: '',
            estadoEjecutivo: 'desconectado',
            room: 'ITCS',
            pressPause: 0,
            pressPredictivo: 0,
            pressManual: 0,
            marcarDisabled: true,
            idUsuario: this.props.idUsuario,
            renderReady: false,
            nombresClientes: [],
            clienteReady: false,
            clienteBuscar: '',
            telefonos: []
        }

        this.timer = 0;

        this.iniciarLlamada = this.iniciarLlamada.bind(this);
        this.colgarLlamada = this.colgarLlamada.bind(this);
        this.handleReferenciaNueva = this.handleReferenciaNueva.bind(this);
        this.handleTelefonoNuevo = this.handleTelefonoNuevo.bind(this);
        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.modoPredictivo = this.modoPredictivo.bind(this);
        this.modoManual = this.modoManual.bind(this);
        this.modoPausa = this.modoPausa.bind(this);
        this.handleTelefonoMarcar = this.handleTelefonoMarcar.bind(this);
        this.handleNumeroTelefono = this.handleNumeroTelefono.bind(this);
        this.getProductoEmpleado = this.getProductoEmpleado.bind(this);
        this.getInfoClientes = this.getInfoClientes.bind(this);
        this.nextClient = this.nextClient.bind(this);
        this.buscarCliente = this.buscarCliente.bind(this);
        this.handleClienteBuscar = this.handleClienteBuscar.bind(this);
        this.getClienteCredito = this.getClienteCredito.bind(this);
    }

    handleClienteBuscar(event){this.setState({clienteBuscar: event.target.value});}


    getProductoEmpleado(){
        axios.get('/getProductoEmpleado', {
            params: {
                idEmpleado: this.props.idUsuario
            }
        }).then(response => {
            console.log(response.data[0][0].nombre);
            this.setState({
                room: response.data[0][0].nombre
            });
            socket.on('connect', () => {
                //socket.emit('room', response.data[0][0].nombre);
                socket.emit('room', this.state.room);
             });
        });
    }
    
    buscarCliente(event){
        event.preventDefault();
        this.getClienteCredito();
    }

    getClienteCredito(){
        axios.get('/getClienteCredito', {
            params: {
                numCredito: parseInt(this.state.clienteBuscar)
            }
        }).then(response => {
            let referencias = {}
            for(let i = 0; i < response.data.referencias.length; i++){
                referencias[response.data.referencias[i].nombre] = {
                    telCasa: response.data.referencias[i].telCasa,
                    telCelular: response.data.referencias[i].telCelular
                }
            }
            console.log(response);
            console.log(referencias);
            let gestion = [];
            gestion[0] = response.data.gestion;
            this.setState({
                cliente: {
                    cliente: {
                        idCliente: response.data.idCliente,
                        idProducto: response.data.idProducto,
                        idCliente: response.data.idCliente,
                        telCasa: response.data.telCasa,
                        telCelular: response.data.telCelular,
                        idCliente: response.data.idCliente,
                        creditos: response.data.credito,
                        referencias: referencias,
                        gestiones: gestion
                    },
                    nombre: response.data.nombre
                },
            });
            this.setState({
                renderReady: true,
                clienteReady: true
            });
        });
    }

    getInfoClientes(idEmpleado){
        axios.get('/getInfoClientes', {
            params: {
                idEmpleado: idEmpleado
            }
        }).then(response => {
            let i = 0
            for(i; i < response.data[0][0].length; i++){
                let referencias = {}
                for(let j = 0; j < response.data[0][0][i].referencias.length; j++ ){
                    referencias[response.data[0][0][i].referencias[j].nombre] = {
                        telCasa: response.data[0][0][i].referencias[j].telCasa,
                        telCelular: response.data[0][0][i].referencias[j].telCelular
                    }
                }
                
                this.setState({
                    clientes: {
                        ...this.state.clientes,
                        [response.data[0][0][i].nombre]: {
                            ...this.state.clientes[response.data[0][0][i].nombre],
                            idCliente: response.data[0][0][i].idCliente,
                            telCasa: response.data[0][0][i].telCasa,
                            telCelular: response.data[0][0][i].telCelular,
                            referencias: referencias
                        }
                    }
                });

                let creditos;
                let gestiones;
                if(this.state.clientes[response.data[0][0][i].nombre]){
                    if(this.state.clientes[response.data[0][0][i].nombre].creditos){
                        creditos = [...this.state.clientes[response.data[0][0][i].nombre].creditos, response.data[0][0][i].credito];
                    } else {
                        creditos = [response.data[0][0][i].credito];
                    }
                    if(this.state.clientes[response.data[0][0][i].nombre].gestiones){
                        gestiones = [...this.state.clientes[response.data[0][0][i].nombre].gestiones, response.data[0][0][i].gestion];
                    } else {
                        gestiones = [response.data[0][0][i].gestion];
                    }
                } else {
                    creditos = [];
                    gestiones = [];
                }
                
                this.setState({
                    clientes: {
                        ...this.state.clientes,
                        [response.data[0][0][i].nombre]: {
                            ...this.state.clientes[response.data[0][0][i].nombre],
                            creditos: creditos,
                            gestiones: gestiones
                        }
                    }
                });
            }
            if(i >= response.data[0][0].length){
                this.setState({renderReady: true, nombresClientes: Object.keys(this.state.clientes)});
                //this.nextClient();
            }
        });
    }

    nextClient(){
        if(this.state.telefonos.length === 0 && this.state.estadoEjecutivo == 'predictivo'){
            this.setState({clienteReady: false});
            let clon = lodash.cloneDeep(this.state.nombresClientes);
            let nombreCliente = clon.shift();
            //console.log(clon);
            let cliente = this.state.clientes[nombreCliente];
            this.setState({cliente: {cliente, nombre: nombreCliente}});
            console.log(cliente);
            let telefonos = [];
            telefonos[0] = cliente.telCasa;
            telefonos[1] = cliente.telCelular;
            let i = 2;
            Object.keys(cliente.referencias).map((referencia) => {
                //console.log(referencia);
                telefonos[i] = cliente.referencias[referencia].telCasa;
                //console.log(telefonos[i]);
                i++;
                telefonos[i] = cliente.referencias[referencia].telCelular;
                //console.log(telefonos[i]);
                i++;
            });
            //console.log(telefonos.length);
            i = 0;
            while (i < telefonos.length) {
                if(telefonos[i] === 'null') {
                    telefonos.splice(i, 1);
                } else {
                    ++i;
                }
            }
            //console.log(telefonos);
            this.setState({
                nombresClientes: clon,
                clienteReady: true, 
                telefonos: telefonos,
                telefonoMarcar: telefonos[0]
            }, () => { 
                this.nextClient();
            });
        } else { //Si aun quedan telefonos de ese cliente
            let telefonosShifted = lodash.cloneDeep(this.state.telefonos);
            let telefono = telefonosShifted.shift();
            this.setState({
                telefonos: telefonosShifted,
                telefonoMarcar: telefono
            }, () => {
                if(this.telefonoMarcar != '' && this.state.estadoEjecutivo == 'predictivo'){
                    this.iniciarLlamada();
                }
            });
            
        }
    }

    componentDidMount(){
        this.setState({
            idUsuario: localStorage.getItem('idUsuario')
        }, () => {
            this.getProductoEmpleado();
            this.getInfoClientes(this.state.idUsuario);
        });  
    }

    handleNumeroTelefono(num){
        if(this.state.telefonoMarcar.length > 10){
            alert('Por favor inserte un teléfono de máximo 10 digitos');
        } else {
            this.setState({telefonoMarcar: this.state.telefonoMarcar + num})
        }
    }

    handleTelefonoMarcar(event){this.setState({telefonoMarcar: event.target.value});}

    iniciarLlamada(){
        this.timer = setInterval(() => {
            if(this.state.segundosLamada === 59){
                this.setState({
                    minutosLlamada: this.state.minutosLlamada + 1,
                    segundosLamada: 0
                });
            } else {
                this.setState({
                    segundosLamada: this.state.segundosLamada + 1
                });
            }
            this.setState({
                marcarDisabled: true
            });
            socket.emit('llamada', {room: this.state.room, idUsuario: this.state.idUsuario, minutosLlamada: this.state.minutosLlamada, segundosLlamada: this.state.segundosLamada});
        }, 1000);
    }
    
    colgarLlamada(){ //Colgar llamada
        clearInterval(this.timer); //Dejo de correr tiempo
        //Abro modal
        //Lleno reporte
        //Guardo reporte en base de datos
        //Reinicio el tiempo
        //Si estoy en predictivo avanzo al siguiente numero
        //Si estoy en manual o en pausa no hago nada mas
        this.setState({
            minutosLlamada: 0,
            segundosLamada: 0,
            marcarDisabled: false,
            modalShow: true
        });
        socket.emit('llamada', {room: this.state.room, idUsuario: this.state.idUsuario, minutosLlamada: '00', segundosLlamada: '00'});
    }

    insertTelefonoNuevo(telefono){
        //console.log(telefono);
        //console.log(this.state.cliente);
        //console.log(this.state.cliente.cliente.idCliente);
        axios.post('/insertTelefonoNuevo', null, {
            params: {
                idCliente: this.state.cliente.cliente.idCliente,
                nombre: telefono.referencia.toUpperCase(),
                telCasa: 'null',
                telCelular: telefono.telefono
            }
        })
        this.setState({
            cliente: {
                ...this.state.cliente,
                cliente: {
                    ...this.state.cliente.cliente,
                    referencias: {
                        ...this.state.cliente.cliente.referencias,
                        [telefono.referencia.toUpperCase()]: {
                            telCasa: 'null',
                            telCelular: telefono.telefono
                        }
                    }
                }
            },
            telefonoNuevo: '',
            referenciaNueva: ''
        });
    }

    handleTelefonoNuevo(event){this.setState({telefonoNuevo: event.target.value});}
    handleReferenciaNueva(event){this.setState({referenciaNueva: event.target.value});}

    agregarTelefono(event){
        event.preventDefault();
        if(this.state.telefonoNuevo === '' || this.state.referenciaNueva === ''){
            alert('Debe incluir un teléfono y una referencia');
        } else {
            let telefono = {
                telefono: this.state.telefonoNuevo,
                referencia: this.state.referenciaNueva.toUpperCase()
            }
            this.setState({
                telefonos: [...this.state.telefonos, telefono]
            });
            //Agregar telefono a la base de datos
            this.insertTelefonoNuevo(telefono);
        }
    }
    
    modoPredictivo(){
        if(this.state.pressPredictivo % 2 == 0){
            this.setState({
                predictivoActive: true,
                manualActive: false,
                pausaActive: false,
                marcarDisabled: true,
                estadoEjecutivo: 'predictivo',
                pressPredictivo: this.state.pressPredictivo + 1 
            }, () => {
                console.log(this.state.estadoEjecutivo);
                if(this.state.renderReady){
                    this.nextClient();
                }
            });
            socket.emit('message', {
                estadoBoton: 'predictivo',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        } else {
            this.setState({
                predictivoActive: false,
                manualActive: false,
                pausaActive: false,
                marcarDisabled: true,
                estadoEjecutivo: 'desconectado',
                pressPredictivo: this.state.pressPredictivo + 1
            });
            socket.emit('message-disconnect', {
                estadoBoton: 'predictivo',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        }
    }

    modoManual(){
        if(this.state.pressManual % 2 == 0){
            this.setState({
                predictivoActive: false,
                manualActive: true,
                pausaActive: false,
                marcarDisabled: false,
                estadoEjecutivo: 'manual',
                pressManual: this.state.pressManual + 1
            });
            socket.emit('message', {
                estadoBoton: 'manual',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        } else {
            this.setState({
                predictivoActive: false,
                manualActive: false,
                pausaActive: false,
                marcarDisabled: true,
                estadoEjecutivo: 'desconectado',
                pressManual: this.state.pressManual + 1
            });
            socket.emit('message-disconnect', {
                estadoBoton: 'manual',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        }
    }

    modoPausa(){
        if(this.state.pressPause % 2 == 0){
            this.setState({
                predictivoActive: false,
                manualActive: false,
                pausaActive: true,
                marcarDisabled: true,
                estadoEjecutivo: 'pausa',
                pressPause: this.state.pressPause + 1
            });
            socket.emit('message', {
                estadoBoton: 'pausa',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        } else  {
            this.setState({
                predictivoActive: false,
                manualActive: false,
                pausaActive: false,
                marcarDisabled: true,
                estadoEjecutivo: 'desconectado',
                pressPause: this.state.pressPause + 1
            });
            socket.emit('message-disconnect', {
                estadoBoton: 'pausa',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });
            //El valor de estado ejecutivo nos ayuda a
            //en supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        }
    }

    render(){
        return(
            <Row>
                <Col>
                    { (this.props.usuario === 'ejecutivo' || this.props.usuario === 'supervisor') ? 
                        <>
                            <h1>Llamar</h1>
                            <Container fluid>
                                <Row className='d-flex justify-content-between'>
                                    <Col md={8} className='p-0'>
                                        {this.state.estadoEjecutivo === 'manual' &&
                                        <Form onSubmit={this.buscarCliente}>
                                            <Form.Group controlId="telefonoNuevo">
                                                <Form.Label>Buscar cliente por número de crédito</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    value={this.state.clienteBuscar} 
                                                    onChange={this.handleClienteBuscar} 
                                                    placeholder="Telefono"
                                                    required
                                                />
                                                <Button variant="primary" type="submit" onClick={() => this.buscarCliente} block>
                                                Buscar
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                        }
                                        <h2>Datos del cliente</h2>
                                        <Row className='d-flex justify-content-between'>
                                            <Col md={8}>
                                                <p className='mb-0'><b>Nombre</b></p>
                                                <p>{this.state.clienteReady ? this.state.cliente.nombre : <></>}</p>
                                                <p className='mb-2'><b>Cuentas</b></p>
                                                <Table striped hover responsive className='comments-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Crédito</th>
                                                            <th>Bucket</th>
                                                            <th>Último pago</th>
                                                            <th>Cuota</th>
                                                            <th>Vencido</th>
                                                            <th>Vencido + Cuota</th>
                                                            <th>Total</th>
                                                            <th>Liquidación Actual</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady && this.state.cliente.cliente) ? 
                                                            <>
                                                            {console.log(this.state.cliente)}
                                                            {this.state.cliente.cliente.creditos.map(credito => {
                                                                let fechaUltimoPago = new Date(Date.parse(credito.fechaUltimoPago));
                                                                fechaUltimoPago = (fechaUltimoPago.getMonth() + 1) + "-" + fechaUltimoPago.getDate() + "-" + fechaUltimoPago.getFullYear();
                                                                return(
                                                                    <tr key={credito.numCredito}>
                                                                        <td>{credito.numCredito}</td>
                                                                        <td>{credito.bucketInf + ' - ' + credito.bucketSup}</td>
                                                                        <td>{fechaUltimoPago}</td>
                                                                        <td>{credito.cuota}</td>
                                                                        <td>{credito.vencido}</td>
                                                                        <td>{credito.vencidoCuota}</td>
                                                                        <td>{credito.total}</td>
                                                                        <td>{credito.liquidacionActual}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                            }
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                        }
                                                    </tbody>
                                                </Table>
                                                <p className='mb-2'><b>Gestiones Anteriores:</b></p>
                                                <Table striped hover responsive className='comments-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Crédito</th>
                                                            <th>Tel. Marcado</th>
                                                            <th>Fecha (mm-dd-aa)</th>
                                                            {/*<th>Gestor</th>
                                                            <th>Contesto</th>*/}
                                                            <th>Comentario</th>
                                                            <th>c. Acción</th>
                                                            <th>c. Resultado</th>
                                                            <th>c. Contacto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady && this.state.cliente.cliente && this.state.cliente.cliente.gestiones) ? 
                                                            this.state.cliente.cliente.gestiones[0].map(gestion => {
                                                                let fechaGestionCompleta = new Date(Date.parse(gestion.fechaHoraGestion));
                                                                let fechaGestion = (fechaGestionCompleta.getMonth() + 1) + "-" + fechaGestionCompleta.getDate() + "-" + fechaGestionCompleta.getFullYear();
                                                                return(
                                                                    <tr key={gestion.idGestion}>
                                                                        <td>{gestion.numCredito}</td>
                                                                        <td>{gestion.numeroContacto}</td>
                                                                        <td>{fechaGestion}</td>
                                                                        {/*<td>{gestion.empleadoAsignado}</td>
                                                                        <td>{gestion.nombreMarcado}</td>*/}
                                                                        <td>{gestion.comentarios}</td>
                                                                        <td>{gestion.codigoAccion}</td>
                                                                        <td>{gestion.codigoResultado}</td>
                                                                        <td>{gestion.codigoContacto}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                            :
                                                            <>
                                                            </>
                                                        }
                                                    </tbody>
                                                </Table>
                                                {(this.state.estadoEjecutivo === 'manual' && this.state.cliente.cliente) &&
                                                <Button 
                                                    className='boton-morado' 
                                                    onClick={() => this.setState({modalEditarShow: true})}
                                                    style={{
                                                    margin: '10px 0 30px 0'
                                                    }}
                                                >
                                                    Editar última gestión de cliente
                                                </Button>
                                                }
                                            </Col>
                                            <Col md={3}>
                                                <p className='mb-2'><b>Teléfonos:</b></p>
                                                <Table striped hover responsive className='phones-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Teléfono</th>
                                                            <th>Referencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady && this.state.cliente.cliente && this.state.cliente.cliente.telCasa != 'null') &&
                                                            <tr>
                                                                <td>{(this.state.clienteReady && this.state.cliente.cliente) ? this.state.cliente.cliente.telCasa : <></>}</td>
                                                                <td>Casa propietario</td>
                                                            </tr>
                                                        }
                                                        { (this.state.clienteReady && this.state.cliente.cliente && this.state.cliente.cliente.telCelular != 'null') &&
                                                            <tr>
                                                                <td>{(this.state.clienteReady && this.state.cliente.cliente) ? this.state.cliente.cliente.telCelular : <></>}</td>
                                                                <td>Celular propietario</td>
                                                            </tr>
                                                        }
                                                        {(this.state.clienteReady && this.state.cliente.cliente) ? 
                                                            Object.keys(this.state.cliente.cliente.referencias).map((referencia) => {
                                                                return(
                                                                    <>
                                                                        { this.state.cliente.cliente.referencias[referencia].telCasa != 'null' &&
                                                                        <tr key={this.state.cliente.cliente.referencias[referencia].telCasa}>
                                                                            <td>{this.state.cliente.cliente.referencias[referencia].telCasa}</td>
                                                                            <td>{referencia}</td>
                                                                        </tr>
                                                                        }
                                                                        {this.state.cliente.cliente.referencias[referencia].telCelular != 'null' &&
                                                                        <tr key={this.state.cliente.cliente.referencias[referencia].telCelular}>
                                                                            <td>{this.state.cliente.cliente.referencias[referencia].telCelular}</td>
                                                                            <td>{referencia}</td>
                                                                        </tr>
                                                                        }
                                                                    </>
                                                                );
                                                            })
                                                            :
                                                            <></>
                                                        }
                                                    </tbody>
                                                </Table>
                                                {(this.state.clienteReady && this.state.cliente.cliente) &&
                                                <Form onSubmit={this.agregarTelefono}>
                                                    <Form.Group controlId="telefonoNuevo">
                                                        <Form.Label>Nuevo teléfono</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            value={this.state.telefonoNuevo} 
                                                            onChange={this.handleTelefonoNuevo} 
                                                            placeholder="Telefono"
                                                            required 
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId="referenciaNueva">
                                                        <Form.Label>Nombre teléfono</Form.Label>
                                                        <Form.Control 
                                                            type="text"
                                                            value={this.state.referenciaNueva}
                                                            onChange={this.handleReferenciaNueva}
                                                            placeholder="Nombre"
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Button className='boton-morado' type="submit" onClick={() => this.agregarTelefono} block>
                                                        + Agregar teléfono nuevo
                                                    </Button>
                                                </Form>
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3}>
                                        <Row>
                                            <Col 
                                                md={12} 
                                                style={{display: 'inline-block'}}
                                                className='d-flex justify-content-center'
                                            >
                                                <input
                                                    onChange={this.handleTelefonoMarcar}
                                                    value={this.state.telefonoMarcar}
                                                    type="number"
                                                    name="phone"
                                                    maxLength="10"
                                                    style={{
                                                        fontSize: 'x-large',
                                                        color: '#2F2F2F',
                                                        borderStyle: 'none',
                                                        backgroundColor: 'transparent',
                                                        fontWeight: 'bold',
                                                        width: '200px',
                                                    }}
                                                />
                                                <FontAwesomeIcon 
                                                    icon={faBackspace} 
                                                    size='lg' 
                                                    onClick={() => this.setState({telefonoMarcar: this.state.telefonoMarcar.slice(0, -1)})} 
                                                    style={{marginTop: 8}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '30px'}}>
                                            <Col>
                                                <p style={{textAlign: 'center'}}>
                                                    Tiempo de llamada: {this.state.minutosLlamada}m {this.state.segundosLamada}s
                                                </p>      
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '15px'}}>
                                            <Col className='text-center'>
                                                <Button 
                                                    className='boton-numero' 
                                                    onClick={() => this.handleNumeroTelefono('1')}
                                                    disabled={this.state.marcarDisabled}
                                                >
                                                        1
                                                </Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('2')} disabled={this.state.marcarDisabled}>2</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('3')} disabled={this.state.marcarDisabled}>3</Button>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '15px'}}>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('4')} disabled={this.state.marcarDisabled}>4</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('5')} disabled={this.state.marcarDisabled}>5</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('6')} disabled={this.state.marcarDisabled}>6</Button>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '15px'}}>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('7')} disabled={this.state.marcarDisabled}>7</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('8')} disabled={this.state.marcarDisabled}>8</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('9')} disabled={this.state.marcarDisabled}>9</Button>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '15px'}}>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('0')} disabled={this.state.marcarDisabled}>0</Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='text-center d-flex justify-content-around'>
                                                {
                                                    (this.state.minutosLlamada === 0 && this.state.segundosLamada === 0) &&
                                                    <Button className='boton-llamar' onClick={this.iniciarLlamada} disabled={this.state.marcarDisabled}><FontAwesomeIcon icon={faPhoneAlt} /></Button>
                                                }
                                                {
                                                    (this.state.minutosLlamada >= 0 && this.state.segundosLamada > 0) &&
                                                    <Button className='boton-colgar' onClick={this.colgarLlamada}><FontAwesomeIcon icon={faPhoneSlash} /></Button>
                                                }  
                                                
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col><hr></hr></Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col className='text-center'>
                                                <Button className='boton-estado' onClick={this.modoPredictivo} active={this.state.predictivoActive}><FontAwesomeIcon icon={faForward} /></Button>
                                                <p>Predictivo</p>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-estado' onClick={this.modoManual} active={this.state.manualActive}><FontAwesomeIcon icon={faHandPointer} /></Button>
                                                <p>Manual</p>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-estado' onClick={this.modoPausa} active={this.state.pausaActive}><FontAwesomeIcon icon={faPause} /></Button>
                                                <p>Pausa</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                { (this.state.clienteReady && this.state.cliente.cliente) &&
                                    <GenerarReporte
                                        show={this.state.modalShow}
                                        onHide={() => this.setState({modalShow: false})}
                                        cliente = {this.state.cliente}
                                        telefono = {this.state.telefonoMarcar}
                                        nextClient = {() => this.nextClient()}
                                        idUsuarioAsignado = {this.props.idUsuario}
                                        idUsuarioAtendido = {this.props.idUsuario}
                                    />
                                }
                                { (this.state.clienteReady && this.state.cliente.cliente.gestiones[0][0]) &&
                                    
                                    <EditarGestion
                                        show={this.state.modalEditarShow}
                                        onHide={() => this.setState({modalEditarShow: false})}
                                        agregarUsuario ={this.agregarUsuario}
                                        cliente = {this.state.cliente}
                                        telefono = {this.state.telefonoMarcar}
                                        idUsuarioAtendido = {this.props.idUsuario}
                                    />
                                }
                            </Container>
                        </>
                        :
                        <LoginRedirect />
                    }
                </Col>
            </Row>
            
        );
    }
}

export default Llamar;