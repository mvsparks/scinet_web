import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    role: null,
    name: null,
    authRedirectPath: '/'
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, {
        token: action.idToken,
        userId: action.userId,
        name: action.name,
        error: null,
        loading: false
    } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const fetchUserRoleStart = (state, action) => {
    return updateObject(state, {
        error: false,
        loading: true
    })
};

const fetchUserRoleSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        role: action.role
    })
};

const fetchUserRoleFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    })
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.FETCH_USER_ROLE_START: return fetchUserRoleStart(state, action);
        case actionTypes.FETCH_USER_ROLE_SUCCESS: return fetchUserRoleSuccess(state, action);
        case actionTypes.FETCH_USER_ROLE_FAIL: return fetchUserRoleFail(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        default:
            return state;
    }
};

export default reducer;