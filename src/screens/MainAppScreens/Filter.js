import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { Wrapper, Header, MultiSlider, Button } from '../../components/common';
import { strings } from '../../localization';
import { icons, fonts } from '../../../assets';
import { colors, screenNames } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { goBack, navigate } from '../../utilities/NavigationService';
import { layout } from '../../utilities/layout';
import logger from '../../utilities/logger';

const Filter = (props) => {
    const [priceRange, setPriceRange] = useState([0, 10]);
    const [marketPrice, setMarketPrice] = useState(true);
    const [giveAwayPrice, setGiveAwayPrice] = useState(true);
    const [freePrice, setFreePrice] = useState(true);
    const [location, setLocation] = useState({
        lat: props.currentLat,
        long: props.currentLong,
        address: props.currentAddress
    });
    // const [category, setCategory] = useState({});

    const onClearFilterPress = () => {
        setPriceRange([0, 10]);
        setMarketPrice(true);
        setGiveAwayPrice(true);
        setFreePrice(true);
        setLocation({
            lat: props.currentLat,
            long: props.currentLong,
            address: props.currentAddress
        });
        // setCategory({});
    };

    const onLeftPress = () => goBack();

    const onLocationPress = () => navigate(screenNames.ChooseLocation, {
        onLocationSelect: (selectedLocation) => {
            logger.data('selected location is: ', selectedLocation);
            setLocation(selectedLocation);
        }
    });
    // const onCategoriesPress = () => navigate(screenNames.ChooseCategories, {
    //     onCategorySelect: (c) => setCategory(c)
    // });
    const onMarketPricePress = () => setMarketPrice(!marketPrice);
    const onGiveAwayPricePress = () => setGiveAwayPrice(!giveAwayPrice);
    const onFreePricePress = () => setFreePrice(!freePrice);

    const renderRightButton = () => (
        <TouchableOpacity
            style={styles.headerRightButton}
            activeOpacity={0.6}
            onPress={onClearFilterPress}
        >
            <Text style={styles.clearAllText}>
                {strings.clearAll}
            </Text>
        </TouchableOpacity>
    );

    const onApplyPress = () => {
        const category_id = props.navigation.getParam('category_id', category_id);

        const queryParams = {
            minprice: priceRange[0],
            maxprice: priceRange[1],
            marketprice: marketPrice ? 1 : 0,
            giveawayprice: giveAwayPrice ? 1 : 0,
            free: freePrice ? 1 : 0,
            cat_id: category_id,
            lat: location.lat,
            long: location.long,
        };

        navigate(screenNames.FilteredAds, { queryParams });
    };

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                rightIconSource={icons.ic_filter}
                containerStyle={styles.header}
                showBottomBorder={!layout.isIOS}
                title={strings.filters}
                blackTitle
                renderRightButton={renderRightButton}
            />

            <View style={styles.subContainer}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainer}
                    onPress={onLocationPress}
                >
                    <Text style={styles.label}>
                        {strings.location}
                    </Text>
                    <Text style={styles.address}>
                        {location.address}
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainer}
                    onPress={onCategoriesPress}
                >
                    <Text style={styles.label}>
                        {strings.category}
                    </Text>
                    <Text style={styles.subLabel}>
                        {category.name || strings.all}
                    </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainer}
                    onPress={onMarketPricePress}
                >
                    <Text style={styles.label}>
                        {strings.marketPrice}
                    </Text>
                    <Image
                        source={marketPrice
                            ? icons.ic_check : icons.ic_uncheck
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainer}
                    onPress={onGiveAwayPricePress}
                >
                    <Text style={styles.label}>
                        {strings.giveawayPrice}
                    </Text>

                    <Image
                        source={giveAwayPrice
                            ? icons.ic_check : icons.ic_uncheck
                        }
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainer}
                    onPress={onFreePricePress}
                >
                    <Text style={styles.label}>
                        {strings.free}
                    </Text>

                    <Image
                        source={freePrice
                            ? icons.ic_check : icons.ic_uncheck
                        }
                    />
                </TouchableOpacity>

                <View style={styles.priceRangeContainer}>
                    <Text style={styles.label}>
                        {strings.priceRange}
                    </Text>
                    <Text style={styles.priceRangeText}>
                        {`${priceRange[0]} ${strings.aed} - ${priceRange[1]} ${strings.aed}`}
                    </Text>

                    <MultiSlider
                        max={100}
                        onValuesChange={setPriceRange}
                        sliderLength={layout.size.width - moderateScale(50)}
                        values={priceRange}
                        containerStyle={styles.sliderContainer}
                    />
                </View>
            </View>

            <Button
                label={strings.apply}
                style={styles.applyButton}
                onPress={onApplyPress}
            />
        </Wrapper>
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
        marginHorizontal: moderateScale(15),
        paddingBottom: moderateScale(50)
    },
    headerRightButton: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: moderateScale(15)
    },
    clearAllText: {
        fontSize: moderateScale(14),
        color: colors.olive1,
        fontFamily: fonts.regular,
    },
    buttonContainer: {
        height: moderateScale(56),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4,
        justifyContent: 'space-between'
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    },
    subLabel: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey6
    },
    priceRangeContainer: {
        marginTop: moderateScale(25)
    },
    priceRangeText: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey6,
        marginTop: moderateScale(5)
    },
    sliderContainer: {
        marginLeft: moderateScale(10)
    },
    applyButton: {
        marginHorizontal: moderateScale(15),
        marginBottom: moderateScale(40)
    },
    address: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey6,
        flex: 1,
        marginLeft: moderateScale(30),
        textAlign: 'right'
    }
});

const mapStateToProps = (({ location, lang }) => ({
    currentAddress: location.currentAddress,
    currentLat: location.currentLat,
    currentLong: location.currentLong,
    selectedLanguage: lang.selectedLanguage
}));

export default connect(mapStateToProps, {})(Filter);
