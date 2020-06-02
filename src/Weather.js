import React from 'react';
import axios from 'axios';

class Weather extends React.Component {
    constructor(){
        super();
        this.state = {
            weather: "Not yet gotten"
        }
    }

    getTiempo = () => {
        axios.get('/tiempo').then(response => {
            this.setState({
                weather: response.data.main.temp
            });
        });
    };

    render(){
        return(
            <div>
                <button onClick = {this.getTiempo} >Get weather!</button>
                <h1>The weather in monterrey is: {this.state.weather}</h1>
            </div>
        );
    }
}

export default Weather;