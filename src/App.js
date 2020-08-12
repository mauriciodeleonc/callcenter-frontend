import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Navigation from './Navigation';
import Llamar from './Llamar';
import Equipos from './Equipos';
import Carteras from './Carteras';
import Cartera from './Cartera';
import Supervisiones from './Supervisiones';
import Supervision from './Supervision';
import Reportes from './Reportes';
import Reporte from './Reporte';
import Usuarios from './Usuarios';
import Login from './Login';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import './fontawesome';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nivelUsuario: '',
      idUsuario: undefined
    }
    this.handleSession = this.handleSession.bind(this);
    this.logOut = this.logOut.bind(this);

    axios.defaults.baseURL = 'https://asinco.xyz'
    //axios.defaults.baseURL = '';
  }

  logOut(){
    this.setState({
      nivelUsuario: '',
      idUsuario: ''
    });
    localStorage.clear();
    return <Redirect to="/" />
  }
  
  componentDidMount = () => {
    //Revisar si ya inicio sesion o no, si no ha iniciado
    //entonces mandarlo a que inicie sesion.
    let nivelUsuario = localStorage.getItem('nivelUsuario');
    let idUsuario = localStorage.getItem('idUsuario');
    this.setState({
      nivelUsuario: nivelUsuario,
      idUsuario: idUsuario
    });
    //localStorage.clear();
  };

  handleSession(nivelUsuario, idUsuario) {
    this.setState({nivelUsuario: nivelUsuario, idUsuario: idUsuario});
    localStorage.setItem('nivelUsuario', nivelUsuario);
    localStorage.setItem('idUsuario', idUsuario); //Con esto pongo el tipo de usuario
  }

  render(){
    return (
      <Router>
        <Container fluid>
          <Switch>
            <Route exact path='/' render={(props)=> <Login {...props} handleSession={this.handleSession} usuario={this.state.nivelUsuario}/>}/>
            <Row className='full-height'>
              {this.state.nivelUsuario === 'Ejecutivo' ? 
              <Col md={12}>
                <Route path='/llamar' render={(props)=> <Llamar {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                {/*<Route path='/equipos' render={(props)=> <Equipos {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>*/}
                <Route exact path='/supervisiones' render={(props)=> <Supervisiones {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                <Route path='/supervisiones/:nombre' render={(props)=> <Supervision {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
                <Route exact path='/carteras' render={(props)=> <Carteras {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                <Route exact path='/reportes' render={(props)=> <Reportes {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                <Route path='/reportes/:nombre' render={(props)=> <Reporte {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
                <Route path='/usuarios' render={(props)=> <Usuarios {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                <Route path='/carteras/:nombre' render={(props)=> <Cartera {...props}  usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
              </Col>
              :
              <>
                <Col md={2} className='navigation'>
                <Navigation usuario={this.state.nivelUsuario} logOut={() => this.logOut()}/>
                </Col>
                <Col md={10}>
                  <Route path='/llamar' render={(props)=> <Llamar {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                  {/*<Route path='/equipos' render={(props)=> <Equipos {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>*/}
                  <Route exact path='/supervisiones' render={(props)=> <Supervisiones {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                  <Route path='/supervisiones/:nombre' render={(props)=> <Supervision {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
                  <Route exact path='/carteras' render={(props)=> <Carteras {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                  <Route exact path='/reportes' render={(props)=> <Reportes {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                  <Route path='/reportes/:nombre' render={(props)=> <Reporte {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
                  <Route path='/usuarios' render={(props)=> <Usuarios {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>}/>
                  <Route path='/carteras/:nombre' render={(props)=> <Cartera {...props} usuario={this.state.nivelUsuario} idUsuario={this.state.idUsuario}/>} />
                </Col>
              </>  
            }
              
            </Row>
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default App;
