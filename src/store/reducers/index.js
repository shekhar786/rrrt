import { combineReducers } from 'redux';

import app from './appTypeReducers';

import auth from './authReducers';
import user from './userReducers';
import location from './locationReducers';
import lang from './languageReducers';
import product from './productReducers';
import chat from './chatReducers';

export default combineReducers({
    app,
    auth,
    user,
    location,
    lang,
    product,
    chat
});
