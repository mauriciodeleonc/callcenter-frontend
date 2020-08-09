import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';
import LoginRedirect from './LoginRedirect';


import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Reporte extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gestiones: [],
            fileName: '',
            excel: ''
        }

        this.getGestiones = this.getGestiones.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.parseISOString = this.parseISOString.bind(this);
        this.handleExcel = this.handleExcel.bind(this);
        this.handleAgregarGestiones = this.handleAgregarGestiones.bind(this);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.downloadExcel = this.downloadExcel.bind(this);
    }

    getGestiones(idCartera){
        axios.get(`/gestiones/${idCartera}`).then(response => {
            this.setState({
                gestiones: response.data.data
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

    handleExcel(event){this.setState({excel: event.target.files[0]});}

    handleAgregarGestiones(event){
        event.preventDefault();
        //console.log(this.state.excel);
        this.handleFileChosen(this.state.excel);
    }

    handleFileChosen(file){
       //console.log(typeof idProducto);
        readXlsxFile(file).then((rows) => {
            console.log(rows);
            for(let i = 1; i < rows.length; i++){
                let ejecutivo = rows[i][0];
                if(ejecutivo === null){
                    ejecutivo = 'null';
                } else if(ejecutivo === '#N/A'){
                    ejecutivo = 'MARCO';
                } else {
                    ejecutivo = ejecutivo.toString();
                }

                let fechaGestion = rows[i][2];
                fechaGestion = fechaGestion.getFullYear() + "-" + (fechaGestion.getMonth() + 1) + "-" + fechaGestion.getDate();

                let credito = rows[i][3];
                
                /*
                let nombreCliente = rows[i][4];
                if(nombreCliente === null){
                    nombreCliente = 'null';
                } else if(nombreCliente === '#N/A'){
                    nombreCliente = '-';
                } else {
                    nombreCliente = ejecutivo.toString();
                }*/

                let telMarcado = rows[i][10];

                let codigoAccion = rows[i][11];
                let codigoContacto = rows[i][12];
                let codigoResultado = rows[i][13];
                
                let fechaPP = rows[i][14];
                if(fechaPP === '' || fechaPP === null){
                    fechaPP = '';
                } else {
                    fechaPP = fechaPP.getFullYear() + "-" + (fechaPP.getMonth() + 1) + "-" + fechaPP.getDate();
                }

                let montoPP = rows[i][15];
                if(montoPP === '' || montoPP === null){
                    montoPP = '';
                }

                let comentario = rows[i][15];

                axios.get('/getIdEmpleado', {
                    params: {usuario: ejecutivo}
                }).then(response => {
                    axios.post('/insertGestion', null, {
                        params: {
                            idEmpleadoAsignado: response.data[0][0].idEmpleado,
                            idEmpleadoAtendido: response.data[0][0].idEmpleado,
                            numCredito: parseInt(credito),
                            fechaHoraGestion: fechaGestion,
                            numeroContacto: telMarcado,
                            comentarios: comentario,
                            codigoAccion: codigoAccion,
                            codigoResultado: codigoResultado,
                            codigoContacto: codigoContacto
                        }
                    }).then(response => {
                        if(fechaPP !== ''){
                            let fechaPromesa = fechaPP  + ' 00:00:00';
                            axios.post('/insertPromesa', null, {
                                params: {
                                    idGestion: response.data[0][0].idGestion,
                                    fechaPromesa: fechaPromesa,
                                    montoPromesa: parseFloat(montoPP)
                                }
                            })
                        }
                    });
                });
            }
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
    downloadExcel(){
        const idCartera = this.props.match.params.nombre.split('+')[1];
        const nombre = this.props.match.params.nombre.split('+')[0];
        const configExcel = {
            method: 'get',
            url: `/gestiones/excel/${idCartera}`,
            responseType: 'arraybuffer',
        }
        axios(configExcel).then((responseExcel) => {
            const url = window.URL.createObjectURL(new Blob([responseExcel.data]));
            const link = document.createElement('a');
            link.href = url;
            let today = new Date();
            let date = today.getDate() + '/' +(today.getMonth() + 1) + '-' + today.getFullYear();
            link.setAttribute('download', `gestiones_${nombre}_${date}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.log(error));
    }
    render(){
        let today = new Date();
        let date = today.getDate() + '/' +(today.getMonth() + 1) + '/' + today.getFullYear() + '/' + today.getHours() + '-' + today.getMinutes();
        let fileName = (this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1) + '-' + date;
        console.log(this.state);
        return(
            <>
                {(this.props.usuario === 'Supervisor') ?
                <>
                <h1>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</h1>
                <Button className='boton-morado boton-login mb-2' onClick={this.downloadExcel}>Descargar reporte</Button>
                <Form 
                    onSubmit={this.handleAgregarGestiones}
                    style={{
                        borderStyle: 'dashed',
                        borderColor: '#7E2CFF',
                        maxWidth: '250px',
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 5
                    }}    
                >
                    <p className='h5'>Agregar Gestiones</p>
                    <Form.Group controlId="gestion"> 
                        <input 
                            type = 'file'
                            id = 'file'
                            accept = '.xlsx'
                            onChange = {this.handleExcel}
                            required
                        />
                    </Form.Group>
                    <Button className='boton-morado' type="submit" onClick={() => this.handleAgregarGestiones}>
                        Agregar gestiones
                    </Button>
                </Form>
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
                        {this.state.gestiones.flatMap((gestion) => {
                            return gestion.Creditos.map(credito => {
                                let fechaGestionCompleta = new Date(Date.parse(gestion.createdAt));
                                let fechaGestion = fechaGestionCompleta.getDate() + "/" + (fechaGestionCompleta.getMonth() + 1) + "/" + fechaGestionCompleta.getFullYear();
                                let tiempoGestion = fechaGestionCompleta.getHours() + ":" + fechaGestionCompleta.getMinutes() + ":" + fechaGestionCompleta.getSeconds()
                                let fechaPromesa = new Date(Date.parse(gestion.Promesa.fecha));
                                fechaPromesa = fechaPromesa.getDate() + "/" + (fechaPromesa.getMonth() + 1) + "/" + fechaPromesa.getFullYear();
                                return (
                                    <tr key={gestion.idGestion}>
                                        <td>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</td>
                                        <td>{gestion.empleadoAsignado}</td>
                                        <td>{gestion.empleadoAtendio}</td>
                                        <td>{credito.numCredito}</td>
                                        <td>{credito.cliente}</td>
                                        <td>{gestion.numeroContacto}</td>
                                        <td>{fechaGestion === 'NaN/NaN/NaN' ? '' : fechaGestion}</td>
                                        <td>{tiempoGestion}</td>
                                        <td>{gestion.codigoAccion}</td>
                                        <td>{gestion.codigoResultado}</td>
                                        <td>{gestion.codigoContacto}</td>
                                        <td>{gestion.comentarios}</td>
                                        <td>{fechaPromesa === 'NaN/NaN/NaN' ? '' : fechaPromesa}</td>
                                        <td>{gestion.Promesa && gestion.Promesa !== null ? gestion.Promesa.monto : ''}</td>
                                    </tr>
                                );
                            });
                            
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