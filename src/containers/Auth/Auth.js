import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import {Button, FormGroup, TextField} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
});

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirm_password: '',
            isSignup: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.switchAuthModeHandler = this.switchAuthModeHandler.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.isSignup && this.state.password !== this.state.confirm_password) {
            return;
        }

        this.props.onAuth( this.state.email, this.state.password, this.state.isSignup );
    }

    handleInputChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    switchAuthModeHandler = () => {
        this.setState( prevState => {
            return { isSignup: !prevState.isSignup };
        } );
    }

    render() {
        const { classes } = this.props;

        let errorMessage = null;

        if ( this.props.error ) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if ( this.props.isAuthenticated ) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        let form = (
            <form className="Form" onSubmit={this.handleSubmit}>
                <FormGroup>
                    <TextField
                        required
                        id="email"
                        label="Email"
                        className={classes.textField}
                        type="text"
                        margin="normal"
                        variant="outlined"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                    />
                    <TextField
                        required
                        id="password"
                        label="Password"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />
                </FormGroup>
                <Button type='button' color="default" onClick={this.switchAuthModeHandler}>Sign Up</Button>
                <Button type='submit' color="primary">Submit</Button>
            </form>
        );

        if (this.state.isSignup) {
            form = (
                <form className="Form" onSubmit={this.handleSubmit}>
                    <FormGroup>

                        <TextField
                            required
                            id="email"
                            label="Email"
                            className={classes.textField}
                            type="text"
                            margin="normal"
                            variant="outlined"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                        <TextField
                            required
                            id="password"
                            label="Password"
                            className={classes.textField}
                            type="password"
                            margin="normal"
                            variant="outlined"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                        <TextField
                            required
                            id="confirm_password"
                            label="Confirm Password"
                            className={classes.textField}
                            type="password"
                            margin="normal"
                            variant="outlined"
                            value={this.state.confirm_password}
                            onChange={this.handleInputChange}
                        />
                    </FormGroup>
                    <Button type='button' color="default" onClick={this.switchAuthModeHandler}>Cancel</Button>
                    <Button type='submit' color="primary">Submit</Button>
                </form>
            )
        }

        return (
          <div>
              {errorMessage}
              {form}
          </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
        onSetAuthRedirectPath: () => dispatch( actions.setAuthRedirectPath( '/' ) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withStyles(styles)(Auth) );