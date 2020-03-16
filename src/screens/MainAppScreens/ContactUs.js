import React from 'react';
import { Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import {
    Wrapper,
    Header,
    WhiteContainer
} from '../../components/common';
import { strings } from '../../localization';
import { icons, fonts } from '../../../assets';
import { popScreen } from '../../utilities/NavigationService';
import { colors } from '../../utilities/constants';

const Button = ({ onPress, label, value, containerStyle }) => (
    <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[styles.button, containerStyle]}
    >
        <Text style={styles.label}>
            {label}
        </Text>

        <Text style={styles.value}>
            {value}
        </Text>
    </TouchableOpacity>
);

const ContactUs = () => {
    const onEmailPress = () => Linking.openURL('mailto:support@example.com');
    const onMobilePress = () => Linking.openURL('tel:123456789');

    return (
        <Wrapper>
            <Header
                title={strings.contactUs}
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                blackTitle
                titlePosition={'left'}
            />

            <WhiteContainer>
                <Button
                    value={'contact@yabalash.com'}
                    label={strings.email}
                    onPress={onEmailPress}
                />

                <Button
                    value={'123456789'}
                    label={strings.mobileNumber}
                    containerStyle={{
                        ...styles.button,
                        marginTop: moderateScale(15)
                    }}
                    onPress={onMobilePress}
                />
            </WhiteContainer>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    button: {
        height: moderateScale(52),
        marginHorizontal: moderateScale(15),
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.black3
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
        color: colors.black5
    },
    value: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        marginTop: moderateScale(8)
    }
});

const mapStateToProps = ({ lang }) => ({
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, { })(ContactUs);
