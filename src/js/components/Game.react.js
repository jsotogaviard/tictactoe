import React from "react";
import scomActionsInstance from "../actions/ScomActions";

class Game extends React.Component {

    constructor(props) {
        super(props)
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ transports: this.getTransports(nextProps) })
    // }


    goToGame(gameId) {
        scomActionsInstance.goToGame(gameId)
    }

    render() {

        if (this.props && this.props.game) {

            let choosenGame = this.props.choosen_game
            let message = ""
            if(choosenGame == this.props.game.game_id){
                message = "danger"
            }
            let id = this.props.game.id
            let gameId = id + '-game_id'
            let nameId = id + '-name'
            let sizeId = id + '-size'
            let arcadeId = id + '-arcade'
            let winnerId = id + '-winner'
            let statusId = id + '-status'

            return (<tr bsStyle={message} key={id} onClick={this.goToGame.bind(this, this.props.game.game_id)}>
                <td key={gameId}>{this.props.game.game_id}</td>
                <td key={nameId}>{this.props.game.name}</td>
                <td key={arcadeId}>{this.props.game.arcade}</td>
                <td key={sizeId}>{this.props.game.size}</td>
                <td key={winnerId}>{this.props.game.winner}</td>
                <td key={statusId}>{this.props.game.status}</td>
            </tr>)
        } else {
            return (<tr/>)
        }
    }
}

export default Game
