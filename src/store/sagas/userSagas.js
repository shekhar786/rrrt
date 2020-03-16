import { call, put } from 'redux-saga/effects';

import { actionTypes, urls, MIME_TYPE, viewListItemType } from '../../utilities/constants';
import {
    getLocalUserData,
    setLocalUserData,
    showErrorAlert,
    getAPIError,
    showSuccessAlert,
    extractUserDataFromDBResponse
} from '../../utilities/helperFunctions';
import { request } from '../../utilities/request';
import logger from '../../utilities/logger';
import { strings } from '../../localization';
import { goBack } from '../../utilities/NavigationService';

function* editProfileSaga({ params }) {
    try {
        logger.log('Edit profile params are: ', params);
        const { token, otherData } = yield getLocalUserData();

        const config = {
            url: urls.editProfile,
            method: 'POST',
            data: params.data,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': MIME_TYPE.formData
            },
        };

        const response = yield call(request, config);

        const userData = extractUserDataFromDBResponse(response.data.user, {
            token: response.data.token,
            otherData: {
                listViewTypePreference: otherData.listViewTypePreference || viewListItemType.grid
            }
        });

        logger.log('edit profile response is: ', response);

        yield setLocalUserData(userData);

        showSuccessAlert(strings.profileUpdatedSuccessfully);

        goBack();

        yield put({
            type: actionTypes.EDIT_PROFILE_SUCCEEDED,
            payload: userData
        });

        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    } catch (error) {
        logger.apiError('edit profile error: ', error);
        showErrorAlert(getAPIError(error));
        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    }
}

function* removeResumeSaga({ params }) {
    try {
        const userData = yield getLocalUserData();

        const config = {
            url: urls.removeResume,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userData.token}`
            },
        };

        const response = yield call(request, config);

        logger.log('remove resume response: ', response);

        yield put({ type: actionTypes.REMOVE_RESUME_SUCCEEDED });

        userData.resume = null;
        userData.rsize = null;

        yield setLocalUserData(userData);

        if (params.cb) { //success callback
            params.cb();
        }
    } catch (error) {
        logger.apiError('remove resume error: ', error);

        showErrorAlert(getAPIError(error));

        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    }
}

function* updateListViewTypePreferenceSaga({ params }) {
    const { listViewTypePreference } = params;

    try {
        logger.log('listViewTypePreference params: ', listViewTypePreference);

        const userData = yield getLocalUserData();

        userData.otherData = {
            ...userData.otherData,
            listViewTypePreference: listViewTypePreference || viewListItemType.grid
        };

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.UPDATED_LIST_VIEW_PREFERENCE_SUCCEEDED,
            payload: {
                listViewTypePreference
            }
        });
    } catch (error) {
        logger.error('updateListViewTypePreference error: ', error);

        yield put({
            type: actionTypes.UPDATED_LIST_VIEW_PREFERENCE_SUCCEEDED,
            payload: listViewTypePreference
        });
    }
}

function* getUserProfileSaga({ params }) {
    try {
        const userData = yield getLocalUserData();

        const config = {
            url: urls.getUserProfile,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userData.token}`
            },
        };

        const response = yield call(request, config);

        const data = extractUserDataFromDBResponse(response.data.user, {
            token: response.data.token,
            otherData: {
                listViewTypePreference: userData.otherData.listViewTypePreference || viewListItemType.grid
            }
        });

        yield setLocalUserData(data);

        yield put({
            type: actionTypes.GET_USER_PROFILE_SUCCEEDED,
            payload: data
        });

        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    } catch (error) {
        logger.apiError('getUserProfile error: ', error);

        yield put({
            type: actionTypes.USER_LOADING_STOPPED
        });
    }
}

