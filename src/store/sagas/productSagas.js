import { call, put } from 'redux-saga/effects';
import uuid from 'uuid';
import * as yup from 'yup';
import cloneDeep from 'clone-deep';

import {
    actionTypes,
    urls,
    FILED_TYPES,
    POST_TITLE,
    MIME_TYPE,
    regex,
    defaultGetAdsCount,
    appTypes,
    promotionType
} from '../../utilities/constants';
import {
    getLocalUserData,
    showErrorAlert,
    getAPIError,
    generateRandomNumber,
    showSuccessAlert,
    getAppId
} from '../../utilities/helperFunctions';
import { request } from '../../utilities/request';
import { strings } from '../../localization';
import logger from '../../utilities/logger';
import { layout } from '../../utilities/layout';
import store from '..';

function* getAllCategoriesSaga() {
    try {
        const config = {
            url: urls.getCategories,
            method: 'GET'
        };

        const { data } = yield request(config);

        logger.log('getAllCategories response is: ', data);

        const categories = [];

        if (data.data && data.data.length > 0) {
            data.data.forEach((category) => {
                if (category.parent_id === 0) { //to check if it a parent category
                    //to check if subCategories array key exists
                    if (
                        category.sub
                        && getAppId() !== appTypes.yabalash.id
                    ) {
                        category.sub.unshift({ //push extra subcategory to get all ads of parent category
                            id: category.id,
                            parent_id: category.category,
                            name: `All in ${category.name}`,
                            sub: [],
                            isFirstCategory: true
                        });
                    }

                    categories.push(category);
                }
            });
        }

        logger.log('all Categories are: ', categories);

        yield put({
            type: actionTypes.GET_ALL_CATEGORIES_SUCCEEDED,
            payload: categories
        });
    } catch (error) {
        logger.apiError('getAllCategories error: ', error);

        showErrorAlert(getAPIError(error));

        yield put({
            type: actionTypes.GET_ALL_CATEGORIES_SUCCEEDED,
            payload: []
        });
    }
}

