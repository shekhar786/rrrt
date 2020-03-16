import LocalizedStrings from 'react-native-localization';

import en from './en';
import am from './am';

const strings = new LocalizedStrings({
    en,
    am
});

// strings.setLanguage('am');

export { strings };
