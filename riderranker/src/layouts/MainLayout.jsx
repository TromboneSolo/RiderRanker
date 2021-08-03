import React, { Component } from "react";
import ImageBattle from "./components/ImageBattle"




export default class MainLayout extends Component {
    constructor(props){
        super(props);

        state = {
            inBattle = false,
            imageCatalog = ["AGITO", "BLADE", 'FAIZ', 'KUUGA', 'RYUKI'],
            fighter1 = 'AGITO',
            fighter2 = 'BLADE',
            battleScore = []
        }
    }

    componentDidMount(){   
    }

    componentWillUnmount(){
        // autosave
    }

    onQuit

    onResult(res){
        //capture the result
        // TBD
        // increment to next round
        this.nextBattle();
    }


    nextBattle(){
        // find the index of the current fighter2
        fighter1Idx = this.state.imageCatalog.indexOf(this.state.fighter1);
        fighter2Idx = this.state.imageCatalog.indexOf(this.state.fighter2);
        var nextFighter2Idx = (fighter2Idx === this.state.imageCatalog.length) ? 0 : fighter2Idx++;
        var nextFighter1Idx = (this.state.imageCatalog[nextFighter2Idx] = this.state.fighter1) ?
             (fighter1Idx === this.state.imageCatalog.length) ? 0: fighter1Idx++
        : fighter1Idx;

        this.setState({
            fighter1 = this.state.imageCatalog[newFighter1Idx],
            fighter2 = this.state.imageCatalog[newFighter2Idx]
        })

    }





    render() {
        return (
            <div>
                <ImageBattle
                    fighter1 = {this.state.fighter1}
                    fighter2 = {this.state.fighter2}
                    onResult = {this.onResult}
                    onQuit = {this.onQuit}
                />
            </div>
        )
    }


}



