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
        if(this.state.usuario === '' || this.state.contrasena === ''){
            alert('Asegurese de llenar correctamente todos los campos');
        } else {
            axios.post('/empleados/auth', {
                    usuario: this.state.usuario,
                    contrasena: this.state.contrasena
                }).then(({ data }) => {
                    const { rol, usuario } = data.data;
                    this.setState({
                        nivelUsuario: rol,
                        usuario
                    }, () => {
                        this.props.handleSession(this.state.nivelUsuario, this.state.usuario);
                    });
            }).catch(err => {
                alert("Revise que su usuario y contraseñas sean correctos");
            });
        }
    };
    
    handleUsuario(event){this.setState({usuario: event.target.value});}
    handleContrasena(event){this.setState({contrasena: event.target.value});}

    render(){
        console.log(this.props.usuario);
        if(this.props.usuario === 'Supervisor'){
            return <Redirect to='/supervisiones' />
        } else if(this.props.usuario === 'Admin'){
            return <Redirect to='/usuarios' />
        } else if(this.props.usuario === 'Ejecutivo'){
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