import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { 
    faUsers, faUser
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginRedirect from './LoginRedirect';

class Equipos extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            equipos: [ 
                //Aqui hay un pequeño pedillo, el websocket me trae los conectados y en pausa, 
                //pero los desconectados se calculan de la resta entres el total de ejecutivos
                //en ese equipo y los conectados/pausa
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                },
                {
                    nombre: 'Afirme Hipotecario',
                    subgrupo: '0-30 dias mora',
                    cantEjecutivos: 20
                }
            ]
        }
    }

    render(){
        return(
            <>
                { this.props.usuario === 'supervisor' ?
                    <>
                        <h1>Equipos</h1>
                            <Row style={{marginTop: '20px'}}>
                                <Col>
                                    <Button className='boton-morado'>Cambiar ejecutivos de equipo</Button>
                                </Col>
                            </Row>
                            <Row style={{marginTop: '20px'}}>
                                <Col md={3} className='d-flex justify-content-center'>
                                    <Button className='boton-agregar'>
                                        <FontAwesomeIcon icon={faUsers} size='3x' />
                                        <br></br>
                                        Agregar nuevo equipo
                                    </Button>
                                </Col>
                            {this.state.equipos.map(equipo => {
                                return(
                                    <Col md={3} className='d-flex justify-content-center' key={equipo.subgrupo}>
                                        <Card className='equipo'>
                                            <Card.Body className='text-center'>
                                                <Card.Title><b>{equipo.nombre}</b></Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{equipo.subgrupo}</Card.Subtitle>
                                                <Card.Text>
                                                    <Row style={{marginTop: '20px'}}>
                                                        <Col>
                                                            <Button className='boton-morado-circular' disabled><FontAwesomeIcon icon={faUser} /></Button>
                                                            <p>{equipo.cantEjecutivos} ejecutivos</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                                <Button className='boton-morado' block>Ver mas +</Button>
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

export default Equipos;