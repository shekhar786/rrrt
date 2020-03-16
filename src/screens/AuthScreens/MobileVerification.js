import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Alert,
    BackHandler,
    StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { moderateScale } from 'react-native-size-matters';

import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import { Wrapper, Button, Header, Loader } from '../../components/common';
import {
    colors,
    screenNames,
    actionTypes,
    appTypes,
    commonColors,
    OTPExpiringTimeout,
    otpRequestType
} from '../../utilities/constants';
import { navigate, goBack } from '../../utilities/NavigationService';
import {
    showErrorAlert,
    setLocalUserData,
    getAppId,
    msIntoMinutesAndSeconds,
    showSuccessAlert
} from '../../utilities/helperFunctions';
import store from '../../store';
import socketServices from '../../utilities/socketServices';
import logger from '../../utilities/logger';
import { requestOTP, changePhone, signup } from '../../store/actions';

class MobileVerification extends PureComponent {
    constructor(props) {
        super(props);

        this.hasComeFromMainApp = props.navigation.getParam('hasComeFromMainApp', false);
        this.data = this.props.navigation.getParam('data', {});

        this.state = {
            countDownMilliseconds: OTPExpiringTimeout,
            loading: false,
            absoluteLoading: false,
            otp: this.data.otp || null
        };
    }

    componentDidMount() {
        this.startTimer();

        StatusBar.setBarStyle('dark-content');

        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );

