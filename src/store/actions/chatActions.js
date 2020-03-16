import { actionTypes } from '../../utilities/constants';

const getAllChats = (params) => ({
    type: actionTypes.GET_ALL_CHATS_REQUESTED,
    params
});

const getChatMessages = (params) => ({
    type: actionTypes.GET_CHAT_MESSAGES_REQUESTED,
    params
});

const clearOrDeleteChat = (params) => ({
    type: actionTypes.CLEAR_DELETE_CHAT_REQUESTED,
    params
});

const updateAllChatsFromSocket = (payload) => ({
    type: actionTypes.UPDATE_ALL_CHATS_FROM_SOCKET,
    payload
});

const updateCurrentOpenedChatData = (payload) => ({
    type: actionTypes.UPDATE_CURRENT_OPENED_CHAT_DATA_REQUESTED,
    payload
});

export {
    getAllChats,
    getChatMessages,
    clearOrDeleteChat,
    updateAllChatsFromSocket,
    updateCurrentOpenedChatData
};
