import React from "react";
import scomActionsInstance from "../actions/ScomActions";
import scomSocketClientInstance from "../services/ScomSocketClient";
import dataStoreInstance from "../stores/DataStore.js";
import GamesDetails from "./GamesDetails.react";
import Games from "./Games.react";
import Dialog from 'react-bootstrap-dialog'
import {Grid, Row, Col, Checkbox, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';


class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.computeState = this.computeState.bind(this)
        this.state = dataStoreInstance.getAll()

        dataStoreInstance.addChangeListener(this.computeState)

        scomSocketClientInstance.games()
    }

    computeState() {
        console.log("new state")
        this.setState(dataStoreInstance.getAll())
    }


    // componentWillReceiveProps(nextProps) {
    //     this.setState({ transports: this.getTransports(nextProps) })
    // }


    goToGame(gameId) {
        scomActionsInstance.goToGame(gameId)
    }

    render() {
        let gamesDetails = <GamesDetails game_details={this.state.game_details}/>
        let games = <Games games={this.state}/>
        return (
            <div>
                <Dialog ref='dialog' />
                <Row className="show-grid drivers-list">
                    <Col xs={1} sm={1} md={1} lg={1}/>
                    <Col xs={8} sm={8} md={5} lg={5}>
                        {games}
                    </Col>
                    <Col xs={8} sm={8} md={5} lg={5}>
                        {gamesDetails}
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={1}/>
                </Row>
            </div>
        )
    }
}

export default Dashboard
