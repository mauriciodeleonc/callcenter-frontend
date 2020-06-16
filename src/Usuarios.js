import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LoginRedirect from './LoginRedirect';

class AgregarUsuario extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nombre: '',
      usuario: '',
      contrasena: '',
      rol: '',
      estado: 1
    }
    this.handleAgregarUsuario = this.handleAgregarUsuario.bind(this);
    this.handleNombre = this.handleNombre.bind(this);
    this.handleUsuario = this.handleUsuario.bind(this);
    this.handleContrasena = this.handleContrasena.bind(this);
    this.handleRol = this.handleRol.bind(this);
  }

  handleAgregarUsuario(event){
    event.preventDefault();
    let empleadoNuevo = {
      nombre: this.state.nombre,
      usuario: this.state.usuario,
      contrasena: this.state.contrasena,
      rol: this.state.rol,
      estado: this.state.estado
    }
    this.props.agregarUsuario(empleadoNuevo);
    this.props.onHide();
  }

  handleNombre(event){this.setState({nombre: event.target.value});}
  handleUsuario(event){this.setState({usuario: event.target.value});}
  handleContrasena(event){this.setState({contrasena: event.target.value});}
  handleRol(event){this.setState({rol: event.target.value});}


  render(){
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form onSubmit={this.handleAgregarUsuario}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Agregar nuevo usuario
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                      type="text" 
                      value={this.state.nombre} 
                      onChange={this.handleNombre} 
                      placeholder="Nombre"
                      required 
                  />
              </Form.Group>
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
              </Form.Group>
              <Form.Group controlId="rol">
                  <Form.Label><b>Rol</b></Form.Label>
                  <Form.Control as="select" onChange={this.handleRol} value={this.state.rol} required>
                      <option>Admin</option>
                      <option>Supervisor</option>
                      <option>Ejecutivo</option>
                  </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" onClick={() => this.handleAgregarUsuario}>
                  + Agregar usuario nuevo
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      );
    }
  }

