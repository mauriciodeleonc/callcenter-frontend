import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nivelUsuario: '',
            usuario: '',
            contrasena: ''
        }

        this.getEmpleado = this.getEmpleado.bind(this);
        this.handleUsuario = this.handleUsuario.bind(this);
        this.handleContrasena = this.handleContrasena.bind(this);
    }

    getEmpleado = (event) => {
        event.preventDefault();
        if(this.state.usuario == '' || this.state.contrasena == ''){
            alert('Asegurese de llenar correctamente todos los campos');
        } else {
            axios.get('/getEmpleado', {
                headers: {"Access-Control-Allow-Origin": "*"},
                params: {
                    usuario: this.state.usuario,
                    contrasena: this.state.contrasena
                }
            }).then(response => {
                if(response.data[0][0]){
                    this.setState({
                        nivelUsuario: response.data[0][0].rol.toLowerCase(),
                        idUsuario: response.data[0][0].idEmpleado
                    }, () => {
                        this.props.handleSession(this.state.nivelUsuario, this.state.idUsuario);
                    });
                } else {
                    alert('Su usuario o contraseña son incorrectos');
                }
            }).catch(err => {
                console.log(err.message);
            });
        }
    };
    
    handleUsuario(event){this.setState({usuario: event.target.value});}
    handleContrasena(event){this.setState({contrasena: event.target.value});}

    render(){
        if(this.props.usuario === 'supervisor'){
            return <Redirect to='/supervisiones' />
        } else if(this.props.usuario === 'admin'){
            return <Redirect to='/usuarios' />
        } else if(this.props.usuario === 'ejecutivo'){
            return <Redirect to='/llamar' />
        } else {
            return(
                <Row className='d-flex justify-content-center'>
                    <Col className='d-flex justify-content-center'>
                        <Card style={{ width: '25rem', marginTop: '17%', borderRadius: '15px'}}>
                            <Card.Body >
                                <Card.Title className='text-center'><b>Iniciar Sesión</b></Card.Title>
                                <Form onSubmit = {this.getEmpleado}>
                                    <Form.Group controlId="usuario">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={this.state.usuario} 
                                            onChange={this.handleUsuario} 
                                            placeholder="Usuario"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="contrasena">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            value={this.state.contrasena} 
                                            onChange={this.handleContrasena} 
                                            placeholder="Contraseña"
                                            required
                                        />
                                        <div className="text-right mt-3">
                                            <Button type='submit' onClick = {this.getEmpleado} className='boton-morado boton-login'>Iniciar sesión</Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            );
        }
    }
}

export default Login;