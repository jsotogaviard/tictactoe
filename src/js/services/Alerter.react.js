/**
 * Bootstrap styled notifier
 *
 * This obect handles on-screen notifications. The available levels are: info,
 * warning, danger, or success
 */

import React from "react"
import ReactDOM from "react-dom"
import { AlertList } from "react-bs-notifier"
import NotificationStore from '../stores/NotificationStore'

class Alerter extends React.Component {

  constructor(props) {
		super(props)
		this.state = {
			position: "top-right",
			alerts: [],
			timeout: 3000
		}
    NotificationStore.addChangeListener(this._onChange.bind(this))
	}

  _onChange() {
    // Merge alert with the current state
    this.setState({ alerts: NotificationStore.getAlerts() })
    // Remove from store, so we won't get it another time
    for (let a of this.state.alerts) {
      NotificationStore.dismissAlert(a)
    }
  }

  onAlertDismissed(a) {
    // Remove from this instance
    const alerts = this.state.alerts;
    const idx = alerts.indexOf(a);
    if (idx >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
      })
    }
	}

  render() {
    return (
      <AlertList
				position={this.state.position}
				alerts={this.state.alerts}
				timeout={this.state.timeout}
				dismissTitle="Close"
				onDismiss={this.onAlertDismissed.bind(this)}
			/>
    )
  }

}

export default Alerter
