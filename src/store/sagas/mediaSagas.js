import { call } from 'redux-saga/effects';

import { request } from '../../utilities/request';
import logger from '../../utilities/logger';
import { getLocalUserData } from '../../utilities/helperFunctions';
import { urls, MIME_TYPE } from '../../utilities/constants';

function* uploadMediaSaga({ params }) {
    const { data, cb } = params;

    try {
        logger.log('uploadMedia params: ', params);

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.uploadMedia,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': MIME_TYPE.formData
            },
            data
        };

        const response = yield call(request, config);

        logger.data('uploadMedia response; ', response.data);

        cb(null, response.data.file);
    } catch (error) {
        logger.apiError('uploadMedia error: ', error);

        if (cb) {
            cb(error);
        }
    }
}

export {
    uploadMediaSaga
};
