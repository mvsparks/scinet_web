import React, { Component } from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import {Toolbar, AppBar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles';
import SideDrawer from "../SideDrawer/SideDrawer";
import Wrapper from "../../Wrapper/Wrapper";
import Logo from "../../../assets/scinetLogo.png";
import * as styles from './Nav.css';

class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        this.setState({isOpen: !this.state.isOpen})
    };

    render() {
        const { classes } = this.props;
        return (
            <Wrapper>
                <SideDrawer {...this.props} handleLogout={this.props.handleLogout} toggleDrawer={this.handleClick} isOpen={this.state.isOpen} />
                <AppBar className={classes.Toolbar} style={{backgroundColor: '#92C1E9', color: '#A6192E'}}>
                    <Toolbar>
                        <IconButton onClick={this.handleClick} className='MobileOnly' color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <img alt="" src={Logo} style={{width: '150px', marginTop: '0px'}}/>
                            <span className='Wireless'>WIRELESS</span>
                        </Typography>
                        <NavigationItems {...this.props}/>
                    </Toolbar>
                </AppBar>
            </Wrapper>
        );
    }

}

export default withStyles(styles)(Nav);

