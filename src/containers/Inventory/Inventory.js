import React, { Component } from 'react';
import {
    Table, FormControl, FormControlLabel, InputLabel,
    Select, OutlinedInput, Switch,
    TableHead, TableBody, TableRow, Checkbox,
    TableCell, withStyles, FormGroup, Button, Tooltip, TableSortLabel
} from '@material-ui/core';
import * as actions from "../../store/actions";
import connect from "react-redux/es/connect/connect";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import itemClasses from "../AddItem/AddItem.css";
import Wrapper from "../../components/Wrapper/Wrapper";
import AlertDialog from "../../components/Alert/Alert";

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

class Inventory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchItems: [],
            filter: 'all',
            editItem: null,
            deleteItem: null,
            open: false,
            search: '',
            currentSort: null,
            sortType: 0,
            direction: ['asc', 'desc']
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleMacChange = this.handleMacChange.bind(this);
        this.update = this.update.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.setDelete = this.setDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.sortItems = this.sortItems.bind(this);
    //    Joined, complete Counter
    //    Counter for left on tear down
    //    Deployed
    }

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    componentWillMount() {
        this.props.onFetchItems(this.props.token, this.props.userId);
        this.props.checkMode();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props !== nextProps) {
            console.log('RECIEVE PROPS');
            this.filterChange(null, nextProps.items);
        }
    }

    handleSearchChange(e) {
        this.setState({
           search: e.target.value
        });
        const value = e.target.value;
        if (!value) {
            this.setState({
                searchItems: this.props.items
            });
            return;
        }
        const items = this.props.items.filter(item => {
            return item['mac'].toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                    item['location'].toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                        item['port'].toLowerCase().indexOf(value.toLowerCase()) > -1
        });
        this.setState({
            searchItems: items
        })
    }

    filterChange(filter, items) {
        if (this.state.search) {
            return;
        }
        if (filter) {
            if (filter === 'completed') {
                this.setState({searchItems: this.props.items.filter(item => item.complete)});
            } else if (filter === 'joined') {
                this.setState({searchItems: this.props.items.filter(item => item.joined)});
            } else if (filter === 'joinedNotComplete') {
                this.setState({searchItems: this.props.items.filter(item => item.joined && !item.complete)});
            } else if (filter === 'not') {
                this.setState({searchItems: this.props.items.filter(item => !item.joined)});
            } else if (filter === 'notCheckedIn') {
                this.setState({searchItems: this.props.items.filter(item => !item.checkedIn)});
            } else if (filter === 'checkedIn') {
                this.setState({searchItems: this.props.items.filter(item => item.checkedIn)});
            } else {
                this.setState({searchItems: this.props.items})
            }
        } else if (items) {
            if (this.state.filter === 'completed') {
                this.setState({searchItems: items.filter(item => item.complete)});
            } else if (this.state.filter === 'joined') {
                this.setState({searchItems: items.filter(item => item.joined)});
            } else if (this.state.filter === 'joinedNotComplete') {
                this.setState({searchItems: items.filter(item => item.joined && !item.complete)});
            } else if (this.state.filter === 'not') {
                this.setState({searchItems: items.filter(item => !item.joined)});
            } else if (filter === 'notCheckedIn') {
                this.setState({searchItems: items.filter(item => !item.checkedIn)});
            } else if (filter === 'checkedIn') {
                this.setState({searchItems: items.filter(item => item.checkedIn)});
            } else {
                this.setState({searchItems: items})
            }
        } else {
            if (this.state.filter === 'completed') {
                this.setState({searchItems: this.props.items.filter(item => item.complete)});
            } else if (this.state.filter === 'joined') {
                this.setState({searchItems: this.props.items.filter(item => item.joined)});
            } else if (this.state.filter === 'joinedNotComplete') {
                this.setState({searchItems: this.props.items.filter(item => item.joined && !item.complete)});
            } else if (this.state.filter === 'not') {
                this.setState({searchItems: this.props.items.filter(item => !item.joined)});
            } else if (filter === 'notCheckedIn') {
                this.setState({searchItems: this.props.items.filter(item => !item.checkedIn)});
            } else if (filter === 'checkedIn') {
                this.setState({searchItems: this.props.items.filter(item => item.checkedIn)});
            } else {
                this.setState({searchItems: this.props.items});
            }
        }

        this.setState({
            search: ''
        });
    }

    handleMacChange(e) {
        let new_text = "";
        try {
            new_text = e.target.value.toUpperCase().substr(0, 4);
        } catch (e) {
            this.setState({
                formData: {
                    ...this.state.editItem, [e.target.name]: ""
                }
            });
            return;
        }
        this.setState({editItem: {
            ...this.state.editItem, [e.target.name]: new_text
        }});
    }

    getUser(id) {
        const email = '';

        const user = this.props.users.filter(user => user.id === id);

        if (user.length) {
            return user[0].name;
        }

        return '';
    }

    formatDate(date) {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('en-US')
    }

    componentDidMount() {
        this.setState({searchItems: this.props.items});
    }

    handleChange(e, index, type) {
        const items = this.state.searchItems;
        console.log(items[index].joined);
        if (type === 'joined') {
            if (items[index].complete){
                items[index].complete = false;
            }
            items[index].joined = !items[index].joined;
        } else if (type === 'complete' && items[index].joined) {
            items[index].complete = !items[index].complete;
        }

        if (type === 'checkedIn') {
            items[index].checkedIn = !items[index].checkedIn;
        }

        this.props.updateItem(this.props.token, this.props.userId, items[index]);
        this.setState({searchItems: items});
        this.filterChange();
    }

    handleEditChange(e) {
        this.setState({editItem: {
            ...this.state.editItem, [e.target.name]: e.target.value
        }});
    }

    handleModeChange(e) {
        let mode = this.props.mode;

        if (mode === 'Setup') {
            mode = 'Tear Down';
        } else {
            mode = 'Setup';
        }
        this.props.updateMode(mode);
        this.filterChange('all', null);
    }

    setEdit(item) {
        this.setState({editItem: item});
    }

    cancelEdit() {
        this.setState({editItem: null});
    }

    update(e) {
        e.preventDefault();
        this.props.updateItem(this.props.token, this.props.userId, this.state.editItem);
        this.setState({editItem: null});
    }

    handleFilterChange(e) {
        this.setState({filter: e.target.value});
        this.filterChange(e.target.value);
    }

    setDelete(item) {
        this.setState({
            deleteItem: item,
            open: true
        })
    }

    handleClose() {
        this.setState({
            deleteItem: null,
            open: false
        });
    }

    handleDelete() {
        this.props.deleteItem(this.props.token, this.props.userId, this.state.deleteItem);
        this.setState({deleteItem: null});
        this.handleClose();
    }

    handleSort(type) {
        this.setState({searchItems: this.sortItems(this.state.searchItems, type)});
    }

    sortItems(array, type) {
        const sortItems = array;
        if (type === this.state.currentSort) {
            const sortType = this.state.sortType === 1 ? 0 : 1;
            this.setState({sortType, currentSort: type});
            if (sortType) {
                return sortItems.sort((a,b) => (a[type] > b[type]) ? 1 : (a[type] < b[type]) ? -1 : 0);
            } else {
                return sortItems.sort((a,b) => (a[type] < b[type]) ? 1 : (a[type] > b[type]) ? -1 : 0);
            }
        } else {
            this.setState({sortType: 0, currentSort: type});
            return sortItems.sort((a,b) => (a[type] < b[type]) ? 1 : (a[type] > b[type]) ? -1 : 0);
        }
    }

    render() {
        const { classes } = this.props;
        let container = null;

        if (this.state.editItem) {
            container = (
                <form onSubmit={this.update} className={classes.container} autoComplete="off">
                    <FormGroup>
                        <TextField
                            name="mac"
                            label="Mac"
                            className={classes.textField}
                            value={this.state.editItem.mac}
                            onChange={this.handleMacChange}
                            placeholder="Last 4 digits"
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            name="location"
                            label="Location"
                            className={classes.textField}
                            value={this.state.editItem.location}
                            onChange={this.handleEditChange}
                            placeholder="ex. Room 200, Hallway A"
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            name="port"
                            label="Port"
                            className={classes.textField}
                            value={this.state.editItem.port}
                            onChange={this.handleEditChange}
                            placeholder="ex. 105A"
                            margin="normal"
                            variant="outlined"
                        />
                    </FormGroup>
                    <Button onClick={this.cancelEdit} color="primary">Cancel</Button>
                    <Button type='submit' color="primary">Update</Button>
                </form>
            );
        } else if ( !this.props.loading && this.state.searchItems ) {
            container = (
                <Wrapper >
                    <div style={{display: 'flex'}}>
                        { ['admin', 'superuser'].indexOf(this.props.role) > -1 ?
                            <FormControl variant="outlined" style={{margin: '0px'}} className={classes.formControl}>
                                <InputLabel
                                    ref={ref => {
                                        this.InputLabelRef = ref;
                                    }}
                                    style={{padding: '0 5px', background: 'white'}}
                                    htmlFor="outlined-age-native-simple"
                                >
                                    Filter
                                </InputLabel>
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
                                    { this.props.mode === 'Setup' ?
                                        <Wrapper>
                                            <option value="all">All</option>
                                            <option value="not">Not Joined</option>
                                            <option value="joined">Joined</option>
                                            <option value="joinedNotComplete">Joined Not Complete</option>
                                            <option value="completed">Completed</option>
                                        </Wrapper> :
                                         <Wrapper>
                                             <option value="all">All</option>
                                             <option value="notCheckedIn">Not Checked In</option>
                                             <option value="checkedIn">Checked In</option>
                                        </Wrapper>
                                     }
                                </Select>
                            </FormControl> : null }
                        {
                            this.props.mode === 'Setup' ?
                            <div style={{width: '100%', display: 'inline-flex', alignItems: 'center'}}>
                                <p style={{paddingLeft: '10px'}}>
                                    Deployed: {this.props.items.length}
                                </p>
                                <p style={{paddingLeft: '10px'}}>
                                    Joined: {this.props.items.filter(item => item.joined).length}
                                </p>
                                <p style={{paddingLeft: '10px'}}>
                                    Completed: {this.props.items.filter(item => item.complete).length}
                                </p>
                            </div> :
                            <div style={{width: '100%', display: 'inline-flex', alignItems: 'center'}}>
                                <p style={{paddingLeft: '10px'}}>
                                    Deployed: {this.props.items.length}
                                </p>
                                <p style={{paddingLeft: '10px'}}>
                                    Checked In: {this.props.items.filter(item => item.checkedIn).length}
                                </p>
                            </div>
                        }
                    </div>
                    <div style={{width: '100%', display: 'inline-flex', alignItems: 'center'}}>
                        <TextField
                            name="search"
                            label="Search"
                            className={classes.textField}
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                            placeholder="Enter mac, port or location"
                            margin="normal"
                            variant="outlined"
                        />
                        <div style={{width: '100%', display: 'flex', alignItems: 'center'}}></div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.mode === 'Tear Down'}
                                    onChange={this.handleModeChange}
                                    value={this.props.mode === 'Tear Down'}
                                />
                            }
                            label={this.props.mode}
                        />
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell onClick={() => this.handleSort('mac')}>
                                    <Tooltip
                                        title="Sort"
                                        placement='bottom-end'
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={this.state.currentSort === 'mac'}
                                            direction={this.state.direction[this.state.sortType]}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell onClick={() => this.handleSort('location')}>
                                    <Tooltip
                                        title="Sort"
                                        placement='bottom-end'
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={this.state.currentSort === 'location'}
                                            direction={this.state.direction[this.state.sortType]}
                                        >
                                            Location
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell onClick={() => this.handleSort('port')}>
                                    <Tooltip
                                        title="Sort"
                                        placement='bottom-end'
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={this.state.currentSort === 'port'}
                                            direction={this.state.direction[this.state.sortType]}
                                        >
                                            Port
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                { this.props.mode === 'Tear Down' ?
                                    <TableCell onClick={() => this.handleSort('checkedIn')}>
                                        <Tooltip
                                            title="Sort"
                                            placement='bottom-end'
                                            enterDelay={300}
                                        >
                                            <TableSortLabel
                                                active={this.state.currentSort === 'checkedIn'}
                                                direction={this.state.direction[this.state.sortType]}
                                            >
                                                Checked In
                                            </TableSortLabel>
                                        </Tooltip>
                                    </TableCell> : null }
                                { ['admin', 'superuser'].indexOf(this.props.role) > -1 && this.props.mode === 'Setup' ?
                                    <Wrapper>
                                        <TableCell onClick={() => this.handleSort('created_at')}>
                                            <Tooltip
                                                title="Sort"
                                                placement='bottom-end'
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={this.state.currentSort === 'created_at'}
                                                    direction={this.state.direction[this.state.sortType]}
                                                >
                                                    Created At
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell onClick={() => this.handleSort('created_by')}>
                                            <Tooltip
                                                title="Sort"
                                                placement='bottom-end'
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={this.state.currentSort === 'created_by'}
                                                    direction={this.state.direction[this.state.sortType]}
                                                >
                                                    Created By
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell onClick={() => this.handleSort('joined')}>
                                            <Tooltip
                                                title="Sort"
                                                placement='bottom-end'
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={this.state.currentSort === 'joined'}
                                                    direction={this.state.direction[this.state.sortType]}
                                                >
                                                    Joined
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell onClick={() => this.handleSort('complete')}>
                                            <Tooltip
                                                title="Sort"
                                                placement='bottom-end'
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={this.state.currentSort === 'complete'}
                                                    direction={this.state.direction[this.state.sortType]}
                                                >
                                                    Complete
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </Wrapper> : <TableCell></TableCell>}
                                { ['admin', 'superuser'].indexOf(this.props.role) > -1 && this.props.mode === 'Setup' ?
                                    <TableCell></TableCell> : null }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.searchItems.map( (item, index) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell data-label='MAC' component="th" scope="row">
                                            AP-{((item||{}).mac||'')}
                                        </TableCell>
                                        <TableCell>{item.location||''}</TableCell>
                                        <TableCell>{item.port||''}</TableCell>
                                        { this.props.mode === 'Tear Down' ?
                                            <TableCell>
                                                <Checkbox checked={item.checkedIn} onChange={(e) => this.handleChange(e, index, 'checkedIn')} value={item.checkedIn ? item.checkedIn.toString() : 'false'} />
                                            </TableCell> : null }
                                        { ['admin', 'superuser'].indexOf(this.props.role) > -1 && this.props.mode === 'Setup' ?
                                            <Wrapper>
                                                <TableCell>{this.formatDate(item.created_at)}</TableCell>
                                                <TableCell>{item.created_by||''}</TableCell>
                                                <TableCell><Checkbox checked={item.joined} onChange={(e) => this.handleChange(e, index, 'joined')} value={item.joined ? item.joined.toString() : 'false'} /></TableCell>
                                                <TableCell><Checkbox checked={item.complete} onChange={(e) => this.handleChange(e, index, 'complete')} disabled={!item.joined} value={item.complete ? item.complete.toString() : 'false'} /></TableCell>
                                            </Wrapper> : null }
                                        <TableCell><EditIcon onClick={(e) => this.setEdit(item)} style={{cursor: 'pointer'}} className={classes.icon}/></TableCell>
                                        { ['admin', 'superuser'].indexOf(this.props.role) > -1 && this.props.mode === 'Setup'  ?
                                            <TableCell>
                                                <DeleteIcon onClick={(e) => this.setDelete(item)} style={{cursor: 'pointer'}} className={classes.icon}/>
                                            </TableCell> : null }
                                    </TableRow>
                                )

                            })}
                        </TableBody>
                    </Table>
                    {this.state.open ? <AlertDialog handleDelete={this.handleDelete} handleClose={this.handleClose}/> : null}
                </Wrapper>
                );
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
        items: state.item.items,
        loading: state.item.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        role: state.auth.role,
        mode: state.item.mode
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchItems : (token, userId) => dispatch(actions.fetchItems(token, userId)),
        updateItem : (token, userId, item) => dispatch(actions.updateItem(token, userId, item)),
        deleteItem : (token, userId, item) => dispatch(actions.deleteItem(token, userId, item)),
        updateMode : (mode) => dispatch(actions.updateMode(mode)),
        checkMode : () => dispatch(actions.checkMode())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Inventory));