import { actionTypes } from '../../utilities/constants';

const initialState = {
    loading: false
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }
        case actionTypes.LOGIN_REQUESTED:
        case actionTypes.FORCE_CHANGE_PASSWORD_REQUESTED:
        case actionTypes.AUTH_LOADING_STARTED:
        case actionTypes.LOGOUT_REQUESTED:
            return { ...state, loading: true };

        case actionTypes.AUTH_LOADING_STOPPED:
        case actionTypes.LOGIN_SUCCEEDED:
        case actionTypes.SIGNUP_SUCCEEDED:
            return { ...state, loading: false };
        default:
            return state;
    }
};
