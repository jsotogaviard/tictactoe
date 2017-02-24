import {dispatch} from '../dispatcher/ScomAppDispatcher'
import * as ScomConstants from '../constants/ScomConstants'
import { browserHistory } from 'react-router'
import LoginStore from '../stores/LoginStore'

class ScomActions {
  /**
   * System wide notification
   */
  notify(type, message) {
    dispatch({
      action: 'notify',
      type: type,
      message: message
    })
  }

    setScomSocketClient(scomSocketClientInstance){
        this.scomSocketClientInstance = scomSocketClientInstance
    }

    login(user, pwd){
        this.scomSocketClientInstance.login(user, pwd)
    }

    logout(){
        dispatch({
            action : ScomConstants.logout_user,
        })
        let nextPath = LoginStore.getNextPath()
        localStorage.removeItem('token')
        window.location.href = '/';
    }

    onLocaleChange(locale){
        dispatch({
            action : ScomConstants.locale_change,
            locale : locale
        })
    }

    onGames(games){
        dispatch({
            action : ScomConstants.games,
            data : games
        })
    }

    onLogin(data){
        console.log('onLogin ' + data)
        dispatch({
            action : ScomConstants.login,
            data : data,
        })

        let nextPath = LoginStore.getNextPath()
        LoginStore.setNextPath(null)
        console.log('nextPath ' + nextPath)
        browserHistory.push(nextPath)

        localStorage.setItem('token', data.token)

        // this.notify('success', 'Proceeding to dashboard')
    }

    onLoginError(error){
        dispatch({
            action : ScomConstants.login_error,
            error : error
        })
        this.notify('warning', 'Login failed')
    }

    goToGame(gameId) {
        this.scomSocketClientInstance.goToGame(gameId)
    }

    onGameDetails(data){
        dispatch({
            action : ScomConstants.game_details,
            data : data
        })
    }

    play(gameId, rowIdx, columnIdx) {
        this.scomSocketClientInstance.play(gameId, rowIdx, columnIdx)
    }

    onPlay(data){
        dispatch({
            action : ScomConstants.play_game,
            data : data
        })
    }
}

const scomActionsInstance = new ScomActions()
export default scomActionsInstance
