import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { icons, fonts } from '../../../assets';
import { colors, screenNames } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { navigate } from '../../utilities/NavigationService';
import { getLocationAndAddress } from '../../utilities/helperFunctions';

const ChooseLocation = ({ selectedLocation, updateAddress }) => {
    const onChangeLocationPress = () => navigate(screenNames.ChooseLocation, {
        onLocationSelect: updateAddress
    });

    const onCurrentLocationPress = () => {
        getLocationAndAddress().then((location) => {
            console.log('current location is: ', location);
            updateAddress({
                address: location.address,
                lat: location.lat,
                long: location.long
            });
        }).catch((error) => {
            console.log('onCurrentLocationPress error: ', error);
        });
    };

    return (
        <View style={styles.locationContainer}>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.locationSubContainer}
                onPress={onChangeLocationPress}
            >
                <Text
                    style={styles.location}
                    numberOfLines={2}
                >
                    {selectedLocation.address}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.currentLocationButon}
                onPress={onCurrentLocationPress}
            >
                <Image source={icons.ic_current_location} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: colors.white1,
        ...commonStyles.shadow
    },
    locationSubContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    location: {
        textAlignVertical: 'center',
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey5
    },
    currentLocationButon: {
        padding: moderateScale(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export { ChooseLocation };
