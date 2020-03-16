import { actionTypes } from '../../utilities/constants';

const initialState = {
    loading: false,
    deletingChat: false,
    allChats: [
        // {
        //     key: '0',
        //     text: 'item #0'
        // },
        // {
        //     key: '1',
        //     text: 'item #1'
        // },
    ],
    currentChatData: {}
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SESSION_EXPIRED: {
            return {
                ...state,
                ...initialState
            };
        }
        case actionTypes.GET_ALL_CHATS_REQUESTED:
            return { ...state, loading: true };

        case actionTypes.GET_ALL_CHATS_SUCCEEDED:
        case actionTypes.UPDATE_ALL_CHATS_FROM_SOCKET:
            return {
                ...state,
                loading: false,
                allChats: payload
            };

        case actionTypes.CLEAR_DELETE_CHAT_REQUESTED:
            return { ...state, deletingChat: true };

        case actionTypes.CLEAR_DELETE_CHAT_SUCCEEDED:
            return {
                ...state,
                deletingChat: false,
                // allChats: payload
            };

        case actionTypes.STOP_CHAT_LOADING: {
            return {
                ...state,
                loading: false,
                deletingChat: false,
            };
        }
        case actionTypes.UPDATE_CURRENT_OPENED_CHAT_DATA_REQUESTED: {
            return {
                ...state,
                currentChatData: payload,
            };
        }
        default:
            return state;
    }
};
