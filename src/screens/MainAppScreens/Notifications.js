import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    FlatList,
    Platform,
    Text,
    TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { Wrapper, WhiteContainer, Header } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { colors, dummyList } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { goBack } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { NotificationCard } from '../../components/Notifications';

const Notifications = () => {
    const [notifications, setNotifications] = useState(dummyList);

    useEffect(() => {
        // code to run on component mount
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onLeftPress = () => goBack();

    const renderNotification = ({ item }) => (
        <NotificationCard notification={item} />
    );

    const renderRightButton = () => (
        <TouchableOpacity
            activeOpacity={0.6}
            style={styles.headerRightButton}
        >
            <Text style={styles.headerRightText}>
                {strings.clearAll}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_cross_black}
                onLeftPress={onLeftPress}
                containerStyle={styles.header}
                title={strings.notification}
                titleStyle={styles.titleStyle}
                showBottomBorder={Platform.OS === 'android'}
                renderRightButton={renderRightButton}
            />
            <WhiteContainer>
                <View style={styles.subContainer}>
                    <FlatList
                        data={notifications}
                        renderItem={renderNotification}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                    />
                </View>
            </WhiteContainer>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        backgroundColor: colors.white1,
        ...commonStyles.shadow,
        shadowRadius: moderateScale(2),
        elevation: 0,
        marginBottom: 5
    },
    subContainer: {
        marginHorizontal: 15,
    },
    titleStyle: {
        color: colors.black1,
        right: -moderateScale(10)
    },
    listContentContainer: {
        paddingHorizontal: 15,
        paddingBottom: 60
    },
    headerRightButton: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: moderateScale(10),
    },
    headerRightText: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(14),
        color: colors.olive1
    }
});

const mapStateToProps = ({ lang }) => ({
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, { })(Notifications);
