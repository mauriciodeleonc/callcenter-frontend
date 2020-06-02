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

    getCarteras(){
        axios.get('/getCantGestionesProducto').then(response => {
            //console.log(response);
            for(let i = 0; i < response.data[0].length; i++){
                this.setState({
                    carteras: {
                        ...this.state.carteras,
                        [response.data[0][i].nombre]: {
                            cantGestiones: response.data[0][i].gestiones,
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
    }

    render(){
        return(
            <>
                <h1>Reportes</h1>
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
                                                    <Button className='boton-morado-circular' disabled><FontAwesomeIcon icon={faFileAlt} /></Button>
                                                    <p>{this.state.carteras[cartera].cantGestiones} gestiones</p>
                                                </Col>
                                            </Row>
                                        </Card.Text>
                                        <Link to={`/reportes/${cartera}+${this.state.carteras[cartera].idCartera}`}>
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