        // this.requestOTP();
    }

    componentWillUnmount() {
        this.stopTimer();

        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    onVerifyPress = async () => {
        try {
            const { getParam } = this.props.navigation;

            const verificationtype = getParam('verificationtype', null);
            if (verificationtype && verificationtype === otpRequestType.changePhoneNo) {
                return this.changePhoneNo();
            } else if (verificationtype && verificationtype === otpRequestType.register) {
                return this.registerUser();
            }
        } catch (error) {
            logger.error('verify OTP error: ', error);
            showErrorAlert(error);
        }
    };

    onResendOtpPress = () => {
        if (this.state.countDownMilliseconds) {
            return;
        }

        this.setState({
            countDownMilliseconds: OTPExpiringTimeout
        });

        this.startTimer();
    };

    onGoBackPress = () => {
        Alert.alert(
            strings.goBack,
            strings.areYouSureYouWantToGoBack,
            [
                {
                    text: strings.cancel,
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: strings.goBack, onPress: () => goBack() },
            ],
            { cancelable: false },
        );
    };

    changePhoneNo = () => {
        this.setState({ absoluteLoading: true });
        const { isFocused } = this.props.navigation;
        this.props.changePhone({
            data: {
                mobile: this.data.mobile,
                calling_code: this.data.callingCode,
                otp: this.state.otp
            },
            cb: (error) => {
                if (isFocused()) {
                    this.setState({ absoluteLoading: false });
                }
                if (error) {
                    return showErrorAlert(error);
                }

                this.props.navigation.popToTop();
                showSuccessAlert(strings.phoneUpdatedSuccessfully);
            }
        });
    };

    registerUser = () => {
        this.setState({ absoluteLoading: true });
        const { isFocused, getParam } = this.props.navigation;

        const loginKeyId = getParam('loginKeyId', null);

        this.props.signup({
            data: this.data,
            hasComeFromMainApp: this.hasComeFromMainApp,
            loginKeyId,
            navigation: this.props.navigation,
            cb: (error) => {
                if (error && isFocused()) {
                    showErrorAlert(error);
                    return this.setState({ absoluteLoading: false });
                }
            }
        });
    };

    requestOTP = () => {
        const { isFocused, getParam } = this.props.navigation;

        const verificationType = getParam('verificationType', otpRequestType.changePhoneNo);

        this.props.requestOTP({
            data: {
                mobile: this.data.mobile,
                calling_code: this.data.callingCode,
                for_type: verificationType
            },
            cb: (error, otp) => {
                if (isFocused()) {
                    this.setState({ loading: false, absoluteLoading: false });
                }

                if (error) {
                    showErrorAlert(error);
                    return goBack();
                }

                if (isFocused) {
                    this.setState({ otp });
                }
            }
        });
    };

    handleBackButtonPressAndroid = () => {
        if (!this.props.navigation.isFocused()) {
            // The screen is not focused, so don't do anything
            return false;
        } else if (this.props.navigation.isFocused()) {
            this.onGoBackPress();

            // We have handled the back button
            // Return `true` to prevent react-navigation from handling it
            return true;
        }

        return false;
    };

    goBack = () => goBack();

    startTimer = () => {
        logger.log('starting timer');

        this.interval = setInterval(() => {
            // logger.log('interval running');
            if (this.state.countDownMilliseconds) {
                this.setState({
                    countDownMilliseconds: this.state.countDownMilliseconds - 1000
                });
            } else {
                this.stopTimer();
            }
        }, 1000);
    };

    stopTimer = () => {
        // logger.log('stopping interval');

        if (this.interval) {
            clearInterval(this.interval);
        }
    };

    renderTimer = () => {
        const { countDownMilliseconds } = this.state;

        if (countDownMilliseconds) {
            return (
                <View style={styles.OTPExpiresContainer}>
                    <Text style={styles.otpExpiresIn}>
                        {strings.otpExpiresIn} {msIntoMinutesAndSeconds(countDownMilliseconds)} {strings.minutes}
                    </Text>
                </View>
            );
        }

        return <View style={styles.OTPExpiresContainer} />;
    };

    renderContent = () => {
        const { loading } = this.state;

        if (loading) {
            return <Loader isLoading />;
        }

        const { otp } = this.state;

        let underlineStyleBase = {};
        let underlineStyleHighLighted = {};
        let pinCount = 6;
        let validOTP = '111111';
        let mobileVerificationTitle = null;

        switch (getAppId()) {
            case appTypes.yabalash.id:
                underlineStyleBase = styles.underlineStyleBaseYabalas;
                underlineStyleHighLighted = styles.underlineStyleHighLightedYabalas;
                pinCount = 6;
                validOTP = '111111';

                mobileVerificationTitle = (
                    <Text style={styles.mobileVerificationText}>
                        {strings.mobileVerification}
                    </Text>
                );
                break;
            case appTypes.shilengae.id:
                underlineStyleBase = styles.underlineStyleBaseShilenga;
                underlineStyleHighLighted = styles.underlineStyleHighLightedShilenga;
                break;
            default:
                break;
        }

        return (
            <KeyboardAwareScrollView
                style={styles.subContainer}
                contentContainerStyle={styles.subContentContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {mobileVerificationTitle}

                <Text style={styles.mobileVerificationDescription}>
                    {strings.formatString(strings.mobileVerificationDescription, 6)}

                    <Text style={styles.spanMobileNumber}>
                        {(this.data.callingCode || this.data.calling_code)
                            ? `+${this.data.callingCode || this.data.calling_code} ` : ''}{this.data.mobile}
                    </Text>
                </Text>

                {otp ?
                    <Text style={styles.mobileVerificationDescription}>
                        Your otp is: {otp}
                    </Text>
                    : null}
                <View style={styles.formContainer}>
                    {this.renderTimer()}

                    <Formik
                        initialValues={{ otp: '' }}
                        onSubmit={this.onVerifyPress}
                        validationSchema={
                            yup.object().shape({
                                otp: yup
                                    .string()
                                    .oneOf([String(otp)], strings.enterValidOTP)
                                    // .oneOf([validOTP], strings.enterValidOTP)
                                    .required(strings.otpRequired),
                            })}
                    >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            validateForm,
                            isSubmitting,
                            isValidating,
                            setFieldValue
                        }) => {
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

                            const onOtpChange = (enteredOtp) => {
                                if (enteredOtp.length > pinCount) {
                                    setFieldValue('otp', String(enteredOtp).slice(0, pinCount));
                                } else {
                                    setFieldValue('otp', enteredOtp);
                                }
                            };

                            return (
                                <>
                                    <OTPInputView
                                        pinCount={pinCount}
                                        code={values.otp}
                                        onCodeChanged={onOtpChange}
                                        autoFocusOnLoad
                                        onCodeFilled={(code => {
                                            console.log(`Code is ${code}, you are good to go!`);
                                        })}
                                        style={styles.otpContainer}
                                        codeInputFieldStyle={underlineStyleBase}
                                        codeInputHighlightStyle={underlineStyleHighLighted}
                                    />

                                    {getAppId() !== appTypes.yabalash.id ?
                                        <View style={styles.resendOtpContainer}>
                                            <Text
                                                style={{
                                                    ...styles.resendText,
                                                    color: !this.state.countDownMilliseconds ?
                                                        commonColors().themeColor : colors.grey2
                                                }}
                                                onPress={this.onResendOtpPress}
                                            >
                                                {strings.resendOtp}
                                            </Text>
                                        </View>
                                        : null}
                                    <Button
                                        label={strings.verify}
                                        onPress={onSubmit}
                                        style={styles.verifyButton}
                                    />
                                </>
                            );
                        }}
                    </Formik>
                </View>

                {getAppId() === appTypes.yabalash.id ?
                    <Text style={styles.bottomText}>
                        {strings.didntReceivedOtp}
                        <Text
                            style={{
                                ...styles.resendText,
                                color: !this.state.countDownMilliseconds ?
                                    commonColors().themeColor : colors.grey2
                            }}
                            onPress={this.onResendOtpPress}
                        >
                            {` ${strings.resendOtp}`}
                        </Text>
                    </Text>
                    : null}
            </KeyboardAwareScrollView>
        );
    };

    render() {
        const { absoluteLoading } = this.state;
        let headerTitle = null;

        if (getAppId() === appTypes.shilengae.id) {
            headerTitle = strings.otpVerification;
        }

        return (
            <Wrapper wrapperStyle={styles.container}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onGoBackPress}
                    title={headerTitle}
                    blackTitle
                />

                {this.renderContent()}

                <Loader isLoading={absoluteLoading} isAbsolute />
            </Wrapper>
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
        paddingBottom: moderateScale(20),
    },
    formContainer: {
        marginTop: getAppId() === appTypes.yabalash.id
            ? moderateScale(20) : moderateScale(50)
    },
    mobileVerificationDescription: {
        color: colors.purple1,
        marginTop: moderateScale(10),
        fontSize: moderateScale(18),
        fontFamily: fonts.semiBold,
        lineHeight: moderateScale(24)
    },
    mobileVerificationText: {
        fontSize: moderateScale(24),
        fontFamily: fonts.regular,
    },
    mobileNumberContainer: {
        marginTop: moderateScale(20)
    },
    verifyButton: {
        marginTop: moderateScale(40)
    },
    spanMobileNumber: {
        color: colors.black1,
        fontFamily: fonts.semiBold
    },
    otpContainer: { height: moderateScale(50) },
    underlineStyleBaseYabalas: {
        width: getAppId() === appTypes.yabalash.id
            ? moderateScale(40) : moderateScale(20), //40
        height: moderateScale(48),
        borderWidth: moderateScale(1),
        borderColor: colors.black3,
        borderBottomWidth: moderateScale(1),
        borderRadius: moderateScale(8),
        fontSize: moderateScale(32),
        fontFamily: fonts.regular,
        paddingBottom: Platform.select({ android: 6 })
    },
    underlineStyleBaseShilenga: {
        width: getAppId() === appTypes.yabalash.id
            ? moderateScale(70) : moderateScale(40), //70
        height: moderateScale(50),
        borderBottomWidth: moderateScale(1),
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: colors.black3,
        fontSize: moderateScale(32),
        fontFamily: fonts.regular,
        color: colors.purple1
    },
    underlineStyleHighLightedYabalas: {
        borderColor: commonColors().themeColor,
        fontSize: moderateScale(32),
        fontFamily: fonts.regular
    },
    underlineStyleHighLightedShilenga: {
        borderColor: commonColors().themeColor,
        fontSize: moderateScale(32),
        fontFamily: fonts.regular,
        borderBottomWidth: moderateScale(1),
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    bottomText: {
        fontFamily: fonts.regular,
        color: colors.black5,
        fontSize: moderateScale(16),
        marginTop: moderateScale(15)
    },
    resendOtpContainer: {
        alignItems: 'flex-end',
        marginTop: moderateScale(20)
    },
    resendText: {
        color: commonColors().themeColor,
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
    },
    otpExpiresIn: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    OTPExpiresContainer: {
        height: moderateScale(35)
    }
});

export default connect(null, {
    requestOTP,
    changePhone,
    signup
})(MobileVerification);
