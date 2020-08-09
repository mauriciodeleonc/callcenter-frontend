import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form';
import { 
    faPhoneAlt,
    faPhoneSlash,
    faBackspace,
    faHandPointer,
    faForward,
    faPause,
    faUserAlt
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from 'react-bootstrap/Modal';
import LoginRedirect from './LoginRedirect';
import io from 'socket.io-client';
import axios from 'axios';
import lodash from 'lodash';
 
//let socket = io('localhost:5000');
//socket = io.connect();

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
        const promesa = this.state.codigoContacto === 'Promesa de Pago' ? {
            fecha: new Date(this.state.fechaPromesa),
            monto: this.state.montoPromesa
        } : undefined;
        axios.post(`/gestiones`, {
            empleadoAsignado: this.props.idUsuarioAsignado,
            empleadoAtendio: this.props.idUsuarioAtendido,
            fechaHora: new Date(),
            numeroContacto: this.props.telefono,
            comentarios: this.state.comentario,
            codigoAccion: this.state.codigoAccion,
            codigoResultado: this.state.codigoResultado,
            codigoContacto: this.state.codigoContacto,
            creditos: this.state.creditos,
            promesa
        }).then(() => {
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
            this.insertGestion();
            //Agregar reporte a la base de datos
            this.props.onHide();
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
                        {this.props.creditos.map((credito) => (
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
                                <option>Casa</option>
                                <option>Celular</option>
                                <option>Laboral</option>
                                <option>Sucursal</option>
                                <option>Ref 1</option>
                                <option>Ref 2</option>
                                <option>Ref 3</option>
                                <option>Ref 4</option>
                                <option>Ref 5</option>
                                <option>Whatsapp</option>
                                <option>Correo</option>
                                <option>Visita Casa</option>
                                <option>Visita Garantía</option>
                                <option>Visita Laboral</option>
                                <option>Visita Otro</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Código de Resultado</b></Form.Label>
                            <Form.Control as="select" onChange={this.handleCodigoResultado} value={this.state.codigoResultado} required>
                                <option>--</option>
                                <option>Contacto Indirecto</option>
                                <option>Cónyugue</option>
                                <option>Encargado de Pagos</option>
                                <option>Familiar</option>
                                <option>Hijo</option>
                                <option>No Contacto</option>
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
                                <option>Aclaración</option>
                                <option>Buzón</option>
                                <option>Cargo Domiciliado</option>
                                <option>Cargo No Realizado</option>
                                <option>Crédito Liquidado</option>
                                <option>Cuelga</option>
                                <option>Defunción</option>
                                <option>Desempleado</option>
                                <option>Enfermedad</option>
                                <option>Envio Carta de No Acuerdo</option>
                                <option>Envio Convenio de Liquidación</option>
                                <option>Evasivo</option>
                                <option>Fuera de Servicio</option>
                                <option>Insolvente</option>
                                <option>Interesado en Liq.</option>
                                <option>Mensaje</option>
                                <option>Negativa de Pago</option>
                                <option>No Contestan</option>
                                <option>No Existe</option>
                                <option>No Labora Ahí</option>
                                <option>No Lo Conocen</option>
                                <option>No Vive Ahí</option>
                                <option>Nuevos Datos</option>
                                <option>Número Incompleto</option>
                                <option>Promesa de Pago</option>
                                <option>Promesa Rota</option>
                                <option>Recado Fam</option>
                                <option>Recado Ref</option>
                                <option>Seguimiento a PP</option>
                                <option>Sin Información</option>
                                <option>Solicita Cargo</option>
                                <option>Ya Pagó</option>
                                <option>Abandonada</option>
                                <option>Aviso Bajo Puerta</option>
                                <option>Deshabitada</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            this.state.codigoContacto ===  'Promesa de Pago' ? 
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
            referenciaMarcar: '',
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
        this.buscarCliente = this.buscarCliente.bind(this);
        this.handleClienteBuscar = this.handleClienteBuscar.bind(this);
    }

    handleClienteBuscar(event){this.setState({clienteBuscar: event.target.value});}

    buscarCliente(event){
        event.preventDefault();
        axios.get(`/clientes/next/${this.state.clienteBuscar}`).then((res) => {
            const clienteInfo = res.data.data.cliente;
            let gestiones = clienteInfo.Creditos.flatMap(credito => {
                return credito.Gestiones;
            });
            gestiones = gestiones.sort((a, b) => (new Date(b.createdAt).getTime() / 1000) - (new Date(a.createdAt).getTime() / 1000));
            this.setState({
                cliente: {
                    nombre: clienteInfo.nombre,
                    rfc: clienteInfo.rfc,
                    telCasa: clienteInfo.telCasa,
                    telCel: clienteInfo.telCelular
                },
                clienteReady: true,
                creditos: clienteInfo.Creditos,
                referencias: clienteInfo.Referencias,
                gestiones
            })
        });
    }

    componentDidMount(){
        this.setState({
            idUsuario: localStorage.getItem('idUsuario')
        }, () => {
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
           // socket.emit('llamada', {room: this.state.room, idUsuario: this.state.idUsuario, minutosLlamada: this.state.minutosLlamada, segundosLlamada: this.state.segundosLamada});
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
        //.emit('llamada', {room: this.state.room, idUsuario: this.state.idUsuario, minutosLlamada: '00', segundosLlamada: '00'});
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
                if(this.state.renderReady){
                }
            });
            /*socket.emit('message', {
                estadoBoton: 'predictivo',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
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
            /*socket.emit('message-disconnect', {
                estadoBoton: 'predictivo',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
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
           /* socket.emit('message', {
                estadoBoton: 'manual',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            this.nameInput.focus();
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
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
            /*socket.emit('message-disconnect', {
                estadoBoton: 'manual',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
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
            /*socket.emit('message', {
                estadoBoton: 'pausa',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
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
            /*socket.emit('message-disconnect', {
                estadoBoton: 'pausa',
                room: this.state.room,
                idUsuario: this.state.idUsuario
            });*/
            //El valor de estado ejecutivo nos ayuda a
            //en Supervisor quien esta en llamada, quien en pausa
            //y quien desconectado
        }
    }

    render(){
        return(
            <Row>
                <Col>
                    { (this.props.usuario === 'Ejecutivo' || this.props.usuario === 'Supervisor') ? 
                        <>
                            <h1>Llamar</h1>
                            <Container fluid>
                                <Row className='d-flex justify-content-between'>
                                    <Col md={9} className='pl-0' style={{borderRightColor: 'rgba(0,0,0,.1)', borderRightStyle: 'solid', borderRightWidth: 'thin'}}>
                                        {this.state.estadoEjecutivo === 'manual' &&
                                        <Form onSubmit={this.buscarCliente}>
                                            <Form.Label>Buscar cliente por número de crédito</Form.Label>
                                            <InputGroup controlId="telefonoNuevo" style={{marginBottom: 20, width: '50%'}}>
                                                <Form.Control 
                                                    type="number" 
                                                    value={this.state.clienteBuscar} 
                                                    onChange={this.handleClienteBuscar} 
                                                    placeholder="Número de Crédito"
                                                    required
                                                />
                                                <InputGroup.Append>
                                                    <Button variant="primary" type="submit" onClick={() => this.buscarCliente} className='input-group-append'>
                                                        Buscar
                                                    </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form>
                                        }
                                        <h2>Datos del cliente</h2>
                                        <Row className='d-flex justify-content-between'>
                                            <Col md={8}>
                                                <p className='mb-0'><b>Nombre</b></p>
                                                <p>{this.state.clienteReady ? this.state.cliente.nombre : <></>}</p>
                                                <p>{this.state.clienteReady ? this.state.cliente.rfc : <></>}</p>
                                                <p className='mb-2'><b>Cuentas</b></p>
                                                <Table striped hover responsive className='creditos-table'>
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
                                                            <th>Frecuencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady) ? 
                                                            <>
                                                            {this.state.creditos.map(credito => {
                                                                let fechaUltimoPago = new Date(Date.parse(credito.fechaUltimoPago));
                                                                fechaUltimoPago = fechaUltimoPago.getDate() + "/" + (fechaUltimoPago.getMonth() + 1) + "/" + fechaUltimoPago.getFullYear();
                                                                return(
                                                                    <tr key={credito.numCredito}>
                                                                        <td>{credito.numCredito}</td>
                                                                        <td>{credito.bucketInicial + ' - ' + credito.bucketFinal}</td>
                                                                        <td>{fechaUltimoPago}</td>
                                                                        <td>{(new Intl.NumberFormat().format(credito.cuota))}</td>
                                                                        <td>{(new Intl.NumberFormat().format(credito.mejora))}</td>
                                                                        <td>{(new Intl.NumberFormat().format(credito.cura))}</td>
                                                                        <td>{(new Intl.NumberFormat().format(credito.sdoTotal))}</td>
                                                                        <td>{(new Intl.NumberFormat().format(credito.sdoLiq))}</td>
                                                                        <td>{credito.frecuencia}</td>
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
                                            </Col>
                                            <Col md={4}>
                                                <p className='mb-2'><b>Teléfonos:</b></p>
                                                <Table striped hover responsive className='phones-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Teléfono</th>
                                                            <th>Referencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady && this.state.cliente.telCasa !== 'null') &&
                                                            <tr onClick={() => this.setState({telefonoMarcar: this.state.cliente.telCasa, referenciaMarcar: 'Casa Propietario'})}>
                                                                <td>{(this.state.clienteReady) ? this.state.cliente.telCasa : <></>}</td>
                                                                <td>Casa propietario</td>
                                                            </tr>
                                                        }
                                                        { (this.state.clienteReady && this.state.cliente.telCel !== 'null') &&
                                                            <tr onClick={() => this.setState({telefonoMarcar: this.state.cliente.telCel, referenciaMarcar: 'Celular Propietario'})}>
                                                                <td>{(this.state.clienteReady) ? this.state.cliente.telCel : <></>}</td>
                                                                <td>Celular propietario</td>
                                                            </tr>
                                                        }
                                                        {(this.state.clienteReady) ? 
                                                            this.state.referencias.map((referencia) => {
                                                                return(
                                                                    <>
                                                                        {(referencia.telCasa !== 'null' && referencia.telCasa !== '') &&
                                                                            <tr key={referencia.telCasa} onClick={() => this.setState({telefonoMarcar: referencia.telCasa, referenciaMarcar: referencia.nombre})}>
                                                                                <td>{referencia.telCasa}</td>
                                                                                <td>{referencia.nombre}</td>
                                                                            </tr>
                                                                        }
                                                                        {(referencia.telCel !== 'null' &&  referencia.telCel !== '') &&
                                                                            <tr key={referencia.telCel} onClick={() => this.setState({telefonoMarcar: referencia.telCel, referenciaMarcar: referencia.nombre})}>
                                                                                <td>{referencia.telCel}</td>
                                                                                <td>{referencia.nombre}</td>
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
                                        <Row>
                                            <Col md={12}>
                                            <p className='mb-2'><b>Gestiones Anteriores:</b></p>
                                                <Table striped hover responsive className='gestiones-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Crédito</th>
                                                            <th>Tel. Marcado</th>
                                                            <th>Fecha</th>
                                                            {/*<th>Gestor</th>
                                                            <th>Contesto</th>*/}
                                                            <th>Comentario</th>
                                                            <th>c. Acción</th>
                                                            <th>c. Resultado</th>
                                                            <th>c. Contacto</th>
                                                            <th>Fecha PP.</th>
                                                            <th>Monto PP.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { (this.state.clienteReady) ? 
                                                            this.state.gestiones.map(gestion => {
                                                                let fechaGestionCompleta = new Date(Date.parse(gestion.createdAt));
                                                                let fechaGestion =  fechaGestionCompleta.getDate() + "/" + (fechaGestionCompleta.getMonth() + 1) + "/" + fechaGestionCompleta.getFullYear();
                                                                let fechaPromesa = '';
                                                                let fechaPromesaCompleta = '';
                                                                if(gestion.Promesa && gestion.Promesa !== null && gestion.Promesa.fecha && gestion.Promesa.fecha !== null){
                                                                    fechaPromesaCompleta = new Date(Date.parse(gestion.Promesa.fecha));
                                                                    fechaPromesa = fechaPromesaCompleta.getDate() + "/" + (fechaPromesaCompleta.getMonth() + 1) + "/" + fechaPromesaCompleta.getFullYear();
                                                                }
                                                                
                                                                return(
                                                                    <tr key={gestion.idGestion}>
                                                                        <td>{gestion.GestionCredito.numCredito}</td>
                                                                        <td>{gestion.numeroContacto}</td>
                                                                        <td>{fechaGestion  == 'NaN/NaN/NaN' ? '' : fechaGestion}</td>
                                                                        {/*<td>{gestion.empleadoAsignado}</td>
                                                                        <td>{gestion.nombreMarcado}</td>*/}
                                                                        <td>{gestion.comentarios}</td>
                                                                        <td>{gestion.codigoAccion}</td>
                                                                        <td>{gestion.codigoResultado}</td>
                                                                        <td>{gestion.codigoContacto}</td>
                                                                        <td>{fechaPromesa == 'NaN/NaN/NaN' ? '' : fechaPromesa}</td>
                                                                        <td>{(new Intl.NumberFormat().format(gestion.Promesa.monto))}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                            :
                                                            <>
                                                            </>
                                                        }
                                                    </tbody>
                                                </Table>
                                                <Button 
                                                    className='boton-morado' 
                                                    onClick={() => this.setState({modalShow: true})}
                                                    style={{
                                                    margin: '10px 0 30px 0'
                                                    }}
                                                >
                                                    Insertar nueva gestión
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3} className='pl-5 pr-0'>
                                        <div style={{position: 'sticky', top: '10%'}}>
                                        <Row style={{marginBottom: 10}}>
                                            <Col 
                                                md={12} 
                                                style={{display: 'inline-block'}}
                                                className='d-flex justify-content-center'
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faPhoneAlt} 
                                                    size='lg' 
                                                    style={{marginTop: 10, marginRight: 5}}
                                                />
                                                <input
                                                    onChange={this.handleTelefonoMarcar}
                                                    value={this.state.telefonoMarcar}
                                                    type="number"
                                                    name="phone"
                                                    maxLength="10"
                                                    style={{
                                                        fontSize: 'x-large',
                                                        color: '#2F2F2F',
                                                        borderStyle: 'solid',
                                                        backgroundColor: 'transparent',
                                                        fontWeight: 'bold',
                                                        width: '200px',
                                                        borderTop: 'none',
                                                        borderLeft: 'none',
                                                        borderRight: 'none',
                                                        textAlign: 'center'
                                                    }}
                                                    ref={(input) => { this.nameInput = input; }} 
                                                />
                                                {/*<FontAwesomeIcon 
                                                    icon={faBackspace} 
                                                    size='lg' 
                                                    onClick={() => this.setState({telefonoMarcar: this.state.telefonoMarcar.slice(0, -1)})} 
                                                    style={{marginTop: 8}}
                                                />*/}
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: 10}}>
                                            <Col 
                                                md={12} 
                                                style={{display: 'inline-block'}}
                                                className='d-flex justify-content-center'
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faUserAlt} 
                                                    size='lg' 
                                                    style={{marginTop: 8, marginRight: 5}}
                                                />
                                                <p className='text-center'><b>{this.state.referenciaMarcar}</b></p>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: 10}}>
                                            <Col>
                                                <p style={{textAlign: 'center'}}>
                                                    Tiempo de llamada: {this.state.minutosLlamada}m {this.state.segundosLamada}s
                                                </p>      
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '20px'}}>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('1')} disabled={this.state.marcarDisabled}>1</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('2')} disabled={this.state.marcarDisabled}>2</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button className='boton-numero' onClick={() => this.handleNumeroTelefono('3')} disabled={this.state.marcarDisabled}>3</Button>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: '20px'}}>
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
                                        <Row style={{marginBottom: '20px'}}>
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
                                        <Row style={{marginBottom: '20px'}}>
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
                                        </div>
                                    </Col>
                                </Row>
                                { (this.state.clienteReady) &&
                                    <GenerarReporte
                                        show={this.state.modalShow && this.state.telefonoMarcar !== ''}
                                        onHide={() => this.setState({modalShow: false})}
                                        cliente={this.state.cliente}
                                        creditos={this.state.creditos}
                                        telefono={this.state.telefonoMarcar}
                                        idUsuarioAsignado={this.props.idUsuario}
                                        idUsuarioAtendido={this.props.idUsuario}
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