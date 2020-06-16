import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import LoginRedirect from './LoginRedirect';


import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Reporte extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gestiones: {},
            fileName: ''
        }

        this.getGestiones = this.getGestiones.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.parseISOString = this.parseISOString.bind(this);
    }

    getGestiones(idProducto){
        axios.get('/getGestiones', {
            params: {
                idProducto: idProducto
            }
        }).then(response => {
            this.setState({
                gestiones: response.data[0]
            }, () => {
                let gestiones = [];
                
                //console.log(this.state.gestiones);
                for(let i = 0; i  < this.state.gestiones.length; i++){
                    //console.log(this.state.gestiones[i]);
                    let fechaHoraGestion = this.state.gestiones[i].fechaHoraGestion;
                    //let d = new Date(fechaHoraGestion);
                    //console.log(d.getUTCDate() + '/' + (d.getUTCMonth() + 1)+ '/' + d.getUTCFullYear());
                    //console.log((d.getUTCHours() - 5) + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds());
                    //console.log(fechaHoraGestion);
                    fechaHoraGestion = this.parseISOString(fechaHoraGestion);
                    //console.log(fechaHoraGestion);
                    let fechaGestion = fechaHoraGestion.getDate() + '/' +(fechaHoraGestion.getMonth() + 1) + '/' + fechaHoraGestion.getFullYear();
                    let horaGestion = fechaHoraGestion.getHours() + ':' + fechaHoraGestion.getMinutes()+ ':' + fechaHoraGestion.getSeconds();
                    //console.log(fechaHoraGestion);
                    //console.log(fechaGestion);
                    //console.log(horaGestion);
                    //console.log('');

                    let fechaHoraPromesa = this.state.gestiones[i].fechaPromesa;
                    //console.log(fechaHoraPromesa);
                    fechaHoraPromesa == null ? fechaHoraPromesa = '' : fechaHoraPromesa = fechaHoraPromesa;
                    fechaHoraPromesa = this.parseISOString(fechaHoraPromesa);
                    let fechaDiasPromesa = fechaHoraPromesa.getDate() + '/' +(fechaHoraPromesa.getMonth() + 1) + '/' + fechaHoraPromesa.getFullYear();
                    fechaHoraPromesa == 'Invalid Date' ? fechaDiasPromesa = '' : fechaDiasPromesa = fechaDiasPromesa;
                    let horaPromesa = fechaHoraPromesa.getHours() + ':' + fechaHoraPromesa.getMinutes()+ ':' + fechaHoraPromesa.getSeconds();
                    fechaHoraPromesa == 'Invalid Date' ? horaPromesa = '' : horaPromesa = horaPromesa;
                    //console.log(fechaDiasPromesa);
                    //console.log(horaPromesa);

                    let gestion = this.state.gestiones[i];
                    gestion = {
                        ...gestion,
                        fechaGestion,
                        horaGestion,
                        fechaDiasPromesa,
                        horaPromesa
                    }
                    gestiones.push(gestion);
                    //console.log(gestion);
                }
                console.log(gestiones);
                console.log(this.state.gestiones);
                this.setState({gestiones});
            });

            

        });
    }

    updateTime(){
        let today = new Date();
        let date = today.getDate() + '-' +(today.getMonth() + 1) + '-' + today.getFullYear() + '-' + today.getHours() + '-' + today.getMinutes();
        let fileName = (this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1) + '-' + date;

        this.setState({
            fileName: fileName
        });
    }


    componentDidMount(){
        let idProducto = this.props.match.params.nombre.split('+')[1];
        this.getGestiones(idProducto);
    }

    parseISOString(s) {
        //console.log(s);
        let b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    render(){
        let today = new Date();
        let date = today.getDate() + '/' +(today.getMonth() + 1) + '/' + today.getFullYear() + '/' + today.getHours() + '-' + today.getMinutes();
        let fileName = (this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1) + '-' + date;
        console.log(this.state);
        return(
            <>
                {(this.props.usuario === 'supervisor') ?
                <>
                <h1>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</h1>
                <ExcelFile element={<Button className='boton-morado boton-login mb-2'>Descargar reporte</Button>} filename={fileName}>
                    <ExcelSheet data={this.state.gestiones} name="Reporte">
                        <ExcelColumn label="Producto" value="nombreProducto"/>
                        <ExcelColumn label="Usuario Asignado" value="asignado"/>
                        <ExcelColumn label="Usuario Atendió" value="atendido"/>
                        <ExcelColumn label="Cuenta" value="numCredito"/>
                        <ExcelColumn label="Cliente" value="nombreCliente"/>
                        <ExcelColumn label="Teléfono Marcado" value="numeroContacto"/>
                        <ExcelColumn label="Fecha" value="fechaGestion"/>
                        <ExcelColumn label="Hora" value="horaGestion"/>
                        <ExcelColumn label="Código Acción" value="codigoAccion"/>
                        <ExcelColumn label="Código Resultado" value="codigoResultado"/>
                        <ExcelColumn label="Código Contacto" value="codigoContacto"/>
                        <ExcelColumn label="Comentario" value="comentarios"/>
                        <ExcelColumn label="Fecha PP" value="fechaDiasPromesa"/>
                        <ExcelColumn label="Monto PP" value="monto"/>
                    </ExcelSheet>
                </ExcelFile>
                <Table striped hover responsive className='cartera-table'>
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
                            let fechaGestion = fechaGestionCompleta.getDate() + "/" + (fechaGestionCompleta.getMonth() + 1) + "/" + fechaGestionCompleta.getFullYear();
                            let tiempoGestion = fechaGestionCompleta.getHours() + ":" + fechaGestionCompleta.getMinutes() + ":" + fechaGestionCompleta.getSeconds()
                            let fechaPromesa = new Date(Date.parse(this.state.gestiones[gestion].fechaPromesa));
                            fechaPromesa = fechaPromesa.getDate() + "/" + (fechaPromesa.getMonth() + 1) + "/" + fechaPromesa.getFullYear();
                            
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