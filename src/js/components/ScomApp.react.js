import React from "react";
import {IntlProvider} from "react-intl";
import {Router, browserHistory} from "react-router";
import NavigationBar from "./NavigationBar.react";
import Login from "./Login.react";
import LoginStore from "../stores/LoginStore";
import localeStoreInstance from "../stores/LocaleStore";
import Dashboard from "./Dashboard.react";
import scomSocketClientInstance from "../services/ScomSocketClient.js";


class ScomApp extends React.Component {

    constructor(props){
        super(props)
        this.state = this.getLocaleState()
        this.scomSocketClientInstance = scomSocketClientInstance
        this.localeData = localeStoreInstance.getLocaleData()
        this.changeListener = this.onChange.bind(this)
        localeStoreInstance.addChangeListener(this.changeListener)
        this.routeConfig = [
            {
                path: '/',
                component: NavigationBar,
                indexRoute: { onEnter: (nextState, replace) => replace('dashboard') },
                childRoutes: [
                    { path: 'login', component: Login },
                    { path: 'dashboard', component: Dashboard , onEnter: this.requireCred},
                ]
            }
        ];
    }

    getLocaleState() {
        return {
            locale: localeStoreInstance.getLocale()
        }
    }

    onChange() {
        console.log('onchange scom app new locale')
        this.setState(this.getLocaleState())
    }

    componentWillUnmount() {
        localeStoreInstance.removeChangeListener(this.changeListener)
    }

    requireCred(nextState, replace, next) {
        if(LoginStore.isLoggedIn()){
            // User is logged in
            // go to next
            next()
        } else {
            // User not logged in
            const nextPath = nextState.location.pathname
            LoginStore.setNextPath(nextPath)
            replace('/login')
            next()
        }
    }

    render() {
        let messages = this.localeData[this.state.locale]
        console.log('locale')
        console.log(messages)
        console.log(this.state.locale)
        return <IntlProvider locale={this.state.locale} messages={messages}>
            <Router history={browserHistory} routes={this.routeConfig}/>
        </IntlProvider>
    }

}

export default ScomApp
