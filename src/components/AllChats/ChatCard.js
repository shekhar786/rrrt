import React from 'react';
import {
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
    colors,
    screenNames,
    urls,
    messageTypes,
    commonColors,
    MESSAGE_STATUS
} from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { navigate } from '../../utilities/NavigationService';
import { intoHiddenName, getUserName } from '../../utilities/helperFunctions';

dayjs.extend(relativeTime);

const ChatCard = ({ chat, userId }) => {
    let profileImage = icons.ic_edit_profile_shilenga;

    if (chat.receiver_image) {
        profileImage = {
            uri: urls.imagePath + chat.receiver_image
        };
    }

    let lastMessage = null;

    if (chat.msgtype === messageTypes.text) {
        lastMessage = (
            <Text
                style={styles.lastMessage}
                numberOfLines={2}
            >
                {chat.message}
            </Text>
        );
    } else if (chat.msgtype === messageTypes.image) {
        lastMessage = (
            <Text
                style={styles.lastMessage}
                numberOfLines={2}
            >
                Image
            </Text>
        );
    } else if (chat.msgtype === messageTypes.file) {
        lastMessage = (
            <Text
                style={styles.lastMessage}
                numberOfLines={2}
            >
                File
            </Text>
        );
    }

    const onChatCardPress = () => navigate(screenNames.OneToOneChat, {
        chatData: chat
    });
    const renderUnreadChatStatus = () => {
        if (chat.message_status !== MESSAGE_STATUS.read && chat.sender_id !== userId) {
            return <View style={styles.unreadChatView} />;
        }

        return (
            <View
                style={{
                    ...styles.unreadChatView,
                    backgroundColor: 'transparent'
                }}
            />
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={onChatCardPress}
        >
            <View style={styles.profileImageContainer}>
                <Image source={profileImage} style={styles.profileImage} />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.usernameAndTimeContainer}>
                    <Text style={styles.username}>
                        {/* {chat.receiver_name} */}
                        {chat.receiver_showname
                            ? getUserName(chat)
                            : intoHiddenName(getUserName(chat))
                        }
                    </Text>

                    <View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.time}>
                                {dayjs(chat.created_atz).fromNow()}
                            </Text>
                            <Image source={icons.ic_right_arrow} />
                        </View>

                        {renderUnreadChatStatus()}
                    </View>
                </View>

                <Text
                    style={styles.title}
                    numberOfLines={2}
                >
                    {chat.post ? chat.post.title : ''}
                </Text>

                {lastMessage}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: moderateScale(15),
        paddingRight: moderateScale(15),
        borderBottomWidth: moderateScale(1.5),
        borderBottomColor: colors.grey9,
        backgroundColor: colors.white1
    },
    profileImageContainer: {
        height: moderateScale(48),
        width: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: colors.grey9,
        overflow: 'hidden'
    },
    profileImage: {
        height: moderateScale(48),
        width: moderateScale(48)
    },
    rightContainer: {
        flex: 1,
        marginLeft: moderateScale(15)
    },
    usernameAndTimeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    username: {
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(16)
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    time: {
        fontFamily: fonts.regular,
        color: colors.grey5,
        fontSize: moderateScale(14)
    },
    lastMessage: {
        marginTop: moderateScale(5),
        fontFamily: fonts.regular,
        color: colors.grey1,
        fontSize: moderateScale(14)
    },
    title: {
        fontFamily: fonts.regular,
        color: colors.black12,
        fontSize: moderateScale(14)
    },
    unreadChatView: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: commonColors().themeColor,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10
    }
});

export { ChatCard };
