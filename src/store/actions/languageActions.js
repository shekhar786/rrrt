import { actionTypes } from '../../utilities/constants';

const updateLanguage = (lang) => ({
    type: actionTypes.UPDATE_LANGUAGE_REQUESTED,
    params: lang
});

const updateLanguageAndCountry = (data) => ({
    type: actionTypes.UPDATE_LANGUAGE_COUNTRY_REQUESTED,
    params: data
});

export {
    updateLanguage,
    updateLanguageAndCountry
};
