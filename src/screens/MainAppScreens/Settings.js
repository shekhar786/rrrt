import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import uuid from 'uuid';

import { logout } from '../../store/actions';
import { colors, screenNames, appTypes, urls, PROVIDERS } from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { strings } from '../../localization';
import { Wrapper, HeaderWithLeftTitle, Loader, Header } from '../../components/common';
import { goBack, navigate } from '../../utilities/NavigationService';
import { Button } from '../../components/Settings';
import { getAppId } from '../../utilities/helperFunctions';

const Settings = (props) => {
    const [switchValue, setSwitchValue] = useState(true);

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onCrossPressed = () => goBack();

    const onSwitchValueChange = (value) => {
        setSwitchValue(value);
    };

    let buttons = [
        {
            id: uuid(),
            label: strings.changePassword,
            notificationButton: false,
            onPress: () => navigate(screenNames.ChangePassword)
        },
        {
            id: uuid(),
            label: strings.notifications,
            notificationButton: true,
            onPress: onSwitchValueChange,
            switchValue
        },
        {
            id: uuid(),
            label: strings.language,
            notificationButton: false,
            onPress: () => navigate(screenNames.SelectLanguage)
        },
        {
            id: uuid(),
            label: strings.changePhoneNumber,
            notificationButton: false,
            onPress: () => navigate(screenNames.ChangePhoneNumber)
        },
        {
            id: uuid(),
            label: strings.changeEmail,
            notificationButton: false,
            onPress: () => navigate(screenNames.ChangeEmail)
        },
        {
            id: uuid(),
            label: strings.termsAndCondition,
            notificationButton: false,
            onPress: () => navigate(screenNames.WebView, {
                uri: urls.baseUrl + urls.getTermsAndConditions,
                headerTitle: strings.termsAndCondition
            })
        },
        {
            id: uuid(),
            label: strings.privacyPolicy,
            notificationButton: false,
            onPress: () => navigate(screenNames.WebView, {
                uri: urls.baseUrl + urls.getTermsAndConditions,
                headerTitle: strings.privacyPolicy
            })
        },
        {
            id: uuid(),
            label: strings.helpAndSupport,
            notificationButton: false,
            onPress: () => navigate(screenNames.WebView, {
                uri: urls.baseUrl + urls.getTermsAndConditions,
                headerTitle: strings.helpAndSupport
            })
        },
        {
            id: uuid(),
            label: strings.faq,
            notificationButton: false,
            onPress: () => navigate(screenNames.WebView, {
                uri: urls.baseUrl + urls.getFaq,
                headerTitle: strings.faq
            })
        },
        {
            id: uuid(),
            label: strings.logout,
            notificationButton: false,
            hideRightArrow: true,
            onPress: () => {
                Alert.alert(
                    strings.logout,
                    strings.areYouSureYouWantToLogout,
                    [
                        {
                            text: strings.cancel,
                            onPress: () => { },
                            style: 'cancel',
                        },
                        { text: strings.logout, onPress: () => props.logout({ hideAlert: true }) },
                    ],
                    { cancelable: false },
                );
            }
        },
    ];

    let header = (
        <Header
            leftIconSource={icons.ic_back}
            onLeftPress={onCrossPressed}
            title={strings.settings}
            blackTitle
        />
    );

    if (getAppId() === appTypes.yabalash.id) {
        header = (
            <HeaderWithLeftTitle
                leftTitle={strings.settings}
                rightImage={icons.ic_cross_black}
                onRightPress={onCrossPressed}
            />
        );

        buttons = [
            {
                id: uuid(),
                label: strings.changePassword,
                notificationButton: false,
                // onPress: () => navigate(screenNames.ChangePassword)
            },
            {
                id: uuid(),
                label: strings.language,
                notificationButton: false,
                onPress: () => navigate(screenNames.SelectLanguage)
            },
            {
                id: uuid(),
                label: strings.notifications,
                notificationButton: true,
                onPress: onSwitchValueChange,
                switchValue
            },
            {
                id: uuid(),
                label: strings.privacyPolicy,
                notificationButton: false,
                onPress: () => { }
            },
            {
                id: uuid(),
                label: strings.termsAndCondition,
                notificationButton: false,
                // onPress: () => navigate(screenNames.WebView, {
                //     uri: urls.baseUrl + urls.getTermsAndConditions,
                //     headerTitle: strings.termsAndCondition
                // })
            },
            {
                id: uuid(),
                label: strings.helpAndSupport,
                notificationButton: false,
                onPress: () => navigate(screenNames.ContactUs)
            },
            {
                id: uuid(),
                label: strings.faq,
                notificationButton: false,
                onPress: () => navigate(screenNames.WebView, {
                    uri: urls.baseUrl + urls.getFaq,
                    headerTitle: strings.faq
                })
            },
            {
                id: uuid(),
                label: strings.logout,
                notificationButton: false,
                hideRightArrow: true,
                onPress: () => {
                    Alert.alert(
                        strings.logout,
                        strings.areYouSureYouWantToLogout,
                        [
                            {
                                text: strings.cancel,
                                onPress: () => { },
                                style: 'cancel',
                            },
                            { text: strings.logout, onPress: () => props.logout({ hideAlert: true }) },
                        ],
                        { cancelable: false },
                    );
                }
            },
        ];
    }

    if (props.provider === PROVIDERS.fb) {
        buttons = buttons.filter((button) => button.id !== 1);
    }

    return (
        <Wrapper>
            {header}

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
            >
                {getAppId() === appTypes.yabalash.id ?
                    <Text style={styles.manageSettingsString}>
                        {strings.manageSettings}
                    </Text>
                    : null
                }

                {buttons.map((button) => <Button key={button.id} {...button} />)}
            </ScrollView>

            <Loader
                isLoading={props.loading}
                isAbsolute
            />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(15),
    },
    listContentContainer: {
        paddingBottom: moderateScale(40)
    },
    manageSettingsString: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8,
        marginBottom: moderateScale(15)
    }
});

const mapStateToProps = ({ user, lang }) => ({
    loading: user.loading,
    provider: user.provider,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, { logout })(Settings);
