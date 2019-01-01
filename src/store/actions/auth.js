import axios from 'axios';
import * as actionTypes from './actionTypes';
import { config } from '../../firebase';
import axiosInstance from '../../axios-instance';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId, name) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
        name: name
    };
};

export const fetchUserRoleStart = ( ) => {
    return {
        type: actionTypes.FETCH_USER_ROLE_START
    };
};

export const fetchUserRoleSuccess = ( role ) => {
    return {
        type: actionTypes.FETCH_USER_ROLE_SUCCESS,
        role: role
    };
};

export const fetchUserRoleFail = ( error ) => {
    return {
        type: actionTypes.FETCH_USER_ROLE_FAIL,
        error: error
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(refreshAuthToken());
        }, expirationTime * 1000);
    };
};

export const refreshAuthToken = () => {
  return dispatch => {
      const authData = {
          returnSecureToken: true
      };
      let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${config.apiKey}`;
      axiosInstance.post(url, authData)
          .then(res => {
              const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
              localStorage.setItem('token', res.data.idToken);
              localStorage.setItem('expirationDate', expirationDate);
              localStorage.setItem('userId', res.data.localId);

              dispatch(authSuccess(res.data.idToken, res.data.localId, res.data.displayName));
              dispatch(checkAuthTimeout(res.data.expiresIn));
          })
          .catch(e => {
              dispatch(authFail(e.response.data.error))
          });
  };
};

export const fetchUserRole = (userId, token) => {
    return dispatch => {
        dispatch(fetchUserRoleStart());
        axiosInstance.get(`/users/${userId}/role.json?auth=${token}`)
        .then(res => {
            const role = res.data;
            localStorage.setItem('role', role);
            dispatch(fetchUserRoleSuccess(role))
        })
        .catch(e => {
            dispatch(fetchUserRoleFail(e.response.data.error))
        });
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${config.apiKey}`;
        if (!isSignup) {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.apiKey}`;
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                localStorage.setItem('displayName', response.data.displayName);
                dispatch(fetchUserRole(response.data.localId, response.data.idToken));
                dispatch(authSuccess(response.data.idToken, response.data.localId, response.data.displayName));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || !role) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem('displayName');
                dispatch(fetchUserRoleSuccess(role));
                dispatch(authSuccess(token, userId, name));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }
        }
    };
};