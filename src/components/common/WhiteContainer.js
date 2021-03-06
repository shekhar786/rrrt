import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../../utilities/constants';

const WhiteContainer = (props) => (
    <View
        {...props}
        style={{ ...styles.container, ...props.style }}
    >
        {props.children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.white2
        backgroundColor: colors.white1
    }
});

export { WhiteContainer };
