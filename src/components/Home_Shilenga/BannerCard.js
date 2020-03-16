import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Linking
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, urls } from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { Gradient } from '../common';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';

const BannerCard = ({ banner }) => {
    const onBannerPress = () => {
        Linking.canOpenURL(banner.link)
            .then(supported => {
                if (supported) {
                    Linking.openURL(banner.link);
                } else {
                    console.log(`Don't know how to open URI: ${banner.link}`);
                }
            });
    };

    return (
        <TouchableWithoutFeedback onPress={onBannerPress}>
            <View style={styles.container}>
                <Image
                    source={{ uri: urls.imagePath + banner.banner_img }}
                    style={styles.bannerImage}
                />

                <Gradient
                    height={180}
                    width={layout.size.width - 40}
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.getOff}>
                        {strings.formatString(strings.getoff, banner.discount)}
                    </Text>
                    <View style={styles.batchWrapper}>
                        <View style={styles.batchContainer}>
                            <View style={styles.leftBatch}>
                                <Text
                                    style={styles.batchLabel}
                                    numberOfLines={1}
                                >
                                    {banner.title}
                                </Text>
                            </View>
                            <Image source={icons.ic_batch} />
                        </View>
                    </View>

                    <Text
                        style={styles.offerDescription}
                        numberOfLines={2}
                    >
                        {banner.description}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grey9,
        marginHorizontal: moderateScale(5),
        borderRadius: moderateScale(8),
        overflow: 'hidden'
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: moderateScale(10)
    },
    getOff: {
        color: colors.white1,
        fontSize: moderateScale(18),
        fontFamily: fonts.bold,
        marginLeft: moderateScale(15),
    },
    batchWrapper: {
        flexDirection: 'row',
        marginTop: moderateScale(5),
    },
    batchContainer: {
        flexDirection: 'row',
        // height: moderateScale(25),
    },
    leftBatch: {
        backgroundColor: colors.orange1,
        marginBottom: moderateScale(3),
        paddingLeft: moderateScale(15),
        justifyContent: 'center',
        paddingRight: moderateScale(2),
        maxWidth: moderateScale(200)
    },
    batchLabel: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        color: colors.white1,
        lineHeight: 23
    },
    offerDescription: {
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
        color: colors.white1,
        marginLeft: moderateScale(15)
    },
    bannerImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'stretch'
    }
});

export { BannerCard };
