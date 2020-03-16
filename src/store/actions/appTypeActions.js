import { actionTypes } from '../../utilities/constants';

const changeAppId = (appId) => ({
    type: actionTypes.CHANGE_APP_ID_REQUESTED,
    payload: appId
});

export { changeAppId };
