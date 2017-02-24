import React from 'react'
import ReactDOM from 'react-dom'
import ScomApp from './components/ScomApp.react'
import Alerter from './services/Alerter.react'
import ScomActions from './actions/ScomActions'
import jquery from 'jquery'

let token = localStorage.getItem('token')
if (token) {
    ScomActions.onLogin({
      token : token
    })
}

ReactDOM.render(
    <ScomApp/>,
    document.getElementById('scom')
)
