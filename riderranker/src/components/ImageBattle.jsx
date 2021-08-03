import React, { Component } from "react";


export default class ImageBattle extends React.Component{
    constructor(props){
        super(props);

    }






    render() {
        if (this.props.fighter1)
        {
            var fighter1ImgSrc = require('../assets/images/' + this.props.fighter1 + '.png');
            var fighter2ImgSrc = require('../assets/images/' + this.props.fighter2 + '.png');
        }

        return(
            (this.props.fighter1) ?
            <div>
            <button 
                style = {{background: `url(${fighter1ImgSrc})`}}
                onClick={this.props.onResult('fighter1')}
                id="leftFighter"
            />
            <button
            id="bothButton" onClick={this.props.onResult('tie')}
            ></button>
            <button
                            style = {{background: `url(${fighter2ImgSrc})`}}
                id="rightFighter" 
                onClick={this.props.onResult('fighter2')}
            />
            </div>
            : <span/>
        )
    }
}
