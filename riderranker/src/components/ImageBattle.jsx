import React, { Component } from "react";


export default class ImageBattle {
    constructor(props){
        super(props);

    }

    componentDidMount(){

    }
    render() {
        return(
            <div>
            <button onClick={this.props.onResult('fighter1')}
            id="leftFighter"
            ></button>
            <button
            id="bothButton" onClick={this.props.onResult('both')}
            ></button>
            <button onClick={this.props.onResult('neither')}
            id="neitherButton"
            ></button>
            <button
            id="rightFighter" onClick={this.props.onResult('fighter2')}
            ></button>
            </div>
        )
    }
}
