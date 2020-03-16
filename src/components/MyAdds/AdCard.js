import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Platform,
    Alert
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import dayjs from 'dayjs';

import {
    colors,
    screenNames,
    commonColors,
    urls,
    HUMAN_READABLE_DATE_FORMAT,
    appTypes
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { navigate } from '../../utilities/NavigationService';
import { formatNumber, getAppId } from '../../utilities/helperFunctions';

const AdCard = ({ ad, activateDeactivateAd }) => {
    const [isAdActivated, setIsAdActivated] = useState(!!ad.isactive);

    useEffect(() => {
        setIsAdActivated(!!ad.isactive);
    }, [ad]);

    const onAddPress = () => navigate(screenNames.ProductDetails, {
        adData: ad
    });

    const toggleActivationStatus = (switchValue) => {
        setIsAdActivated(switchValue);
        const isactive = switchValue ? 1 : 0;

        const cb = (error, data) => {
            if (!error) {
                ad.isactive = isactive;
            }
        };

        activateDeactivateAd({
            post_id: ad.id,
            isactive,
            cb
        });
    };

    const onActivateDeactivateAd = (switchValue) => {
        if (!switchValue) {
            return Alert.alert(
                strings.deactivate,
                strings.areYouSureYouWantToDeactivateAd,
                [
                    {
                        text: strings.cancel,
                        onPress: () => { },
                        style: 'cancel',
                    },
                    {
                        text: strings.deactivate,
                        onPress: () => toggleActivationStatus(switchValue)
                    },
                ],
                { cancelable: false },
            );
        }

        toggleActivationStatus(switchValue);
    };

    let premiumView = null;
    let activateView = null;

    if (getAppId() !== appTypes.yabalash.id) {
        premiumView = (
            <Text
                style={{
                    ...styles.premium,
                    color: ad.isPremium ? colors.green2 : colors.grey15
                }}
            >
                {ad.isPremium ? strings.premium : strings.nonPremium}
            </Text>
        );
    }

    if (getAppId() !== appTypes.yabalash.id) {
        activateView = (
            <View style={styles.activeStatusContainer}>
                <Text
                    style={{
                        ...styles.activateDeactivate,
                        color: ad.activated ? commonColors().themeColor : colors.black15
                    }}
                >
                    {isAdActivated ? strings.activate : strings.deactivate}
                </Text>

                <Switch
                    value={isAdActivated}
                    onValueChange={onActivateDeactivateAd}
                    style={commonStyles.switch}
                    trackColor={{
                        true: commonColors().themeColor
                    }}
                    thumbColor={Platform.select({ android: colors.white1 })}
                />
            </View>
        );
    }

    const renderImage = () => {
        if (ad && ad.images && ad.images.length > 0 && ad.images[0].value) {
            const images = ad.images[0].value.split(',');

            return (
                <Image
                    source={{ uri: urls.imagePath + images[0] }}
                    style={styles.adImage}
                />
            );
        }

        return (
            <View style={styles.placeholderContainer}>
                <Image
                    source={icons.ic_placeholder_ad}
                    style={styles.placeholderImage}
                />
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.6}
            onPress={onAddPress}
        >
            <View style={styles.detailsContainer}>
                <View style={styles.productImageContainer}>
                    {renderImage()}
                </View>
                <View style={styles.descriptionContainer}>
                    {premiumView}

                    <Text
                        style={styles.title}
                        numberOfLines={1}
                    >
                        {ad.title}
                    </Text>
                    {ad && ad.price ?
                        <Text style={styles.price}>

                            <Text
                                style={styles.price}
                                numberOfLines={1}
                            >
                                {formatNumber(ad.price)} {strings.aed}
                            </Text>

                        </Text>
                        : null}
                    <View style={styles.dateContainer}>
                        <Image source={icons.calendar} />
                        <Text style={styles.date}>
                            {`${dayjs(ad.created_at).format(HUMAN_READABLE_DATE_FORMAT)} ${strings.to} ${dayjs(ad.created_at).add(1, 'M').format(HUMAN_READABLE_DATE_FORMAT)}`}
                        </Text>
                    </View>

                </View>
            </View>

            {activateView}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.shadow,
        padding: moderateScale(15),
        backgroundColor: colors.white1,
        borderRadius: moderateScale(4),
        borderLeftWidth: moderateScale(2),
        borderLeftColor: commonColors().themeColor
    },
    detailsContainer: {
        flexDirection: 'row',
    },
    productImageContainer: {
        height: moderateScale(80),
        width: moderateScale(80),
        backgroundColor: colors.grey9,
        borderRadius: moderateScale(2),
        overflow: 'hidden'
    },
    descriptionContainer: {
        marginLeft: moderateScale(15),
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    price: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(5)
    },
    date: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(12),
        color: colors.grey5,
        marginLeft: moderateScale(10)
    },
    adImage: {
        flex: 1
    },
    premium: {
        fontSize: moderateScale(10),
        fontFamily: fonts.semiBold,
        textTransform: 'uppercase',
        position: 'absolute',
        top: -5,
        right: 0
    },
    activeStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        right: -10
    },
    activateDeactivate: {
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
        marginRight: moderateScale(8)
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderImage: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    }
});

export { AdCard };
