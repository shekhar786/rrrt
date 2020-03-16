import { takeLatest, takeEvery } from 'redux-saga/effects';

import { getCurrentLocationSaga } from './locationSagas';
import { actionTypes } from '../../utilities/constants';
import { updateLanguageSaga, updateLanguageAndCountrySaga } from './languageSagas';
import {
    signupSaga,
    checkIfLoggedInSaga,
    sessionExpiredSaga,
    loginSaga,
    forceChangePasswordSaga,
} from './authSagas';
import {
    getAllCategoriesSaga,
    addPostSaga,
    getStatesAndFormDataSaga,
    getAdsSaga,
    adAddToFavouritesSaga,
    getMyAdsSaga,
    activateDeactivateAdSaga,
    getMyFavouriteAdsSaga,
    getStatesAndCitiesSaga,
    editPostSaga,
    deleteAdSaga,
    getCommentsOnAdSaga,
    postCommentOnAdSaga,
    getFiltersSaga,
    getTrendingAdsSaga,
    getAdsByFiltersSaga,
    getBannersSaga
} from './productSagas';
import {
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
} from './userSagas';
import {
    getAllChatsSaga,
    getChatMessagesSaga,
    clearOrDeleteChatSaga,
    updateCurrentOpenedChatIDSaga
} from './chatSagas';
import { uploadMediaSaga } from './mediaSagas';

export default function* rootSaga() {
    yield takeLatest(actionTypes.CHECKED_IF_LOGGED_IN, checkIfLoggedInSaga);
    yield takeLatest(actionTypes.SESSION_EXPIRE_REQUESTED, sessionExpiredSaga);
    yield takeLatest(actionTypes.GET_LOCATION_REQUESTED, getCurrentLocationSaga);
    yield takeLatest(actionTypes.UPDATE_LANGUAGE_REQUESTED, updateLanguageSaga);
    yield takeLatest(actionTypes.UPDATE_LANGUAGE_COUNTRY_REQUESTED, updateLanguageAndCountrySaga);
    yield takeLatest(actionTypes.SIGNUP_REQUESTED, signupSaga);
    yield takeLatest(actionTypes.LOGIN_REQUESTED, loginSaga);
    yield takeLatest(actionTypes.FORCE_CHANGE_PASSWORD_REQUESTED, forceChangePasswordSaga);
    yield takeLatest(actionTypes.CHANGE_PASSWORD_REQUESTED, changePasswordSaga);
    yield takeLatest(actionTypes.EDIT_PROFILE_REQUESTED, editProfileSaga);
    yield takeLatest(actionTypes.REMOVE_RESUME_REQUESTED, removeResumeSaga);
    yield takeLatest(actionTypes.CHANGE_EMAIL_REQUESTED, changeEmailSaga);
    yield takeLatest(actionTypes.GET_USER_PROFILE_REQUESTED, getUserProfileSaga);
    yield takeLatest(actionTypes.CHANGE_PHONE_REQUESTED, changePhoneSaga);
    yield takeLatest(actionTypes.OTP_REQUESTED, requestOTPSaga);
    yield takeLatest(actionTypes.GET_ALL_CATEGORIES_REQUESTED, getAllCategoriesSaga);
    yield takeLatest(actionTypes.GET_STATE_AND_FORM_DATA_REQUESTED, getStatesAndFormDataSaga);
    yield takeLatest(actionTypes.GET_STATE_AND_CITIES_REQUESTED, getStatesAndCitiesSaga);
    yield takeLatest(actionTypes.ADD_POST_REQUESTED, addPostSaga);
    yield takeLatest(actionTypes.EDIT_POST_REQUESTED, editPostSaga);
    yield takeLatest(actionTypes.GET_ADS_REQUESTED, getAdsSaga);
    yield takeLatest(actionTypes.DELETE_AD_REQUESTED, deleteAdSaga);
    yield takeLatest(actionTypes.CONNECT_FACEBOOK_REQUESTED, connectFacebookSaga);
    yield takeLatest(actionTypes.SEND_EMAIL_VERIFICATION_LINK_REQUESTED, sendEmailVerificationLinkSaga);
    yield takeLatest(actionTypes.GET_FAVOURITE_ADS_REQUESTED, getMyFavouriteAdsSaga);
    yield takeLatest(actionTypes.GET_ALL_CHATS_REQUESTED, getAllChatsSaga);
    yield takeLatest(actionTypes.GET_CHAT_MESSAGES_REQUESTED, getChatMessagesSaga);
    yield takeLatest(actionTypes.GET_COMMENTS_ON_AD_REQUESTED, getCommentsOnAdSaga);
    yield takeLatest(actionTypes.POST_COMMENT_ON_AD_REQUESTED, postCommentOnAdSaga);
    yield takeLatest(actionTypes.GET_FILTERS_REQUESTED, getFiltersSaga);
    yield takeLatest(actionTypes.GET_TRENDING_ADS_REQUESTED, getTrendingAdsSaga);
    yield takeLatest(actionTypes.GET_ADS_BY_FILTER_REQUESTED, getAdsByFiltersSaga);
    yield takeLatest(actionTypes.GET_BANNERS_REQUESTED, getBannersSaga);

    yield takeEvery(actionTypes.ADD_AD_TO_FAVOURITE_REQUESTED, adAddToFavouritesSaga);
    yield takeEvery(actionTypes.GET_MY_ADS_REQUESTED, getMyAdsSaga);
    yield takeEvery(actionTypes.ACTIVATE_DEACTIVATE_AD_REQUESTED, activateDeactivateAdSaga);
    yield takeEvery(actionTypes.UPLOAD_MEDIA_REQUESTED, uploadMediaSaga);
    yield takeEvery(actionTypes.CLEAR_DELETE_CHAT_REQUESTED, clearOrDeleteChatSaga);
    yield takeEvery(actionTypes.UPDATED_LIST_VIEW_PREFERENCE_REQUESTED, updateListViewTypePreferenceSaga);
}
