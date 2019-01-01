import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import styles from './NavigationItem.css';
import { withStyles } from '@material-ui/core/styles';

const navigationItem = ( props ) => {
    const { classes } = props;

    return (
        <NavLink
            style={styles}
            className="DesktopOnly a mute"
            to={props.link}
            exact={props.exact}
            activeClassName="active">
            <MenuItem className={styles.a}>
                {props.children}
            </MenuItem>
        </NavLink>
    );
};

export default withStyles(styles)(navigationItem);

