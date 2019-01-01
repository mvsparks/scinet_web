import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';

export const clearMessage = ( ) => {
    const payload = {
        created: false,
        loading: false,
        error: false
    };
    return {
        payload,
        type: actionTypes.CLEAR_MESSAGE
    };
};

export const fetchUsersSuccess = ( users ) => {
    return {
        type: actionTypes.FETCH_USERS_SUCCESS,
        users: users
    };
};

export const fetchUsersFail = ( error ) => {
    return {
        type: actionTypes.FETCH_USERS_FAIL,
        error: error
    };
};

export const fetchUsersStart = () => {
    return {
        type: actionTypes.FETCH_USERS_START
    };
};

export const fetchUsers = (token, userId) => {
    return dispatch => {
        dispatch(fetchUsersStart());
        const queryParams = '?auth=' + token;
        axios.get( '/users.json' + queryParams)
            .then( res => {
                const fetchedUsers = [];
                for ( let key in res.data ) {
                    fetchedUsers.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchUsersSuccess(fetchedUsers));
            } )
            .catch( err => {
                dispatch(fetchUsersFail(err));
            } );
    };
};

export const updateUserFail = ( error ) => {
    return {
        type: actionTypes.UPDATE_USER_FAIL,
        error: error
    };
};

export const updateUserStart = () => {
    return {
        type: actionTypes.UPDATE_USER_START
    };
};

export const updateUserSuccess = ( updatedUser ) => {
    return {
        type: actionTypes.UPDATE_USER_SUCCESS,
        updatedUser
    };
};

export const updateUser = (token, userId, user) => {
    return dispatch => {
        dispatch(updateUserStart());
        const queryParams = '?auth=' + token;
        axios.put( `/users/${user.id}.json${queryParams}`, user)
            .then( res => {
                const updatedUser = res.data;
                dispatch(updateUserSuccess(updatedUser));
            } )
            .catch( err => {
                dispatch(updateUserFail(err));
            } );
    };
};