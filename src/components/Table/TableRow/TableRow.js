import React, { Component } from 'react';
import {Checkbox, TableCell, TableRow} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class TblRow extends Component {
    render() {
        const { classes } = this.props;
        const cells = this.props.map
        return (
            <TableRow key={this.props.item.id}>
                <TableCell data-label='MAC' component="th" scope="row">
                    AP-{((this.props.item || {}).mac || '')}
                </TableCell>
                <TableCell>{((this.props.item || {}).location || '')}</TableCell>
                <TableCell>{(this.props.item || {}).port || ''}</TableCell>
                <TableCell>{this.formatDate(this.props.item.created_at)}</TableCell>
                <TableCell>{this.getUser(this.props.item.userId)}</TableCell>
                <TableCell><Checkbox checked={this.props.item.joined} onChange={(e) => this.handleChange(e, index, 'joined')} value={(this.props.item || {}).joined.toString() || 'false'} /></TableCell>
                <TableCell><Checkbox checked={this.props.item.complete} onChange={(e) => this.handleChange(e, index, 'complete')} disabled={!this.props.item.joined} value={(this.props.item || {}).complete.toString() || 'false'} /></TableCell>
                <TableCell><EditIcon onClick={(e) => this.setEdit(this.props.item)} className={classes.icon}/></TableCell>
                <TableCell><DeleteIcon className={classes.icon}/></TableCell>
            </TableRow>
        );
    }
}

export default TblRow;