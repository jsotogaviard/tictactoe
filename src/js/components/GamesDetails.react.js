import React from "react";
import {Table, Glyphicon, Panel} from "react-bootstrap";
import scomActionsInstance from "../actions/ScomActions";

class GamesDetails extends React.Component {

    constructor(props){
        super(props)
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ transports: this.getTransports(nextProps) })
    // }

    play(gameId, rowIdx, columnIdx){
        scomActionsInstance.play(gameId, rowIdx, columnIdx)
    }

    render() {
        if (!this.props || !this.props.game_details || !this.props.game_details.game) {
            return <Table/>
        }else {
            let reactGamesDetails = []
            let gamesDetails = this.props.game_details.details
            let game = this.props.game_details.game.id
            let size = this.props.game_details.game.size;
            let table = [];
            for (let rowIdx = 0; rowIdx < size; rowIdx++) {

                let column = [];
                for (let columnIdx = 0; columnIdx < size; columnIdx++) {
                    let found = null;
                    for (let idx in gamesDetails) {
                        let gamesDetail = gamesDetails[idx]
                        if (gamesDetail.row_id == (rowIdx + 1) && gamesDetail.column_id == (columnIdx + 1)) {
                            found = gamesDetail;
                            break;
                        }
                    }
                    if (found) {
                        let userId = parseInt(found.user_id)
                        if(userId % 3 == 0){
                            column.push(<td><Glyphicon glyph="remove" /></td>)
                        } else if(userId % 3 == 1){
                            column.push(<td><Glyphicon glyph="star" /></td>)
                        } else if(userId % 3 == 2){
                            column.push(<td><Glyphicon glyph="heart" /></td>)
                        } else {
                            column.push(<td>{found.user_id}</td>)
                        }
                    } else {
                        column.push(<td onClick={this.play.bind(this, game, rowIdx + 1, columnIdx + 1)}>&nbsp;</td>)
                    }
                }
                table.push(<tr>{column}</tr>)
            }
            return (
                    <Table striped bordered condensed hover responsive>
                        <tbody>
                        {table}
                        </tbody>
                    </Table>
            )
        }
    }
}

export default GamesDetails
