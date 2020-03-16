import React, { PureComponent } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Platform,
    RefreshControl
} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { moderateScale } from 'react-native-size-matters';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import cloneDeep from 'clone-deep';

import {
    Wrapper,
    HeaderWithLeftTitle,
    Button,
    EmptyListComponent,
    Loader
} from '../../components/common';
import {
    colors,
    screenNames,
    chatOperationTypes,
    socketEvents,
    MESSAGE_STATUS
} from '../../utilities/constants';
import { ChatCard } from '../../components/AllChats';
import { strings } from '../../localization';
import { navigate } from '../../utilities/NavigationService';
import commonStyles from '../../utilities/commonStyles';
import { icons, fonts } from '../../../assets';
import { getAllChats, clearOrDeleteChat, updateAllChatsFromSocket } from '../../store/actions';
import { keyExtractor } from '../../utilities/helperFunctions';
import socketServices from '../../utilities/socketServices';
import logger from '../../utilities/logger';

const BUTTONSiOS = [
    // 'Clear Chat',
    'Delete Chat',
    'Cancel'
];

const BUTTONSandroid = [
    // 'Clear Chat',
    'Delete Chat',
];

class AllChats extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            listViewData: Array(2)
                .fill('')
                .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
        };

        this.rowSwipeAnimatedValues = {};
        Array(2)
            .fill('')
            .forEach((_, i) => {
                this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
            });
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        if (this.props.userId) {
            this.addSocketListeners();
        }

        this.props.getAllChats();
    }

    componentWillUnmount() {
        this._navListener.remove();
        socketServices.removeListener(socketEvents.onMessageReceivedOnAllChatsScreen);
    }

    onLoginPress = () => navigate(screenNames.Login, { hasComeFromMainApp: true });

    onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
        this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    onRefreshChats = () => this.props.getAllChats();

    addSocketListeners = () => {
        const { userId } = this.props;
        socketServices.on(socketEvents.onMessageReceivedOnAllChatsScreen, (messageData) => {
            logger.log('message received on AllChats Screen is: ', messageData);

            /* if (
                messageData.senderId === userId //other user sent the message
                && messageData.chatId !== this.props.currentChatData.chatId //other chat is opened
                // && messageData.receiverId !== this.props.currentChatData.receiverid
            ) { //other user sent the message. mark the message as delivered
                console.log('other chat is opened');
                socketServices.emit(socketEvents.deliverMessage, messageData);
            } */

            if (
                messageData.senderId !== userId //other user sent the message
                && messageData.chatId !== this.props.currentChatData.chatId //other chat is opened
            ) { //other user sent the message. mark the message as delivered
                socketServices.emit(socketEvents.deliverMessage, messageData);
            }

            const chat = this.props.allChats.find((c) => c.chat_id === messageData.chatId);

            if (chat) {
                let updatedAllChats = cloneDeep(this.props.allChats);

                updatedAllChats = updatedAllChats.map((chat) => {
                    if (chat.chat_id === messageData.chatId) {
                        chat.message = messageData.message;
                        chat.msgtype = messageData.messageType;
                        chat.created_atz = messageData.created_at;

                        if (messageData.senderId !== this.props.userId) {
                            chat.message_status = MESSAGE_STATUS.delivered;
                        }
                    }

                    return chat;
                });

                logger.data('updated chats: ', updatedAllChats, true);

                this.props.updateAllChatsFromSocket(updatedAllChats);
            } else {
                this.props.getAllChats();
            }
        });
    };

    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow(rowMap, rowKey) {
        this.closeRow(rowMap, rowKey);
        const newData = [...this.state.listViewData];
        const prevIndex = this.state.listViewData.findIndex(
            item => item.key === rowKey
        );
        newData.splice(prevIndex, 1);
        this.setState({ listViewData: newData });
    }

    openActionSheet = ({ item }) => {
        ActionSheet.showActionSheetWithOptions({
            options: (Platform.OS === 'ios') ? BUTTONSiOS : BUTTONSandroid,
            cancelButtonIndex: 1,
        },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.props.clearOrDeleteChat({
                            chatId: item.chat_id,
                            otherUserId: item.receiverid,
                            operationType: chatOperationTypes.delete
                        });
                        break;

                    default:
                        break;
                }
            }
        );
    };

    renderChat = ({ item }) => <ChatCard chat={item} userId={this.props.userId} />;

    renderHiddenItem = (data, rowMap) => (
        <View style={styles.hiddenContainer}>
            <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                    // this.closeRow(rowMap, data.item.key);
                    this.openActionSheet(data);
                }}
                activeOpacity={0.6}
            >
                <Image source={icons.ic_chat_more} />
                <Text style={styles.moreText}>
                    {strings.more}
                </Text>
            </TouchableOpacity>
        </View>
    );

    renderListEmptyComponent = () => {
        const { loading } = this.props;

        if (loading) {
            return null;
        }

        return (
            <EmptyListComponent
                message={strings.noChatsYet}
                emptyTextStyle={commonStyles.emptyListText}
                containerStyle={commonStyles.emptyListContainer}
            />
        );
    };

    render() {
        const { userId, allChats, loading, deletingChat } = this.props;

        let content = (
            <View style={commonStyles.guestUserView}>
                <Text style={commonStyles.guestUserMessage}>
                    {strings.formatString(strings.pleaseLoginFirst, strings.accessTheChats)}
                </Text>
                <Button
                    onPress={this.onLoginPress}
                    label={strings.login}
                    style={commonStyles.loginButton}
                />
            </View>
        );

        if (userId) {
            content = (
                <>
                    <SwipeListView
                        data={allChats}
                        previewRowKey={'0'}
                        rightOpenValue={-moderateScale(90)}
                        previewOpenValue={-moderateScale(90)}
                        previewOpenDelay={3000}
                        disableRightSwipe
                        contentContainerStyle={styles.listContainer}
                        keyExtractor={keyExtractor}
                        showsVerticalScrollIndicator={false}

                        renderItem={this.renderChat}
                        renderHiddenItem={this.renderHiddenItem}
                        ListEmptyComponent={this.renderListEmptyComponent}

                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={this.onRefreshChats}
                            />
                        }

                    // onRowDidOpen={this.onRowDidOpen}
                    // onSwipeValueChange={this.onSwipeValueChange}
                    />
                    <Loader
                        isLoading={deletingChat}
                        isAbsolute
                    />
                </>
            );
        } else if (userId && allChats.length === 0 && loading) {
            content = (
                <Loader isLoading />
            );
        } else if (userId && allChats.length === 0) {
            content = (
                <EmptyListComponent
                    message={strings.noChatsYet}
                    emptyTextStyle={commonStyles.emptyListText}
                />
            );
        }

        return (
            <Wrapper wrapperStyle={styles.wrapperStyle}>
                <HeaderWithLeftTitle
                    leftTitle={strings.chats}
                    containerStyle={styles.headerContainer}
                />

                {content}
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    listContainer: {
        paddingBottom: moderateScale(60),
        paddingLeft: moderateScale(15)
    },
    headerContainer: {
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    hiddenContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    moreButton: {
        flex: 1,
        width: moderateScale(90),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.grey2,
    },
    moreText: {
        color: colors.white1,
        fontFamily: fonts.regular,
        fontSize: moderateScale(16)
    }
});

const mapStateToProps = ({ user, chat, lang }) => ({
    userId: user.id,
    loading: chat.loading,
    deletingChat: chat.deletingChat,
    allChats: chat.allChats,
    selectedLanguage: lang.selectedLanguage,
    currentChatData: chat.currentChatData
});

export default connect(mapStateToProps, {
    getAllChats,
    clearOrDeleteChat,
    updateAllChatsFromSocket
})(AllChats);
