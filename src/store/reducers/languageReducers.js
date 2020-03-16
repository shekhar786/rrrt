import { actionTypes, LANGUAGES, COUNTRIES } from '../../utilities/constants';

const initialState = {
    selectedLanguage: LANGUAGES.english,
    selectedCountry: COUNTRIES.unitedArabEmirates
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }

        case actionTypes.UPDATE_LANGUAGE_SUCCEEDED:
            return { ...state, selectedLanguage: payload };

        case actionTypes.UPDATE_LANGUAGE_COUNTRY_SUCCEDED:
        // case actionTypes.SIGNUP_SUCCEEDED:
            return {
                ...state,
                selectedLanguage: payload.selectedLanguage,
                selectedCountry: payload.selectedCountry
            };

        default:
            return state;
    }
};
