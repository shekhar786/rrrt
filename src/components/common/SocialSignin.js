import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken
} from 'react-native-fbsdk';
import { moderateScale } from 'react-native-size-matters';

import { colors, PROVIDERS, } from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { strings } from '../../localization';
import logger from '../../utilities/logger';

const fbLoginRequest = () => new Promise(async (resolve, reject) => {
    try {
        const loginResponse = await LoginManager.logInWithPermissions(['public_profile']);
        if (loginResponse.isCancelled) {
            return reject('User canceled login');
        }

        //Create response callback.
        const _responseInfoCallback = (error, info) => {
            if (error) {
                return reject(error);
            }

            LoginManager.logOut();
            return resolve(info);
        };

        const accessTokenData = await AccessToken.getCurrentAccessToken();

        // Create a graph request asking for user information with a callback to handle the response.
        const infoRequest = new GraphRequest(
            '/me',
            {
                accessToken: accessTokenData.accessToken,
                parameters: {
                    fields: {
                        string: 'id, name, picture.type(large), first_name, last_name'
                    }
                }
            },
            _responseInfoCallback,
        );

        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
        reject(error);
    }
});

const Button = ({
    onPress,
    imageSource,
    title,
    containerStyle
}) => (
        <TouchableOpacity
            activeOpacity={0.6}
            style={containerStyle}
            onPress={onPress}
        >
            <View style={styles.imageContainer}>
                <Image source={imageSource} />
                <View style={styles.buttonVerticalSeparator} />
            </View>
            <Text style={styles.buttonTitle}>
                {title}
            </Text>
            <View />
        </TouchableOpacity>
    );

const SocialSignin = ({
    onSocialSigninSuccess,
    showFBLogin,
    showGoogleLogin
}) => {
    const onFbLoginPress = async () => {
        try {
            const userInfo = await fbLoginRequest();

            const data = {
                last_name: userInfo.last_name,
                first_name: userInfo.first_name,
                provider_id: userInfo.id,
                provider: PROVIDERS.fb
            };

            onSocialSigninSuccess(data);
        } catch (error) {
            logger.error('FB login error: ', error);
        }
    };

    return (
        <>
            {showFBLogin ?
                <Button
                    onPress={onFbLoginPress}
                    imageSource={icons.ic_facebook_logo}
                    title={strings.continueUsingFb}
                    containerStyle={styles.button}
                />
                : null}

            {showGoogleLogin ?
                <Button
                    // onPress={onGoogleLoginPress}
                    imageSource={icons.ic_google}
                    title={strings.continueUsingGoogle}
                    containerStyle={{
                        ...styles.button,
                        backgroundColor: colors.red2,
                        marginTop: moderateScale(20)
                    }}
                />
                : null}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.blue1,
        flexDirection: 'row',
        height: moderateScale(56),
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(30),
    },
    buttonTitle: {
        color: colors.white1,
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
    },
    buttonVerticalSeparator: {
        height: 24,
        width: 1,
        backgroundColor: colors.black8,
        marginLeft: 15
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export { SocialSignin, fbLoginRequest };
