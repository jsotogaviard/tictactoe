                   import SocketClient from "socket.io-client";
import scomActionsInstance from "../actions/ScomActions";
import loginStoreInstance from "../stores/LoginStore";
import * as ScomConstants from "../constants/ScomConstants";         


class ScomSocketClient {

    constructor(scomActions, socketClient){
        this.socketClient = socketClient
        this.scomActions = scomActions
        this.login.bind(this)         
        this.registerListeners();
    }

    /**
     * Register listeners used for callback from the SCOM server
     */
    registerListeners() {
        // Notes           
        this.socketClient.on(ScomConstants.games, this.onGames.bind(this))
        this.socketClient.on(ScomConstants.game_details, this.onGameDetails.bind(this))
        this.socketClient.on(ScomConstants.play_game, this.onPlay.bind(this))}


    login(user, pwd){
        this.socketClient.on(ScomConstants.login, this.onLogin.bind(this))
        let hashPwd = pwd//crypto.createHash('sha256').update(pwd).digest('hex')
        let data = {user : user, password : hashPwd}
        console.log(data)
        this.socketClient.emit(ScomConstants.login, data)
    }

    onLogin(data){
        console.log(data);
        this.scomActions.onLogin(data)
    }


    games(){

        let token = loginStoreInstance.getToken()

        if(!token){
            this.scomActions.logout()
            return
        }

        console.log('get games')
        // start the data stream
        this.socketClient.emit(ScomConstants.games, {token: token})

    }

    onGames(data){
        console.log(data.games);
        this.scomActions.onGames(data.games)
    }

    goToGame(gameId){

        let token = loginStoreInstance.getToken()

        if(!token){
            this.scomActions.logout()
            return
        }

        console.log('get game ' + gameId)
        // start the data stream
        this.socketClient.emit(ScomConstants.game_details, {token: token, game_id: gameId})

    }

    onGameDetails(data){
        console.log(data);
        this.scomActions.onGameDetails(data)
    }

    play(gameId, rowIdx, columnIdx){

        let token = loginStoreInstance.getToken()

        if(!token){
            this.scomActions.logout()
            return
        }

        console.log('play game ' + gameId + ' row ' + rowIdx + ' column ' + columnIdx )

        this.socketClient.emit(ScomConstants.play_game, {token: token, game_id: gameId, row_id:rowIdx, column_id: columnIdx})
    }

    onPlay(data){
        this.scomActions.onPlay(data)
    }

    stopStream(){
        // stop the data stream
        this.socketClient.emit(ScomConstants.disconnect)
    }

}

const socketClientInstance = new SocketClient()
const scomSocketClientInstance = new ScomSocketClient(scomActionsInstance, socketClientInstance)
scomActionsInstance.setScomSocketClient(scomSocketClientInstance)
export default scomSocketClientInstance
