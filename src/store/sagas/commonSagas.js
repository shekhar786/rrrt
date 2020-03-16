import { call } from 'redux-saga/effects';

import logger from '../../utilities/logger';
import { request } from '../../utilities/request';
import { getLocalUserData, getAPIError } from '../../utilities/helperFunctions';

function* sagaWithCallback({ params }) {
    try {
        const { excludeToken, config, cb } = params;
        const requestHeaders = { ...config };

        if (!excludeToken) {
            const { token } = yield getLocalUserData();
            requestHeaders.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }

        const response = yield call(request, requestHeaders);

        logger.data('sagaWithCallback response: ', response.data.data, true);

        if (cb) {
            cb(response.data.data);
        }
    } catch (error) {
        logger.apiError('sagaWithCallback error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

export {
    sagaWithCallback
};
