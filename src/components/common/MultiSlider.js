import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider, { MultiSliderProps } from '@ptomasroos/react-native-multi-slider';

import { colors, commonColors } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';

const CustomMarker = () => <View style={styles.marker} />;

const MultiSlider = (props: MultiSliderProps) => (
    <Slider
        customMarker={CustomMarker}
        selectedStyle={styles.selectedTrackStyle}
        unselectedStyle={styles.unselectedTrackStyle}
        {...props}
    />
);

const styles = StyleSheet.create({
    marker: {
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: colors.white1,
        backgroundColor: commonColors().themeColor,
        ...commonStyles.shadow,
        shadowRadius: 1
    },
    selectedTrackStyle: {
        backgroundColor: commonColors().themeColor
    },
    unselectedTrackStyle: {
        backgroundColor: colors.grey7
    }
});

export { MultiSlider };
