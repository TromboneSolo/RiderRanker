import React, { Component } from "react";
import ImageBattle from "../components/ImageBattle";




export default class MainLayout extends Component {
    constructor(props){
        super(props);

        this.state = {
            inBattle: false,
            imageCatalog : ["AGITO", "BLADE", 'FAIZ', 'KUUGA', 'RYUKI'],
            fighter1 : null,
            fighter2 : null,
            battleScore : []
        }

        this.nextBattle = this.nextBattle.bind(this);
        this.fetchNextFighters = this.fetchNextFighters.bind(this);
        this.onResult = this.onResult.bind(this);
    }

    componentDidMount(){ 
        this.nextBattle();  
    }

    componentWillUnmount(){
        // autosave
    }

    onQuit

    onResult(res){
        //capture the result
        // TBD
        // increment to next round
        //this.nextBattle();
    }

    fetchNextFighters()
    {
        // current logic - pull first two fighters
        var fighter1 = this.state.imageCatalog[0];
        var fighter2 = this.state.imageCatalog[1];
        return {fighter1: fighter1, fighter2: fighter2};
 
    }


    nextBattle(){
        var nextFighters = this.fetchNextFighters();
        this.setState({
            fighter1 : nextFighters.fighter1,
            fighter2 : nextFighters.fighter2
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



