import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { fonts, icons } from '../../../assets';
import { colors } from '../../utilities/constants';

const FieldCard = ({
    label,
    value,
    renderVerifiedBadge,
    hideBottomBorder,
    verified,
    marginTop,
    renderRightButton,
    onPress
}) => {
    let verifiedBadge = null;

    if (renderVerifiedBadge) {
        verifiedBadge = (
            <Image
                source={icons.ic_verified_green}
                style={styles.verifiedStatus}
            />
        );
    }

    /* if (renderVerifiedBadge && verified) {
        verifiedBadge = (
            // <View
            //     style={{
            //         height: 14,
            //         width: 14,
            //         borderRadius: 7,
            //         backgroundColor: '#A2E151',
            //         marginLeft: 10
            //     }}
            // />
            <Image source={icons.ic_verified_green} />
        );
    } else if (renderVerifiedBadge && !verified) {
        verifiedBadge = (
            <View
                style={{
                    height: 14,
                    width: 14,
                    borderRadius: 7,
                    backgroundColor: commonColors().themeColor,
                    marginLeft: 10
                }}
            />
        );
    } */

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    ...styles.wrapper,
                    marginTop: marginTop || moderateScale(20),
                    borderBottomWidth: hideBottomBorder ? 0 : moderateScale(1)
                }}
            >
                <View style={styles.container}>
                    <Text style={styles.label}>
                        {label}
                    </Text>

                    <View style={styles.valueAndVerifiedLabelContainer}>
                        <Text style={styles.value}>
                            {value}
                        </Text>

                        {verifiedBadge}
                    </View>
                </View>

                {renderRightButton ? renderRightButton() : null}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        borderBottomColor: colors.grey12,
    },
    container: {
        flex: 1,
        paddingBottom: moderateScale(6)
    },
    label: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(12),
        color: colors.grey11
    },
    value: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(16),
        minHeight: moderateScale(22),
        marginTop: moderateScale(5)
    },
    valueAndVerifiedLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    verifiedStatus: {
        marginLeft: moderateScale(10)
    }
});

export { FieldCard };
