import React from 'react';
import { Link } from 'react-router-dom';

class LoginRedirect extends React.Component{
    render(){
        return(
            <>
                <h1>No tienes autorización para ver este contenido.</h1>
                <h2>Inicia sesión  <Link to='/'>aquí.</Link></h2>
            </>
        );
    }
}

export default LoginRedirect;