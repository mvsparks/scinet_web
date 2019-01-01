import React from 'react';
import { Menu } from '@material-ui/core';
import NavigationItem from './NavigationItem/NavigationItem';
import Wrapper from '../../Wrapper/Wrapper';
import { withStyles } from '@material-ui/core/styles';

const navigationItems = ( props ) => {
    const { classes } = props;
    return (
        !props.isAuthenticated
            ? <Wrapper>
                <div style={{width: '100%'}}></div>
                <NavigationItem link="/Login" exact>Login</NavigationItem>
              </Wrapper>
            : !props.loading ? ( <Wrapper>
                {!props.noAccess ? <NavigationItem link="/" exact>Add Item</NavigationItem>: null}
                {props.isSuperUser ? <NavigationItem link="/Users" exact>Users</NavigationItem> : null}
                {!props.noAccess ?<NavigationItem link="/Inventory" exact>Inventory</NavigationItem> : null}
                {props.isSuperUser ? <NavigationItem link="/Reports" exact>Reports</NavigationItem> : null}
                <div style={{width: '100%'}}></div>
                <NavigationItem link="/Logout" exact>Logout</NavigationItem>
            </Wrapper>) : null
    );
};

export default withStyles(null)(navigationItems);