import { actionTypes } from '../../utilities/constants';

const initialState = {
    loading: false,
    gettingUserProfile: false,

    /* id: '',
    name: '',
    email: '',
    profile_image: null,
    mobile: '',
    description: '',
    fcm_id: '',
    token: '',

    dob: '', //date of birth
    clevel: '', //career level
    user_country: '',
    cposition: '', //current position
    gender: null,
    pcode: '', //postal/zip code
    resume: null,
    salary: '', //salary expectation
    rsize: '',
    business: 0,
    provider_id: null, //social id
    provider: null, //web, facebook, admin
    industry: '',
    showname: 1,
    verified: 0,
    mverified: 0,

    otherData: {}, */

    userLat: 0,
    userLong: 0,
    userAddress: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }

        case actionTypes.LOGIN_SUCCEEDED:
        case actionTypes.SIGNUP_SUCCEEDED:
        case actionTypes.EDIT_PROFILE_SUCCEEDED:
        case actionTypes.GET_USER_PROFILE_SUCCEEDED:
        case actionTypes.CONNECT_FACEBOOK_SUCCEEDED:
        case actionTypes.CHANGE_PHONE_SUCCEEDED:
            return {
                ...state,
                loading: false,
                ...payload
                /* token: payload.token,
                id: payload.id,
                name: payload.name,
                email: payload.email,
                profile_image: payload.profile_image,
                mobile: payload.mobile,
                description: payload.description,
                fcm_id: payload.fcm_id,
                business: payload.business,

                dob: payload.dob || initialState.dob, //date of birth
                clevel: payload.clevel || initialState.clevel, //career level
                user_country: payload.user_country || initialState.user_country,
                cposition: payload.cposition || initialState.cposition, //current position
                gender: payload.gender || initialState.gender,
                pcode: payload.pcode || initialState.pcode, //postal/zip code
                resume: payload.resume || initialState.resume,
                salary: payload.salary || initialState.salary,
                rsize: payload.rsize || initialState.rsize,
                provider_id: payload.provider_id,
                provider: payload.provider,
                industry: payload.industry,
                showname: payload.showname || 1,
                verified: payload.verified || 0,
                mverified: payload.mverified || 0,
                otherData: payload.otherData || {} */
            };

        case actionTypes.UPDATED_LIST_VIEW_PREFERENCE_SUCCEEDED: {
            return {
                ...state,
                otherData: {
                    ...state.otherData,
                    listViewTypePreference: payload.listViewTypePreference
                }
            };
        }

        case actionTypes.USER_LOADING_STARTED:
        case actionTypes.EDIT_PROFILE_REQUESTED:
        case actionTypes.REMOVE_RESUME_REQUESTED:
        case actionTypes.CONNECT_FACEBOOK_REQUESTED:
        case actionTypes.SEND_EMAIL_VERIFICATION_LINK_REQUESTED:
            return { ...state, loading: true };

        case actionTypes.GET_USER_PROFILE_REQUESTED: {
            return { ...state, gettingUserProfile: true };
        }
        case actionTypes.USER_LOADING_STOPPED:
            return { ...state, loading: false, gettingUserProfile: false };
        case actionTypes.USER_LOCATION_UPDATED:
            return {
                ...state,
                userLat: payload.currentLat,
                userLong: payload.currentLong,
                userAddress: payload.currentAddress,
            };

        case actionTypes.REMOVE_RESUME_SUCCEEDED: {
            return {
                ...state,
                resume: null,
                rsize: '',
                loading: false
            };
        }
        case actionTypes.GET_USERS_SUCCESS:
            return { ...state, users: payload.users, loading: false };

        case actionTypes.EMAIL_CHANGED_SUCCEEDED:
            return {
                ...state,
                email: payload.email,
                verified: 0
            };
        default:
            return state;
    }
};
