import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, StatusBar } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import {
    Header,
    Wrapper,
    TextInputWithLabel,
    Button,
    Loader
} from '../../components/common';
import { icons } from '../../../assets';
import { popScreen } from '../../utilities/NavigationService';
import { layout } from '../../utilities/layout';
import { strings } from '../../localization';
import { showErrorAlert, showSuccessAlert } from '../../utilities/helperFunctions';
import { regex } from '../../utilities/constants';
import { changeEmail } from '../../store/actions';

const ChangeEmail = (props) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onSavePress = () => {
        if (!email) {
            showErrorAlert(strings.emailRequired);
        } else if (!regex.email.test(email)) {
            showErrorAlert(strings.enterValidEmail);
        } else {
            Keyboard.dismiss();
            setLoading(true);

            props.changeEmail({
                data: {
                    email
                },
                cb: (error) => {
                    setLoading(false);

                    if (!error) {
                        popScreen();
                        showSuccessAlert(strings.emailUpdatedSuccessfully, {
                            duration: 5000
                        });
                    }
                }
            });
        }
    };

    return (
        <Wrapper>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                showBottomBorder={!layout.isIOS}
                title={strings.newEmail}
                blackTitle
            />

            <View style={styles.subContainer}>
                <TextInputWithLabel
                    label={strings.newEmail}
                    returnKeyType={'done'}
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                    blurOnSubmit
                />
            </View>

            <Button
                label={strings.save}
                onPress={onSavePress}
                marginBottom={moderateScale(20)}
                marginHorizontal={moderateScale(15)}
            />
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
        marginTop: moderateScale(30),
        height: moderateScale(62)
    },
    saveButton: {
        marginTop: moderateScale(50)
    }
});

export default connect(null, {
    changeEmail
})(ChangeEmail);
