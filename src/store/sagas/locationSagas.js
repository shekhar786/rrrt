import { put } from 'redux-saga/effects';
import Axios from 'axios';

import { getLocation } from '../../utilities/helperFunctions';
import { actionTypes, GOOGLE_API_KEY } from '../../utilities/constants';
import logger from '../../utilities/logger';

function* getCurrentLocationSaga(params) {
    try {
        logger.data('getCurrentLocationSaga params are: ', params.params, true);

        const { updateUseLocation } = params.params;

        const { latitude, longitude } = yield getLocation();

        const address = yield Axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${latitude},${longitude}`,
                key: GOOGLE_API_KEY
            }
        });

        if (address.data.results.length === 0) { //no results found
            return;
        }

        const data = {
            currentLat: latitude,
            currentLong: longitude,
            currentAddress: address.data.results[0].formatted_address
        };

        if (updateUseLocation) {
            yield put({
                type: actionTypes.USER_LOCATION_UPDATED,
                payload: data
            });
        }

        yield put({
            type: actionTypes.GET_LOCATION_SUCCEEDED,
            payload: data
        });
    } catch (error) {
        logger.apiError(error);
        console.log('getCurrentLocation error: ', error);
    }
}

export {
    getCurrentLocationSaga
};
