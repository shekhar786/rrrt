import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import { colors } from '../../utilities/constants';

const Gradient = ({
    height,
    width,
    reversed,
    startColor,
    endColor
}) => {
    let gradientView = (
        <LinearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="100%" stopColor={colors.black7} stopOpacity="0" />
            <Stop offset="0%" stopColor={colors.black6} stopOpacity="0.4" />
        </LinearGradient>
    );

    if (reversed) {
        gradientView = (
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={startColor || colors.black6} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={endColor || colors.black7} stopOpacity="0" />
            </LinearGradient>
        );
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <Svg height={height} width={width}>
                <Defs>
                    {gradientView}
                </Defs>
                <Rect
                    x={'0'}
                    y={'0'}
                    width={width}
                    height={height}
                    fill={'url(#grad)'}
                />
            </Svg>
        </View>
    );
};

export { Gradient };
