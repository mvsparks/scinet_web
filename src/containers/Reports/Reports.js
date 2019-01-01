import React, { Component } from 'react';
import * as actions from "../../store/actions";
import connect from "react-redux/es/connect/connect";
import {
    Table, FormControl, FormControlLabel, InputLabel,
    Select, OutlinedInput, Switch,
    TableHead, TableBody, TableRow, Checkbox,
    TableCell, withStyles, FormGroup, Button
} from '@material-ui/core';
import Wrapper from "../../components/Wrapper/Wrapper";
import EditIcon from "@material-ui/core/SvgIcon/SvgIcon";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: [],
            filter: ''
        };

        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentWillMount() {
        this.props.onFetchItems(this.props.token, this.props.userId);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props !== nextProps) {
            this.filterChange(null, nextProps.items);
        }
    }

    handleFilterChange(e) {
        this.setState({filter: e.target.value});
        this.filterChange(e.target.value);
    }

    filterChange(filter, items) {
        if (filter) {
            if (items) {
                this.setState(
                {
                    filteredItems: items.filter(item => {
                        const newDate = new Date(item.created_at);
                        return newDate.toLocaleDateString('en-US') === filter
                    })
                });
            } else {
                this.setState(
                {
                    filteredItems: this.props.items.filter(item => {
                        const newDate = new Date(item.created_at);
                        return newDate.toLocaleDateString('en-US') === filter
                    })
                });
            }
        } else {
            if (items) {
                this.setState({filteredItems: items});
            } else {
                this.setState({filteredItems: this.props.items});
            }
        }
    }

    render() {
        const { classes } = this.props;

        let options = (<option value=''>No Dates</option>);
        if (this.props.uniqueDates && this.props.uniqueDates.length) {
            options = [];
            options.push(<option key='default' value=''>Choose Date</option>);
            options = [...options, this.props.uniqueDates.map(date => <option key={date} value={date}>{date}</option>)];
            console.log('here', options)
        }

        return (
            <Wrapper>
                <Select
                    native
                    value={this.state.filter}
                    onChange={this.handleFilterChange}
                    input={
                        <OutlinedInput
                            name="filter"
                            labelWidth={0}
                            id="outlined-age-native-simple"
                        />
                    }
                >
                    {options}
                </Select>
                <p>Deployed: {this.state.filteredItems.length}</p>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Port</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.filteredItems.map( (item, index) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell data-label='MAC' component="th" scope="row">
                                        AP-{((item||{}).mac||'')}
                                    </TableCell>
                                    <TableCell>{item.location||''}</TableCell>
                                    <TableCell>{item.port||''}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.items,
        uniqueDates: state.item.uniqueDates,
        token: state.auth.token,
        userId: state.auth.userId,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchItems : (token, userId) => dispatch(actions.fetchItems(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Reports));