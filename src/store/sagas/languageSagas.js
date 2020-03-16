import { put } from 'redux-saga/effects';

import { actionTypes } from '../../utilities/constants';
import { getLocalUserData, setLocalUserData } from '../../utilities/helperFunctions';
import { strings } from '../../localization';

function* updateLanguageSaga({ params }) {
    try {
        strings.setLanguage(params);

        const userData = yield getLocalUserData();

        if (userData) {
            userData.selectedLanguage = params;

            setLocalUserData(userData);
        }

        yield put({
            type: actionTypes.UPDATE_LANGUAGE_SUCCEEDED,
            payload: params
        });
    } catch (error) {
        console.log('updateLanguage error: ', error);
    }
}

function* updateLanguageAndCountrySaga({ params }) {
    try {
        strings.setLanguage(params.selectedLanguage);

        yield put({
            type: actionTypes.UPDATE_LANGUAGE_COUNTRY_SUCCEDED,
            payload: params
        });
    } catch (error) {
        console.log('updateLanguageandCountry error: ', error);
    }
}

export {
    updateLanguageSaga,
    updateLanguageAndCountrySaga
};
