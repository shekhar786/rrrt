import { actionTypes } from '../../utilities/constants';

const initialState = {
    currentLat: 0,
    currentLong: 0,
    currentAddress: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }
        case actionTypes.GET_LOCATION_SUCCEEDED:
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
};
