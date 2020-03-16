import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale } from 'react-native-size-matters';
import CountryPicker, { getCallingCode } from 'react-native-country-picker-modal';
import cloneDeep from 'clone-deep';

import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import {
    Wrapper,
    TextInputWithLabel,
    Button,
    Header,
    Loader,
    KeyboardAccessoryView
} from '../../components/common';
import { colors, urls, appTypes, commonColors, regex } from '../../utilities/constants';
import { goBack } from '../../utilities/NavigationService';
import {
    showErrorAlert,
    showSuccessAlert,
    getAppId,
    getAPIError
} from '../../utilities/helperFunctions';
import { request } from '../../utilities/request';
import logger from '../../utilities/logger';

class ForgotPassword extends PureComponent {
    state = {
        loading: false,
        isEmailSelected: true,
        inputFocused: false,
        email: '',
        mobile: '',
        countryCode: 'AE'
    };

    onMobileSubmit = () => Keyboard.dismiss();
    onForgotPasswordSubmit = async (values) => {
        try {
            Keyboard.dismiss();
            this.setState({ loading: true });
            const config = {
                url: urls.forgotPassword,
                method: 'POST',
                data: {
                    email: values.emailPhone
                }
            };

            const response = await request(config);

            showSuccessAlert(response.data.msg, { duration: 6000 });

            goBack();

            // navigate(screenNames.ForceChangePassword, {
            //     token: response.data.token,
            //     hasComeFromMainApp: params.hasComeFromMainApp,
            //     loginKeyId: params.loginKeyId
            // });
        } catch (error) {
            logger.apiError('Forgot password error: ', error);

            showErrorAlert(getAPIError(error));
            this.setState({ loading: false });
        }
    };
    onSelectCountry = (countryData) => this.setState({ countryCode: countryData.cca2 });
    onContinuePress = async () => {
        try {
            const { email, mobile, isEmailSelected, countryCode } = this.state;
            const calling_code = await getCallingCode(countryCode);

            if (isEmailSelected && !email.trim()) {
                return showErrorAlert(strings.emailRequired);
            } else if (isEmailSelected && !regex.email.test(email)) {
                return showErrorAlert(strings.enterValidEmail);
            } else if (!isEmailSelected && !mobile.trim()) {
                return showErrorAlert(strings.phoneRequired);
            } else if (!isEmailSelected && !regex.mobileNo.test(mobile)) {
                return showErrorAlert(strings.enterValidMobileNo);
            }

            let data = {};

            if (isEmailSelected) {
                data = { email };
            } else {
                data = { mobile, calling_code };
            }
            Keyboard.dismiss();
            this.setState({ loading: true });
            const config = {
                url: urls.forgotPassword,
                method: 'POST',
                data
            };

            const response = await request(config);

            console.log('forgot password response: ', response);

            showSuccessAlert(response.data.msg, { duration: 6000 });

            goBack();
        } catch (error) {
            logger.apiError('Forgot password error: ', error);

            showErrorAlert(getAPIError(error));
            this.setState({ loading: false });
        }
    };
    onEmailSelect = () => this.setState({ isEmailSelected: true });
    onMobileSelect = () => this.setState({ isEmailSelected: false });

    updateState = (key) => (value) => {
        const state = cloneDeep(this.state);
        state[key] = value;

        this.setState(state);
    };

    toggleInputFocused = () => this.setState({ inputFocused: !this.state.inputFocused });

    goBack = () => goBack();

    renderInput = () => {
        const inputAccessoryViewID = 'mobileNumber';
        const { inputFocused, email, mobile, countryCode } = this.state;

        if (this.state.isEmailSelected) {
            return (
                <TextInputWithLabel
                    label={strings.email}
                    onChangeText={this.updateState('email')}
                    value={email}
                    containerStyle={styles.emailContainer}
                    blurOnSubmit
                    keyboardType={'email-address'}
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                />
            );
        }

        return (
            <View style={styles.mobileNumberContainer}>
                <Text
                    style={{
                        ...styles.label,
                        color: inputFocused
                            ? commonColors().themeColor : colors.black5
                    }}
                >
                    {strings.mobileNumber}
                </Text>
                <View
                    style={{
                        ...styles.mobileNumberSubContainer,
                        borderColor: inputFocused
                            ? commonColors().themeColor : colors.black3
                    }}
                >
                    <View style={styles.countryCodeContainer}>
                        <CountryPicker
                            withAlphaFilter
                            withCloseButton
                            withFilter
                            withCallingCode
                            withCallingCodeButton={countryCode}
                            countryCode={countryCode}
                            onSelect={this.onSelectCountry}
                        />
                    </View>

                    <TextInputWithLabel
                        ref={this.mobileRef}
                        returnKeyType={'done'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={this.onMobileSubmit}
                        value={mobile}
                        onChangeText={this.updateState('mobile')}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        disableBorder
                        containerStyle={styles.mobileInputContainer}
                        textInputContainer={{ marginTop: 0 }}
                        inputAccessoryViewID={inputAccessoryViewID}
                        maxLength={12}
                        blurOnSubmit
                        onFocus={this.toggleInputFocused}
                        onBlur={this.toggleInputFocused}
                    />
                </View>
            </View>
        );
    };

    render() {
        const inputAccessoryViewID = 'mobileNumber';
        const { isEmailSelected } = this.state;

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
                >
                    <Text style={styles.forgotPassword}>
                        {strings.forgotPassword}
                    </Text>

                    {/* <Text style={styles.labelText}>
                        {strings.forgotPasswordDescription}
                    </Text> */}

                    <Text style={styles.labelText}>
                        {'Send new password via'}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onEmailSelect}
                        style={styles.button}
                    >
                        <Image
                            source={isEmailSelected ? icons.ic_radio : icons.ic_radio_inactive}
                            style={styles.radioButton}
                        />

                        <Text style={styles.buttonLabel}>
                            {strings.email}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onMobileSelect}
                        style={styles.button}
                    >
                        <Image
                            source={isEmailSelected ? icons.ic_radio_inactive : icons.ic_radio}
                            style={styles.radioButton}
                        />

                        <Text style={styles.buttonLabel}>
                            {strings.mobileNumber}
                        </Text>
                    </TouchableOpacity>

                    {/* <View style={styles.radioPickerOuterContainer}>
                            <RadioButton
                                // onSelect={handleChange(parameter.field_name)}
                                selectedValue={1}
                                options={industryOptions}
                            />
                        </View> */}

                    {this.renderInput()}

                    <Button
                        label={strings.continue}
                        onPress={this.onContinuePress}
                        style={styles.continueButton}
                    />
                </KeyboardAwareScrollView>
                <Loader
                    isLoading={this.state.loading}
                    isAbsolute
                />


                <KeyboardAccessoryView
                    inputAccessoryViewID={inputAccessoryViewID}
                    onPress={this.onMobileSubmit}
                    label={strings.next}
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
    forgotPassword: {
        fontSize: moderateScale(24),
        fontFamily: fonts.regular,
        marginTop: moderateScale(10),
    },
    emailContainer: {
        marginTop: moderateScale(15)
    },
    labelText: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.black5,
        marginVertical: moderateScale(10)
    },
    continueButton: {
        marginTop: moderateScale(50)
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
        paddingHorizontal: moderateScale(5),
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mobileInputContainer: {
        flex: 1,
        marginLeft: moderateScale(0),
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: moderateScale(4)
    },
    buttonLabel: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        marginLeft: moderateScale(10)
    },
    radioButton: {
        tintColor: commonColors().themeColor
    }
});

export default ForgotPassword;
