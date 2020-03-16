import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale } from 'react-native-size-matters';

import { signup } from '../../store/actions';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import {
    Wrapper,
    TextInputWithLabel,
    Button,
    Header,
    KeyboardAccessoryView,
    Loader
} from '../../components/common';
import { colors, regex, } from '../../utilities/constants';
import { goBack } from '../../utilities/NavigationService';
import { showErrorAlert } from '../../utilities/helperFunctions';

class EnterMobileNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.hasComeFromMainApp = props.navigation.getParam('hasComeFromMainApp', false);
    }

    onContinuePress = (values) => {
        const data = this.props.navigation.getParam('data', {});
        const loginKeyId = this.props.navigation.getParam('loginKeyId', null);

        data.mobile = values.phone;
        
        this.props.signup({
            data,
            hasComeFromMainApp: this.hasComeFromMainApp,
            loginKeyId
        });

        /* navigate(screenNames.MobileVerification, {
            hasComeFromMainApp: this.hasComeFromMainApp,
            enterMobileNumberKeyId: this.props.navigation.state.key,
            loginKeyId,
            data
        }); */
    };

    onDonePress = () => Keyboard.dismiss();

    goBack = () => goBack();

    render() {
        const inputAccessoryViewID = 'phoneNumber';
        /* let header = null;

        if (this.hasComeFromMainApp) {
            header = (
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.goBack}
                />
            );
        } */

        return (
            <Wrapper wrapperStyle={styles.container}>
                {/* {header} */}
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.goBack}
                />

                <KeyboardAwareScrollView
                    style={styles.subContainer}
                    contentContainerStyle={{
                        ...styles.subContentContainer,
                        paddingTop: this.hasComeFromMainApp ? 0 : moderateScale(60)
                    }}
                    bounces={false}
                >
                    <Text style={styles.mobileNumberText}>
                        {strings.mobileNumber}
                    </Text>

                    <Text style={styles.mobileNumerDescription}>
                        {strings.mobileNumerDescription}
                    </Text>

                    <View style={styles.formContainer}>
                        <Formik
                            initialValues={{ phone: '' }}
                            onSubmit={this.onContinuePress}
                            validationSchema={
                                yup.object().shape({
                                    phone: yup
                                        .string()
                                        .matches(regex.mobileNo, strings.enterValidMobileNo)
                                        .required(strings.mobileNoRequired),
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
                                let phoneError = false;

                                if (touched.phone && errors.phone) {
                                    phoneError = true;
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
                                            label={strings.mobileNumber}
                                            onChangeText={handleChange('phone')}
                                            value={values.phone}
                                            containerStyle={styles.mobileNumberContainer}
                                            keyboardType={'number-pad'}
                                            maxLength={12}
                                            errored={phoneError}
                                            inputAccessoryViewID={inputAccessoryViewID}
                                            blurOnSubmit
                                        />

                                        <Button
                                            label={strings.continue}
                                            onPress={onSubmit}
                                            style={styles.continueButton}
                                        />
                                    </>
                                );
                            }}
                        </Formik>
                    </View>
                </KeyboardAwareScrollView>

                <KeyboardAccessoryView
                    inputAccessoryViewID={inputAccessoryViewID}
                    onPress={this.onDonePress}
                    label={strings.done}
                />

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
        paddingBottom: moderateScale(20)
    },
    formContainer: {
        marginTop: moderateScale(20)
    },
    mobileNumerDescription: {
        color: colors.black5,
        marginTop: moderateScale(10),
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
    },
    mobileNumberText: {
        fontSize: moderateScale(24),
        fontFamily: fonts.regular,
    },
    mobileNumberContainer: {
        marginTop: moderateScale(20)
    },
    continueButton: {
        marginTop: moderateScale(50)
    }
});

const mapStateToProps = ({ auth }) => ({
    loading: auth.loading
});

export default connect(mapStateToProps, {
    signup
})(EnterMobileNumber);
