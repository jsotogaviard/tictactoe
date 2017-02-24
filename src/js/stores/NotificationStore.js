import * as ScomConstants from '../constants/ScomConstants'
import AScomStore from './AScomStore'
import scomAppDispatcherInstance from '../dispatcher/ScomAppDispatcher'


class NotificationStore extends AScomStore {

  constructor(scomAppDispatcher) {
    super(scomAppDispatcher)
    this.alerts = []
  }

  onAction(action) {
    console.log('NotificationStore onAction')
    console.log(action)
    switch(action.action) {
        case 'notify':
            console.log('[notify] will notify user with message: ' + action.message)
            const newAlert = {
        			id: 'notify-'+Date.now(),
        			type: action.type,
        			message: action.message,
              timeout: 3000
        		}
            this.alerts.push(newAlert)
            super.emitChange()
            break
        default:
            break
    }
  }

  getAlerts() {
    return this.alerts
  }

  dismissAlert(alert) {
    const alerts = this.alerts
    const idx = alerts.indexOf(alert);
    if (idx >= 0) {
      this.alerts = [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
    }
    console.log(this.alerts)
  }

}

const instance = new NotificationStore(scomAppDispatcherInstance)
export default instance
