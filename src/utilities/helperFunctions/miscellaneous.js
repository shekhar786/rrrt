import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Geolocation from 'react-native-geolocation-service';
import Axios from 'axios';
import cloneDeep from 'clone-deep';

import { GOOGLE_API_KEY } from '../constants/otherConstants';
import { countries } from '../constants/countriesData';
import { fonts } from '../../../assets';
import { layout } from '../layout';
import { strings } from '../../localization';
import store from '../../store';

const requestLocationPermission = () => new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
        return resolve();
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            return resolve();
        }

        console.log('Location permission denied');
        return reject('Location Permission denied');
    }).catch((error) => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
    });
});

const requestCameraPermission = () => new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
        return resolve();
    }

    return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]).then((grantedResponse) => {
        const granted = PermissionsAndroid.RESULTS.GRANTED;
        if (
            grantedResponse['android.permission.CAMERA'] !== granted ||
            grantedResponse['android.permission.READ_EXTERNAL_STORAGE'] !== granted
            || grantedResponse['android.permission.WRITE_EXTERNAL_STORAGE'] !== granted
        ) {
            console.log('You can\'t use the camera');
            Alert.alert(
                strings.permissionToUseCamera,
                strings.weNeedYourPermission
            );
            return reject('Camera permission denied');
        }

        return resolve();
    }).catch((error) => {
        console.log('Ask Camera permission error: ', error);
        return reject(error);
    });
});

const keyExtractor = (item) => String(item.id);

const truncateString = (str, num = 50) => {
    if (str.length > num) {
        return `${str.slice(0, num > 3 ? num - 3 : num)}...`;
    }
    return str;
};

const showErrorAlert = (alertMessage, options = {}) => {
    showMessage({
        message: 'Error!',
        description: String(alertMessage),
        type: 'danger',
        floating: true,
        duration: 4000,
        style: { marginTop: layout.isIOS ? 0 : 20 },
        textStyle: { fontFamily: fonts.regular },
        titleStyle: { fontFamily: fonts.regular },
        // style: { paddingTop: (!layout.isIOS) ? 22 : 0 },
        ...options
    });
};

const showSuccessAlert = (alertMessage, options = {}) => {
    showMessage({
        message: 'Success!',
        description: String(alertMessage),
        type: 'success',
        floating: true,
        duration: 4000,
        style: { marginTop: layout.isIOS ? 0 : 20 },
        textStyle: { fontFamily: fonts.regular },
        titleStyle: { fontFamily: fonts.regular },
        // style: { paddingTop: (!layout.isIOS) ? 22 : 0 },
        ...options
    });
};

const showInfoAlert = (alertMessage, options = {}) => {
    showMessage({
        message: 'Info!',
        description: String(alertMessage),
        type: 'info',
        floating: true,
        duration: 4000,
        style: { marginTop: layout.isIOS ? 0 : 20 },
        textStyle: { fontFamily: fonts.regular },
        titleStyle: { fontFamily: fonts.regular },
        // style: { paddingTop: (!layout.isIOS) ? 22 : 0 },
        ...options
    });
};

const getLocation = () => new Promise(async (resolve, reject) => {
    try {
        await requestLocationPermission();
        return Geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => {
                console.log(error.code, error.message);
                return reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    } catch (error) {
        reject(error);
    }
});

const getCity = (addressResults) => {
    let city = {};
    let region = {};
    let country = {};

    for (let j = 0; j < addressResults.length; j++) {
        for (let i = 0; i < addressResults[j].address_components.length; i++) {
            if (addressResults[j].address_components[i].types[0] === 'locality') {
                //this is the object you are looking for City
                city = addressResults[j].address_components[i];
            }
            if (addressResults[j].address_components[i].types[0] === 'administrative_area_level_1') {
                //this is the object you are looking for State
                region = addressResults[j].address_components[i];
            }
            if (addressResults[j].address_components[i].types[0] === 'country') {
                //this is the object you are looking for country
                country = addressResults[j].address_components[i];
            }
        }
    }

    console.log(`${city.long_name} || ${region.long_name} || ${country.short_name}`);
};

const getLocationAndAddress = () => new Promise(async (resolve, reject) => {
    try {
        await requestLocationPermission();
        return Geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const address = await Axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            latlng: `${position.coords.latitude},${position.coords.longitude}`,
                            key: GOOGLE_API_KEY
                        }
                    });

                    const data = {
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                        address: address.data.results[0].formatted_address
                    };

                    return resolve(data);
                } catch (error) {
                    let err = error;

                    if (error.response) {
                        err = error.response.message;
                    }

                    reject(String(err));
                }
            },
            (error) => {
                console.log('Geolocation service error', JSON.stringify(error));
                console.log(error.code, error.message);
                showErrorAlert(strings.unableToGetLocation, { duration: 5000 });
                return reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    } catch (error) {
        reject(error);
    }
});

const getAppId = () => store.getState().app.appId;

const getCountryName = (countryCode) => {
    let requestedCountryName = '';

    const country = countries.find((c) => c.value.toLowerCase() === countryCode.toLowerCase());

    if (country) {
        requestedCountryName = country.label;
    }

    return requestedCountryName;
};

//to convert Bytes into KB, MB GB etc
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getAPIError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        /* console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers); */


        if (error.response.data && error.response.data.msg) {
            return error.response.data.msg;
        }
    }

    return strings.somethingWentWrong;
};

//output like: "1,000,000,000"
const formatNumber = (number) => String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');

//to find intersection between two arrays
const intersectionBy = (a, b, fn) => {
    const s = new Set(b.map(fn));
    return a.filter(x => s.has(fn(x)));
};

//to generate 6 digits random number
const generateRandomNumber = () => Math.floor((Math.random() * 899999) + 100000);

//to convert milliseconds into minutes and seconds
const msIntoMinutesAndSeconds = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);

    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
};

const distanceBetweenCoords = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }

    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') { dist *= 1.609344; }
    if (unit === 'N') { dist *= 0.8684; }
    return dist;
};

const sortAdsByPrice = (allAds, descending) => {
    const ads = cloneDeep(allAds);

    if (descending) {
        return ads.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    }

    return ads.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
};

const intoHiddenName = (name = '') => {
    let hiddenName = '';
    if (name) {
        const firstCharacter = name.charAt(0);
        const lastCharacter = name.charAt(name.length - 1);

        const clippedName = name.slice(1, -1); //to remove first and last character

        hiddenName = firstCharacter + clippedName.replace(/./g, '*') + lastCharacter;
    }

    return hiddenName;
};

const getSMSDivider = () => (layout.isIOS ? '&' : '?');

export {
    requestLocationPermission,
    requestCameraPermission,
    showErrorAlert,
    showSuccessAlert,
    showInfoAlert,
    getLocation,
    getLocationAndAddress,
    keyExtractor,
    truncateString,
    getAppId,
    getCountryName,
    formatBytes,
    getAPIError,
    formatNumber,
    intersectionBy,
    generateRandomNumber,
    msIntoMinutesAndSeconds,
    distanceBetweenCoords,
    sortAdsByPrice,
    intoHiddenName,
    getSMSDivider
};
