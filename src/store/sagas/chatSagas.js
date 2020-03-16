import { call, put } from 'redux-saga/effects';

import logger from '../../utilities/logger';
import { urls, actionTypes, messageTypes } from '../../utilities/constants';
import { request } from '../../utilities/request';
import { getLocalUserData, showErrorAlert, getAPIError } from '../../utilities/helperFunctions';

function* getAllChatsSaga({ params }) {
    try {
        const { token } = yield getLocalUserData();

        const config = {
            url: urls.getAllChats,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

        const response = yield call(request, config);

        logger.data('getAllChats response: ', response.data.data, true);

        const allChats = response.data.data.map((chat) => {
            chat.first_name = chat.receiver_first_name;
            chat.last_name = chat.receiver_last_name;
            chat.name = chat.receiver_name;

            return chat;
        });
        yield put({
            type: actionTypes.GET_ALL_CHATS_SUCCEEDED,
            payload: allChats
        });
    } catch (error) {
        logger.apiError('getAllChats error: ', error);

        yield put({
            type: actionTypes.STOP_CHAT_LOADING
        });
    }
}

function* getChatMessagesSaga({ params }) {
    const { queryParams, apiUrl, cb } = params;

    try {
        const { token } = yield getLocalUserData();

        const config = {
            url: apiUrl,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: queryParams
        };

        // logger.log('getChatMessages params: ', config);
        const response = yield call(request, config);

        logger.data('getChatMessages response; ', response.data.data, true);

        const messages = response.data.data.map((messageData) => {
            const message = {
                user: {
                    _id: messageData.sender_id
                },
                createdAt: messageData.created_at,
                _id: messageData.id,
                message_status: messageData.message_status
            };

            if (messageData.msgtype === messageTypes.text) {
                message.text = messageData.message;
            } else if (messageData.msgtype === messageTypes.image) {
                message.image = messageData.message;
            } else if (messageData.msgtype === messageTypes.file) {
                message.text = messageData.message;
            }

            return message;
        });

        cb(null, messages);
    } catch (error) {
        logger.apiError('getChatMessages error: ', error);

        if (cb) {
            cb(error);
        }
    }
}

function* clearOrDeleteChatSaga({ params }) {
    try {
        const { chatId, otherUserId, operationType } = params;

        logger.data('clearOrDeleteChat params', params);
        const { token } = yield getLocalUserData();

        const config = {
            url: urls.clearOrDeleteChat,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                chat_id: chatId,
                user_id: otherUserId,
                type: operationType
            }
        };

        const response = yield call(request, config);

        logger.data('clearOrDeleteChat response: ', response.data);

        yield put({
            type: actionTypes.CLEAR_DELETE_CHAT_SUCCEEDED,
            // payload: response.data.data
        });

        yield put({
            type: actionTypes.GET_ALL_CHATS_REQUESTED,
            params: {}
        });
    } catch (error) {
        logger.apiError('clearOrDeleteChat error: ', error);

        showErrorAlert(getAPIError(error));

        yield put({
            type: actionTypes.STOP_CHAT_LOADING
        });
    }
}

export {
    getAllChatsSaga,
    getChatMessagesSaga,
    clearOrDeleteChatSaga
};
