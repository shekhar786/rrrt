import { put } from 'redux-saga/effects';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';

import {
    actionTypes,
    urls,
    screenNames,
    appTypes,
    viewListItemType,
    DEVICE_TYPES
} from '../../utilities/constants';
import {
    showErrorAlert,
    setLocalUserData,
    getLocalUserData,
    deleteUserDataFromLocal,
    getAppId,
    getAPIError,
    extractUserDataFromDBResponse
} from '../../utilities/helperFunctions';
import { request } from '../../utilities/request';
import { navigate, goBack } from '../../utilities/NavigationService';
import logger from '../../utilities/logger';
import { strings } from '../../localization';
import socketServices from '../../utilities/socketServices';
import { layout } from '../../utilities/layout';

function* checkIfLoggedInSaga() {
    try {
        const userData = yield getLocalUserData();

        logger.data('userData', userData);

        if (!userData) {
            const error = 'User data not found';
            throw error;
        }

        //to initialize and connect socket
        socketServices.initializeSocket(userData.token);

        if (userData.selectedLanguage) {
            strings.setLanguage(userData.selectedLanguage);
        }

        yield put({
            type: actionTypes.UPDATE_LANGUAGE_SUCCEEDED,
            payload: userData.selectedLanguage
        });

        yield put({
            type: actionTypes.LOGIN_SUCCEEDED,
            payload: userData
        });

        if (getAppId() === appTypes.yabalash.id) {
            navigate(screenNames.YabalasNavigator);
        } else {
            navigate(screenNames.ShilengaNavigator);
        }

        SplashScreen.hide();
    } catch (error) {
        logger.error('checkIfLoggedIn error: ', error);

        navigate(screenNames.AuthNavigator);

        SplashScreen.hide();
    }
}

function* sessionExpiredSaga({ params }) {
    try {
        const { hideAlert } = params;
        /* const config = {
            url: urls.getUsers,
            method: 'GET',
            data: {}
        };

        let { data } = yield call(request, config);

        data = data.map((user) => {
            user.key = String(user.id);
            return user;
        });

        const payload = {
            users: data
        };

        console.log('payload is: ', data); */

        yield deleteUserDataFromLocal();

        //to connect socket
        if (socketServices.socket) {
            socketServices.socket.close();
        }

        if (!hideAlert) {
            showErrorAlert(strings.sessionExpired, { duration: 4000 });
        }

        navigate(screenNames.AuthNavigator);
        yield put({ type: actionTypes.SESSION_EXPIRED });
    } catch (error) {
        console.log('Logout user error: ', error);
        // const errorMessage = error.message || strings.somethingWentWrong;

        yield put({ type: actionTypes.AUTH_LOADING_STOPPED });
    }
}

function* signupSaga({ params }) {
    try {
        const { data: signupData, loginKeyId, } = params;

        logger.log('signup params are: ', params);

        const fcmToken = yield firebase.messaging().getToken();

        logger.log('fcmToken', fcmToken);

        const config = {
            url: urls.register,
            method: 'POST',
            data: {
                ...signupData,
                fcm_id: fcmToken,
                device_type: layout.isIOS ? DEVICE_TYPES.ios : DEVICE_TYPES.android
            },
        };

        const response = yield request(config);

        logger.log('signup response is: ', response);

        const userData = extractUserDataFromDBResponse(response.data.user, {
            token: response.data.token,
            otherData: {
                listViewTypePreference: viewListItemType.grid
            }
        });
        logger.log('data to be put into the store: ', userData);

        //to initialize and connect socket
        socketServices.initializeSocket(userData.token);

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.SIGNUP_SUCCEEDED,
            payload: userData
        });

        if (this.hasComeFromMainApp) {
            return goBack(loginKeyId);
        } else if (
            getAppId() === appTypes.shilengae.id
            || getAppId() === appTypes.beault.id
        ) {
            return navigate(screenNames.ShilengaNavigator);
        }

        return navigate(screenNames.YabalasNavigator);
    } catch (error) {
        logger.apiError('signup error: ', error);

        if (params.cb) {
            return params.cb(getAPIError(error));
        }
    }
}

function* loginSaga({ params }) {
    try {
        logger.data('login params are: ', params);

        const fcmToken = yield firebase.messaging().getToken();

        const data = {
            ...params.data,
            fcm_id: fcmToken,
            device_type: layout.isIOS ? DEVICE_TYPES.ios : DEVICE_TYPES.android
        };

        // logger.log('login data:', data);
        const config = {
            url: urls.login,
            method: 'POST',
            data,
        };

        if (params.isSocialSignin) {
            config.url = urls.appSocialLogin;
        }

        const response = yield request(config);

        logger.log('login response is: ', response);

        if (response.data.user.forgot_status && response.data.user.forgot_status == 1) {
            yield put({
                type: actionTypes.AUTH_LOADING_STOPPED,
            });

            return navigate(screenNames.ForceChangePassword, {
                token: response.data.token,
                hasComeFromMainApp: params.hasComeFromMainApp,
                loginKeyId: params.loginKeyId
            });
        }

        const userData = extractUserDataFromDBResponse(response.data.user, {
            token: response.data.token,
            otherData: {
                listViewTypePreference: viewListItemType.grid
            }
        });

        logger.data('data to be saved is: ', userData);

        //to initialize and connect socket
        socketServices.initializeSocket(response.data.token);

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.LOGIN_SUCCEEDED,
            payload: userData
        });

        if (params.hasComeFromMainApp) {
            goBack(params.loginKeyId);
        } else if (
            getAppId() === appTypes.shilengae.id
            || getAppId() === appTypes.beault.id
        ) {
            navigate(screenNames.ShilengaNavigator);
        } else {
            navigate(screenNames.YabalasNavigator);
        }
    } catch (error) {
        logger.apiError('login error: ', error);

        showErrorAlert(getAPIError(error));

        yield put({
            type: actionTypes.AUTH_LOADING_STOPPED,
        });
    }
}

function* forceChangePasswordSaga({ params }) {
    try {
        logger.log('forceChangePassword params are: ', params);

        const config = {
            url: urls.forceChangePassword,
            method: 'POST',
            data: params.data,
            headers: {
                Authorization: `Bearer ${params.token}`
            }
        };

        const response = yield request(config);

        logger.log('forceChangePassword response is: ', response);

        const userData = extractUserDataFromDBResponse(response.data.user, {
            token: response.data.token,
            otherData: {
                listViewTypePreference: viewListItemType.grid
            }
        });

        logger.data('data to be saved is: ', userData);

        yield setLocalUserData(userData);

        yield put({
            type: actionTypes.LOGIN_SUCCEEDED,
            payload: userData
        });

        if (params.hasComeFromMainApp) {
            goBack(params.loginKeyId);
        } else if (getAppId() === appTypes.yabalash.id) {
            navigate(screenNames.YabalasNavigator);
        } else {
            navigate(screenNames.ShilengaNavigator);
        }
    } catch (error) {
        logger.apiError('forceChangePassword error: ', error);

        showErrorAlert(getAPIError(error));

        yield put({
            type: actionTypes.AUTH_LOADING_STOPPED,
        });
    }
}

export {
    checkIfLoggedInSaga,
    sessionExpiredSaga,
    signupSaga,
    loginSaga,
    forceChangePasswordSaga
};