function* changePasswordSaga({ params }) {
    const { cb, data } = params;

    try {
        logger.log('changePassword params are: ', params);

        const userData = yield getLocalUserData();

        const config = {
            url: urls.changePassword,
            method: 'POST',
            data,
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };

        const response = yield request(config);

        logger.log('changePassword response is: ', response);

        if (cb) {
            cb(null);
        }

        showSuccessAlert(response.data.msg, {
            duration: 5000
        });
    } catch (error) {
        logger.apiError('changePassword error', error);

        showErrorAlert(getAPIError(error));

        if (cb) {
            cb(error);
        }
    }
}

function* changeEmailSaga({ params }) {
    const { cb, data } = params;

    try {
        logger.log('changeEmail params are: ', params);

        const userData = yield getLocalUserData();

        const config = {
            url: urls.changeEmail,
            method: 'POST',
            data,
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };

        const response = yield request(config);

        logger.log('changeEmail response is: ', response);

        if (cb) {
            cb(null);
        }

        userData.email = data.email;
        userData.verified = 0;

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.EMAIL_CHANGED_SUCCEEDED,
            payload: {
                email: data.email
            }
        });
    } catch (error) {
        logger.apiError('changeEmail error', error);

        showErrorAlert(getAPIError(error));

        if (cb) {
            cb(error);
        }
    }
}

function* changePhoneSaga({ params }) {
    const { cb, data } = params;

    try {
        logger.log('changePhone params are: ', params);

        const userData = yield getLocalUserData();

        const config = {
            url: urls.changePhone,
            method: 'POST',
            data,
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };

        const response = yield request(config);

        logger.log('changePhone response is: ', response.data);

        userData.mobile = data.mobile;
        userData.calling_code = data.calling_code;
        userData.mverified = 1;

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.CHANGE_PHONE_SUCCEEDED,
            payload: userData
        });

        if (cb) {
            cb(null);
        }
    } catch (error) {
        logger.apiError('changePhone error', error);

        if (cb) {
            cb(getAPIError(error));
        }
    }
}

function* requestOTPSaga({ params }) {
    const { cb, data } = params;

    try {
        logger.log('requestOTP params are: ', params);

        const config = {
            url: urls.requestOTP,
            method: 'POST',
            data
        };

        const response = yield request(config);

        logger.log('requestOTP response is: ', response.data);

        if (cb) {
            cb(null, response.data.otp);
        }
    } catch (error) {
        logger.apiError('requestOTP error', error);
        if (cb) {
            cb(getAPIError(error));
        }
    }
}

function* connectFacebookSaga({ params }) {
    try {
        const { data } = params;
        logger.log('connectFacebook params are: ', params);

        const userData = yield getLocalUserData();

        const config = {
            url: urls.connectFacebook,
            method: 'POST',
            data,
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };

        const response = yield request(config);

        logger.log('connectFacebook response is: ', response.data);

        userData.provider = data.provider;

        yield setLocalUserData(userData);

        showSuccessAlert(strings.facebookConnectedSuccessfully);

        yield put({
            type: actionTypes.CONNECT_FACEBOOK_SUCCEEDED,
            payload: userData
        });
    } catch (error) {
        logger.apiError('connectFacebook error', error);

        showErrorAlert(getAPIError(error));
        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    }
}

function* sendEmailVerificationLinkSaga({ params }) {
    try {
        logger.log('sendEmailVerificationLink params are: ', params);

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.sendEmailVerificationLink,
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        };

        const response = yield request(config);

        logger.log('sendEmailVerificationLink response is: ', response.data);

        showSuccessAlert(strings.emailVerificationLinkSentSuccessfully);

        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    } catch (error) {
        logger.apiError('sendEmailVerificationLink error', error);

        showErrorAlert(getAPIError(error));

        yield put({ type: actionTypes.USER_LOADING_STOPPED });
    }
}

export {
    editProfileSaga,
    removeResumeSaga,
    updateListViewTypePreferenceSaga,
    getUserProfileSaga,
    changePasswordSaga,
    changeEmailSaga,
    changePhoneSaga,
    requestOTPSaga,
    connectFacebookSaga,
    sendEmailVerificationLinkSaga
};