function* getStatesAndFormDataSaga({ params }) {
    const { cb, categoryId } = params;

    try {
        const getStatesConfig = {
            url: urls.getStatesAndCities,
        };

        const getCategoryFieldsFormConfig = {
            url: urls.getCategoryFieldsForm,
            params: {
                cat_id: categoryId
            }
        };

        logger.log('getCategoryFieldsFormConfig params: ', getCategoryFieldsFormConfig);

        const [states, form] = yield Promise.all([
            request(getStatesConfig),
            request(getCategoryFieldsFormConfig)
        ]);

        logger.log('getCategoryFieldsFormConfig response: ', form.data);

        if (!form.data.data.parameters || form.data.data.parameters.length === 0) {
            return cb(strings.noDataFound);
        }

        let formFields = [];

        if (form.data.data && form.data.data.parameters) {
            formFields = form.data.data.parameters.map((param) => {
                const field = {
                    ...param,
                    id: param.id || uuid(),
                    field_name: `${param.title.replace(/ /g, '_')}_${generateRandomNumber()}`,
                    title: param.title,
                    field_type: param.field_type,
                };

                switch (param.field_type) {
                    case FILED_TYPES.simple_text: {
                        field.value = '';
                        field.placeholder = param.placeholder;

                        if (param.required === '1') {
                            field.validation = yup.string().required(
                                strings.formatString(strings.pleaseEnterThe, param.title)
                            );
                        } else {
                            field.validation = yup.string();
                        }

                        return field;
                    }
                    case FILED_TYPES.multiline_text: {
                        field.value = '';
                        field.placeholder = param.placeholder;

                        if (param.required === '1') {
                            field.validation = yup.string().required(
                                strings.formatString(strings.pleaseEnterThe, param.title)
                            );
                        } else {
                            field.validation = yup.string();
                        }

                        return field;
                    }

                    case FILED_TYPES.picker: {
                        const labels = param.options.split(',');

                        field.value = labels[0].replace(/ /g, '_');

                        field.options = labels.map((label) => ({
                            label,
                            value: label.replace(/ /g, '_')
                        }));

                        field.validation = yup.string().required(
                            strings.formatString(strings.pleasePickAnOption, param.title)
                        );

                        return field;
                    }

                    case FILED_TYPES.multi_select_option: {
                        const labels = param.options.split(',');

                        field.value = [];

                        field.options = labels.map((label) => ({
                            label,
                            value: label.replace(/ /g, '_')
                        }));

                        if (param.required === '1') {
                            field.validation = yup.array().min(1,
                                strings.formatString(strings.pleaseChooseAtleast, param.title)
                            ).required(strings.formatString(strings.pleasePickAnOption, param.title));
                        } else {
                            field.validation = yup.array();
                        }

                        return field;
                    }

                    case FILED_TYPES.radio_button: {
                        const labels = param.options.split(',');

                        field.value = labels[0].replace(/ /g, '_');

                        field.options = labels.map((label) => ({
                            label,
                            value: label.replace(/ /g, '_')
                        }));

                        field.validation = yup.string().required(
                            strings.formatString(strings.pleasePickAnOption, param.title)
                        );

                        return field;
                    }

                    case FILED_TYPES.picture: {
                        field.value = [];

                        const max_count = parseInt(param.count, 10);

                        field.max_count = max_count;

                        if (param.required === '1') {
                            field.validation = yup.array()
                                .min(1, strings.formatString(strings.chooseAtleast1Pic, param.title))
                                .max(max_count, strings.formatString(strings.chooseAtMostPic, max_count, param.title))
                                .required(strings.formatString(strings.chooseAtleast1Pic, param.title));
                        } else {
                            field.validation = yup.array().max(
                                max_count,
                                strings.formatString(strings.chooseAtMostPic, max_count, param.title)
                            );
                        }

                        return field;
                    }

                    case FILED_TYPES.price: {
                        field.value = {
                            price_type: '1',
                            price: ''
                        };
                        field.validation = yup.object().shape({
                            price_type: yup.number().required(strings.formatString(strings.choosePriceType, param.title)),
                            price: yup.string().when('price_type', {
                                is: 3,
                                then: yup.string(),
                                otherwise: yup.string()
                                    .matches(regex.price, strings.formatString(strings.enterValidPrice, param.title))
                                    .required(strings.formatString(strings.enterPrice, param.title))
                            })
                        });

                        return field;
                    }

                    case FILED_TYPES.date: {
                        field.value = '';
                        if (param.required === '1') {
                            field.validation = yup.string().required(
                                strings.formatString(strings.pickADate, param.title)
                            );
                        } else {
                            field.validation = yup.string();
                        }

                        return field;
                    }

                    default:
                        return field;
                }
            });
        }

        const postTitleInput = {
            id: uuid(),
            field_name: POST_TITLE,
            title: 'Add title',
            placeholder: 'Add title here',
            field_type: '1',
            value: '',
            validation: yup.string().required('Please enter the title')
        };

        formFields.unshift(postTitleInput);

        logger.log('states Data: ', states.data);

        return cb(null, {
            statesData: states.data.data,
            formData: {
                formFields,
                formId: form.data.data.form_id
            }
        });
    } catch (error) {
        logger.log('getAllCategories error: ', error);

        return cb(error);
    }
}

function* getStatesAndCitiesSaga({ params }) {
    const { cb } = params;

    try {
        const getStatesConfig = {
            url: urls.getStatesAndCities,
        };

        const { data } = yield call(request, getStatesConfig);

        logger.log('getStatesAndCities response: ', data.data);

        if (cb) {
            cb(null, data.data);
        }
    } catch (error) {
        console.log('getStatesAndCities error: ', error);
        if (cb) {
            return cb(getAPIError(error));
        }
    }
}

