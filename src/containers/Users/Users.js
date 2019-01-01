import React, { Component } from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    withStyles,
    FormGroup,
    Button, OutlinedInput, Select
} from '@material-ui/core';
import * as actions from "../../store/actions";
import connect from "react-redux/es/connect/connect";
import itemClasses from "../AddItem/AddItem.css";
import TextField from "@material-ui/core/TextField/TextField";
import EditIcon from '@material-ui/icons/Edit';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchUsers: [],
            users: [],
            editUser: null
        };

        this.handleEditChange = this.handleEditChange.bind(this);
        this.update = this.update.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

    }

    componentWillMount() {
        this.props.onFetchUsers(this.props.token, this.props.userId);
    }

    componentDidMount() {
        this.setState({users: this.props.users, searchUsers: this.props.users});
        console.log(this.state);
    }

    handleEditChange(e) {
        this.setState({editUser: {
            ...this.state.editUser, [e.target.name]: e.target.value
        }});
    }

    setEdit(user) {
        this.setState({editUser: user});
    }

    cancelEdit() {
        this.setState({editUser: null});
    }

    update(e) {
        e.preventDefault();
        this.props.updateUser(this.props.token, this.props.userId, this.state.editUser);
        this.setState({editUser: null});
    }

    render() {
        const { classes } = this.props;
        let container = null;
        if (this.state.editUser) {
            container = (
                <form onSubmit={this.update} className={classes.container} autoComplete="off">
                    <FormGroup>
                        <TextField
                            name="email"
                            label="Email"
                            className={classes.textField}
                            value={this.state.editUser.email}
                            margin="normal"
                            variant="outlined"
                            disabled
                        />
                        <Select
                            native
                            value={this.state.editUser.role}
                            onChange={this.handleEditChange}
                            input={
                                <OutlinedInput
                                    name="role"
                                    label="Role"
                                    labelWidth={0}
                                    id="outlined-age-native-simple"
                                />
                            }
                        >
                            <option value="noaccess">No Access</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superuser">Superuser</option>
                        </Select>
                    </FormGroup>
                    <Button onClick={this.cancelEdit} color="primary">Cancel</Button>
                    <Button type='submit' color="primary">Update</Button>
                </form>
            );
        } else if ( !this.props.loading && this.props.users ) {
            container = (<Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.users.map( (user) => {
                        return (
                            <TableRow key={user.id}>
                                <TableCell component="th" scope="row">
                                    {((user||{}).email||'')}
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                {this.props.userId !== user.id ?
                                    <TableCell>
                                        <EditIcon onClick={(e) => this.setEdit(user)} style={{cursor: 'pointer'}}
                                                  className={classes.icon}/>
                                    </TableCell> : <TableCell></TableCell>
                                }
                            </TableRow>
                        )
                    } )}
                </TableBody>
            </Table>);
        }
        return (
            <div style={{padding: '20px'}}>
                {container}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        users: state.user.users,
        loading: state.user.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUsers : (token, userId) => dispatch(actions.fetchUsers(token, userId)),
        updateUser : (token, userId, user) => dispatch(actions.updateUser(token, userId, user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(itemClasses)(Users));