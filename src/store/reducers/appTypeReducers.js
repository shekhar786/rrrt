import { appTypes } from '../../utilities/constants/appTypes';
import { actionTypes } from '../../utilities/constants';

const initialAppState = {
    appId: appTypes.shilengae.id,
    // appId: appTypes.yabalash.id,
    // appId: appTypes.beault.id,
};

export default (state = initialAppState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHANGE_APP_ID_REQUESTED:
            return { ...state, appId: payload };

        default:
            return state;
    }
};
