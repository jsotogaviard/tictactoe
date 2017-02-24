import * as ScomConstants from '../constants/ScomConstants'
import scomAppDispatcherInstance from '../dispatcher/ScomAppDispatcher'
import ScomActionInstance from '../actions/ScomActions'
import AScomStore from './AScomStore'

class DataStore extends AScomStore{

    constructor(scomAppDispatcher) {
        super(scomAppDispatcher)
        this.games = {}
        this.gameDetails = {}
    }

    onAction(action){
        console.log('DataStore onAction')
        console.log(action)
        switch(action.action) {
            case ScomConstants.games:
                if(action.data)
                    this.games = action.data
                super.emitChange()
                break
            case ScomConstants.game_details:
                if(action.data)
                    this.gameDetails = action.data
                super.emitChange()
                break
            case ScomConstants.play_game:
                if(action.data) {

                    let game_update = action.data.game_update
                    let details_update = action.data.details_update

                    // Update the detailed view if necessary
                    if (this.gameDetails.game.id = game_update.id) {
                        this.gameDetails.game = game_update
                        this.gameDetails.details.push(details_update)
                    }

                    // Add the update of the game
                    let updatedIdx = -1
                    for (let idx in this.games) {
                        let game = this.games[idx]
                        if (game.game_id == game_update.id) {
                            updatedIdx = idx
                        }
                    }
                    if (updatedIdx != -1) {
                        let gameUpdate = this.mergeOptions(this.games[updatedIdx], game_update);
                        this.games.splice(updatedIdx, 1, gameUpdate)
                    }

                }
                super.emitChange()
                break
            case ScomConstants.new_game:
                if(action.data){
                    this.games.push(action.data.new_game)
                }
                super.emitChange()
                break
            default : // No op
        }
    }

    mergeOptions(obj1,obj2){
        let obj3 = {};
        for (let attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (let attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    getAll(){
        return {
            games :  this.games,
            game_details :  this.gameDetails
        }
    }
    // game_details : {game: , details:[]}
    // games : []

}
const instance = new DataStore(scomAppDispatcherInstance)
export default instance
