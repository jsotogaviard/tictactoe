import * as ScomConstants from '../constants/ScomConstants'
import AScomStore from './AScomStore'
import scomAppDispatcherInstance from '../dispatcher/ScomAppDispatcher'


class LoginStore extends AScomStore {

    constructor(scomAppDispatcher) {
        super(scomAppDispatcher)
        this.token = null
        this.apiurl = null
        this.nextPath = null
        this.id = null
        this.name = null
        this.user_type = null
    }

    onAction(action) {
      console.log('LoginStore onAction')
      console.log(action)
      switch(action.action) {
          case ScomConstants.login:
              this.token = action.data.token
              super.emitChange()
              break
          case ScomConstants.logout_user:
              this.user = null
              super.emitChange()
              break
          default:
              break
      }
    }

    getToken() {
        return this.token
    }

    getAPIURL() {
        return this.apiurl
    }

    getId() {
        return this.id
    }

    getUserType() {
        return this.user_type
    }

    getUsername() {
        return this.name
    }

    getNextPath(){
        return this.nextPath || '/'
    }

    setNextPath(nextPath){
        this.nextPath = nextPath
    }

    isLoggedIn() {
        return this.token != null
    }

    isAdmin() {
      return (this.user_type == 'admin') ? true : false
    }
}

const instance = new LoginStore(scomAppDispatcherInstance)
export default instance
