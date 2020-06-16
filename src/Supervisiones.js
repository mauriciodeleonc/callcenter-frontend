import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { 
    faHeadset,
    faPhoneSlash,
    faPause
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginRedirect from './LoginRedirect';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom';

let socket = io('https://callcenter-backend.herokuapp.com');
socket = io.connect();

class Supervisiones extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            carteras: [],
            room: 'ITCS'
        }
        this.getCarteras = this.getCarteras.bind(this);
    }

    getCarteras(){
        axios.get('/getCantEmpleadosProducto').then(response => {
            //console.log(response);
            for(let i = 0; i < response.data[0].length; i++){
                this.setState({
                    carteras: {
                        ...this.state.carteras,
                        [response.data[0][i].nombre]: {
                            countPausa: 0,
                            countLlamada: 0,
                            countDesconectados: response.data[0][i].empleados,
                            idCartera: response.data[0][i].idProducto
                        }
                    }
                });
            }
            //console.log(this.state.carteras);
        });
    }

    componentDidMount(){

        this.getCarteras();

        socket.on('connect', () => {
            this.setState({
                carteras: {
                    ...this.state.carteras,
                    [this.state.room]: {
                        ...this.state.carteras[this.state.room],
                        countPausa: 0,
                        countLlamada: 0,
                        countDesconectados: 0
                    }
                }
            });
            socket.emit('room', this.state.room);
            //console.log(this.state);
        });
        socket.on('message', (data) => {
            //console.log('En llamada:', data[this.state.room].countLlamada);
            //console.log('En pausa:', data[this.state.room].countPausa);

            //console.log(data.room);
            //console.log(data.estadoBoton);
            //console.log(this.state);
            
            
            switch(data.estadoBoton){
                case 'pausa':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countPausa: this.state.carteras[data.room].countPausa + 1,
                                countLlamada: this.state.carteras[data.room].countLlamada > 0 ? this.state.carteras[data.room].countLlamada - 1 : 0,
                                countDesconectados: this.state.carteras[data.room].countDesconectados > 0 ? this.state.carteras[data.room].countDesconectados - 1 : 0
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras[data.room]);
                    break;
                case 'predictivo':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countLlamada: this.state.carteras[data.room].countLlamada + 1,
                                countPausa: this.state.carteras[data.room].countPausa > 0 ? this.state.carteras[data.room].countPausa - 1 : 0,
                                countDesconectados: this.state.carteras[data.room].countDesconectados > 0 ? this.state.carteras[data.room].countDesconectados - 1 : 0
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras);
                    break;
                case 'manual':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countLlamada: this.state.carteras[data.room].countLlamada + 1,
                                countPausa: this.state.carteras[data.room].countPausa > 0 ? this.state.carteras[data.room].countPausa - 1 : 0,
                                countDesconectados: this.state.carteras[data.room].countDesconectados > 0 ? this.state.carteras[data.room].countDesconectados - 1 : 0
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras[data.room]);
                    break;
              }
        });

        socket.on('message-disconnect', (data) => {
            //console.log('En llamada:', data[this.state.room].countLlamada);
            //console.log('En pausa:', data[this.state.room].countPausa);

            //console.log(data.room);
            //console.log(data.estadoBoton);
            //console.log(this.state);
            
            
            switch(data.estadoBoton){
                case 'pausa':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countPausa: this.state.carteras[data.room].countPausa > 0 ? this.state.carteras[data.room].countPausa - 1 : 0,
                                countLlamada: this.state.carteras[data.room].countLlamada,
                                countDesconectados: this.state.carteras[data.room].countDesconectados + 1
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras[data.room]);
                    break;
                case 'predictivo':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countLlamada: this.state.carteras[data.room].countLlamada > 0 ? this.state.carteras[data.room].countLlamada - 1 : 0,
                                countPausa: this.state.carteras[data.room].countPausa,
                                countDesconectados: this.state.carteras[data.room].countDesconectados + 1
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras);
                    break;
                case 'manual':
                    this.setState({
                        carteras:{
                            ...this.state.carteras,
                            [data.room]: {
                                ...this.state.carteras[data.room],
                                countLlamada: this.state.carteras[data.room].countLlamada > 0 ? this.state.carteras[data.room].countLlamada - 1 : 0,
                                countPausa: this.state.carteras[data.room].countPausa,
                                countDesconectados: this.state.carteras[data.room].countDesconectados + 1
                            }
                        }
                    });
                    //carteras[data.room].countPausa = carteras[data.room].countPausa + 1;
                    //console.log(this.state.carteras[data.room]);
                    break;
              }
        });
    }

    render(){
        return(
            <>
                { this.props.usuario === 'supervisor' ?
                    <>
                        <h1>Supervisiones</h1>
                            <Row>
                            {Object.keys(this.state.carteras).map((cartera) => {
                                {console.log(this.state.carteras)}
                                return (
                                    <Col md={3} className='d-flex justify-content-center' key={cartera}>
                                        <Card className='equipo'>
                                            <Card.Body className='text-center'>
                                                <Card.Title><b>{cartera.charAt(0).toUpperCase() + cartera.slice(1)}</b></Card.Title>
                                                <Card.Text>
                                                    <Row style={{marginTop: '40px'}}>
                                                        <Col>
                                                            <Button className='boton-conectado' disabled><FontAwesomeIcon icon={faHeadset} /></Button>
                                                            <p>{this.state.carteras[cartera].countLlamada}</p>
                                                        </Col>
                                                        <Col>
                                                            <Button className='boton-pausa' disabled><FontAwesomeIcon icon={faPause} /></Button>
                                                            <p>{this.state.carteras[cartera].countPausa}</p>
                                                        </Col>
                                                        <Col>
                                                            <Button className='boton-desconectado' disabled><FontAwesomeIcon icon={faPhoneSlash} /></Button>
                                                            <p>{this.state.carteras[cartera].countDesconectados}</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                                <Link to={`/supervisiones/${cartera}+${this.state.carteras[cartera].idCartera}`}>
                                                    <Button className='boton-morado' block>Ver más +</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                            </Row>
                        </>
                        :
                        <LoginRedirect />
                    }
            </>
        );
    }
}

export default Supervisiones;