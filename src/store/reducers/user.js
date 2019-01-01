import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    users: [],
    loading: false,
    created: false
};

const clearMessage = (state, action) => {
    return updateObject(state, {...action.payload})
};

const fetchUsersStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchUsersSuccess = ( state, action ) => {
    return updateObject( state, {
        users: action.users,
        loading: false
    } );
};

const fetchUsersFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateUserFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateUserStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateUserSuccess = ( state, action ) => {
    const users = state.users.map(user => user.email === action.updatedUser.email ? { ...action.updatedUser } : user);
    return updateObject( state, {
        updatedUser: action.updatedUser,
        loading: false,
        users
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.CLEAR_MESSAGE: return clearMessage( state, action );
        case actionTypes.FETCH_USERS_START: return fetchUsersStart( state, action );
        case actionTypes.FETCH_USERS_SUCCESS: return fetchUsersSuccess( state, action );
        case actionTypes.FETCH_USERS_FAIL: return fetchUsersFail( state, action );
        case actionTypes.UPDATE_USER_START: return updateUserStart( state, action );
        case actionTypes.UPDATE_USER_FAIL: return updateUserFail( state, action );
        case actionTypes.UPDATE_USER_SUCCESS: return updateUserSuccess( state, action );
        default: return state;
    }
};

export default reducer;