function* addPostSaga({ params }) {
    try {
        logger.log('addPost params: ', params);

        const {
            category,
            formId,
            parameters,
            selectedStateAndCity,
            subCategory,
            superParentCategoryId,
            appCountry,
            promoted
        } = params.adData;

        let cat_id = category.id; //if there is no subCategory

        if (subCategory.id) { //if there is subCategory
            cat_id = subCategory.id;
        }

        let title = '';
        let price = '';
        let price_type = '3'; //free
        const media_parameters = []; //names of the parameters containing any kind of media files

        const data = new FormData();

        const tempData = parameters.map((parameter) => {
            const tempObj = { ...parameter };

            // delete tempObj.id;
            delete tempObj.validation;

            if (tempObj.field_name === POST_TITLE) {
                title = tempObj.value;
            }

            if (tempObj.field_type === FILED_TYPES.price) {
                price = tempObj.value.price;
                price_type = tempObj.value.price_type;
            }

            if (tempObj.field_type === FILED_TYPES.picture) {
                media_parameters.push(tempObj.field_name);

                tempObj.value = parameter.value.map((image, index) => {
                    data.append(`${tempObj.field_name}[${index}]`, {
                        uri: layout.isIOS ? `file:///${image.path}` : image.path,
                        name: `${tempObj.field_name}.jpg`,
                        type: MIME_TYPE.image
                    });

                    return image.path;
                });
            }
            return tempObj;
        });

        data.append('form_id', formId);
        data.append('cat_id', cat_id);
        data.append('country', appCountry);

        data.append('title', title);
        data.append('promoted', promoted || promotionType.free);
        data.append('parent_cat_id', superParentCategoryId);

        data.append('price', price);
        data.append('price_type', price_type);

        data.append('location', selectedStateAndCity.pickedCity);
        data.append('data', JSON.stringify(tempData));
        data.append('media_parameters', media_parameters.toString());

        logger.data('data to be sent is: ', data, true);

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.addPost,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': MIME_TYPE.formData
            },
            data
        };

        const response = yield call(request, config);

        // logger.data('addPost response is: ', response.data.data);

        if (response.data.data) {
            const postData = JSON.parse(response.data.data.data);

            const uploadedImages = [];

            postData.forEach((param) => {
                if (param.field_type === FILED_TYPES.picture) {
                    if (param.value.length > 0) {
                        const images = param.value.split(',');

                        if (images.length > 0) {
                            uploadedImages.push(...images);
                        }
                    }
                }
            });

            response.data.data.uploadedImages = uploadedImages;
            response.data.data.postData = postData;

            return params.cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError(error);

        params.cb(error);
        showErrorAlert(getAPIError(error));
    }
}

function* editPostSaga({ params }) {
    try {
        logger.log('EditPost params: ', params);

        const {
            post_id,
            parameters,
            selectedStateAndCity,
        } = params.updatedAdData;

        let title = '';
        let price = '';
        let price_type = '3'; //free
        const media_parameters = []; //names of the parameters containing any kind of media files

        const data = new FormData();

        const tempData = parameters.map((parameter) => {
            const tempObj = { ...parameter };

            delete tempObj.id;
            delete tempObj.validation;

            if (tempObj.field_name === POST_TITLE) {
                title = tempObj.value;
            }

            if (tempObj.field_type === FILED_TYPES.price) {
                price = tempObj.value.price;
                price_type = tempObj.value.price_type;
            }

            if (tempObj.field_type === FILED_TYPES.picture) {
                media_parameters.push(tempObj.field_name);

                tempObj.value = parameter.value.map((image, index) => {
                    let uri;

                    if (image.path.startsWith('http') || image.path.startsWith('http')) {
                        uri = image.path;
                    } else if (layout.isIOS) {
                        uri = `file:///${image.path}`;
                    } else {
                        uri = image.path;
                    }

                    data.append(`${tempObj.field_name}[${index}]`, {
                        uri,
                        name: `${tempObj.field_name}.jpg`,
                        type: MIME_TYPE.image
                    });

                    return image.path;
                });
            }
            return tempObj;
        });

        data.append('post_id', post_id);
        data.append('title', title);
        data.append('price', price);
        data.append('price_type', price_type);
        data.append('location', selectedStateAndCity.pickedCity);
        data.append('data', JSON.stringify(tempData));
        data.append('media_parameters', media_parameters.toString());

        logger.log('data to be sent is: ', data);

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.editPost,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': MIME_TYPE.formData
            },
            data
        };

        const response = yield call(request, config);

        logger.data('editPost response is: ', response.data.data);

        showSuccessAlert(response.data.msg);

        yield put({
            type: actionTypes.GET_MY_ADS_REQUESTED,
            params: {
                pageno: 1,
                myAds: store.getState().product.myAds
            }
        });

        params.cb();
    } catch (error) {
        logger.apiError(error);

        params.cb(error);

        showErrorAlert(getAPIError(error));
    }
}

function* getAdsSaga({ params }) {
    try {
        logger.data('getAds params: ', params);
        const { queryParams, cb, apiUrl } = params;

        const config = {
            url: apiUrl,
            method: 'GET',
            params: queryParams
        };

        const response = yield call(request, config);

        // logger.log('getAds response is: ', response);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('getAds error: ', error);

        if (params.cb) {
            params.cb(error);
        }

        showErrorAlert(getAPIError(error));
    }
}

