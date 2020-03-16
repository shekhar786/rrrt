import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Keyboard
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import CountryPicker, { getCallingCode } from 'react-native-country-picker-modal';
import Tooltip from 'react-native-walkthrough-tooltip';
import RNPickerSelect from 'react-native-picker-select';

import { signup, login, requestOTP } from '../../store/actions';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import {
    Wrapper,
    TextInputWithLabel,
    Button,
    Header,
    Loader,
    TermsAndConditionCard,
    KeyboardAccessoryView,
    pickerProps
} from '../../components/common';
import {
    colors,
    commonColors,
    appTypes,
    regex,
    screenNames,
    industryOptions,
    otpRequestType
} from '../../utilities/constants';
import { goBack, navigate } from '../../utilities/NavigationService';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';
import { layout } from '../../utilities/layout';
import logger from '../../utilities/logger';

class Signup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mobileFocused: false,
            toolTipVisible: false,
            loading: false
        };
        this.hasComeFromMainApp = props.navigation.getParam('hasComeFromMainApp', false);

        this.mobileRef = React.createRef();
        this.lastNameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.retypePasswordRef = React.createRef();
    }

    onSubmitFirstname = () => this.lastNameRef.current.focus();
    onSubmitLastname = () => this.emailRef.current.focus();
    onSubmitEmail = () => {
        if (getAppId === appTypes.yabalash.id) {
            return this.passwordRef.current.focus();
        }

        return this.mobileRef.current.focus();
    };
    onMobileSubmit = () => this.passwordRef.current.focus();
    onPasswordSubmit = () => this.retypePasswordRef.current.focus();

    onSignupSubmit = async ({
        first_name,
        last_name,
        name,
        email,
        countryForCallingCode,
        userCountryCode,
        mobile,
        password,
        businessAccount,
        industry
    }) => {
        try {
            Keyboard.dismiss();
            const loginKeyId = this.props.navigation.getParam('loginKeyId', null);
            const { selectedCountry, selectedLanguage } = this.props;

            const calling_code = await getCallingCode(countryForCallingCode);

            const data = {
                email,
                calling_code,
                mobile,
                password,
                business: businessAccount || 0,
                user_country: userCountryCode, //user country
                app_country: selectedCountry, // app country
                language: selectedLanguage
            };

            if (businessAccount || (businessAccount && getAppId() === appTypes.yabalash.id)) {
                data.industry = industry;
                data.name = name;
            } else {
                data.first_name = first_name;
                data.last_name = last_name;
            }

            /* this.props.signup({
                data,
                hasComeFromMainApp: this.hasComeFromMainApp,
                loginKeyId,
                navigation: this.props.navigation
            }); */
            this.setState({ loading: true });

            const { isFocused } = this.props.navigation;

            this.props.requestOTP({
                data: {
                    mobile,
                    calling_code,
                    for_type: otpRequestType.register,
                    email,
                    app_country: selectedCountry
                },
                cb: (error, otp) => {
                    if (isFocused()) {
                        this.setState({ loading: false });
                    }

                    if (error) {
                        return showErrorAlert(error);
                    }

                    data.otp = otp;

                    if (isFocused()) {
                        return navigate(screenNames.MobileVerification, {
                            data,
                            verificationtype: otpRequestType.register,
                            hasComeFromMainApp: this.hasComeFromMainApp,
                            loginKeyId,
                            navigation: this.props.navigation
                        });
                    }
                }
            });
        } catch (error) {
            logger.error();
        }
    };

    onSocialSigninSuccess = (data) => {
        const loginKeyId = this.props.navigation.getParam('loginKeyId', null);

        this.props.login({
            data,
            hasComeFromMainApp: this.hasComeFromMainApp,
            loginKeyId,
            isSocialSignin: true
        });
    };

    onInfoPress = () => this.setState({ toolTipVisible: true });
    onTooltipClose = () => this.setState({ toolTipVisible: false });
    onLoginPress = () => navigate(screenNames.Login);

    getBusinessInfoIcon = () => {
        if (getAppId() === appTypes.shilengae.id) {
            return <Image source={icons.ic_info} />;
        } else if (getAppId() === appTypes.beault.id) {
            return <Image source={icons.ic_business_info_pink} />;
        }

        return null;
    };

    toggleMobileInputFocus = () => {
        this.setState({
            mobileFocused: !this.state.mobileFocused
        });
    };

    goBack = () => goBack();

    updateState = (key) => (value) => {
        const state = { ...this.state };

        state[key] = value;

        this.setState(state);
    };

    renderTooltipContent = () => (
        <Text style={styles.loginOption}>
            Enable this to signup with a business account.
        </Text>
    );

    renderNameInputs = ({ handleChange, values }) => {
        if (!values.businessAccount && getAppId() !== appTypes.yabalash.id) {
            return (
                <>
                    <TextInputWithLabel
                        label={strings.firstName}
                        value={values.first_name}
                        onChangeText={handleChange('first_name')}
                        containerStyle={{
                            marginTop: getAppId() === appTypes.yabalash.id
                                ? 0 : moderateScale(15)
                        }}
                        onSubmitEditing={this.onSubmitFirstname}
                        returnKeyType={'next'}
                        bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                    />

                    <TextInputWithLabel
                        ref={this.lastNameRef}
                        label={strings.lastName}
                        value={values.last_name}
                        onChangeText={handleChange('last_name')}
                        containerStyle={{
                            marginTop: getAppId() === appTypes.yabalash.id
                                ? 0 : moderateScale(15)
                        }}
                        onSubmitEditing={this.onSubmitLastname}
                        returnKeyType={'next'}
                        bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                    />
                </>
            );
        }

        return (
            <TextInputWithLabel
                label={strings.name}
                value={values.name}
                onChangeText={handleChange('name')}
                containerStyle={{
                    marginTop: getAppId() === appTypes.yabalash.id
                        ? 0 : moderateScale(15)
                }}
                onSubmitEditing={this.onSubmitLastname}
                returnKeyType={'next'}
                bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
            />
        );
    };

    render() {
        const inputAccessoryViewID = 'mobileNumber';

        const { mobileFocused } = this.state;
        const { selectedCountry } = this.props;

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
                    keyboardShouldPersistTaps={'handled'}
                >
                    <Text style={styles.signupText}>
                        {strings.sign_up}
                    </Text>
                    <View style={styles.formContainer}>
                        <Formik
                            initialValues={{
                                first_name: '',
                                last_name: '',
                                name: '',
                                email: '',
                                password: '',
                                retypePassword: '',
                                countryForCallingCode: selectedCountry.toUpperCase(),
                                mobile: '',
                                businessAccount: getAppId() === appTypes.yabalash.id ? 1 : 0,
                                industry: industryOptions[0].value,
                                userCountryCode: selectedCountry.toUpperCase()
                            }}
                            onSubmit={this.onSignupSubmit}
                            validationSchema={
                                yup.object().shape({
                                    first_name: yup.string().when('businessAccount', {
                                        is: 0,
                                        then: yup.string()
                                            .min(2, strings.firstName2CharsLong)
                                            .required(strings.firstNameRequired),
                                        otherwise: yup.string()
                                    }),
                                    last_name: yup.string().when('businessAccount', {
                                        is: 0,
                                        then: yup.string()
                                            .min(2, strings.lastName2CharsLong)
                                            .required(strings.lastNameRequired),
                                        otherwise: yup.string()
                                    }),
                                    name: yup.string().when('businessAccount', {
                                        is: 1,
                                        then: yup.string().min(2, strings.name2CharsLong)
                                            .required(strings.nameRequired),
                                        otherwise: yup.string()
                                    }),
                                    email: yup
                                        .string()
                                        .matches(regex.email, strings.enterValidEmail)
                                        .required(strings.emailRequired),
                                    mobile: yup
                                        .string()
                                        .matches(regex.mobileNo, strings.enterValidMobileNo)
                                        .required(strings.mobileNoRequired),
                                    password: yup.string()
                                        .matches(regex.password, strings.enterValidPassword)
                                        .max(15, strings.passwordMinMaxLength)
                                        .min(6, strings.passwordMinMaxLength)
                                        .required(strings.passwordRequired),
                                    retypePassword: yup.string()
                                        .oneOf([yup.ref('password'), null], strings.passwordsDonotMatch)
                                        .required(strings.confirmNewPasswordRequired)
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
                                let tickIcon = icons.ic_uncheck_grey;

                                if (values.businessAccount && getAppId() === appTypes.shilengae.id) {
                                    tickIcon = icons.ic_check_red;
                                } else if (values.businessAccount && getAppId() === appTypes.beault.id) {
                                    tickIcon = icons.ic_check_pink;
                                }

                                const onCallingCodeSelect = (countryData) => {
                                    setFieldValue('countryForCallingCode', countryData.cca2);
                                };

                                const onUserCountrySelect = (countryData) => {
                                    setFieldValue('userCountryCode', countryData.cca2);
                                };
                                const toggleBusinessAccount = () => {
                                    setFieldValue('businessAccount', values.businessAccount ? 0 : 1);
                                };

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

                                        showErrorAlert(error);
                                    } else {
                                        handleSubmit();
                                    }
                                };

                                return (
                                    <>
                                        {this.renderNameInputs({ handleChange, values })}

                                        <TextInputWithLabel
                                            ref={this.emailRef}
                                            label={strings.email}
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            containerStyle={styles.emailPassContainer}
                                            onSubmitEditing={this.onSubmitEmail}
                                            returnKeyType={'next'}
                                            keyboardType={'email-address'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                        />

                                        <View style={styles.mobileNumberContainer}>
                                            <Text
                                                style={{
                                                    ...styles.label,
                                                    color: mobileFocused
                                                        ? commonColors().themeColor : colors.black5
                                                }}
                                            >
                                                {strings.mobileNumber}
                                            </Text>
                                            <View
                                                style={{
                                                    ...styles.mobileNumberSubContainer,
                                                    borderColor: mobileFocused
                                                        ? commonColors().themeColor : colors.black3
                                                }}
                                            >
                                                <View style={styles.countryCodeContainer}>
                                                    <CountryPicker
                                                        withAlphaFilter
                                                        withCloseButton
                                                        withFilter
                                                        withCallingCode
                                                        withCallingCodeButton={values.countryForCallingCode}
                                                        countryCode={values.countryForCallingCode}
                                                        onSelect={onCallingCodeSelect}
                                                    />
                                                </View>

                                                <TextInputWithLabel
                                                    ref={this.mobileRef}
                                                    returnKeyType={'next'}
                                                    keyboardType={'number-pad'}
                                                    onSubmitEditing={this.onMobileSubmit}
                                                    value={values.mobile}
                                                    onChangeText={handleChange('mobile')}
                                                    autoCorrect={false}
                                                    autoCapitalize={'none'}
                                                    disableBorder
                                                    containerStyle={styles.mobileInputContainer}
                                                    textInputContainer={{ marginTop: 0 }}
                                                    bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                                    inputAccessoryViewID={inputAccessoryViewID}
                                                    maxLength={12}
                                                    onFocus={this.toggleMobileInputFocus}
                                                    onBlur={this.toggleMobileInputFocus}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.pickerOuterContainer}>
                                            <Text style={{ ...styles.label, color: colors.black5 }}>
                                                {strings.yourCountry}
                                            </Text>
                                            <CountryPicker
                                                withAlphaFilter
                                                withCloseButton
                                                withFilter
                                                withCountryNameButton
                                                // withCallingCodeButton={values.userCountryCode}
                                                countryCode={values.userCountryCode}
                                                onSelect={onUserCountrySelect}
                                                containerButtonStyle={styles.countryPickerContainer}
                                            />
                                        </View>

                                        <TextInputWithLabel
                                            ref={this.passwordRef}
                                            label={strings.password}
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            containerStyle={styles.emailPassContainer}
                                            returnKeyType={'next'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            secureTextEntry
                                            bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                            onSubmitEditing={this.onPasswordSubmit}
                                        />

                                        <TextInputWithLabel
                                            ref={this.retypePasswordRef}
                                            label={strings.retypePassword}
                                            value={values.retypePassword}
                                            onChangeText={handleChange('retypePassword')}
                                            containerStyle={styles.emailPassContainer}
                                            blurOnSubmit
                                            returnKeyType={'done'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            secureTextEntry
                                            bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                                        />

                                        {getAppId() !== appTypes.yabalash.id ?
                                            <View style={styles.businessAccountContainer}>
                                                <TouchableOpacity
                                                    activeOpacity={0.6}
                                                    style={styles.checkButtonContainer}
                                                    onPress={toggleBusinessAccount}
                                                >
                                                    <Image source={tickIcon} />
                                                    <Text style={styles.businessAccount}>
                                                        {strings.businessAccount}
                                                    </Text>
                                                </TouchableOpacity>

                                                <Tooltip
                                                    isVisible={this.state.toolTipVisible}
                                                    content={this.renderTooltipContent()}
                                                    placement={'top'}
                                                    onClose={this.onTooltipClose}
                                                    showChildInTooltip={false}
                                                    childContentSpacing={layout.isIOS ? 0 : 20}
                                                >
                                                    <TouchableOpacity
                                                        activeOpacity={0.6}
                                                        style={styles.info}
                                                        onPress={this.onInfoPress}
                                                    >
                                                        {this.getBusinessInfoIcon()}
                                                    </TouchableOpacity>
                                                </Tooltip>
                                            </View>
                                            : null}


                                        {values.businessAccount && getAppId() !== appTypes.yabalash.id ?
                                            <View style={styles.pickerOuterContainer}>
                                                <Text style={{ ...styles.label, color: colors.black5 }}>
                                                    {strings.industry}
                                                </Text>
                                                <RNPickerSelect
                                                    onValueChange={handleChange('industry')}
                                                    value={values.industry}
                                                    items={industryOptions}
                                                    placeholder={{}}
                                                    {...pickerProps}
                                                />
                                            </View>
                                            : null
                                        }
                                        <Button
                                            label={strings.continue}
                                            onPress={onSubmit}
                                            style={styles.continueButton}
                                        />
                                    </>
                                );
                            }}
                        </Formik>

                        <View style={styles.loginOptionContainer}>
                            <Text style={styles.loginOption}>
                                {strings.alreadyHaveAccount}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.onLoginPress}
                            >
                                <Text
                                    style={{
                                        ...styles.loginOption,
                                        color: commonColors().themeColor
                                    }}
                                > {strings.log_in}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {
                        getAppId() === appTypes.yabalash.id ?
                            <View style={styles.termsAndConditionsContainer}>
                                <TermsAndConditionCard />
                            </View>
                            : null
                    }
                </KeyboardAwareScrollView>

                <KeyboardAccessoryView
                    inputAccessoryViewID={inputAccessoryViewID}
                    onPress={this.onMobileSubmit}
                    label={strings.next}
                />

                <Loader
                    isLoading={this.state.loading}
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
        paddingBottom: moderateScale(20),
    },
    signupText: {
        fontSize: moderateScale(32),
        fontFamily: fonts.regular,
    },
    formContainer: {
        marginTop: moderateScale(25)
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emailPassContainer: {
        marginTop: moderateScale(15)
    },
    continueButton: {
        marginTop: moderateScale(40)
    },
    loginOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(20),
        marginBottom: moderateScale(20)
    },
    loginOption: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
    },
    termsAndConditionsContainer: {
        marginTop: moderateScale(20),
        alignItems: 'center'
    },
    mobileNumberContainer: {
        marginTop: moderateScale(15)
    },
    mobileNumberSubContainer: {
        flexDirection: 'row',
        borderTopWidth: getAppId() === appTypes.yabalash.id ? moderateScale(1) : 0,
        borderLeftWidth: getAppId() === appTypes.yabalash.id ? moderateScale(1) : 0,
        borderRightWidth: getAppId() === appTypes.yabalash.id ? moderateScale(1) : 0,
        borderBottomWidth: moderateScale(1),
        borderRadius: getAppId() === appTypes.yabalash.id ? moderateScale(8) : 0,
        marginTop: moderateScale(2),
        paddingHorizontal: moderateScale(5),
        paddingVertical: moderateScale(1),
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mobileInputContainer: {
        flex: 1,
        marginLeft: moderateScale(0),
    },
    businessAccountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(20)
    },
    checkButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(8)
    },
    businessAccount: {
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(16),
        marginLeft: moderateScale(10)
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    },
    info: {
        padding: moderateScale(8),
    },
    pickerOuterContainer: {
        marginTop: moderateScale(15),
        borderBottomWidth: moderateScale(1),
        borderColor: colors.black3
    },
    countryPickerContainer: {
        paddingVertical: moderateScale(10)
    }
});

const mapStateToProps = ({ auth, lang }) => ({
    loading: auth.loading,
    selectedCountry: lang.selectedCountry,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    signup,
    login,
    requestOTP
})(Signup);
