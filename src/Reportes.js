import React from 'react';
import Row from 'react-bootstrap/Row';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class Reportes extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            carteras: [],
        }
        this.getCarteras = this.getCarteras.bind(this);
    }

    getCarteras() {
        axios.get('/gestiones/cards').then(response => {
            this.setState({
                carteras: response.data.data
            });
        });
    }

    componentDidMount(){
        this.getCarteras();
    }

    render(){
        return(
            <>
                <h1>Reportes</h1>
                <Row>
                    {this.state.carteras.map((cartera) => {
                        return (
                            <Col md={3} className='d-flex justify-content-center' key={cartera.idCartera}>
                                <Card className='equipo'>
                                    <Card.Body className='text-center'>
                                        <Card.Title><b>{cartera.nombre.charAt(0).toUpperCase() + cartera.nombre.slice(1)}</b></Card.Title>
                                        <Card.Text>
                                            <Row style={{marginTop: '40px'}}>
                                                <Col>
                                                    <Button className='boton-morado-circular' disabled><FontAwesomeIcon icon={faFileAlt} /></Button>
                                                    <p>{cartera.n} gestiones</p>
                                                </Col>
                                            </Row>
                                        </Card.Text>
                                        <Link to={`/reportes/${cartera.nombre}+${cartera.idCartera}`}>
                                            <Button className='boton-morado' block>Ver más +</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </>
        );
    }
}

export default Reportes;