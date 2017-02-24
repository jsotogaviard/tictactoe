import React from 'react'
import {FormattedMessage} from 'react-intl'
import {Image, Input, Button, Label, FormGroup, Col, Form, ControlLabel, FormControl} from 'react-bootstrap'
import scomActionsInstance from '../actions/ScomActions'

class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            user: '',
            password: ''
        }
    }

    onUserChange(user){
        this.state.user = user.target.value
    }

    onPasswordChange(password){
        this.state.password = password.target.value
    }

    login(e) {
        e.preventDefault()
        scomActionsInstance.login(this.state.user, this.state.password)
    }

    render() {
        let email = <FormattedMessage key="login.email" id="login.email"/>
        let welcome = <FormattedMessage key="login.welcome" id="login.welcome"/>
        let password = <FormattedMessage key="login.password" id="login.password"/>
        let signIn = <FormattedMessage key="login.signin" id="login.signin"/>
        return (
          <div className="landing-signin">
            <Form className="form-signin">
                <Image src="/img/snapcar.png" responsive />
                <FormGroup className="form-signin" controlId="formHorizontalEmail">
                  <ControlLabel>{email}</ControlLabel>
                  <FormControl
                    className="form-control"
                    type="email"
                    onChange={this.onUserChange.bind(this)}/>
                </FormGroup>
                <FormGroup className="form-signin" controlId="formHorizontalPassword">
                  <ControlLabel>{password}</ControlLabel>
                  <FormControl
                    className="form-control"
                    type="password"
                    onChange={this.onPasswordChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <Button
                            bsSize="large"
                            onClick={this.login.bind(this)}
                            block
                            >
                        {signIn}
                    </Button>
                </FormGroup>
            </Form>
          </div>
        )
    }

}

export default Login
