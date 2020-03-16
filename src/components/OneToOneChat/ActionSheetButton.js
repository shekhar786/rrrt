import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { fonts } from '../../../assets';

const ActionSheetButton = ({ label, icon }) => (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Image source={icon} />
        </View>

        <Text style={styles.label}>
            {label}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(15)
    },
    label: {
        fontSize: moderateScale(18),
        fontFamily: fonts.regular,
    },
    iconContainer: {
        width: moderateScale(40),
    }
});

export { ActionSheetButton };
