import AsyncStorage from '@react-native-community/async-storage';

import { USER_DATA } from '../constants/otherConstants';
import { strings } from '../../localization';

const getLocalUserData = () => AsyncStorage.getItem(USER_DATA)
    .then((data) => JSON.parse(data));

const setLocalUserData = (data) => AsyncStorage.setItem(USER_DATA, JSON.stringify(data));

const deleteUserDataFromLocal = () => AsyncStorage.removeItem(USER_DATA);

const extractUserDataFromDBResponse = (userData = {}, defaultValues) => {
    const {
        id,
        email,
        first_name,
        last_name,
        name,
        calling_code,
        mobile,
        business,
        industry,
        profile_image,
        fcm_id,
        description,
        user_country,
        app_country,
        language,
        dob,
        clevel,
        cposition,
        gender,
        pcode,
        resume,
        salary,
        rsize,
        provider_id,
        provider,
        showname,
        verified,
        mverified,
        device_type
    } = userData;

    return {
        id,
        email,
        first_name,
        last_name,
        name,
        calling_code,
        mobile,
        business,
        industry,
        profile_image,
        fcm_id,
        description,
        user_country,
        app_country,
        language,
        dob,
        clevel,
        cposition,
        gender,
        pcode,
        resume,
        salary,
        rsize,
        provider_id,
        provider,
        showname,
        verified,
        mverified,
        device_type,
        ...defaultValues
    };
};

const getUserName = (user = {}) => {
    if (user.name) {
        return user.name;
    } else if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
        return user.first_name;
    }

    return '';
};

const isUserVerified = ({ email, mobile, emailVerified, mobileVerified } = {}) => {
    if (!email) {
        return strings.enterEmailInProfile;
    } else if (!emailVerified) {
        return strings.verifyEmailFromProfile;
    } else if (!mobile) {
        return strings.enterMobileInProfile;
    } else if (!mobileVerified) {
        return strings.verifyMobileFromProfile;
    }

    return null;
};

export {
    getLocalUserData,
    setLocalUserData,
    deleteUserDataFromLocal,
    extractUserDataFromDBResponse,
    getUserName,
    isUserVerified
};
