import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { faHeadset, faPause, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import io from 'socket.io-client';
import LoginRedirect from './LoginRedirect';
let socket = io('localhost:5000');
socket = io.connect();

class Supervision extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            empleados: []
        }
        this.getEmpleadosProducto = this.getEmpleadosProducto.bind(this);
        this.botonEstado = this.botonEstado.bind(this);
    }

    getEmpleadosProducto(idProducto){
        axios.get('/getEmpleadosProducto', {
            params: {
                idProducto: idProducto
            }
        }).then(response => {
            console.log(response.data[0]);
            for(let i = 0; i < response.data[0].length; i++){
                this.setState({
                    empleados: {
                        ...this.state.empleados,
                        [response.data[0][i].idEmpleado]: {
                            usuario: response.data[0][i].usuario,
                            estado: 'desconectado',
                            tiempoLlamada: '00m:00s'
                        }
                    }
                    
                });
            }
        });
    }

    componentDidMount(){
        //console.log(this.props.match);
        let idProducto = this.props.match.params.nombre.split('+')[1];
        this.getEmpleadosProducto(idProducto);

        socket.on('connect', () => {
            //socket.emit('room', this.props.match.params.nombre.split('+')[0]);
            socket.emit('room', 'ITCS');
        });

        socket.on('llamada', (data) => {
            this.setState({
                empleados:{
                    ...this.state.empleados,
                    [data.idUsuario]: {
                        ...this.state.empleados[data.idUsuario],
                        tiempoLlamada: data.minutosLlamada + 'm:' + data.segundosLlamada + 's'
                    }
                }
            });
        });
        
        socket.on('message', (data) => {

            //console.log(data.idUsuario);
            //console.log(data.estadoBoton);
            //console.log(this.state);
            
            
            switch(data.estadoBoton){
                case 'pausa':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'pausa'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras[data.idUsuario]);
                    break;
                case 'predictivo':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'conectado'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras);
                    break;
                case 'manual':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'conectado'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras[data.idUsuario]);
                    break;
              }
        });

        socket.on('message-disconnect', (data) => {
            //console.log('En llamada:', data[this.state.room].countLlamada);
            //console.log('En pausa:', data[this.state.room].countPausa);

            //console.log(data.idUsuario);
            //console.log(data.estadoBoton);
            //console.log(this.state);
            
            
            switch(data.estadoBoton){
                case 'pausa':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'desconectado'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras[data.idUsuario]);
                    break;
                case 'predictivo':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'desconectado'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras);
                    break;
                case 'manual':
                    this.setState({
                        empleados:{
                            ...this.state.empleados,
                            [data.idUsuario]: {
                                ...this.state.empleados[data.idUsuario],
                                estado: 'desconectado'
                            }
                        }
                    });
                    //carteras[data.idUsuario].countPausa = carteras[data.idUsuario].countPausa + 1;
                    //console.log(this.state.carteras[data.idUsuario]);
                    break;
              }
        });
        
    }

    botonEstado(estado){
        console.log(estado);
        if(estado == 'conectado'){
            return <Button className='boton-conectado' disabled><FontAwesomeIcon icon={faHeadset} /></Button>
        } else if(estado == 'pausa'){
            return <Button className='boton-pausa' disabled><FontAwesomeIcon icon={faPause} /></Button>
        } else {
            return <Button className='boton-desconectado' disabled><FontAwesomeIcon icon={faPhoneSlash} /></Button>
        }
    }

    render(){
        return(
            <>
                {(this.props.usuario === 'supervisor') ?
                <>
                <h1>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</h1>
                <Table striped hover responsive >
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Tiempo en llamada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.empleados).map((empleado) => {
                            {console.log(this.state.empleados[empleado])}
                            return(
                                <tr key={this.state.empleados[empleado].idEmpleado}>
                                    <td>{this.state.empleados[empleado].usuario}</td>
                                    <td>{this.botonEstado(this.state.empleados[empleado].estado)}</td>
                                    <td>{this.state.empleados[empleado].tiempoLlamada}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                </>
                :
                <LoginRedirect />
                }   
            </>
        );
    }
}

export default Supervision;