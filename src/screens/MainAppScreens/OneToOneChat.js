/* eslint-disable no-unreachable */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    View,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { withNavigationFocus } from 'react-navigation';
import * as mime from 'react-native-mime-types';
import {
    GiftedChat,
    Bubble,
    Send,
    InputToolbar,
    Composer,
    MessageText,
    Day,
} from 'react-native-gifted-chat';
import { ActionSheetCustom } from 'react-native-actionsheet';
import ActionSheet from 'react-native-action-sheet';
import cloneDeep from 'clone-deep';
import uuid from 'uuid';

import { Wrapper, Header, WhiteContainer, Loader } from '../../components/common';
import {
    colors,
    commonColors,
    inputToolbarOptions,
    messageTypes,
    socketEvents,
    screenNames,
    urls,
    MIME_TYPE,
    defaultChatMessageCount,
    MESSAGE_STATUS
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack, navigate } from '../../utilities/NavigationService';
import commonStyles from '../../utilities/commonStyles';
import logger from '../../utilities/logger';
import socketServices from '../../utilities/socketServices';
import { strings } from '../../localization';
import { ActionSheetButton } from '../../components/OneToOneChat';
import {
    getAppId,
    showErrorAlert,
    intoHiddenName,
    getUserName
} from '../../utilities/helperFunctions';
import { layout } from '../../utilities/layout';
import {
    getChatMessages,
    uploadMedia,
    getAllChats,
    updateCurrentOpenedChatData
} from '../../store/actions';

