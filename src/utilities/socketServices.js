import io from 'socket.io-client';

import logger from './logger';
import { urls } from './constants';

class WSService {
    initializeSocket = (userToken) => {
        try {
            logger.log('initializing socket');

            if (!userToken) {
                logger.error('Skipping socket initialization.', 'userToken not found');
                return;
            }

            this.socket = io(urls.socketUrl, {
                transports: ['websocket'],
                query: {
                    accessToken: userToken,
                }
            });

            this.socket.on('connect', () => {
                logger.log('===== socket connected =====');
            });

            this.socket.on('disconnect', () => {
                logger.error('socket disconnected');
            });

            this.socket.on('connect_error', (err) => {
                // console.log('socket connection error: ', err);
                // logger.data('socket connection error: ', err);
            });

            this.socket.on('error', (err) => {
                // console.log('socket error: ', err);
                logger.data('socket error: ', err);
            });

            // this.socket.on('reconnect_attempt', () => {
            //     console.log('reconnecting');
            //     socket.io.opts.transports = ['polling', 'websocket'];
            // });

            // this.socket.on('connection-Response', (data) => {
            //     console.log('data received from server is: ', data);
            // });
        } catch (error) {
            logger.error('initialize token error: ', error);
        }
    };

    emit(event, data = {}) {
        logger.log('event to be emitted is: ', event);
        this.socket.emit(event, data);
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }

    sendChatMessage(
        event,
        chatId,
        text,
        userId,
        receiverId,
        type,
        mediaName,
        tempId
    ) {
        console.log('emitting message: ',
            event,
            chatId,
            text,
            userId,
            receiverId,
            type,
            mediaName,
            tempId
        );
        this.socket.emit(
            event,
            chatId,
            text,
            userId,
            receiverId,
            type,
            mediaName,
            tempId
        );
    }

    isUserTyping(
        event,
        userID,
        chatID
    ) {
        this.socket.emit(
            event,
            userID,
            chatID
        );
    }

    viewChat(
        event,
        userID,
        chatID
    ) {
        console.log('view chat data is: ',
            event,
            userID,
            chatID
        );
        this.socket.emit(
            event,
            userID,
            chatID
        );
    }

    removeListener(listenerName) {
        this.socket.removeListener(listenerName);
    }
}

const socketServices = new WSService();

export default socketServices;
