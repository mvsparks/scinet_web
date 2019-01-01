import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import * as actions from './store/actions/index';
import firebase from 'firebase';
import { config } from './firebase';

import Layout from "./containers/Layout";
import Logout from "./containers/Auth/Logout/Logout";
import Login from "./containers/Auth/Auth";
import AddItem from "./containers/AddItem/AddItem";
import Inventory from  "./containers/Inventory/Inventory";
import Users from "./containers/Users/Users";
import NoAccess from "./containers/NoAccess/NoAccess";
import Reports from "./containers/Reports/Reports";

firebase.initializeApp(config);

class App extends Component {
    componentDidMount () {
        this.props.onTryAutoSignup();
    }

    render() {
        let routes = (
          <Switch>
              <Route path="/Login" exact component={Login} />
              <Redirect to="/Login" />
          </Switch>
        );

        if ( this.props.isAuthenticated ) {
          routes = (
              <Switch>
                  <Route path="/Logout" exact component={Logout} />
                  {this.props.noAccess ? <Route path="/" exact component={NoAccess} /> : null }
                  {!this.props.noAccess ? <Route path="/" exact component={AddItem} /> : null }
                  {!this.props.noAccess ? <Route path="/Inventory" exact component={Inventory} /> : null }
                  {this.props.isSuperUser ? <Route path="/Users" exact component={Users} /> : null }
                  {this.props.isSuperUser ? <Route path="/Reports" exact component={Reports} /> : null }
                  <Redirect to="/" />
              </Switch>
          );
        }
        return (
            <Layout {...this.props}>
                {routes}
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isSuperUser: state.auth.role === 'superuser',
        isAdmin: state.auth.role === 'admin',
        noAccess: state.auth.role === 'noaccess',
        role: state.auth.role
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch( actions.authCheckState() )
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
