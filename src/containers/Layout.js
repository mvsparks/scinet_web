import React, { Component } from 'react';
import Nav from '../components/Navigation/Nav/Nav';
import { connect } from 'react-redux';
import * as actions from "../store/actions";

class Layout extends Component {
    render() {

        return (
            <div>
                <Nav {...this.props}/>
                <main style={{marginTop: '81px'}}>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleLogout : () => dispatch(actions.logout())
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Layout );