class EditarUsuario extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      empleadoViejo: {
        idEmpleado: this.props.empleado.idEmpleado,
        nombre: this.props.empleado.nombre,
        usuario: this.props.empleado.usuario,
        contrasena: this.props.empleado.contrasena,
        rol: this.props.empleado.rol,
        estado: this.props.empleado.estado
      },
      empleadoNuevo: {
        idEmpleado: this.props.empleado.idEmpleado,
        nombre: '',
        usuario: '',
        contrasena: '',
        rol: '',
        estado: 1
      }
    }
    
    this.handleEditarUsuario = this.handleEditarUsuario.bind(this);
    this.handleNombre = this.handleNombre.bind(this);
    this.handleUsuario = this.handleUsuario.bind(this);
    this.handleContrasena = this.handleContrasena.bind(this);
    this.handleRol = this.handleRol.bind(this);
    this.handleEstado = this.handleEstado.bind(this);
  }

  handleEditarUsuario(event){
    event.preventDefault();
    if(this.state.empleadoNuevo.nombre == '' || this.state.empleadoNuevo.rol == '' || this.state.empleadoNuevo.usuario == '' || this.state.empleadoNuevo.contrasena == ''){
      alert('Revise que todos los campos hayan sido llenados correctamente');
    } else {
      let empleadoEditar = {
        idEmpleado: this.props.empleado.idEmpleado,
        nombre: this.state.empleadoNuevo.nombre,
        rol: this.state.empleadoNuevo.rol,
        usuario: this.state.empleadoNuevo.usuario,
        contrasena: this.state.empleadoNuevo.contrasena,
        estado: this.state.empleadoNuevo.estado
      }
      this.props.editarUsuario(empleadoEditar);
      this.props.onHide();
    }
  }

  handleNombre(event){
    if(this.props.empleado.nombre !== event.target.value){
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          nombre: event.target.value
        }
      });
    } else {
      this.setState({
        empleadoNuevo: {
          ...this.state.empleadoNuevo,
          nombre: this.props.empleado.nombre
        }
      });
    }
  }
  handleUsuario(event){
    if(this.props.empleado.usuario !== event.target.value){
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          usuario: event.target.value
        }
      });
    } else {
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          usuario: this.props.empleado.usuario
        }
      });
    }
  }
  handleContrasena(event){
    if(this.props.empleado.contrasena !== event.target.value){
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          contrasena: event.target.value
        }
      });
    } else {
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          contrasena: this.props.empleado.contrasena
        }
      });
    }
  }
  handleRol(event){
    if(this.props.empleado.rol !== event.target.value){
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          rol: event.target.value
        }
      });
    } else {
      this.setState({
        empleadoNuevo: {
          ...this.state.empleadoNuevo, 
          rol: this.props.empleado.rol
        }
      });
    }
  }
  handleEstado(event){
    if(this.props.empleado.estado !== event.target.value){
      this.setState({
        empleadoNuevo: { 
          ...this.state.empleadoNuevo,
          estado: event.target.value
        }
      });
    } else {
      this.setState({
        empleadoNuevo: {
          ...this.state.empleadoNuevo, 
          estado: this.props.empleado.estado
        }
      });
    }
  }


  render(){
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form onSubmit={this.handleEditarUsuario}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Editar usuario
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="nombre">
                    <Form.Label><b>Nombre</b></Form.Label>
                    <Form.Control 
                        type="text" 
                        value={this.state.empleadoNuevo.nombre} 
                        onChange={this.handleNombre} 
                        placeholder={this.props.empleado.nombre} 
                    />
                </Form.Group>
                <Form.Group controlId="usuario">
                    <Form.Label><b>Usuario</b></Form.Label>
                    <Form.Control 
                        type="text" 
                        value={this.state.empleadoNuevo.usuario} 
                        onChange={this.handleUsuario} 
                        placeholder={this.props.empleado.usuario}  
                    />
                </Form.Group>
                <Form.Group controlId="contrasena">
                    <Form.Label><b>Contraseña</b></Form.Label>
                    <Form.Control 
                        type="password" 
                        value={this.state.empleadoNuevo.contrasena} 
                        onChange={this.handleContrasena} 
                        placeholder={this.props.empleado.contrasena}   
                    />
                </Form.Group>
                <Form.Group controlId="rol">
                  <Form.Label><b>Rol</b></Form.Label>
                  <Form.Control as="select" onChange={this.handleRol} value={this.state.empleadoNuevo.rol} required>
                      <option>Admin</option>
                      <option>Supervisor</option>
                      <option>Ejecutivo</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="estado">
                  <Form.Label><b>Estado</b></Form.Label>
                  <Form.Control as="select" onChange={this.handleEstado} value={this.state.empleadoNuevo.estado} required>
                      <option>1</option>
                      <option>0</option>
                  </Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" onClick={() => this.handleEditarUsuario}>
                  Editar usuario
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      );
    }
  }

  class BorrarUsuario extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        empleadoBorrar: {
          nombre: this.props.empleado.nombre,
          usuario: this.props.empleado.usuario,
          rol: this.props.empleado.rol,
          estado: this.props.empleado.estado
        }
      }
      this.handleBorrarUsuario = this.handleBorrarUsuario.bind(this);
    }
  
    handleBorrarUsuario(){
      this.props.borrarUsuario(this.props.empleado);
      this.props.onHide();
    }
  
    render(){
        return (
          <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Borrar usuario
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='h3'>¿Estás seguro que deseas elminar al siguiente usuario?</p>
                <p><b>Nombre: </b>{this.props.empleado.nombre}</p>
                <p><b>Usuario: </b>{this.props.empleado.usuario}</p>
                <p><b>Rol: </b>{this.props.empleado.rol}</p>
                <p><b>Estado: </b>{this.props.empleado.estado == 1 ? 'Empleado' : 'Desempleado'}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleBorrarUsuario}>
                  Borrar usuario
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }
    }



