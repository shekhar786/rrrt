import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { addPost } from '../../store/actions';
import { Header, Wrapper, Button, Loader } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import {
    colors,
    commonColors,
    promotionType,
    screenNames,
    ReplaceCurrentScreenAndRemovePrevScreens
} from '../../utilities/constants';
import logger from '../../utilities/logger';

const PromoteBeforePostAd = (props) => {
    const [selectedPromotionOption, setSelectedPromotionOption] = useState(0);
    const [loading, setLoading] = useState(false);

    const popScreen = () => goBack();

    const adData = props.navigation.getParam('adData', {});

    logger.log('adData in PromoteBeforePostAd is: ', adData);

    const onSubmit = () => {
        setLoading(true);

        adData.promoted = selectedPromotionOption;

        const successCallback = (error, data) => {
            if (error) {
                return setLoading(false);
            }

            // logger.data('added data is: ', data);

            const postAdScreenKey = props.navigation.getParam('postAdScreenKey', null);

            props.navigation.dispatch({
                replaceFrom: postAdScreenKey, //start popping from
                type: ReplaceCurrentScreenAndRemovePrevScreens,
                routeName: screenNames.PostSuccess, //send popping to
                params: { adData: data },
            });

            /* props.navigation.popToTop();

            return navigate(screenNames.PostSuccess, { adData: data }); */
        };

        props.addPost({ adData, cb: successCallback });
    };

    const renderPromotionOption = (option) => {
        let buttonImage = icons.ic_radio_inactive;
        let title = null;
        let priceView = null;
        let guaranteedView = null;

        if (selectedPromotionOption === option) {
            buttonImage = icons.ic_radio;
        }

        if (option === promotionType.paid) { /* paid promotion */
            title = strings.formatString(strings.promoteAdForDays, 5);

            priceView = (
                <Text style={styles.price}>
                    250 {strings.aed}
                </Text>
            );

            guaranteedView = (
                <View style={styles.guaranteedViewsContainer}>
                    <Image source={icons.ic_check_green_small} />
                    <Text style={styles.guaranteedViews}>
                        {strings.formatString(strings.guaranteedViews, 1000)}
                    </Text>
                </View>
            );
        } else {
            title = strings.promoteYourAdFree;
        }

        return (
            <TouchableOpacity
                style={styles.cardContainer}
                activeOpacity={0.6}
                onPress={() => setSelectedPromotionOption(option)}
            >
                <View style={styles.cardLeftContainer}>
                    <Image
                        source={buttonImage}
                        style={styles.radioButton}
                    />
                    <View style={styles.cardTitleConatiner}>
                        <Text style={styles.promoteAdTitle}>
                            {title}
                        </Text>
                        {guaranteedView}
                    </View>
                </View>

                {priceView}
            </TouchableOpacity>
        );
    };

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                showBottomBorder
                title={strings.yourPostIsAlmostOnline}
                blackTitle
                titlePosition={'left'}
            />

            <View style={styles.container}>
                <Text style={styles.youWantToPromote}>
                    {strings.youWantToPromote}
                </Text>

                {renderPromotionOption(promotionType.paid)}

                {renderPromotionOption(promotionType.free)}

                <Button
                    label={strings.continue}
                    style={styles.button}
                    marginTop={50}
                    onPress={onSubmit}
                />
            </View>

            <Loader isLoading={loading} isAbsolute />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    container: {
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(20)
    },
    youWantToPromote: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.black11
    },
    cardContainer: {
        borderWidth: moderateScale(1),
        borderColor: colors.black10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: moderateScale(15),
        marginTop: moderateScale(28)
    },
    cardLeftContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    radioButton: {
        tintColor: commonColors().themeColor,
        marginTop: moderateScale(5)
    },
    promoteAdTitle: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
    },
    price: {
        fontSize: moderateScale(16),
        fontFamily: fonts.bold,
    },
    cardTitleConatiner: {
        flex: 1,
        marginLeft: moderateScale(10)
    },
    guaranteedViewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(5)
    },
    guaranteedViews: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.black12,
        marginLeft: moderateScale(5)
    }
});

export default connect(null, {
    addPost
})(PromoteBeforePostAd);
