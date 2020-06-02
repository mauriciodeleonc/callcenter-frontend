import React from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import LoginRedirect from './LoginRedirect';

class Reporte extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gestiones: {}
        }

        this.getGestiones = this.getGestiones.bind(this);
    }

    getGestiones(idProducto){
        axios.get('/getGestiones', {
            params: {
                idProducto: idProducto
            }
        }).then(response => {
            this.setState({
                gestiones: response.data[0]
            })
        });
    }


    componentDidMount(){
        let idProducto = this.props.match.params.nombre.split('+')[1];
        this.getGestiones(idProducto);
    }

    render(){
        return(
            <>
                {(this.props.usuario === 'supervisor') ?
                <>
                <h1>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</h1>
                <Table striped hover responsive className='user-table'>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Usuario Asignado</th>
                            <th>Usuario Atendió</th>
                            <th>Cuenta</th>
                            <th>Cliente</th>
                            <th>Teléfono marcado</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Código Acción</th>
                            <th>Código Resultado</th>
                            <th>Código Contacto</th>
                            <th>Comentario</th>
                            <th>Fecha PP</th>
                            <th>Monto PP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.gestiones).map((gestion) => {
                            let fechaGestionCompleta = new Date(Date.parse(this.state.gestiones[gestion].fechaHoraGestion));
                            let fechaGestion = (fechaGestionCompleta.getMonth() + 1) + "-" + fechaGestionCompleta.getDate() + "-" + fechaGestionCompleta.getFullYear();
                            let tiempoGestion = fechaGestionCompleta.getHours() + ":" + fechaGestionCompleta.getMinutes() + ":" + fechaGestionCompleta.getSeconds()
                            let fechaPromesa = new Date(Date.parse(this.state.gestiones[gestion].fechaPromesa));
                            fechaPromesa = (fechaPromesa.getMonth() + 1) + "-" + fechaPromesa.getDate() + "-" + fechaPromesa.getFullYear();
                            return(
                                <tr key={this.state.gestiones[gestion].idGestion}>
                                    <td>{this.state.gestiones[gestion].nombreProducto}</td>
                                    <td>{this.state.gestiones[gestion].asignado}</td>
                                    <td>{this.state.gestiones[gestion].atendido}</td>
                                    <td>{this.state.gestiones[gestion].numCredito}</td>
                                    <td>{this.state.gestiones[gestion].nombreCliente}</td>
                                    <td>{this.state.gestiones[gestion].numeroContacto}</td>
                                    <td>{fechaGestion}</td>
                                    <td>{tiempoGestion}</td>
                                    <td>{this.state.gestiones[gestion].codigoAccion}</td>
                                    <td>{this.state.gestiones[gestion].codigoResultado}</td>
                                    <td>{this.state.gestiones[gestion].codigoContacto}</td>
                                    <td>{this.state.gestiones[gestion].comentarios}</td>
                                    <td>{this.state.gestiones[gestion].fechaPromesa == null ? '' : fechaPromesa}</td>
                                    <td>{this.state.gestiones[gestion].monto}</td>
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

export default Reporte;