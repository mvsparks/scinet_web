import React, {Component} from 'react';
import {Button, TextField, FormGroup} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import connect from "react-redux/es/connect/connect";
import itemClasses from './AddItem.css';
import * as actions from '../../store/actions/index';
import MessageBar from "../../components/MessageBar/MessageBar";

const initialState = {
    formData: {
        location: '',
        mac: '',
        port: ''
    }
};

class AddItem extends Component {

    constructor(props) {
        super(props);

        this.state = initialState;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleMacChange = this.handleMacChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onCreateItem(this.state.formData, this.props.token, this.props.userId, this.props.name);
    }

    handleInputChange(e) {
        this.setState({
            formData: {
                ...this.state.formData, [e.target.id]: e.target.value
            }
        })
    }

    handleMacChange(e) {
        let new_text = "";
        try {
            new_text = e.target.value.toUpperCase().substr(0, 4);
        } catch (e) {
            this.setState({
                formData: {
                    ...this.state.formData, [e.target.id]: ""
                }
            });
            return;
        }
        this.setState({
            formData: {
                ...this.state.formData, [e.target.id]: new_text
            }
        });
    }

    clearForm() {
        this.setState({...initialState});
    }

    render() {
        const { classes } = this.props;

        let successMessage = null;
        let errorMessage = null;

        if ( this.props.created ) {
            successMessage = (
                <MessageBar type='success' message='Successfully created item.' clearForm={this.clearForm} />
            );
        } else if (this.props.error) {
            errorMessage = (
                <MessageBar type='error' message={`${this.props.error.message}`} clearForm={this.clearForm} />
            );
        }

        return (
            <div style={{padding: '20px'}}>
                <form className="Form" onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <TextField
                            required
                            id="mac"
                            label="MAC Address"
                            placeholder="Last 4 digits"
                            className={classes.textField}
                            type="text"
                            margin="normal"
                            variant="outlined"
                            maxLength={4}
                            value={this.state.formData.mac}
                            onChange={this.handleMacChange}
                        />
                        <TextField
                            required
                            id="location"
                            label="Location"
                            placeholder="ex. Room 200, Hallway A"
                            className={classes.textField}
                            type="text"
                            margin="normal"
                            variant="outlined"
                            value={this.state.formData.location}
                            onChange={this.handleInputChange}
                        />
                        <TextField
                            id="port"
                            label="Port Number"
                            placeholder="ex. 105A"
                            className={classes.textField}
                            type="text"
                            margin="normal"
                            variant="outlined"
                            value={this.state.formData.port}
                            onChange={this.handleInputChange}
                        />
                    </FormGroup>

                    <Button type='submit' color="primary">Submit</Button>
                </form>
                {successMessage}
                {errorMessage}
            </div>

        );
    }

    componentWillUnmount() {
        this.props.onClearMessage();
    }
}

const mapStateToProps = state => {
    return {
        loading: state.item.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        name: state.auth.name,
        created: state.item.created,
        error: state.item.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCreateItem: (formData, token, userId, name) => dispatch(actions.checkForItem(formData, token, userId, name)),
        onClearMessage: () => dispatch(actions.clearMessage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(itemClasses)(AddItem));
