import Axios, { AxiosRequestConfig } from 'axios';

import { urls, actionTypes } from './constants';
import store from '../store';

const axios = Axios.create({
    baseURL: urls.baseUrl,
    validateStatus: (status) => {
        if (status === 200 || status === 401) {
            return true;
        }
        return false;
    },
    timeout: 30000 //30 seconds
});

export const request = (config: AxiosRequestConfig) => axios(config).then((response) => {
    if (response.status === 401) {
        return store.dispatch({
            type: actionTypes.SESSION_EXPIRE_REQUESTED,
            params: {
                hideAlert: false
            }
        });
    }

    return response;
});
