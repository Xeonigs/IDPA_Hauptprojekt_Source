import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { AuthProvider } from './components/Auth'
import { PrivateRoute, LoggedOutRoute } from './components/CustomRoute'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { Signup } from "./public_sites/Signup"
import { Login } from './public_sites/Login'
import { FinancialOverview } from './private_sites/FinancialOverview'
import { Predictor } from "./public_sites/Predictor";

export function App() {
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <PrivateRoute exact path='/overview' component={FinancialOverview} />
                    <LoggedOutRoute exact path="/signup" component={Signup} />
                    <LoggedOutRoute exact path="/login" component={Login} />
                    <Route exact path="/predictor" component={Predictor} />
                    <Route exact path="*" render={() => (<Redirect to="/login" />)} />
                </Switch>
            </AuthProvider>
        </Router>
    )
}