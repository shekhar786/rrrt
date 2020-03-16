import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, commonColors } from '../../utilities/constants';
import { fonts } from '../../../assets';
import { getAppId } from '../../utilities/helperFunctions';

const Button = (props) => {
    const {
        label,
        style,
        labelStyle,
        whiteButton,
        marginTop,
        marginHorizontal,
        marginBottom,
        borderRadius
    } = props;

    const outerContainerStyle = [{
        ...styles.container,
        marginTop: marginTop ? moderateScale(marginTop) : 0,
        marginHorizontal: marginHorizontal ? moderateScale(marginHorizontal) : 0,
        marginBottom: marginBottom ? moderateScale(marginBottom) : 0,
        borderRadius: borderRadius ? moderateScale(borderRadius) : moderateScale(5)
    }];

    const buttonLabelStyle = [styles.label];

    if (whiteButton) {
        outerContainerStyle.push({
            borderWidth: moderateScale(2),
            borderColor: commonColors(getAppId()).themeColor,
            backgroundColor: colors.white1
        });

        buttonLabelStyle.push({
            color: commonColors(getAppId()).themeColor
        });
    }

    outerContainerStyle.push(style);

    buttonLabelStyle.push(labelStyle);

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            {...props}
            style={outerContainerStyle}
        >
            <Text style={buttonLabelStyle}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: commonColors(getAppId()).themeColor
    },
    label: {
        fontFamily: fonts.bold,
        color: colors.white1,
        fontSize: moderateScale(16)
    }
});

export { Button };
