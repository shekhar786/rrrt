import { actionTypes } from '../../utilities/constants';

const getCurrentLocation = (params) => ({
    type: actionTypes.GET_LOCATION_REQUESTED,
    params
});

export {
    getCurrentLocation,
};
