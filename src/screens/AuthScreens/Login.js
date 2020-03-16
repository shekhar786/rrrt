import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale } from 'react-native-size-matters';

import { login } from '../../store/actions';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import {
    Wrapper,
    TextInputWithLabel,
    Button,
    Header,
    Loader
} from '../../components/common';
import { colors, screenNames, regex, appTypes, commonColors, } from '../../utilities/constants';
import { navigate, goBack } from '../../utilities/NavigationService';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.hasComeFromMainApp = props.navigation.getParam('hasComeFromMainApp', false);
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content');
    }

    onSubmitEmailPhoneEditing = () => this.password.focus();

    onForgotPasswordPress = () => navigate(screenNames.ForgotPassword);

    onSignupPress = () => navigate(screenNames.Signup, {
        hasComeFromMainApp: this.hasComeFromMainApp,
        loginKeyId: this.props.navigation.state.key
    });

    onSkipPress = () => {
        if (this.hasComeFromMainApp) {
            return goBack();
        }

        return navigate(screenNames.YabalasNavigator);
    };

    onLoginSubmit = (values) => {
        const { selectedCountry, selectedLanguage } = this.props;

        const data = {
            email_mobile: values.emailPhone,
            password: values.password,
            app_country: selectedCountry,
            language: selectedLanguage
        };

        this.props.login({
            data,
            hasComeFromMainApp: this.hasComeFromMainApp,
            loginKeyId: this.props.navigation.state.key
        });
    };

    goBack = () => goBack();

    render() {
        return (
            <Wrapper wrapperStyle={styles.container}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.goBack}
                />

                <KeyboardAwareScrollView
                    style={styles.subContainer}
                    contentContainerStyle={styles.subContentContainer}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.loginText}>
                            {strings.login}
                        </Text>

                        <Formik
                            initialValues={{
                                emailPhone: '',
                                password: '',
                            }}
                            onSubmit={this.onLoginSubmit}
                            validationSchema={
                                yup.object().shape({
                                    emailPhone: yup
                                        .string()
                                        .matches(regex.emailMobileNo, strings.enterValidEmailPhone)
                                        .required(strings.emailPhoneRequired),
                                    password: yup.string()
                                        .matches(regex.password, strings.enterValidPassword)
                                        // .max(15, strings.passwordMinMaxLength)
                                        // .min(6, strings.passwordMinMaxLength)
                                        .required(strings.passwordRequired),
                                })}
                        >
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                                errors,
                                touched,
                                validateForm,
                                isSubmitting,
                                isValidating
                            }) => {
                                let emailError = false;
                                let passwordError = false;

                                if (touched.emailPhone && errors.emailPhone) {
                                    emailError = true;
                                }

                                if (touched.password && errors.password) {
                                    passwordError = true;
                                }

                                const onSubmit = async () => {
                                    const validationErrors = await validateForm();

                                    if (
                                        !isSubmitting
                                        && !isValidating
                                        && Object.keys(validationErrors).length > 0
                                    ) {
                                        let error = validationErrors[Object.keys(validationErrors)[0]]; //to get first error

                                        if (typeof error === 'object') { //to extract error from an object
                                            error = error[Object.keys(error)[0]];
                                        }
                                        console.log('error is: ', error);
                                        showErrorAlert(error);
                                    } else {
                                        handleSubmit();
                                    }
                                };

                                return (
                                    <>
                                        <TextInputWithLabel
                                            label={strings.emailPhoneNumberWithoutCode}
                                            onChangeText={handleChange('emailPhone')}
                                            value={values.emailPhone}
                                            containerStyle={styles.emailContainer}
                                            onSubmitEditing={this.onSubmitEmailPhoneEditing}
                                            keyboardType={'email-address'}
                                            returnKeyType={'next'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            errored={emailError}
                                            bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                        />

                                        <TextInputWithLabel
                                            ref={(password) => (this.password = password)}
                                            label={strings.password}
                                            onChangeText={handleChange('password')}
                                            value={values.password}
                                            containerStyle={styles.passwordContainer}
                                            blurOnSubmit
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            secureTextEntry
                                            errored={passwordError}
                                            returnKeyType={'done'}
                                            bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                        />

                                        <View style={styles.forgotPasswordContainer}>
                                            <TouchableOpacity
                                                activeOpacity={0.6}
                                                onPress={this.onForgotPasswordPress}
                                            >
                                                <Text style={styles.forgotPasswordText}>
                                                    {strings.forgotPassword_loginScreen}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <Button
                                            label={strings.log_in}
                                            onPress={onSubmit}
                                        />
                                    </>
                                );
                            }}
                        </Formik>

                        <View style={styles.signupOptionContainer}>
                            <Text style={styles.signupOption}>
                                {strings.dontHaveAccount}
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.onSignupPress}
                            >
                                <Text
                                    style={{
                                        ...styles.signupOption,
                                        color: commonColors().themeColor,
                                    }}
                                > {strings.sign_up}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <Loader
                    isLoading={this.props.loading}
                    isAbsolute
                />
            </Wrapper >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white1,
    },
    subContainer: {
        paddingHorizontal: moderateScale(25)
    },
    subContentContainer: {
        paddingBottom: moderateScale(40),
    },
    formContainer: {
        marginTop: moderateScale(20)
    },
    loginText: {
        fontSize: moderateScale(32),
        fontFamily: fonts.regular,
        marginBottom: moderateScale(30)
    },
    emailContainer: {
        marginTop: moderateScale(20)
    },
    passwordContainer: {
        marginTop: moderateScale(15)
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: moderateScale(25),
        marginTop: moderateScale(15)
    },
    forgotPasswordText: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        color: commonColors().themeColor
    },
    signupOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(40),
        marginBottom: moderateScale(30)
    },
    signupOption: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
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
})(Login);
