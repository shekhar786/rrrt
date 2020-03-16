import { actionTypes } from '../../utilities/constants';

const logout = (params) => ({
    type: actionTypes.SESSION_EXPIRE_REQUESTED,
    params
});

const editProfile = (params) => ({
    type: actionTypes.EDIT_PROFILE_REQUESTED,
    params
});

const removeResume = (params) => ({
    type: actionTypes.REMOVE_RESUME_REQUESTED,
    params
});

const updateListViewTypePreference = (params) => ({
    type: actionTypes.UPDATED_LIST_VIEW_PREFERENCE_REQUESTED,
    params
});

const changeEmail = (params) => ({
    type: actionTypes.CHANGE_EMAIL_REQUESTED,
    params
});

const changePhone = (params) => ({
    type: actionTypes.CHANGE_PHONE_REQUESTED,
    params
});

const requestOTP = (params) => ({
    type: actionTypes.OTP_REQUESTED,
    params
});

const getUserProfile = (params) => ({
    type: actionTypes.GET_USER_PROFILE_REQUESTED,
    params
});

const connectFacebook = (params) => ({
    type: actionTypes.CONNECT_FACEBOOK_REQUESTED,
    params
});

const sendEmailVerificationLink = (params) => ({
    type: actionTypes.SEND_EMAIL_VERIFICATION_LINK_REQUESTED,
    params
});

export {
    logout,
    editProfile,
    removeResume,
    updateListViewTypePreference,
    changeEmail,
    getUserProfile,
    changePhone,
    requestOTP,
    connectFacebook,
    sendEmailVerificationLink
};
