import React from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LoginRedirect from './LoginRedirect';
const FormData = require('form-data');

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
        this.handleAgregarCartera = this.handleAgregarCartera.bind(this);
        this.getCartera = this.getCartera.bind(this);
        this.handleExcel = this.handleExcel.bind(this);
    }

    handleFileChosen(file){
        const data = new FormData();
        const idCartera = this.props.match.params.nombre.split('+')[1];
        data.append('file', file);
        const config = {
            method: 'put',
            url: `/carteras/${idCartera}`,
            data: data
        };
        axios(config)
            .then((response) => {
                this.getCartera(idCartera);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    handleAgregarCartera(event){
        event.preventDefault();
        //console.log(this.state.excel);
        this.handleFileChosen(this.state.excel);
    }

    handleExcel(event){this.setState({excel: event.target.files[0]});}

    getCartera(idCartera){
        /*axios.get(`/carteras/${idCartera}`).then(response => {
            this.setState({
                filas: response.data.data.cartera.Creditos
            });
        })*/
    }

    componentDidMount(){
        const idCartera = this.props.match.params.nombre.split('+')[1];
        this.getCartera(idCartera);
    }

    /*shouldComponentUpdate(nextProps, nextState){
        //console.log(this.props.match);
        if(this.state.filas !== nextState.filas){
            let idProducto = this.props.match.params.nombre.split('/')[1];
            //if(prevState.filas != this.state.filas){
            this.getCartaProducto(idProducto);
            return true;
        }
    }*/

    render(){
        return(
            <>
                {(this.props.usuario === 'Supervisor') ?
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
                            <th>No. Crédito</th>
                            <th>Nombre Cliente</th>
                            <th>RFC</th>
                            <th>Tel. Casa</th>
                            <th>Tel. Celular</th>
                            <th>Fecha Otorgamiento</th>
                            <th>Bucket Min</th>
                            <th>Bucket Max</th>
                            <th>Cuota</th>
                            <th>Mejora</th>
                            <th>Cura</th>
                            <th>Total</th>
                            <th>Liq. Actual</th>
                            <th>Frecuencia</th>
                            <th>Plazo</th>
                            <th>Fecha Último Pago</th>
                            <th>Nombre Referencia</th>
                            <th>Tel. Casa Ref.</th>
                            <th>Tel. Cel. Ref.</th>
                            <th>Calle</th>
                            <th>Colonia</th>
                            <th>Municipio</th>
                            <th>Estado</th>
                            <th>Código Postal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filas.flatMap(fila => {
                            let fechaOriginacion = new Date(Date.parse(fila.fechaOriginacion));
                            fechaOriginacion = fechaOriginacion.getDate() + "/" + (fechaOriginacion.getMonth() + 1) + "/" + fechaOriginacion.getFullYear();

                            let ultimoPago = new Date(Date.parse(fila.fechaUltimoPago));
                            ultimoPago = ultimoPago.getDate() + "/" + (ultimoPago.getMonth() + 1) + "/" + ultimoPago.getFullYear();
                            return fila.Cliente.Referencias.map(referencia => {
                                return(
                                    <tr key={fila.idReferencia}>
                                        <td>{fila.ejecutivo == 'null' ? '' : fila.ejecutivo}</td>
                                        <td>{fila.numCredito == 'null' ? '' : fila.numCredito}</td>
                                        <td>{fila.cliente == 'null' ? '' : fila.cliente}</td>
                                        <td>{fila.Cliente.rfc == 'null' ? '' : fila.Cliente.rfc}</td>
                                        <td>{fila.Cliente.telCasa == 'null' ? '' : fila.Cliente.telCasa}</td>
                                        <td>{fila.Cliente.telCelular == 'null' ? '' : fila.Cliente.telCelular}</td>
                                        <td>{fechaOriginacion == 'NaN/NaN/NaN' ? '' : fechaOriginacion}</td>
                                        <td>{fila.bucketInicial == 'null' ? '' : fila.bucketInicial}</td>
                                        <td>{fila.bucketFinal == 'null' ? '' : fila.bucketFinal}</td>
                                        <td>{fila.cuota == 'null' ? '' : (new Intl.NumberFormat().format(fila.cuota))}</td>
                                        <td>{fila.mejora == 'null' ? '' : (new Intl.NumberFormat().format(fila.mejora))}</td>
                                        <td>{fila.cura == 'null' ? '' : (new Intl.NumberFormat().format(fila.cura))}</td>
                                        <td>{fila.sdoTotal == 'null' ? '' : (new Intl.NumberFormat().format(fila.sdoTotal))}</td>
                                        <td>{fila.sdoLiq == 'null' ? '' : (new Intl.NumberFormat().format(fila.sdoLiq))}</td>
                                        <td>{fila.frecuencia == 'null' ? '' : fila.frecuencia}</td>
                                        <td>{fila.plazo == 'null' ? '' : fila.plazo}</td>
                                        <td>{ultimoPago == 'NaN/NaN/NaN' ? '' : ultimoPago}</td>
                                        <td>{referencia.nombre == 'null' ? '' : referencia.nombre}</td>
                                        <td>{referencia.telCasa == 'null' ? '' : referencia.telCasa}</td>
                                        <td>{referencia.telCel == 'null' ? '' : referencia.telCel}</td>
                                        <td>{fila.Cliente.Direccion.calle == 'null' ? '' : fila.Cliente.Direccion.calle}</td>
                                        <td>{fila.Cliente.Direccion.colonia == 'null' ? '' : fila.Cliente.Direccion.colonia}</td>
                                        <td>{fila.Cliente.Direccion.municipio == 'null' ? '' : fila.Cliente.Direccion.municipio}</td>
                                        <td>{fila.Cliente.Direccion.estado == 'null' ? '' : fila.Cliente.Direccion.estado}</td>
                                        <td>{fila.Cliente.Direccion.cp == 'null' ? '' : fila.Cliente.Direccion.cp}</td>
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

export default Cartera;