import { actionTypes } from '../../utilities/constants';

const initialState = {
    allCategories: [],
    gettingAllCategories: true,

    gettingMyAds: false,
    myAds: [],
    myAdsPageNo: 1,

    gettingMyFavouriteAds: false,
    myFavourites: [],
    myFavouriteAdsPageNo: 1,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }

        case actionTypes.GET_ALL_CATEGORIES_SUCCEEDED:
            return {
                ...state,
                allCategories: payload,
                gettingAllCategories: false
            };

        case actionTypes.GET_MY_ADS_REQUESTED: {
            return { ...state, gettingMyAds: true };
        }

        case actionTypes.GET_MY_ADS_FAILED: {
            return { ...state, gettingMyAds: false };
        }

        case actionTypes.GET_MY_ADS_SUCCEEDED: {
            return {
                ...state,
                gettingMyAds: false,
                myAds: payload.myAds,
                myAdsPageNo: payload.myAdsPageNo
            };
        }

        case actionTypes.UPDATE_MY_ADS_SUCCEEDED: {
            return {
                ...state,
                myAds: payload.myAds,
            };
        }

        case actionTypes.GET_FAVOURITE_ADS_REQUESTED: {
            return { ...state, gettingMyFavouriteAds: true };
        }

        case actionTypes.GET_FAVOURITE_ADS_SUCCEEDED: {
            return {
                ...state,
                gettingMyFavouriteAds: false,
                myFavourites: payload.myFavourites,
                myFavouriteAdsPageNo: payload.myFavouriteAdsPageNo
            };
        }

        case actionTypes.GET_FAVOURITE_ADS_FAILED: {
            return { ...state, gettingMyFavouriteAds: false };
        }
        default:
            return state;
    }
};
