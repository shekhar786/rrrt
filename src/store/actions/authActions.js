import { actionTypes } from '../../utilities/constants';

const checkIfLoggedIn = () => ({
    type: actionTypes.CHECKED_IF_LOGGED_IN
});

const signup = (params) => ({
    type: actionTypes.SIGNUP_REQUESTED,
    params
});

const login = (params) => ({
    type: actionTypes.LOGIN_REQUESTED,
    params
});

const changePassword = (params) => ({
    type: actionTypes.CHANGE_PASSWORD_REQUESTED,
    params
});

const forceChangePassword = (params) => ({
    type: actionTypes.FORCE_CHANGE_PASSWORD_REQUESTED,
    params
});

export {
    checkIfLoggedIn,
    signup,
    login,
    changePassword,
    forceChangePassword
};
