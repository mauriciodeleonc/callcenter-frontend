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
    }

    componentDidMount(){
        this.getCarteras();
    }

    getCarteras(){
        axios.get('/carteras').then(response => {
            console.log(response);
            this.setState({
                carteras: response.data.data
            });
        });
    }

    handleFileChosen(file, titulo){
        axios.post()
        const data = new FormData();
        data.append('file', file);
        data.append('nombre', titulo);
        const config = {
            method: 'post',
            url: 'http://localhost:4000/carteras',
            data: data
        };
        console.log(this);
        axios(config)
            .then((response) => {
                this.getCarteras();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render(){
        return(
            <>
                { this.props.usuario === 'Supervisor' ?
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
                                                            <p>{cartera.cantCreditos} clientes</p>
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