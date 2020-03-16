import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Platform
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Wrapper, Header, WhiteContainer, } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { colors, commonColors } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { ChooseDistanceRange } from '../../components/SearchWithLocation';

const SearchWithLocation = () => {
    useEffect(() => {
        // code to run on component mount
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onLeftPress = () => goBack();

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_cross_black}
                onLeftPress={onLeftPress}
                containerStyle={styles.header}
                showBottomBorder={Platform.OS === 'android'}
            />
            <WhiteContainer>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.searchBarContainer}
                        activeOpacity={0.6}
                    // onPress={this.onSearchPress}
                    >
                        <Image source={icons.ic_search} />
                        <Text
                            style={styles.searchText}
                            numberOfLines={1}
                        >
                            {strings.findFurniturePlaceholder}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.currentLocationContainer}
                        activeOpacity={0.6}
                    // onPress={this.onSearchPress}
                    >
                        <Image
                            source={icons.ic_current_location}
                            style={styles.currentLocationIcon}
                        />
                        <Text style={styles.currentLocation}>
                            {strings.currentLocation}
                        </Text>
                    </TouchableOpacity>
                    <ChooseDistanceRange />
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
        marginBottom: moderateScale(5)
    },
    subContainer: {
        marginHorizontal: moderateScale(15),
        paddingBottom: moderateScale(50)
    },
    searchBarContainer: {
        height: moderateScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white4,
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(10),
    },
    searchText: {
        flex: 1,
        marginLeft: moderateScale(10),
        fontFamily: fonts.regular,
        color: colors.grey6
    },
    currentLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(20),
        paddingVertical: moderateScale(10),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    currentLocationIcon: {
        tintColor: commonColors().themeColor
    },
    currentLocation: {
        color: commonColors().themeColor,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        marginLeft: moderateScale(10)
    },
});

export default SearchWithLocation;
