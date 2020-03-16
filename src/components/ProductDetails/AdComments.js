import React, { PureComponent } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import dayjs from 'dayjs';

import { colors, commonColors, urls } from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { strings } from '../../localization';
import { Loader } from '../common';

class AdComments extends PureComponent {
    state = {
        comment: ''
    };

    onCommentTextChange = (comment) => this.setState({ comment });

    onSendCommentPress = () => {
        const { onSendCommentPress } = this.props;
        const { comment } = this.state;

        if (!comment.trim()) {
            return;
        }

        onSendCommentPress(comment.trim());

        this.setState({ comment: '' });
    };

    renderSend = () => {
        if (this.state.comment.trim()) {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.sendButton}
                    onPress={this.onSendCommentPress}
                >
                    <Image
                        source={icons.ic_send}
                        style={styles.sendImage}
                    />
                </TouchableOpacity>
            );
        }

        return null;
    };

    renderTextInput = () => {
        const { comment } = this.state;

        if (!this.props.hideTextInput) {
            return (
                <View style={styles.commentInputContainer}>
                    <TextInput
                        multiline
                        value={comment}
                        onChangeText={this.onCommentTextChange}
                        style={styles.textInput}
                        placeholder={strings.writeAComment}
                    />

                    {this.renderSend()}
                </View>
            );
        }

        return null;
    };

    render() {
        const { comments, loadingComments } = this.props;

        let commentsCount = `${comments.length} ${strings.comments}`;

        if (comments.length === 0) {
            commentsCount = strings.noCommentsYet;
        }

        if (loadingComments) {
            return (
                <View style={styles.wrapper}>
                    <View style={styles.container}>
                        <Loader isLoading />
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.commentsCount}>
                        {commentsCount}
                    </Text>

                    {comments.map((commentData) => {
                        let profileImage = icons.ic_user;

                        let userName = null;

                        if (commentData.user && commentData.user.name) {
                            userName = commentData.user.name;
                        }

                        if (commentData.user && commentData.user.profile_image) {
                            profileImage = {
                                uri: urls.imagePath + commentData.user.profile_image
                            };
                        }

                        return (
                            <View
                                key={commentData.id}
                                style={styles.profileContainer}
                            >
                                <View style={styles.profileImageContainer}>
                                    <Image
                                        style={styles.profileImage}
                                        source={profileImage}
                                    />
                                </View>

                                <View style={styles.profileNameAndCommentContainer}>
                                    <View style={styles.nameAndTimeContainer}>
                                        <Text style={styles.name} numberOfLines={1}>
                                            {userName}
                                        </Text>

                                        <Text style={styles.date}>
                                            {dayjs(commentData.created_atz).fromNow(true)}
                                        </Text>
                                    </View>
                                    <Text style={styles.comment}>
                                        {commentData.comment}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                </View>

                {this.renderTextInput()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey2
    },
    container: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey2
    },
    commentsCount: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8,
        marginBottom: moderateScale(10)
    },
    profileContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(8)
    },
    profileImageContainer: {
        height: moderateScale(36),
        width: moderateScale(36),
        borderRadius: moderateScale(18),
        overflow: 'hidden',
        backgroundColor: colors.grey9,
    },
    profileImage: {
        height: moderateScale(36),
        width: moderateScale(36),
    },
    profileNameAndCommentContainer: {
        marginLeft: moderateScale(10),
        flex: 1
    },
    name: {
        fontSize: moderateScale(14),
        fontFamily: fonts.bold,
        marginRight: moderateScale(10)
    },
    date: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8
    },
    comment: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular
    },
    textInput: {
        minHeight: moderateScale(45),
        maxHeight: moderateScale(150),
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: moderateScale(14),
    },
    commentInputContainer: {
        paddingLeft: moderateScale(20),
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    sendImage: {
        tintColor: commonColors().themeColor
    },
    sendButton: {
        padding: moderateScale(10),
    },
    nameAndTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export { AdComments };