function* adAddToFavouritesSaga({ params }) {
    try {
        logger.data('adAddToFavourites params: ', params);

        const { post_id, cb } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.addtofavourites,
            method: 'POST',
            params: { post_id },
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.log('Favourite response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('adAddToFavourites error: ', error);

        if (params.cb) {
            params.cb(error);
        }

        showErrorAlert(getAPIError(error));
    }
}

function* getMyFavouriteAdsSaga({ params }) {
    try {
        logger.log('getMyFavouriteAds params: ', params);
        const { myFavouriteAdsPageNo, cb, myFavourites } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getMyFavouriteAds,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                pageno: myFavouriteAdsPageNo,
                pageoffset: 20
            }
        };

        const response = yield call(request, config);

        logger.log('getMyFavouriteAds response is: ', response.data.data);

        const favourites = response.data.data.map((ad) => {
            ad.form.favourite = 1; //add favourite status
            return ad;
        });

        const allFavourites = [...myFavourites, ...favourites];

        let pageNo = myFavouriteAdsPageNo;

        if (favourites.length > 0) {
            pageNo += 1;
        }

        const favouritesData = {
            pageNo,
            allFavourites
        };

        if (cb) { //favourites are required only on single screen. Do not save in redux-store.
            return cb(null, favouritesData);
        }

        let payload = {
            myFavourites: favourites,
            myFavouriteAdsPageNo
        };

        // if (favourites.length > 0) {
        //     payload = {
        //         myFavourites: [...favourites, ...cloneDeep(myFavourites)],
        //         myFavouriteAdsPageNo
        //         // myFavouriteAdsPageNo: myFavouriteAdsPageNo + 1
        //     };
        // }

        yield put({
            type: actionTypes.GET_FAVOURITE_ADS_SUCCEEDED,
            payload
        });
    } catch (error) {
        logger.apiError('getMyFavouriteAds error: ', error);

        if (params.cb) {
            return params.cb(getAPIError(error));
        }

        yield put({
            type: actionTypes.GET_FAVOURITE_ADS_FAILED,
        });
        showErrorAlert(getAPIError(error));
    }
}

function* getMyAdsSaga({ params }) {
    try {
        logger.log('getMyAds params: ', params);

        const { pageno, myAds, isLoadMore } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getMyAds,
            method: 'GET',
            params: {
                pageno,
                pageoffset: defaultGetAdsCount
            },
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.log('getMyAds response: ', response.data.data);

        let payload = {
            myAds: response.data.data,
            myAdsPageNo: pageno
        };

        if (!isLoadMore) {
            return yield put({
                type: actionTypes.GET_MY_ADS_SUCCEEDED,
                payload
            });
        }

        logger.log('Loading more...');

        payload = {
            myAds,
            myAdsPageNo: pageno
        };

        if (response.data.data.length > 0) {
            payload = {
                myAds: [...response.data.data, ...cloneDeep(myAds)],
                myAdsPageNo: pageno + 1
            };
        }

        yield put({
            type: actionTypes.GET_MY_ADS_SUCCEEDED,
            payload
        });

        /* 
        
            let payload = {
                myAds,
                myAdsPageNo: pageno
            };

            if (response.data.data.length > 0) {
                payload = {
                    myAds: [...cloneDeep(myAds), ...response.data.data],
                    myAdsPageNo: pageno + 1
                };
            }

            yield put({
                type: actionTypes.GET_MY_ADS_SUCCEEDED,
                payload
            });

        */
    } catch (error) {
        logger.apiError('getMyAds error: ', error);

        showErrorAlert(error);

        yield put({
            type: actionTypes.GET_MY_ADS_FAILED,
        });
    }
}

function* activateDeactivateAdSaga({ params }) {
    try {
        logger.data('activateDeactivateAd params: ', params);

        const { post_id, isactive, cb } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.activateDeactivateAd,
            method: 'POST',
            params: { post_id, isactive },
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.log('activateDeactivateAd response: ', response.data);

        const myAds = cloneDeep(store.getState().product.myAds);

        // logger.log('my ads: ', myAds);

        const updatedMyAds = myAds.map((myAd) => {
            if (myAd.id === post_id) {
                myAd.isactive = isactive;
            }

            return myAd;
        });

        // logger.log('updatedAd: ', updatedMyAds);

        yield put({
            type: actionTypes.UPDATE_MY_ADS_SUCCEEDED,
            payload: {
                myAds: updatedMyAds
            }
        });

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('adAddToFavourites error: ', error);

        if (params.cb) {
            params.cb(error);
        }

        showErrorAlert(getAPIError(error));
    }
}

