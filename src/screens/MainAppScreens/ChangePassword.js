import React, { useState } from 'react';
import {
    StyleSheet,
    Keyboard
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import {
    Wrapper,
    Header,
    TextInputWithLabel,
    WhiteContainer,
    Button,
    Loader
} from '../../components/common';
import { icons } from '../../../assets';
import { goBack, popScreen } from '../../utilities/NavigationService';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { showErrorAlert } from '../../utilities/helperFunctions';
import { regex } from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { changePassword } from '../../store/actions';

const ChangePassword = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const oldPasswordRef = React.createRef();
    const newPasswordRef = React.createRef();
    const confirmNewPasswordRef = React.createRef();

    const onLeftPress = () => goBack();
    const onOldPasswordSubmit = () => newPasswordRef.current.focus();
    const onNewPasswordSubmit = () => confirmNewPasswordRef.current.focus();

    const onSubmit = () => {
        if (!oldPassword) {
            showErrorAlert(strings.oldPasswordRequired);
        } else if (!regex.password.test(oldPassword)) {
            showErrorAlert(strings.enterValidOldPassword);
        }/*  else if (oldPassword.length < 6 || oldPassword.length > 15) {
            showErrorAlert(strings.passwordMinMaxLength);
        } */ else if (!newPassword) {
            showErrorAlert(strings.newPasswordRequired);
        } else if (!regex.password.test(newPassword)) {
            showErrorAlert(strings.enterValidNewPassword);
        } else if (newPassword.length < 6 || newPassword.length > 15) {
            showErrorAlert(strings.passwordMinMaxLength);
        } else if (!confirmNewPassword) {
            showErrorAlert(strings.confirmNewPasswordRequired);
        } else if (newPassword !== confirmNewPassword) {
            showErrorAlert(strings.newAndConfirmPasswordNotMatched);
        } else {
            Keyboard.dismiss();
            setLoading(true);

            props.changePassword({
                data: {
                    oldpassword: oldPassword,
                    newpassword: newPassword
                },
                cb: (error) => {
                    setLoading(false);

                    if (!error) {
                        popScreen();
                    }
                }
            });
        }
    };

    return (
        <Wrapper>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                containerStyle={commonStyles.header}
                showBottomBorder={!layout.isIOS}
                title={strings.changePassword}
                blackTitle
            />

            <WhiteContainer style={styles.subContainer}>
                <TextInputWithLabel
                    label={strings.oldPassword}
                    ref={oldPasswordRef}
                    onSubmitEditing={onOldPasswordSubmit}
                    returnKeyType={'next'}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    secureTextEntry
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />
                <TextInputWithLabel
                    label={strings.newPassword}
                    ref={newPasswordRef}
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
                    onPress={onSubmit}
                    marginTop={moderateScale(50)}
                />
            </WhiteContainer>

            <Loader isLoading={loading} isAbsolute />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(50)
    },
    textInputContainer: {
        marginTop: moderateScale(15),
        height: moderateScale(56)
    },
});

const mapStateToProps = ({ lang }) => ({
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    changePassword
})(ChangePassword);
