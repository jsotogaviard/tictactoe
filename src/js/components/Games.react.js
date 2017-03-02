import React from "react"
import {FormattedMessage} from "react-intl"
import {Table} from "react-bootstrap"
import {Grid, Row, Col, Checkbox, FormGroup, ControlLabel, FormControl, Panel} from 'react-bootstrap';
import scomSocketClientInstance from "../services/ScomSocketClient";
import dataStoreInstance from "../stores/DataStore.js";
import Game from "./Game.react";
import GamesDetails from "./GamesDetails.react";

class Games extends React.Component {

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ transports: this.getTransports(nextProps) })
    // }

    render() {

        if(!this.props || !this.props.games)
            return <Table/>

        // Headers
        let reactHeaders = []
        reactHeaders.push(<th key="id">
            <FormattedMessage key="game.id" id="game.id"/>
        </th>)
        reactHeaders.push(<th key="name">
            <FormattedMessage key="game.name" id="game.name"/>
        </th>)
        reactHeaders.push(<th key="arcade">
            <FormattedMessage key="game.arcade" id="game.arcade" />
        </th>)
        reactHeaders.push(<th key="size">
            <FormattedMessage key="game.size" id="game.size"/>
        </th>)
        reactHeaders.push(<th key="winner">
            <FormattedMessage key="game.winner" id="game.winner"/>
        </th>)
        reactHeaders.push(<th key="status">
            <FormattedMessage key="game.status" id="game.status"/>
        </th>)

        // Body
        let reactGames = []
        let games = this.props.games.games
        let choosenGame = -1
        if(this.props.games.game_details && this.props.games.game_details.game){
            choosenGame = this.props.games.game_details.game.id
        }

        for(let idx in games){
            let game = games[idx]
            reactGames.push(<Game game= {game} choosen_game = {choosenGame}/>)
        }

        return (
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        {reactHeaders}
                    </tr>
                    </thead>
                    <tbody>
                    {reactGames}
                    </tbody>
                </Table>
        )
    }
}

export default Games
