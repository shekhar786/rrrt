import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Switch,
    Platform
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, commonColors } from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import commonStyles from '../../utilities/commonStyles';

const Button = ({
    label,
    onPress,
    notificationButton,
    switchValue,
    hideRightArrow
}) => {
    if (notificationButton) {
        return (
            <View
                activeOpacity={0.6}
                style={styles.container}
            >
                <Text style={styles.label}>
                    {label}
                </Text>
                <Switch
                    value={switchValue}
                    onValueChange={onPress}
                    style={commonStyles.switch}
                    trackColor={{
                        true: commonColors().themeColor
                    }}
                    thumbColor={Platform.select({ android: colors.white1 })}
                />
            </View>
        );
    }

    let image = null;

    if (!hideRightArrow) {
        image = <Image source={icons.ic_right_arrow} />;
    }

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.label}>
                {label}
            </Text>

            {image}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4,
        height: moderateScale(70)
    },
    label: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
    },
});

export { Button };
