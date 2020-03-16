import React, { useState } from 'react';
import { Platform, StyleSheet, Keyboard } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { forceChangePassword } from '../../store/actions';
import {
    Wrapper,
    Header,
    TextInputWithLabel,
    WhiteContainer,
    Button,
    Loader
} from '../../components/common';
import { colors, regex } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { showErrorAlert } from '../../utilities/helperFunctions';
import { icons } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';

const ForceChangePassword = (props) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const onLeftPress = () => goBack();

    const confirmNewPasswordRef = React.createRef();

    const onNewPasswordSubmit = () => confirmNewPasswordRef.current.focus();

    const onSubmit = () => {
        if (!newPassword) {
            showErrorAlert(strings.newPasswordRequired);
        } else if (!regex.password.test(newPassword)) {
            showErrorAlert(strings.enterValidPassword);
        } else if (newPassword.length < 6 || newPassword.length > 15) {
            showErrorAlert(strings.newPasswordMinMaxLength);
        } else if (!confirmNewPassword) {
            showErrorAlert(strings.confirmNewPasswordRequired);
        } else if (newPassword !== confirmNewPassword) {
            showErrorAlert(strings.newAndConfirmPasswordNotMatched);
        } else {
            const token = props.navigation.getParam('token', 0);
            const hasComeFromMainApp = props.navigation.getParam('hasComeFromMainApp', false);
            const loginKeyId = props.navigation.getParam('loginKeyId', null);

            // console.log('user token is: ', token);

            const data = {
                password: newPassword,
            };

            Keyboard.dismiss();

            props.forceChangePassword({
                data,
                hasComeFromMainApp,
                loginKeyId,
                token
            });
        }
    };

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                containerStyle={styles.header}
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                showBottomBorder={Platform.OS === 'android'}
                title={strings.changePassword}
                blackTitle
            />

            <WhiteContainer style={styles.subContainer}>
                <TextInputWithLabel
                    label={strings.newPassword}
                    onSubmitEditing={onNewPasswordSubmit}
                    returnKeyType={'next'}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    secureTextEntry
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />

                <TextInputWithLabel
                    label={strings.confirmNewPassword}
                    ref={confirmNewPasswordRef}
                    blurOnSubmit
                    returnKeyType={'done'}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    secureTextEntry
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />

                <Button
                    label={strings.save}
                    style={styles.saveButton}
                    onPress={onSubmit}
                />
            </WhiteContainer>

            <Loader
                isLoading={props.loading}
                isAbsolute
            />
        </Wrapper >
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        ...commonStyles.header
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(50)
    },
    textInputContainer: {
        marginTop: moderateScale(15),
        height: moderateScale(56)
    },
    saveButton: {
        marginTop: moderateScale(50)
    }
});

const mapStateToProps = ({ auth }) => ({
    loading: auth.loading
});

export default connect(mapStateToProps, {
    forceChangePassword
})(ForceChangePassword);