function* deleteAdSaga({ params }) {
    try {
        logger.data('deleteAd params: ', params);

        const { post_id, cb } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.deleteAd,
            method: 'POST',
            params: { post_id },
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.log('deleteAd response: ', response.data);

        const myAds = cloneDeep(store.getState().product.myAds);

        // logger.log('my ads: ', myAds);

        const updatedMyAds = myAds.filter((myAd) => (myAd.id !== post_id));

        // logger.log('updatedAd: ', updatedMyAds);

        yield put({
            type: actionTypes.UPDATE_MY_ADS_SUCCEEDED,
            payload: {
                myAds: updatedMyAds
            }
        });

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('deleteAd error: ', error);

        if (params.cb) {
            params.cb(error);
        }

        showErrorAlert(getAPIError(error));
    }
}

function* getCommentsOnAdSaga({ params }) {
    try {
        logger.data('getCommentsOnAd params: ', params);

        const { post_id, cb } = params;

        const config = {
            url: urls.getCommentsOnAd,
            method: 'GET',
            params: { post_id }
        };

        const response = yield call(request, config);

        logger.log('getCommentsOnAd response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('getCommentsOnAd error: ', error);

        if (params.cb) {
            params.cb(error);
        }
    }
}

function* postCommentOnAdSaga({ params }) {
    try {
        logger.data('postCommentOnAd params: ', params);

        const { post_id, comment, cb } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.postCommentOnAd,
            method: 'POST',
            params: { post_id, comment },
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.log('postCommentOnAd response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('postCommentOnAd error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

function* getFiltersSaga({ params }) {
    try {
        logger.data('getFilters params: ', params);

        const { cat_id, cb } = params;

        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getFilters,
            method: 'GET',
            params: { cat_id },
            headers: { Authorization: `Bearer ${token}` },
        };

        const response = yield call(request, config);

        logger.log('getFilters response: ', response.data);

        const filters = response.data.data.parameters.map((filter) => {
            filter.options = filter.options.split(',').map((option) => ({
                label: option,
                value: option
            }));

            filter.selectedValues = filter.options.map((option) => option.value);
            return filter;
        });

        if (cb) {
            cb(null, filters);
        }
    } catch (error) {
        logger.apiError('getFilters error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

function* getTrendingAdsSaga({ params }) {
    try {
        logger.data('getTrendingAds params: ', params);

        const { pageno, pageoffset, cb } = params;
        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getTrendingAds,
            method: 'GET',
            params: { pageno, pageoffset },
            headers: { Authorization: `Bearer ${token}` },
        };

        const response = yield call(request, config);

        logger.log('getTrendingAds response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('getTrendingAds error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

function* getAdsByFiltersSaga({ params }) {
    try {
        logger.data('getAdsByFilters params: ', params);

        const { cb, data } = params;
        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getAdsByFilters_Shilengae,
            method: 'POST',
            data,
            headers: { Authorization: `Bearer ${token}` },
        };

        const response = yield call(request, config);

        logger.log('getAdsByFilters response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('getAdsByFilters error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

function* getBannersSaga({ params }) {
    try {
        logger.data('getBanners params: ', params);

        const { cb, data } = params;
        const config = {
            url: urls.getBanners,
            method: 'GET',
            data
        };

        const response = yield call(request, config);

        logger.log('getBanners response: ', response.data);

        if (cb) {
            cb(null, response.data.data);
        }
    } catch (error) {
        logger.apiError('getBanners error: ', error);

        if (params.cb) {
            params.cb(getAPIError(error));
        }
    }
}

export {
    getAllCategoriesSaga,
    getStatesAndFormDataSaga,
    getStatesAndCitiesSaga,
    addPostSaga,
    editPostSaga,
    getAdsSaga,
    adAddToFavouritesSaga,
    getMyFavouriteAdsSaga,
    getMyAdsSaga,
    activateDeactivateAdSaga,
    deleteAdSaga,
    getCommentsOnAdSaga,
    postCommentOnAdSaga,
    getFiltersSaga,
    getTrendingAdsSaga,
    getAdsByFiltersSaga,
    getBannersSaga
};
