import React from 'react';
import {
    View,
    Text,
    InputAccessoryView,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';

import { colors } from '../../utilities/constants';
import { fonts } from '../../../assets';

const KeyboardAccessoryView = ({
    inputAccessoryViewID,
    onPress,
    label
}) => {
    if (Platform.OS === 'android') {
        return null;
    }
    
    return (
        <InputAccessoryView
            nativeID={inputAccessoryViewID}
            backgroundColor={colors.white2}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.6}
                >
                    <Text style={styles.label}>
                        {label || 'Done'}
                    </Text>
                </TouchableOpacity>
            </View>
        </InputAccessoryView>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'flex-end' },
    label: {
        color: colors.blue1,
        paddingVertical: 15,
        paddingRight: 15,
        fontFamily: fonts.regular,
        fontSize: 16
    }
});

export { KeyboardAccessoryView };
