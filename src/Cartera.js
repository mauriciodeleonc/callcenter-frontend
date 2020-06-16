import React from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import readXlsxFile from 'read-excel-file';
import LoginRedirect from './LoginRedirect';

class Cartera extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rol: this.props.usuario,
            idUsuario: this.props.idUsuario,
            filas: [],
            excel: ''
        }
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.promisesRecursivos = this.promisesRecursivos.bind(this);
        this.updateCliente = this.updateCliente.bind(this);
        this.updateClienteEjecutivo = this.updateClienteEjecutivo.bind(this);
        this.updateReferencia = this.updateReferencia.bind(this);
        this.updateDireccion = this.updateDireccion.bind(this);
        this.updateCredito = this.updateCredito.bind(this);
        this.handleAgregarCartera = this.handleAgregarCartera.bind(this);
        this.getCartaProducto = this.getCartaProducto.bind(this);
        this.handleExcel = this.handleExcel.bind(this);
        this.getIdEmpleado = this.getIdEmpleado.bind(this);
    }

    async updateCliente(idProducto, cliente){
        let id;
        let response = await axios.post('/updateCliente', null, {
            params: {
              idProducto: idProducto,
              nombre: cliente.nombre,
              telCasa: cliente.telCasa,
              telCel: cliente.telCel
            }
        });
        id = response.data[0][0].idCliente;
        console.log("Cliente actualizado: "  + id);
        return id;
    }

    updateClienteEjecutivo(idCliente, idEjecutivo){
        axios.post('/updateClienteEjecutivo', null, {
            params: {
              idCliente: idCliente,
              idEjecutivo: idEjecutivo
            }
        }).then(() => {
            console.log("Cliente Ejecutivo actualizado: " + idCliente);
        });
    }

    updateDireccion(idCliente, direccionCliente){
        axios.post('/updateDireccion', null, {
            params: {
              idCliente: idCliente,
              calle: direccionCliente.calle,
              colonia: direccionCliente.colonia,
              municipio: direccionCliente.municipio,
              estado: direccionCliente.estado
            }
        }).then(() => {
            console.log("Direccion actualizada: " + idCliente);
        });
    }

    updateCredito(credito){
        axios.post('/updateCredito', null, {
            params: {
              numCredito: credito.numCredito,
              estado: credito.estado,
              bucketMin: credito.bucketMin,
              bucketMax: credito.bucketMax,
              cuota: credito.cuota,
              vencido: credito.vencido,
              vencidoCuota: credito.vencidoCuota,
              total: credito.total,
              liqActual: credito.liqActual,
              plazo: credito.plazo,
              ultimoPago: credito.ultimoPago
            }
        }).then(() => {
            console.log("Credito actualizado: " + credito.numCredito);
        });
    }

    updateReferencia(idCliente, referencia){
        axios.post('/updateReferencia', null, {
            params: {
              idCliente: idCliente,
              nombre: referencia.nombre,
              telCasa: referencia.telCasa,
              telCel: referencia.telCel
            }
        }).then(() => {
            console.log("Referencia actualizada: " + idCliente);
        });
    }

    async getIdEmpleado(usuario){
        let id;
        let response = await axios.get(('/getIdEmpleado'), {
            params: {
                usuario: usuario
            }
        });
        id = response.data[0][0].idEmpleado;
        console.log('id de empleado: ' + id);
        return id;
    }

    promisesRecursivos(idCliente, rows, i){
        
        let idEjecutivo;
        let datosEjecutivo;
        let direccionCliente;
        let datosCredito;
        let bucketMin;
        let bucketMax;
        let nombreReferencia;
        let telCasaReferencia;
        let telCelReferencia;
        let referencia1;
        let referencia2;
        let referencia3;
        let referencia4;
        let referencia5;
        datosEjecutivo = rows[i][3].toString().toLowerCase();
        this.getIdEmpleado(datosEjecutivo).then(idEjecutivo =>{
            
            this.updateClienteEjecutivo(idCliente, idEjecutivo);
            direccionCliente = {
                calle: rows[i][38].toString(),
                colonia: rows[i][39].toString(),
                municipio: rows[i][40].toString(),
                estado: rows[i][41].toString()
            }
            this.updateDireccion(idCliente, direccionCliente);

            let bucket = rows[i][7];
            bucket = bucket.split(" ");

            if(bucket[2] === '+') {
                bucketMin = parseInt(bucket[1]);
                bucketMax = parseInt('999');
            } else {
                bucketMin = parseInt(bucket[1]);
                bucketMax = parseInt(bucket[3]);
            }

            let fechaOtorgado = rows[i][5];
            fechaOtorgado = fechaOtorgado.getFullYear() + "-" + (fechaOtorgado.getMonth() + 1) + "-" + fechaOtorgado.getDate();

            let ultimoPago = rows[i][20];
            ultimoPago = ultimoPago.getFullYear() + "-" + (ultimoPago.getMonth() + 1) + "-" + ultimoPago.getDate();

            const estados = {
                'RECADO REF': 1,
                'NUEVA': 2,
                'BUZON': 3,
                'FUERA DE SERVICIO': 4,
                'NO EXISTE': 5,
                'NO CONTESTAN': 6,
                'DEFUNCION': 7,
                'SIN INFORMACION': 8
            }

            datosCredito = {
                numCredito: rows[i][2],
                estado: estados[rows[i][0]],
                fechaOtorgado: fechaOtorgado,
                bucketMin: bucketMin,
                bucketMax: bucketMax,
                cuota: rows[i][8],
                vencido: rows[i][9], 
                vencidoCuota: rows[i][10],
                total: rows[i][11],
                liqActual: rows[i][12],
                plazo: rows[i][17],
                ultimoPago: ultimoPago
            }

            this.updateCredito(datosCredito);

            nombreReferencia = rows[i][23];
            if(nombreReferencia === null){
                nombreReferencia = 'null';
            } else  {
                nombreReferencia = nombreReferencia.toString();
            }

            telCasaReferencia = rows[i][24];
            if(telCasaReferencia === null){
                telCasaReferencia = 'null';
            } else  {
                telCasaReferencia = telCasaReferencia.toString();
            }

            telCelReferencia = rows[i][25];
            if(telCelReferencia === null){
                telCelReferencia = 'null';
            } else  {
                telCelReferencia = telCelReferencia.toString();
            }

            referencia1 = {
                nombre: nombreReferencia,
                telCasa: telCasaReferencia,
                telCel: telCelReferencia
            }
            this.updateReferencia(idCliente, referencia1);

            nombreReferencia = rows[i][26];
            if(nombreReferencia === null){
                nombreReferencia = 'null';
            } else  {
                nombreReferencia = nombreReferencia.toString();
            }

            telCasaReferencia = rows[i][27];
            if(telCasaReferencia === null){
                telCasaReferencia = 'null';
            } else  {
                telCasaReferencia = telCasaReferencia.toString();
            }

            telCelReferencia = rows[i][28];
            if(telCelReferencia === null){
                telCelReferencia = 'null';
            } else  {
                telCelReferencia = telCelReferencia.toString();
            }

            referencia2 = {
                nombre: nombreReferencia,
                telCasa: telCasaReferencia,
                telCel: telCelReferencia
            }
            this.updateReferencia(idCliente, referencia2);

            nombreReferencia = rows[i][29];
            if(nombreReferencia === null){
                nombreReferencia = 'null';
            } else  {
                nombreReferencia = nombreReferencia.toString();
            }

            telCasaReferencia = rows[i][30];
            if(telCasaReferencia === null){
                telCasaReferencia = 'null';
            } else  {
                telCasaReferencia = telCasaReferencia.toString();
            }

            telCelReferencia = rows[i][31];
            if(telCelReferencia === null){
                telCelReferencia = 'null';
            } else  {
                telCelReferencia = telCelReferencia.toString();
            }

            referencia3 = {
                nombre: nombreReferencia,
                telCasa: telCasaReferencia,
                telCel: telCelReferencia
            }
            this.updateReferencia(idCliente, referencia3);

            nombreReferencia = rows[i][32];
            if(nombreReferencia === null){
                nombreReferencia = 'null';
            } else  {
                nombreReferencia = nombreReferencia.toString();
            }

            telCasaReferencia = rows[i][33];
            if(telCasaReferencia === null){
                telCasaReferencia = 'null';
            } else  {
                telCasaReferencia = telCasaReferencia.toString();
            }

            telCelReferencia = rows[i][34];
            if(telCelReferencia === null){
                telCelReferencia = 'null';
            } else  {
                telCelReferencia = telCelReferencia.toString();
            }

            referencia4 = {
                nombre: nombreReferencia,
                telCasa: telCasaReferencia,
                telCel: telCelReferencia
            }
            this.updateReferencia(idCliente, referencia4);

            nombreReferencia = rows[i][35];
            if(nombreReferencia === null){
                nombreReferencia = 'null';
            } else  {
                nombreReferencia = nombreReferencia.toString();
            }

            telCasaReferencia = rows[i][36];
            if(telCasaReferencia === null){
                telCasaReferencia = 'null';
            } else  {
                telCasaReferencia = telCasaReferencia.toString();
            }

            telCelReferencia = rows[i][37];
            if(telCelReferencia === null){
                telCelReferencia = 'null';
            } else  {
                telCelReferencia = telCelReferencia.toString();
            }

            referencia5 = {
                nombre: nombreReferencia,
                telCasa: telCasaReferencia,
                telCel: telCelReferencia
            }
            this.updateReferencia(idCliente, referencia5);
        });
    }

    handleFileChosen(file){
        let datosCliente;
        let idProducto = parseInt(this.props.match.params.nombre.split('+')[1]);
       //console.log(typeof idProducto);
        readXlsxFile(file).then((rows) => {
            console.log(rows);
            for(let i = 1; i < rows.length; i++){
                let nombreCliente = rows[i][6];
                if(nombreCliente === null){
                    nombreCliente = 'null';
                } else  {
                    nombreCliente = nombreCliente.toString();
                }

                let telCasaCliente = rows[i][21];
                if(telCasaCliente === null){
                    telCasaCliente = 'null';
                } else  {
                    telCasaCliente = telCasaCliente.toString();
                }

                let telCelCliente = rows[i][22];
                if(telCelCliente === null){
                    telCelCliente = 'null';
                } else  {
                    telCelCliente = telCelCliente.toString();
                }

                datosCliente = {
                    nombre: nombreCliente,
                    telCasa: telCasaCliente,
                    telCel: telCelCliente
                }
                this.updateCliente(idProducto, datosCliente).then(idCliente => {
                    //console.log(idCliente);
                    this.promisesRecursivos(idCliente, rows, i);
                });
            }
        });
    }

    handleAgregarCartera(event){
        event.preventDefault();
        //console.log(this.state.excel);
        this.handleFileChosen(this.state.excel);
    }

    handleExcel(event){this.setState({excel: event.target.files[0]});}

    getCartaProducto(idProducto){
        axios.get('/getCarteraProducto', {
            params: {
                idProducto: idProducto
            }
        }).then(response => {
           //console.log(response.data);
            this.setState({
                filas: response.data[0]
            });
            console.log(this.state.filas);
        })
    }

    componentDidMount(){
        //console.log(this.props.match);
        let idProducto = this.props.match.params.nombre.split('+')[1];
        this.getCartaProducto(idProducto);
    }

    shouldComponentUpdate(nextProps, nextState){
        //console.log(this.props.match);
        if(this.state.filas !== nextState.filas){
            let idProducto = this.props.match.params.nombre.split('+')[1];
            //if(prevState.filas != this.state.filas){
            this.getCartaProducto(idProducto);
            return true;
        }
    }

    render(){
        return(
            <>
                {(this.props.usuario === 'supervisor') ?
                <>
                <h1>{(this.props.match.params.nombre.split('+')[0]).charAt(0).toUpperCase() + (this.props.match.params.nombre.split('+')[0]).slice(1)}</h1>
                <Form 
                    onSubmit={this.handleAgregarCartera}
                    style={{
                        borderStyle: 'dashed',
                        borderColor: '#7E2CFF',
                        maxWidth: '250px',
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 5
                    }}    
                >
                    <p className='h5'>Actualizar Cartera</p>
                    <Form.Group controlId="cartera"> 
                        <input 
                            type = 'file'
                            id = 'file'
                            accept = '.xlsx'
                            onChange = {this.handleExcel}
                            required
                        />
                    </Form.Group>
                    <Button className='boton-morado' type="submit" onClick={() => this.handleAgregarCartera}>
                        Actualizar cartera
                    </Button>
                </Form>
                <Table striped hover responsive className='cartera-table'>
                    <thead>
                        <tr>
                            <th>Ejecutivo asignado</th>
                            <th>Estatus</th>
                            <th>No. Crédito</th>
                            <th>Nombre Cliente</th>
                            <th>Tel. Casa</th>
                            <th>Tel. Celular</th>
                            <th>Fecha Otorgamiento</th>
                            <th>Bucket Min</th>
                            <th>Bucket Max</th>
                            <th>Cuota</th>
                            <th>Vencido</th>
                            <th>Vencido + Cuota</th>
                            <th>Total</th>
                            <th>Liq. Actual</th>
                            <th>Plazo</th>
                            <th>Fecha Último Pago</th>
                            <th>Nombre Referencia</th>
                            <th>Tel. Casa Ref.</th>
                            <th>Tel. Cel. Ref.</th>
                            <th>Calle</th>
                            <th>Colonia</th>
                            <th>Municipio</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filas.map(fila => {
                            let fechaOtorgamiento = new Date(Date.parse(fila.fechaOtorgamiento));
                            fechaOtorgamiento = fechaOtorgamiento.getDate() + "/" + (fechaOtorgamiento.getMonth() + 1) + "/" + fechaOtorgamiento.getFullYear();

                            let ultimoPago = new Date(Date.parse(fila.fechaUltimoPago));
                            ultimoPago = ultimoPago.getDate() + "/" + (ultimoPago.getMonth() + 1) + "/" + ultimoPago.getFullYear();
                            
                            return(
                                <tr key={fila.idReferencia}>
                                    <td>{fila.usuario == 'null' ? '' : fila.usuario}</td>
                                    <td>{fila.estatus == 'null' ? '' : fila.estatus}</td>
                                    <td>{fila.numCredito == 'null' ? '' : fila.numCredito}</td>
                                    <td>{fila.nombreCliente == 'null' ? '' : fila.nombreCliente}</td>
                                    <td>{fila.telCasaCliente == 'null' ? '' : fila.telCasaCliente}</td>
                                    <td>{fila.telCelularCliente == 'null' ? '' : fila.telCelularCliente}</td>
                                    <td>{fechaOtorgamiento == 'null' ? '' : fechaOtorgamiento}</td>
                                    <td>{fila.bucketInf == 'null' ? '' : fila.bucketInf}</td>
                                    <td>{fila.bucketSup == 'null' ? '' : fila.bucketSup}</td>
                                    <td>{fila.cuota == 'null' ? '' : fila.cuota}</td>
                                    <td>{fila.vencido == 'null' ? '' : fila.vencido}</td>
                                    <td>{fila.vencidoCuota == 'null' ? '' : fila.vencidoCuota}</td>
                                    <td>{fila.total == 'null' ? '' : fila.total}</td>
                                    <td>{fila.liquidacionActual == 'null' ? '' : fila.liquidacionActual}</td>
                                    <td>{fila.plazo == 'null' ? '' : fila.plazo}</td>
                                    <td>{ultimoPago == 'null' ? '' : ultimoPago}</td>
                                    <td>{fila.nombreReferencia == 'null' ? '' : fila.nombreReferencia}</td>
                                    <td>{fila.telCasaReferencia == 'null' ? '' : fila.telCasaReferencia}</td>
                                    <td>{fila.telCelularReferencia == 'null' ? '' : fila.telCelularReferencia}</td>
                                    <td>{fila.calle == 'null' ? '' : fila.calle}</td>
                                    <td>{fila.colonia == 'null' ? '' : fila.colonia}</td>
                                    <td>{fila.municipio == 'null' ? '' : fila.municipio}</td>
                                    <td>{fila.estado == 'null' ? '' : fila.estado}</td>
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

export default Cartera;