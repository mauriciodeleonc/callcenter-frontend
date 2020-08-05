import React from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { 
    faUsers,
    faHeadset,
    faEye,
    faWallet,
    faFileAlt
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Navigation extends React.Component{
    render(){
        return(
            <Navbar expand="lg" style={{position: 'sticky', top: 0}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="flex-column">
                        {
                            this.props.usuario === 'admin' &&
                            <>
                                <Link to='/usuarios'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faUsers} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Usuarios
                                            </Col>
                                        </Row>
                                    </li>
                                </Link>
                                <Form onSubmit={() => this.props.logOut()} style={{marginTop: '82vh'}}>
                                    <Button variant='danger'  type='submit' onClick={() => this.props.logOut()} block>
                                        Cerrar sesión
                                    </Button>
                                </Form>
                            </>
                        }
                        {
                            this.props.usuario === 'ejecutivo' && 
                            <>
                                <Link to='/llamar'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faHeadset} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Llamar
                                            </Col>
                                        </Row>
                                    </li>
                                </Link>
                                <Form onSubmit={() => this.props.logOut()} style={{marginTop: '82vh'}}>
                                    <Button variant='danger'  type='submit' onClick={() => this.props.logOut()} block>
                                        Cerrar sesión
                                    </Button>
                                </Form>
                            </>
                        }
                        {
                            this.props.usuario === 'Supervisor' && 
                            <>
                                <Link to='/supervisiones'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faEye} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Supervisiones
                                            </Col>
                                        </Row>
                                    </li>
                                </Link>
                                <br />
                                {/*<Link to='/equipos'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faUsers} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Equipos
                                            </Col >
                                        </Row>
                                    </li>
                                </Link>
                                <br />*/}
                                <Link to='/carteras'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faWallet} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Carteras
                                            </Col>
                                        </Row>
                                    </li>
                                </Link>
                                <br />
                                <Link to='/reportes'>
                                    <li>
                                        <Row className='link-row'>
                                            <Col md={2} className='nav-col'>
                                                <FontAwesomeIcon icon={faFileAlt} />
                                            </Col>
                                            <Col className='nav-col'>
                                                Reportes
                                            </Col>
                                        </Row>
                                    </li>
                                </Link>
                                <br />
                                <Form onSubmit={() => this.props.logOut()} style={{marginTop: '57vh'}}>
                                    <Button variant='danger'  type='submit' onClick={() => this.props.logOut()} block>
                                        Cerrar sesión
                                    </Button>
                                </Form>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;