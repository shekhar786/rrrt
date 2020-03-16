import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Text, StatusBar } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import CountryPicker, { getCallingCode } from 'react-native-country-picker-modal';

import {
    Header,
    Wrapper,
    TextInputWithLabel,
    Button,
    Loader,
    KeyboardAccessoryView
} from '../../components/common';
import { icons } from '../../../assets';
import { popScreen, navigate } from '../../utilities/NavigationService';
import { layout } from '../../utilities/layout';
import { strings } from '../../localization';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';
import {
    regex,
    colors,
    appTypes,
    screenNames,
    otpRequestType
} from '../../utilities/constants';
import { requestOTP } from '../../store/actions';
import logger from '../../utilities/logger';

const ChangePhoneNumber = (props) => {
    let country = props.app_country;

    if (props.user_country) {
        country = props.user_country;
    }
    const [countryCode, setCountryCode] = useState(country.toUpperCase());
    const [callingCode, setCallingCode] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const getPhoneCallingCode = async () => {
        try {
            const code = await getCallingCode(country.toUpperCase());
            setCallingCode(code);
        } catch (error) {
            logger.error('getCallingCode error: ', error);
        }
    };

    useEffect(() => {
        getPhoneCallingCode();
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onSelectCountry = async (countryData) => {
        setCountryCode(countryData.cca2);
        setCallingCode(countryData.callingCode[0]);
    };

    const onSavePress = () => {
        if (!phone) {
            showErrorAlert(strings.phoneRequired);
        } else if (!regex.mobileNo.test(phone)) {
            showErrorAlert(strings.enterValidMobileNo);
        } else {
            Keyboard.dismiss();
            const { isFocused } = props.navigation;
            setLoading(true);
            props.requestOTP({
                data: {
                    mobile: phone,
                    calling_code: callingCode,
                    for_type: otpRequestType.changePhoneNo
                },
                cb: (error, otp) => {
                    if (isFocused()) {
                        setLoading(false);
                    }

                    if (error) {
                        return showErrorAlert(error);
                    }

                    if (isFocused()) {
                        return navigate(screenNames.MobileVerification, {
                            data: {
                                mobile: phone,
                                countryCode,
                                callingCode,
                                otp
                            },
                            verificationtype: otpRequestType.changePhoneNo
                        });
                    }
                }
            });
        }
    };

    const onDonePress = () => Keyboard.dismiss();

    const inputAccessoryViewID = 'MobileNumber';

    return (
        <Wrapper>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                showBottomBorder={!layout.isIOS}
                title={strings.newMobileNumber}
                blackTitle
            />

            <View style={styles.subContainer}>
                <View style={styles.mobileNumberContainer}>
                    <Text style={styles.label}>
                        {strings.mobileNumber}
                    </Text>
                    <View style={styles.mobileNumberSubContainer}>
                        <View style={styles.countryCodeContainer}>
                            <CountryPicker
                                withAlphaFilter
                                withCloseButton
                                withFilter
                                withCallingCode
                                withCallingCodeButton={countryCode}
                                countryCode={countryCode}
                                onSelect={onSelectCountry}
                            />
                        </View>

                        <TextInputWithLabel
                            returnKeyType={'done'}
                            keyboardType={'number-pad'}
                            value={phone}
                            onChangeText={setPhone}
                            disableBorder
                            containerStyle={styles.mobileInputContainer}
                            blurOnSubmit
                            inputAccessoryViewID={inputAccessoryViewID}
                            maxLength={12}
                        />
                    </View>
                </View>
            </View>

            <Button
                label={strings.save}
                onPress={onSavePress}
                marginBottom={moderateScale(20)}
                marginHorizontal={moderateScale(15)}
            />

            <KeyboardAccessoryView
                inputAccessoryViewID={inputAccessoryViewID}
                label={strings.done}
                onPress={onDonePress}
            />
            <Loader isLoading={loading} isAbsolute />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        padding: moderateScale(15),
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
        paddingVertical: moderateScale(5),
        borderColor: colors.black3
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mobileInputContainer: {
        flex: 1,
        marginLeft: moderateScale(0),
    },
});

const mapStateToProps = ({ user }) => ({
    user_country: user.user_country,
    app_country: user.app_country,
    calling_code: user.calling_code
});

export default connect(mapStateToProps, {
    requestOTP
})(ChangePhoneNumber);
