import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import MessageBarContent from './MessageBarContent/MessageBarContent';
import * as actions from '../../store/actions/index';

const styles2 = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
});

class MessageBar extends Component {

    componentDidMount() {
        if (this.props.type === 'success') {
            this.props.clearForm();
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.props.onClearMessage();
    };

    render() {
        const { classes } = this.props;
        let container = null;
        if (this.props.type === 'success') {
            container = (
                <Snackbar
                    style={{maxWidth: '500px'}}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    open={true}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                >
                    <MessageBarContent
                        onClose={this.handleClose}
                        variant="success"
                        message={this.props.message}
                    />
                </Snackbar>
            );
        } else {
            console.log('error snackbar')
            container = (
                <Snackbar
                    style={{maxWidth: '500px'}}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    open={true}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                >
                    <MessageBarContent
                        onClose={this.handleClose}
                        variant="error"
                        message={this.props.message}
                    />
                </Snackbar>
            );
        }

        return (
            container
        );
    }
}

MessageBar.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        loading: state.item.loading,
        created: state.item.created,
        error: state.item.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onClearMessage: () => dispatch(actions.clearMessage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles2)(MessageBar));