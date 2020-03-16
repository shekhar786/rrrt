import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { icons } from '../../../assets';
import { colors } from '../../utilities/constants';

const PickerRightIcon = () => (
    <Image
        source={icons.ic_down}
        style={styles.downArrow}
    />
);

const styles = StyleSheet.create({
    downArrow: {
        tintColor: colors.grey1,
        transform: [{ scale: 1.5 }]
    }
});

export { PickerRightIcon };
