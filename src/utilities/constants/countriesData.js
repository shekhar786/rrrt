import { LANGUAGES, COUNTRIES } from './otherConstants';

const countriesData = {
    ET: {
        capital: 'Addis Ababa',
        continent: 'AF',
        currency: 'ETB',
        emoji: '🇪🇹',
        emojiU: 'U+1F1EA U+1F1F9',
        languages: ['am', 'en'],
        name: 'Ethiopia',
        native: 'ኢትዮጵያ',
        phone: '251',
    },
    IN: {
        capital: 'New Delhi',
        continent: 'AS',
        currency: 'INR',
        emoji: '🇮🇳',
        emojiU: 'U+1F1EE U+1F1F3',
        languages: ['hi', 'en'],
        name: 'India',
        native: 'भारत',
        phone: '91',
    }
};

const countries = [
    {
        label: 'United Arab Emirates',
        value: COUNTRIES.unitedArabEmirates
    },
    {
        label: 'United States',
        value: COUNTRIES.unitedStateOfAmerica
    }
];

const countries_yabalash = [
    {
        label: 'Algeria',
        value: 'dz'
    },
    {
        label: 'Bahrain',
        value: 'bh'
    },
    {
        label: 'Comoros',
        value: 'km'
    },
    {
        label: 'Djibouti',
        value: 'dj'
    },
    {
        label: 'Egypt',
        value: 'eg'
    },
    {
        label: 'Iraq',
        value: 'iq'
    },
    {
        label: 'Jordan',
        value: 'jo'
    },
    {
        label: 'Kuwait',
        value: 'kw'
    },
    {
        label: 'Lebanon',
        value: 'lb'
    },
    {
        label: 'Libya',
        value: 'ly'
    },
    {
        label: 'Mauritania',
        value: 'mr'
    },
    {
        label: 'Morocco',
        value: 'ma'
    },
    {
        label: 'Oman',
        value: 'om'
    },
    {
        label: 'Qatar',
        value: 'qa'
    },
    {
        label: 'Saudi Arabia',
        value: 'sa'
    },
    {
        label: 'Somalia',
        value: 'so'
    },
    {
        label: 'Sudan',
        value: 'sd'
    },
    {
        label: 'Syria',
        value: 'sy'
    },
    {
        label: 'Tunisia',
        value: 'tn'
    },
    {
        label: 'United Arab Emirates',
        value: COUNTRIES.unitedArabEmirates
    },
    {
        label: 'Yemen',
        value: 'ye'
    },
];

const languages = [
    {
        label: 'English',
        value: LANGUAGES.english
    },
    {
        label: 'Amheric',
        value: LANGUAGES.amheric
    }
];

export {
    countriesData,
    countries,
    languages,
    countries_yabalash
};
