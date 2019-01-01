import React, { Component } from 'react';
import {TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Table, FormControl, InputLabel, Select, OutlinedInput,
    TableHead, TableBody, TableRow, Checkbox,
    TableCell, withStyles} from '@material-ui/core';
import * as actions from "../../store/actions";
import connect from "react-redux/es/connect/connect";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import itemClasses from "../AddItem/AddItem.css";
import Wrapper from "../../components/Wrapper/Wrapper";

class Tbl extends Component {

    render() {
        const { classes } = this.props;

        const container = this.state.searchItems.map( (item, index) => {
            return(
                <TableRow key={item.id}>
                    <TableCell data-label='MAC' component="th" scope="row">
                        AP-{((item || {}).mac || '')}
                    </TableCell>
                    <TableCell>{((item || {}).location || '')}</TableCell>
                    <TableCell>{(item || {}).port || ''}</TableCell>
                    <TableCell>{this.formatDate(item.created_at)}</TableCell>
                    <TableCell>{this.getUser(item.userId)}</TableCell>
                    <TableCell><Checkbox checked={item.joined} onChange={(e) => this.handleChange(e, index, 'joined')} value={(item || {}).joined.toString() || 'false'} /></TableCell>
                    <TableCell><Checkbox checked={item.complete} onChange={(e) => this.handleChange(e, index, 'complete')} disabled={!item.joined} value={(item || {}).complete.toString() || 'false'} /></TableCell>
                    <TableCell><EditIcon onClick={(e) => this.setEdit(item)} className={classes.icon}/></TableCell>
                    <TableCell><DeleteIcon className={classes.icon}/></TableCell>
                </TableRow>
            )
        });

        return (
            <Table className={classes.table} style={{margin: '20px'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Port</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Complete</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {container}
                </TableBody>
            </Table>
        );
    }
}

export default Tbl;