class Usuarios extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            empleados: [],
            empleadoEditar: {},
            empleadoBorrar: {}
        }
        this.agregarUsuario = this.agregarUsuario.bind(this);
        this.borrarUsuario = this.borrarUsuario.bind(this);
        this.editarUsuario = this.editarUsuario.bind(this);
        this.getEmpleados = this.getEmpleados.bind(this);
    }

    getEmpleados(){
      axios.get('/getEmpleados').then(response => {
        //console.log(response.data);
        this.setState({
            empleados: response.data
        });
      });
    }

    componentDidMount(){
      this.getEmpleados();
    }

    agregarUsuario(empleadoNuevo){
      axios.post('/insertEmpleado', null, {
        params: {
          nombre: empleadoNuevo.nombre,
          rol: empleadoNuevo.rol,
          usuario: empleadoNuevo.usuario,
          contrasena: empleadoNuevo.contrasena, //Encriptar esta antes del desmadre
          estado: empleadoNuevo.estado
        }
      }).then(response => {
        this.getEmpleados();
      });     
    }

    editarUsuario(empleadoUpdate){
      axios.post('/updateEmpleado', null, {
        params: {
          idEmpleado: empleadoUpdate.idEmpleado,
          nombre: empleadoUpdate.nombre,
          rol: empleadoUpdate.rol,
          usuario: empleadoUpdate.usuario,
          contrasena: empleadoUpdate.contrasena, //Encriptar esta antes del desmadre
          estado: empleadoUpdate.estado
        }
      }).then(response => {
        this.getEmpleados();
      });
    }

    borrarUsuario(empleadoBorrar){
      console.log(empleadoBorrar);
      axios.post('/deleteEmpleado', null, {
        params: {
          usuario: empleadoBorrar.usuario
        }
      }).then(response => {
        this.getEmpleados();
      });
    }

    render(){
        return(
            <>
              { this.props.usuario === 'admin' ?
                <>
                  <h1>Usuarios</h1>
                  <Button 
                    className='boton-morado' 
                    onClick={() => this.setState({modalAgregarShow: true})}
                    style={{
                      margin: '10px 0 30px 0'
                    }}
                  >
                    Agregar nuevo usuario
                  </Button>
                  <Table striped hover responsive>
                      <thead>
                          <tr>
                              <th>Nombre</th>
                              <th>Usuario</th>
                              <th>Contraseña</th>
                              <th>Rol</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.empleados.map(empleado => {
                              return(
                                  <tr key={empleado.idEmpleado}>
                                      <td>{empleado.nombre}</td>
                                      <td>{empleado.usuario}</td>
                                      <td>***********</td>
                                      <td>{empleado.rol}</td>
                                      <td>{empleado.estado == '1' ? 'empleado' : 'desempleado'}</td>
                                      <td>
                                        <Button 
                                          onClick={() => this.setState({modalEditarShow: true, empleadoEditar: empleado})}
                                          className='boton-editar-usuario'
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button 
                                          onClick={() => this.setState({modalBorrarShow: true, empleadoBorrar: empleado})}
                                          className='boton-borrar-usuario'
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </Table>
                  <AgregarUsuario
                      show={this.state.modalAgregarShow}
                      onHide={() => this.setState({modalAgregarShow: false})}
                      agregarUsuario ={this.agregarUsuario}
                  />
                  <EditarUsuario
                      show={this.state.modalEditarShow}
                      onHide={() => this.setState({modalEditarShow: false})}
                      editarUsuario ={this.editarUsuario}
                      empleado  = {this.state.empleadoEditar}
                  />
                  <BorrarUsuario
                      show={this.state.modalBorrarShow}
                      onHide={() => this.setState({modalBorrarShow: false})}
                      borrarUsuario ={this.borrarUsuario}
                      empleado  = {this.state.empleadoBorrar}
                  />
                </>
                :
                <LoginRedirect />
              }
          </>
        );
    }
}

export default Usuarios;