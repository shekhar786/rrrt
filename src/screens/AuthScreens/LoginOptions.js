import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import {
    Wrapper,
    Button,
    SocialSignin,
    TermsAndConditionCard,
    Loader,
    Header
} from '../../components/common';
import {
    colors,
    screenNames,
    getAppdata,
    commonColors,
    appTypes
} from '../../utilities/constants';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import { navigate, goBack } from '../../utilities/NavigationService';
import { getAppId } from '../../utilities/helperFunctions';
import { login } from '../../store/actions';

const LoginOptions = (props) => {
    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onLoginPress = () => navigate(screenNames.Login);

    const onRegisterPress = () => navigate(screenNames.Signup);

    const onFbLoginSuccess = (userData) => {
        const { selectedCountry, selectedLanguage } = props;

        const data = {
            ...userData,
            user_country: selectedCountry,
            app_country: selectedCountry,
            language: selectedLanguage
        };

        props.login({
            data,
            hasComeFromMainApp: props.navigation.getParam('hasComeFromMainApp', false),
            loginKeyId: props.navigation.state.key,
            isSocialSignin: true
        });
    };

    const onSkipPress = () => navigate(screenNames.YabalasNavigator);

    const popScreen = () => goBack();

    const renderSkipButton = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return (
                <Button
                    label={strings.skip}
                    onPress={onSkipPress}
                    whiteButton
                    marginTop={moderateScale(20)}
                />
            );
        }

        return null;
    };

    const renderAppTitle = () => {
        if (getAppId() === appTypes.beault.id) {
            return <Image source={icons.ic_beault} />;
        }

        return (
            <Text style={styles.appName}>
                {getAppdata(getAppId()).name}
            </Text>
        );
    };

    return (
        <Wrapper wrapperStyle={styles.container}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
            />

            <View style={styles.appNameContainer}>
                {renderAppTitle()}
            </View>

            <View style={styles.loginOptionsContainer}>
                <SocialSignin
                    onSocialSigninSuccess={onFbLoginSuccess}
                    showFBLogin
                />

                <Button
                    label={strings.login}
                    style={styles.loginButton}
                    onPress={onLoginPress}
                    whiteButton
                />

                {renderSkipButton()}

                <View style={styles.newUserContainer}>
                    <Text style={styles.newUser}>
                        {strings.newAccount}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={onRegisterPress}
                    >
                        <Text style={styles.register}>
                            {strings.register}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.termsAndConditionContainer}>
                <TermsAndConditionCard />
            </View>

            <Loader
                isLoading={props.loading}
                isAbsolute
            />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    },
    subContainer: {
        paddingHorizontal: moderateScale(25)
    },
    subContentContainer: {
        paddingBottom: moderateScale(40),
    },
    appNameContainer: {
        flex: 0.30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    appName: {
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(50)
    },
    loginButton: {
        marginTop: moderateScale(20)
    },
    loginOptionsContainer: {
        flex: 0.50,
        paddingHorizontal: moderateScale(15)
    },
    newUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(40)
    },
    newUser: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(14)
    },
    register: {
        fontFamily: fonts.regular,
        marginLeft: moderateScale(5),
        color: commonColors().themeColor,
        paddingVertical: moderateScale(5),
        fontSize: moderateScale(14)
    },
    termsAndConditionContainer: {
        flex: 0.20,
        alignItems: 'center'
    },
});


const mapStateToProps = ({ auth, app, lang }) => ({
    loading: auth.loading,
    appId: app.appId,
    selectedCountry: lang.selectedCountry,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    login
})(LoginOptions);
