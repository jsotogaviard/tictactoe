import React from 'react'
import {FormattedMessage} from 'react-intl'
import {Glyphicon, Button, Label, FormGroup, Col, Form, ControlLabel, FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from 'react-bootstrap'
import { Link, withRouter } from 'react-router'
import LoginStore from '../stores/LoginStore'
import DataStore from '../stores/DataStore'
import scomActionsInstance from '../actions/ScomActions'

class NavigationBar extends React.Component {

    constructor() {
        super()
        this.state = this.getLoginState()
        this.changeListener = this.onChange.bind(this)
        LoginStore.addChangeListener(this.changeListener)
    }

    getLoginState() {
        return {
            userLoggedIn: LoginStore.isLoggedIn()
        }
    }

    onChange() {
        console.log('onchange scom app')
        this.setState(this.getLoginState())
    }

    componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener)
    }

    changeLocaleToUS(){
        this.changeLocaleTo('en-US')
    }

    changeLocaleToFr(){
        this.changeLocaleTo('fr-FR')
    }

    changeLocaleTo(locale){
        scomActionsInstance.onLocaleChange(locale)
    }

    render() {
        if(!LoginStore.isLoggedIn()){
            return <div className="detail">
                {this.props.children}
            </div>
        } else {
          let username = LoginStore.getUsername()
          let title = <FormattedMessage key="app.title" id="app.title"/>
          let logout = <Glyphicon glyph="log-out"/>
          let dashboard = <FormattedMessage key="app.dashboard" id="app.dashboard"/>
          let quality = <FormattedMessage key="app.quality" id="app.quality"/>
          let bookings = <FormattedMessage key="app.bookings" id="app.bookings"/>
          let reservations = <FormattedMessage key="app.reservations" id="app.reservations"/>
          let shifts = <FormattedMessage key="app.shifts" id="app.shifts"/>
          let history = <FormattedMessage key="app.history" id="app.history"/>
          let activity = <FormattedMessage key="app.activity" id="app.activity"/>
          let enUS = <FormattedMessage key="locale.en_us" id="locale.en_us"/>
          let frFR = <FormattedMessage key="locale.fr_fr" id="locale.fr_fr"/>
          let locale = <Glyphicon glyph="flag"/>
          let location = <Glyphicon glyph="map-marker"/>
          // Create links
          let links = []
          links.push(<NavItem eventKey={1}><Link to="/dashboard">{dashboard}</Link></NavItem>)
          if (LoginStore.isAdmin()) { links.push(<NavItem eventKey={2}><Link to="/quality">{quality}</Link></NavItem>) }
          links.push(<NavItem eventKey={3}><Link to="/bookings">{bookings}</Link></NavItem>)
          links.push(<NavItem eventKey={4}><Link to="/reservations">{reservations}</Link></NavItem>)
          if (LoginStore.isAdmin()) {
            links.push(<NavItem eventKey={5}><Link to="/shifts">{shifts}</Link></NavItem>)
            links.push(<NavItem eventKey={6}><Link to="/history">{history}</Link></NavItem>)
            links.push(<NavItem eventKey={7}><Link to="/activity">{activity}</Link></NavItem>)
          }
          // Actual render
          return <div>
              <Navbar>
                  <Navbar.Header>
                  </Navbar.Header>
                  <Nav pullRight>
                    <Navbar.Text>{username}</Navbar.Text>
                    <NavDropdown eventKey={2} title={locale} id="basic-nav-dropdown">
                      <MenuItem eventKey={2.1} onClick={this.changeLocaleToUS.bind(this)}>{enUS}</MenuItem>
                      <MenuItem eventKey={2.2} onClick={this.changeLocaleToFr.bind(this)}>{frFR}</MenuItem>
                    </NavDropdown>
                    <NavItem eventKey={1} onClick={this.logout}>{logout}</NavItem>
                  </Nav>
              </Navbar>
              <div className="detail">
                  {this.props.children}
              </div>
          </div>
        }
    }

    logout(e) {
        e.preventDefault()
        scomActionsInstance.logout()
    }
}

export default NavigationBar
