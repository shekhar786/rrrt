import { actionTypes } from '../../utilities/constants';

const getAllCategories = () => ({
    type: actionTypes.GET_ALL_CATEGORIES_REQUESTED,
});

const getStatesAndFormData = (params) => ({
    type: actionTypes.GET_STATE_AND_FORM_DATA_REQUESTED,
    params
});

const getStatesAndCities = (params) => ({
    type: actionTypes.GET_STATE_AND_CITIES_REQUESTED,
    params
});

const addPost = (params) => ({
    type: actionTypes.ADD_POST_REQUESTED,
    params
});

const editPost = (params) => ({
    type: actionTypes.EDIT_POST_REQUESTED,
    params
});

const getAds = (params) => ({
    type: actionTypes.GET_ADS_REQUESTED,
    params
});

const adAddToFavourites = (params) => ({
    type: actionTypes.ADD_AD_TO_FAVOURITE_REQUESTED,
    params
});

const getMyAds = (params) => ({
    type: actionTypes.GET_MY_ADS_REQUESTED,
    params
});

const getMyFavouriteAds = (params) => ({
    type: actionTypes.GET_FAVOURITE_ADS_REQUESTED,
    params
});

const activateDeactivateAd = (params) => ({
    type: actionTypes.ACTIVATE_DEACTIVATE_AD_REQUESTED,
    params
});

const deleteAd = (params) => ({
    type: actionTypes.DELETE_AD_REQUESTED,
    params
});

const getCommentsOnAd = (params) => ({
    type: actionTypes.GET_COMMENTS_ON_AD_REQUESTED,
    params
});

const postCommentOnAd = (params) => ({
    type: actionTypes.POST_COMMENT_ON_AD_REQUESTED,
    params
});

const getFilters = (params) => ({
    type: actionTypes.GET_FILTERS_REQUESTED,
    params
});

const getTrendingAds = (params) => ({
    type: actionTypes.GET_TRENDING_ADS_REQUESTED,
    params
});

const getAdsByFilters = (params) => ({
    type: actionTypes.GET_ADS_BY_FILTER_REQUESTED,
    params
});

const getBanners = (params) => ({
    type: actionTypes.GET_BANNERS_REQUESTED,
    params
});

export {
    getAllCategories,
    getStatesAndFormData,
    getStatesAndCities,
    addPost,
    editPost,
    getAds,
    adAddToFavourites,
    getMyAds,
    activateDeactivateAd,
    getMyFavouriteAds,
    deleteAd,
    getCommentsOnAd,
    postCommentOnAd,
    getFilters,
    getTrendingAds,
    getAdsByFilters,
    getBanners
};
