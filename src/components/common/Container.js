import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

import { colors } from '../../utilities/constants';

const Container = (props: ViewProps) => (
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
        backgroundColor: colors.white1
    }
});

export { Container };