class OneToOneChat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loadingInitialChatMessages: true,
            loadingEarlier: false,
            uploadingMedia: false,
            pageNo: 1, //to load next messages
            showLoadEarlier: false
        };

        this.chatActionsSheet = React.createRef();
        this.chatData = props.navigation.getParam('chatData', {});
        props.updateCurrentOpenedChatData(this.chatData);
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.initializeSocketListeners();
        this.getChatHistory();
    }

    componentWillUnmount() {
        socketServices.removeListener(socketEvents.onMessageReceived);
        this._navListener.remove();

        this.props.getAllChats();
        this.props.updateCurrentOpenedChatData({});
    }

    onLeftPress = () => goBack();

    onSend = (messages = []) => {
        if (messages[0].text.trim()) {
            const { userId } = this.props;
            const { receiverid, post_id } = this.chatData;

            const messageToBeSent = {
                senderId: userId,
                receiverId: receiverid,
                appId: getAppId(),
                messageType: messageTypes.text,
                message: messages[0].text,
                postId: post_id,
                tempMessageId: messages[0]._id //used to identify and change the status of the local message
            };

            logger.log('messageToBeSent: ', messageToBeSent);

            //send message to the server
            socketServices.emit(socketEvents.sendMessage, messageToBeSent);

            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }));
        }
    };

    onChatActionSheetPress = async (index) => {
        try {
            const { userId, isFocused } = this.props;
            const { receiverid, post_id } = this.chatData;

            switch (index) {
                case 0: { //camera
                    const imagePickerOptions = {
                        compressImageQuality: 0.4,
                    };

                    const pickedImage = await ImagePicker.openCamera(imagePickerOptions);

                    logger.log('Picked image is: ', pickedImage);

                    const data = new FormData();

                    data.append('filenames[0]', {
                        uri: layout.isIOS ? `file:///${pickedImage.path}` : pickedImage.path,
                        name: 'image.jpg',
                        type: MIME_TYPE.image
                    });

                    this.setState({ uploadingMedia: true });

                    this.props.uploadMedia({
                        data,
                        cb: (error, uploadedFiles) => {
                            if (isFocused) {
                                this.setState({ uploadingMedia: false });
                            }

                            if (error) {
                                return showErrorAlert(error);
                            }

                            const messages = uploadedFiles.map((file) => {
                                const messageId = uuid();

                                const messageToBeSent = {
                                    senderId: userId,
                                    receiverId: receiverid,
                                    appId: getAppId(),
                                    messageType: messageTypes.image,
                                    message: urls.imagePath + file,
                                    postId: post_id,
                                    tempMessageId: messageId
                                };

                                logger.log('messageToBeSent: ', messageToBeSent);

                                //send message to the server
                                socketServices.emit(socketEvents.sendMessage, messageToBeSent);

                                return {
                                    image: urls.imagePath + file,
                                    user: { _id: userId },
                                    createdAt: new Date(),
                                    _id: messageId
                                };
                            });

                            this.setState(previousState => ({
                                messages: GiftedChat.append(previousState.messages, messages),
                            }));
                        }
                    });
                    break;
                }

                case 1: { //Photo & Library
                    const imagePickerOptions = {
                        compressImageQuality: 0.4,
                        multiple: true,
                        maxFiles: 6
                    };

                    const pickedImages = await ImagePicker.openPicker(imagePickerOptions);

                    logger.log('Picked images are: ', pickedImages);

                    const data = new FormData();

                    pickedImages.forEach((pickedImage, i) => {
                        data.append(`filenames[${i}]`, {
                            uri: layout.isIOS ? `file:///${pickedImage.path}` : pickedImage.path,
                            name: 'image.jpg',
                            type: MIME_TYPE.image
                        });
                    });

                    this.setState({ uploadingMedia: true });

                    this.props.uploadMedia({
                        data,
                        cb: (error, uploadedFiles) => {
                            if (isFocused) {
                                this.setState({ uploadingMedia: false });
                            }

                            if (error) {
                                return showErrorAlert(error);
                            }

                            const messages = uploadedFiles.map((file) => {
                                const messageId = uuid();
                                const messageToBeSent = {
                                    senderId: userId,
                                    receiverId: receiverid,
                                    appId: getAppId(),
                                    messageType: messageTypes.image,
                                    message: urls.imagePath + file,
                                    postId: post_id,
                                    tempMessageId: messageId
                                };

                                logger.log('messageToBeSent: ', messageToBeSent);

                                //send message to the server
                                socketServices.emit(socketEvents.sendMessage, messageToBeSent);

                                return {
                                    image: urls.imagePath + file,
                                    user: { _id: userId },
                                    createdAt: new Date(),
                                    _id: messageId
                                };
                            });

                            this.setState(previousState => ({
                                messages: GiftedChat.append(previousState.messages, messages),
                            }));
                        }
                    });

                    break;
                }

                case 2: { //Document
                    return;
                    const documents = await DocumentPicker.pickMultiple({
                        type: [
                            // mime.lookup('docx'),
                            // mime.lookup('xlsx'),
                            // mime.lookup('doc'),
                            // mime.lookup('xls'),
                            mime.lookup('pdf'),
                        ]
                    });

                    logger.log('Picked documents are: ', documents);

                    const data = new FormData();

                    documents.forEach((pickedDoc, i) => {
                        data.append(`filenames[${i}]`, {
                            uri: layout.isIOS ? `file:///${pickedDoc.uri}` : pickedDoc.uri,
                            name: 'file.doc',
                            type: pickedDoc.type
                        });
                    });

                    this.setState({ uploadingMedia: true });

                    this.props.uploadMedia({
                        data,
                        cb: (error, uploadedFiles) => {
                            if (isFocused) {
                                this.setState({ uploadingMedia: false });
                            }

                            if (error) {
                                return showErrorAlert(error);
                            }

                            const messages = uploadedFiles.map((file) => {
                                const messageId = uuid();
                                const messageToBeSent = {
                                    senderId: userId,
                                    receiverId: receiverid,
                                    appId: getAppId(),
                                    messageType: messageTypes.file,
                                    message: urls.imagePath + file,
                                    postId: post_id,
                                    tempMessageId: messageId
                                };

                                logger.log('messageToBeSent: ', messageToBeSent);

                                //send message to the server
                                socketServices.emit(socketEvents.sendMessage, messageToBeSent);

                                return {
                                    image: urls.imagePath + file,
                                    user: { _id: userId },
                                    createdAt: new Date(),
                                    _id: messageId
                                };
                            });

                            this.setState(previousState => ({
                                messages: GiftedChat.append(previousState.messages, messages),
                            }));
                        }
                    });
                    break;
                }
                case 3: { //Location
                    return;
                    navigate(screenNames.ChooseLocation, {
                        onLocationSelect: (selectedLocation) => {
                            logger.data('selected location is: ', selectedLocation);

                            // const messageToBeSent = {
                            //     senderId: userId,
                            //     receiverId: receiverid,
                            //     appId: getAppId(),
                            //     messageType: messageTypes.text,
                            //     message: messages[0].text,
                            //     postId: post_id
                            // };
                        }
                    });
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            logger.error('Actions error: ', error);
        }
    };

    getChatHistory = () => {
        this.setState({ loadingEarlier: true });

        const { userId, isFocused } = this.props;
        const { post_id, receiverid } = this.chatData;
        const { pageNo } = this.state;

        const callback = (error, allMessages) => {
            if (isFocused) {
                this.setState({
                    loadingEarlier: false,
                    loadingInitialChatMessages: false
                });
            }

            if (error) {
                return;
            }

            if (allMessages.length < defaultChatMessageCount && isFocused) {
                this.setState({ showLoadEarlier: false });
            }

            logger.log('all messasges: ', allMessages);

            if (isFocused) {
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, allMessages),
                    pageNo: this.state.pageNo + 1
                }));
            }
        };

        const queryParams = {
            user_one: userId,
            user_two: receiverid,
            post_id,
            pageno: pageNo,
            pageoffset: defaultChatMessageCount //load defaultChatMessageCount(30) messages
        };

        this.props.getChatMessages({
            queryParams,
            cb: callback,
            apiUrl: urls.getChatHistory
        });
    };

    getInputToolbarOptions = () => inputToolbarOptions.map((option) => {
        if (!option.id) { //cancel button
            return option;
        }

        return (
            <ActionSheetButton
                label={option.title}
                icon={option.icon}
            />
        );
    });

    initializeSocketListeners = () => {
        if (!socketServices.socket.connected) { //connect socket
            socketServices.socket.connect();
        }

        socketServices.on(socketEvents.onMessageReceived, (messageData) => {
            logger.log('message received is: ', messageData);

            if (
                this.chatData.post_id === messageData.postId &&
                messageData.senderId === this.chatData.receiverid
            ) { //message sent by the other user
                const message = {
                    user: { _id: messageData.senderId },
                    createdAt: messageData.created_at,
                    _id: messageData.messageId
                };

                if (messageData.messageType === messageTypes.text) {
                    message.text = messageData.message;
                } else if (messageData.messageType === messageTypes.image) {
                    message.image = messageData.message;
                } else if (messageData.messageType === messageTypes.file) {
                    message.text = messageData.message;
                }

                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, [message]),
                }));

                //read message
                socketServices.emit(socketEvents.readMessage, messageData);
            }
        });

        socketServices.on(socketEvents.ackDeliveredMessage, (messageData) => {
            if (
                this.chatData.post_id === messageData.postId &&
                messageData.receiverId === this.chatData.receiverid
            ) {
                let allMessages = cloneDeep(this.state.messages);
                allMessages = allMessages.map((message) => {
                    if (message._id === messageData.tempMessageId
                        && message.message_status !== MESSAGE_STATUS.read
                    ) { //tempMessageId is used to identify and change the status of the local message
                        message.message_status = MESSAGE_STATUS.delivered;
                    }

                    return message;
                });

                this.setState({ messages: allMessages });
            }
        });

        socketServices.on(socketEvents.ackReadMessage, (messageData) => {
            if (
                this.chatData.post_id === messageData.postId &&
                messageData.receiverId === this.chatData.receiverid
            ) {
                let allMessages = cloneDeep(this.state.messages);
                allMessages = allMessages.map((message) => {
                    if (message._id === messageData.tempMessageId) { //tempMessageId is used to identify and change the status of the local message
                        message.message_status = MESSAGE_STATUS.read;
                    }

                    return message;
                });

                this.setState({ messages: allMessages });
            }
        });
    };

    renderBubble = (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                left: {
                    ...styles.commonBorderRadius,
                    backgroundColor: colors.grey9
                },
                right: {
                    ...styles.commonBorderRadius,
                    backgroundColor: commonColors().themeColor
                }
            }}
            containerToNextStyle={{
                left: styles.commonBorderRadius,
                right: styles.commonBorderRadius
            }}
            containerToPreviousStyle={{
                left: styles.commonBorderRadius,
                right: styles.commonBorderRadius
            }}
        />
    );

    renderMessageText = (props) => (
        <MessageText
            {...props}
            textStyle={{
                left: styles.leftMessageText,
                right: styles.rightMessageText
            }}
            linkStyle={{
                left: styles.linkstyle,
                right: styles.linkstyle
            }}
        />
    );

    renderSend = (props) => (
        <Send
            {...props}
            containerStyle={styles.sendContainerStyle}
            sendButtonProps={{ activeOpacity: 0.6 }}
        >
            <Image
                source={icons.ic_send}
                style={styles.send}
            />
        </Send>
    );

    renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            primaryStyle={styles.inputToolbarPrimary}
            containerStyle={styles.inputToolbarContainer}
        />
    );

    renderComposer = (props) => (
        <Composer
            {...props}
            textInputStyle={styles.textInput}
        />
    );

    renderActions = () => (
        <TouchableOpacity
            onPress={() => {
                if (layout.isIOS) {
                    ActionSheet.showActionSheetWithOptions({
                        options: inputToolbarOptions.map((option) => option.title || option),
                        cancelButtonIndex: 2,
                        // tintColor: colors.olive1,
                        title: strings.chooseImagesFrom
                    }, (index) => this.onChatActionSheetPress(index));
                } else {
                    this.chatActionsSheet.current.show();
                }
            }}
            activeOpacity={0.6}
            style={styles.actionsButton}
        >
            <Image
                source={icons.ic_ad_plus}
                style={styles.addButton}
            />
        </TouchableOpacity>
    );

    renderTime = () => null;

    renderChatFooter = () => <View style={styles.chatFooter} />;

    renderAvatar = (props) => {
        const { _id } = props.currentMessage.user;
        const { userId, profile_image } = this.props;

        let profileImage = icons.ic_edit_profile_shilenga;

        if (_id === userId && profile_image) {
            profileImage = {
                uri: urls.imagePath + profile_image
            };
        } else if (_id === this.chatData.receiverid && this.chatData.receiver_image) {
            profileImage = {
                uri: urls.imagePath + this.chatData.receiver_image
            };
        }

        return (
            <View style={styles.avatarContainer}>
                <Image
                    source={profileImage}
                    style={styles.avatar}
                />
            </View>
        );
    };

    renderDay = (props) => (
        <Day
            {...props}
            textStyle={styles.day}
        />
    );

    renderTicks = (currentMessage) => {
        if (currentMessage.user._id !== this.props.userId) {
            return null;
        }

        let tickIcon = icons.ic_sent;

        if (currentMessage.message_status === MESSAGE_STATUS.delivered) {
            tickIcon = icons.ic_deliverd;
        } else if (currentMessage.message_status === MESSAGE_STATUS.read) {
            tickIcon = icons.ic_seen;
        }

        return (
            <Image
                source={tickIcon}
                style={styles.tick}
            />
        );
    };

    render() {
        const { userId } = this.props;

        const {
            loadingInitialChatMessages,
            uploadingMedia,
            loadingEarlier,
            showLoadEarlier
        } = this.state;

        let content = (
            <Loader
                isLoading
                isAbsolute
                containerStyle={styles.gettingChatHistoryLoader}
                loaderColor={commonColors().themeColor}
            />
        );

        if (!loadingInitialChatMessages) {
            content = (
                <GiftedChat
                    alwaysShowSend
                    scrollToBottom
                    showUserAvatar
                    extraData={{ loadingEarlier }}
                    user={{ _id: userId }}
                    messages={this.state.messages}
                    placeholder={strings.writeYourMessageHere}
                    onSend={this.onSend}
                    minComposerHeight={layout.isIOS ? 50 : 40}
                    maxComposerHeight={130}
                    loadEarlier={showLoadEarlier}
                    isLoadingEarlier={loadingEarlier}
                    onLoadEarlier={this.getChatHistory}
                    renderTicks={this.renderTicks}

                    renderTime={this.renderTime}
                    renderSend={this.renderSend}
                    renderBubble={this.renderBubble}
                    renderAvatar={this.renderAvatar}

                    renderComposer={this.renderComposer}
                    renderInputToolbar={this.renderInputToolbar}
                    renderActions={this.renderActions}
                    renderMessageText={this.renderMessageText}
                    renderChatFooter={this.renderChatFooter}
                    renderDay={this.renderDay}
                    bottomOffset={layout.isIOS ? -20 : 0}
                    renderLoading={() => <Loader isLoading />}
                />
            );
        }

        return (
            <Wrapper wrapperStyle={styles.wrapperStyle}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onLeftPress}
                    title={this.chatData.receiver_showname
                        ? getUserName(this.chatData)
                        : intoHiddenName(getUserName(this.chatData))
                    }
                    containerStyle={styles.header}
                    showBottomBorder={Platform.OS === 'android'}
                    blackTitle
                />

                <WhiteContainer>
                    {content}

                    <ActionSheetCustom
                        ref={this.chatActionsSheet}
                        options={this.getInputToolbarOptions()}
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={this.onChatActionSheetPress}
                        styles={{
                            buttonBox: styles.actionSheetButtonBox,
                            buttonText: styles.actionSheetButtonText,
                        }}
                    />

                    <Loader
                        isLoading={uploadingMedia}
                        isAbsolute
                    />
                </WhiteContainer>
            </Wrapper >
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        backgroundColor: colors.white1,
        ...commonStyles.shadow,
        shadowRadius: moderateScale(2),
        elevation: 0,
        marginBottom: moderateScale(5)
    },
    sendContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(12),
    },
    commonBorderRadius: {
        borderTopLeftRadius: moderateScale(8),
        borderTopRightRadius: moderateScale(8),
        borderBottomLeftRadius: moderateScale(8),
        borderBottomRightRadius: moderateScale(8),
    },
    leftMessageText: {
        fontFamily: fonts.regular,
        color: colors.grey10
    },
    rightMessageText: {
        fontFamily: fonts.regular,
        color: colors.white1
    },
    linkstyle: {
        fontFamily: fonts.regular,
    },
    inputToolbarPrimary: {
        alignItems: 'center',
    },
    textInput: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        borderRadius: moderateScale(24),
        borderWidth: moderateScale(0.5),
        borderColor: colors.black3,
        paddingHorizontal: moderateScale(15),
        paddingTop: layout.isIOS ? moderateScale(18) : moderateScale(15),
        paddingBottom: moderateScale(15)
    },
    actionWrapper: {
        borderWidth: 0
    },
    chatFooter: {
        height: moderateScale(20)
    },
    inputToolbarContainer: {
        paddingVertical: layout.isIOS ? 0 : moderateScale(10)
    },
    actionSheetButtonBox: {
        height: moderateScale(58),
        alignItems: 'flex-start',
    },
    actionSheetButtonText: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden'
    },
    avatar: {
        width: 36,
        height: 36,
    },
    actionsButton: {
        minHeight: moderateScale(40),
        width: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    gettingChatHistoryLoader: {
        backgroundColor: colors.white1
    },
    day: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(12)
    },
    send: { tintColor: commonColors().themeColor },
    addButton: { tintColor: commonColors().themeColor },
    tick: {
        marginHorizontal: 5,
    }
});

const mapStateToProps = ({ user, lang }) => ({
    userId: user.id,
    profile_image: user.profile_image,
    token: user.userToken,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    getChatMessages,
    uploadMedia,
    getAllChats,
    updateCurrentOpenedChatData
})(withNavigationFocus(OneToOneChat));
