import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Logo from "../../../assets/scinetDallasLogo.png";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withRouter } from 'react-router'
import Wrapper from "../../Wrapper/Wrapper";

const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class SideDrawer extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    handleClick(e){
        this.props.toggleDrawer();
    };

    handleItemClick(location) {
        const { history: { push } } = this.props;
        push(location);
    }


    render() {
        const { classes } = this.props;
        let sideList = (
            <List component={'nav'}>
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText to='/Login' primary="Login" />
                </ListItem>
            </List>
        );

        if (this.props.isAuthenticated) {
            sideList = (
                <Wrapper>
                    <List component={'nav'}>
                        { !this.props.noAccess ?
                            <Wrapper>
                                <ListItem button onClick={(e) => this.handleItemClick('/')}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Item" />
                                </ListItem>
                                <ListItem button onClick={(e) => this.handleItemClick('/Inventory')}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Inventory" />
                                </ListItem>
                                { ['admin', 'superuser'].indexOf(this.props.role) > -1 ?
                                    <ListItem button onClick={(e) => this.handleItemClick('/Users')}>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Users" />
                                    </ListItem> : null }
                            </Wrapper> : null }
                    </List>
                    { !this.props.noAccess ? <Divider /> : null }
                    <List component={'nav'}>
                        <ListItem button>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText to='/Logout' primary="Logout" onClick={this.props.handleLogout} />
                        </ListItem>
                    </List>
            </Wrapper>
            );
        }

        return (
            <div>
                <Drawer open={this.props.isOpen} onClose={this.toggleDrawer('left', false)}>
                    <ClickAwayListener onClickAway={this.handleClick}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.handleClick}
                            onKeyDown={this.handleClick}
                        >
                        <div className={classes.list} style={{backgroundColor: '#92C1E9', heigth: '100vh'}}>
                            <img alt="" src={Logo} style={{width: '200px', display: 'block', margin: '0 auto'}}/>
                            {sideList}
                        </div>
                        </div>
                    </ClickAwayListener>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(SideDrawer));