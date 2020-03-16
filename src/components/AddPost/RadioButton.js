import React from 'react';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { icons, fonts } from '../../../assets';
import { commonColors } from '../../utilities/constants';

const RadioButton = ({ onSelect, options, selectedValue }) => options.map((option) => {
    let buttonImage = icons.ic_radio_inactive;

    if (selectedValue === option.value) {
        buttonImage = icons.ic_radio;
    }

    return (
        <TouchableOpacity
            key={option.value}
            activeOpacity={0.6}
            onPress={() => onSelect(option.value)}
            style={styles.button}
        >
            <Image
                source={buttonImage}
                style={styles.radioButton}
            />

            <Text style={styles.label}>
                {option.label}
            </Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: moderateScale(4)
    },
    label: {
        fontSize: 16,
        fontFamily: fonts.regular,
        marginLeft: moderateScale(10)
    },
    radioButton: {
        tintColor: commonColors().themeColor
    }
});

export { RadioButton };
