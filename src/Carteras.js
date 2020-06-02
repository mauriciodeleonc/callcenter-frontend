import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import readXlsxFile from 'read-excel-file';
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginRedirect from './LoginRedirect';
import { Link } from 'react-router-dom';
import axios from 'axios';

class AgregarCartera extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        nombre: '',
        excel: ''
      }
      this.handleAgregarCartera = this.handleAgregarCartera.bind(this);
      this.handleNombre = this.handleNombre.bind(this);
      this.handleExcel = this.handleExcel.bind(this);
    }
  
    handleAgregarCartera(event){
      event.preventDefault();
      console.log(this.state.excel);
      this.props.handleFileChosen(this.state.excel, this.state.nombre);
      this.props.onHide();
    }
  
    handleNombre(event){this.setState({nombre: event.target.value});}
    handleExcel(event){this.setState({excel: event.target.files[0]});}
  
    render(){
        return (
          <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Form onSubmit={this.handleAgregarCartera}>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Agregar cartera
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form.Group controlId="nombre">
                      <Form.Label>Nombre de la cartera</Form.Label>
                      <Form.Control 
                          type="text" 
                          value={this.state.nombre} 
                          onChange={this.handleNombre} 
                          placeholder="Nombre"
                          required 
                      />
                  </Form.Group>
                  <Form.Group controlId="cartera">
                        <Form.Label>Excel de cartera</Form.Label>
                        <input 
                            type = 'file'
                            id = 'file'
                            accept = '.xlsx'
                            onChange = {this.handleExcel}
                            required
                        />
                  </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={() => this.handleAgregarCartera}>
                    Agregar cartera
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        );
      }
    }

class Carteras extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            carteras: []
        }
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.getCarteras = this.getCarteras.bind(this);
        this.getIdEmpleado = this.getIdEmpleado.bind(this);
        this.insertProducto = this.insertProducto.bind(this);
        this.insertReferencia = this.insertReferencia.bind(this);
        this.insertDatosCliente = this.insertDatosCliente.bind(this);
        this.insertDatosCredito  = this.insertDatosCredito.bind(this);
        this.insertClienteEjecutivo = this.insertClienteEjecutivo.bind(this);
        this.insertDireccionCliente = this.insertDireccionCliente.bind(this);
        this.promisesRecursivos = this.promisesRecursivos.bind(this);
    }

    componentDidMount(){
        this.getCarteras();
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.carteras !== this.state.carteras){
            this.getCarteras();
        }
    }

    getCarteras(){
        axios.get('/getCarteras').then(response => {
            this.setState({
                carteras: response.data[0]
            });
        });
        console.log(this.state.carteras);
    }

    async getIdEmpleado(usuario){
        let id;
        let response = await axios.get(('/getIdEmpleado'), {
            params: {
                usuario: usuario
            }
        });
        id = response.data[0][0].idEmpleado;
        return id;
    }

    async insertProducto(titulo){
        let id;
        let response = await axios.post('/insertProducto', null, {
            params: {
                titulo: titulo
            }
        });
        id = response.data[0][0].idProducto;
        return id;
    }

    insertReferencia(idCliente, referencia){
        axios.post('/insertReferencia', null, {
            params: {
              idCliente: idCliente,
              nombre: referencia.nombre,
              telCasa: referencia.telCasa,
              telCel: referencia.telCel
            }
        });
    }

    async insertDatosCliente(idProducto, cliente){
        let id;
        let response = await axios.post('/insertCliente', null, {
            params: {
              idProducto: idProducto,
              nombre: cliente.nombre,
              telCasa: cliente.telCasa,
              telCel: cliente.telCel
            }
        });
        id = response.data[0][0].idCliente;
        return id;
    }
    
    insertDatosCredito(idCliente, credito){
        axios.post('/insertCredito', null, {
            params: {
              idCliente: idCliente,
              numCredito: credito.numCredito,
              estado: credito.estado,
              fechaOtorgado: credito.fechaOtorgado,
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
        });
    }

    insertClienteEjecutivo(idCliente, idEjecutivo){
        axios.post('/insertClienteEjecutivo', null, {
            params: {
              idCliente: idCliente,
              idEjecutivo: idEjecutivo
            }
        });
    }

    insertDireccionCliente(idCliente, direccionCliente){
        axios.post('/insertDireccion', null, {
            params: {
              idCliente: idCliente,
              calle: direccionCliente.calle,
              colonia: direccionCliente.colonia,
              municipio: direccionCliente.municipio,
              estado: direccionCliente.estado
            }
        });
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
            
            this.insertClienteEjecutivo(idCliente, idEjecutivo);
            direccionCliente = {
                calle: rows[i][38].toString(),
                colonia: rows[i][39].toString(),
                municipio: rows[i][40].toString(),
                estado: rows[i][41].toString()
            }
            this.insertDireccionCliente(idCliente, direccionCliente);

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

            this.insertDatosCredito(idCliente, datosCredito);

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
            this.insertReferencia(idCliente, referencia1);

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
            this.insertReferencia(idCliente, referencia2);

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
            this.insertReferencia(idCliente, referencia3);

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
            this.insertReferencia(idCliente, referencia4);

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
            this.insertReferencia(idCliente, referencia5);
        });
    }

    handleFileChosen(file, titulo){
        let datosCliente;
        let idCliente;
        let idProducto;
        
        readXlsxFile(file).then(async (rows) => {
            console.log(rows);
            idProducto = await this.insertProducto(titulo);
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
                this.insertDatosCliente(idProducto, datosCliente).then(idCliente => {
                    
                    this.promisesRecursivos(idCliente, rows, i);
                });
            } 
        });
        this.getCarteras();
    }

    render(){
        
        return(
            <>
                { this.props.usuario === 'supervisor' ?
                    <>
                        <h1>Carteras</h1>
                        
                            <Row>
                                <Col md={3} className='d-flex justify-content-center'>
                                    <Button 
                                        className='boton-agregar' 
                                        onClick={() => this.setState({modalAgregarShow: true})}
                                    >
                                        <FontAwesomeIcon icon={faWallet} size='3x' />
                                        <br></br>
                                        Agregar nueva cartera
                                    </Button>
                                </Col>
                            {this.state.carteras.map(cartera => {
                                return(
                                    <Col md={3} className='d-flex justify-content-center' key={cartera.idProducto}>
                                        <Card className='equipo'>
                                            <Card.Body className='text-center'>
                                                <Card.Title><b>{cartera.nombre.charAt(0).toUpperCase() + cartera.nombre.slice(1)}</b></Card.Title>
                                                <Card.Text>
                                                    <Row style={{marginTop: '45px'}}>
                                                        <Col>
                                                            <Button className='boton-morado-circular' disabled><FontAwesomeIcon icon={faWallet} /></Button>
                                                            <p>{cartera.clientes} clientes</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                                <Link to={`/carteras/${cartera.nombre}+${cartera.idProducto}`}>
                                                    <Button className='boton-morado' block>Ver más +</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                            </Row>
                            <AgregarCartera
                                show={this.state.modalAgregarShow}
                                onHide={() => this.setState({modalAgregarShow: false})}
                                handleFileChosen={this.handleFileChosen}
                            />
                        </>
                        :
                        <LoginRedirect />
                    }
            </>
        );
    }
}

export default Carteras;