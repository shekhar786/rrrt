import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
    Image,
    TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, commonColors, appTypes } from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { getAppId } from '../../utilities/helperFunctions';

const TextInputWithLabel = React.forwardRef((props: TextInputProps, ref) => {
    const [focused, setFocused] = useState(false);
    const [securedText, setSecuredText] = useState(true);

    const onFocus = () => {
        setFocused(true);

        if (props.onFocus) {
            props.onFocus();
        }
    };

    const onBlur = () => {
        setFocused(false);

        if (props.onBlur) {
            props.onBlur();
        }
    };

    const renderToggleSecureInput = () => {
        if (props.secureTextEntry) {
            let imageSource = icons.ic_visibility_off;

            if (!securedText) {
                imageSource = icons.ic_visibility_on;
            }

            const toggleSecureTextInput = () => setSecuredText(!securedText);

            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.secureTextImageContainer}
                    onPress={toggleSecureTextInput}
                >
                    <Image source={imageSource} />
                </TouchableOpacity>
            );
        }

        return null;
    };

    const {
        containerStyle,
        label,
        textInputStyle,
        bottomBorderOnly,
        noColorChange
    } = props;


    const borderStyle = {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.black3
    };

    const errored = props.errored;
    if (props.disableBorder) {
        borderStyle.borderWidth = 0;
    } else if (bottomBorderOnly) {
        borderStyle.borderRadius = 0;
        borderStyle.borderTopWidth = 0;
        borderStyle.borderLeftWidth = 0;
        borderStyle.borderRightWidth = 0;
        borderStyle.marginTop = 0;
    }

    if (focused && !noColorChange) {
        borderStyle.borderColor = commonColors().themeColor;
    } else if (errored) {
        borderStyle.borderColor = colors.red;
    }

    let labelView = null;

    if (label) {
        labelView = (
            <Text
                style={[styles.labelText, {
                    color: (focused && !noColorChange)
                        ? commonColors().themeColor : colors.black5,
                }]}
            >
                {label}
            </Text>
        );
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {labelView}

            <View
                style={[
                    {
                        ...styles.textInputContainer,
                        ...borderStyle
                    },
                    props.textInputContainer
                ]}
            >
                <TextInput
                    ref={ref}
                    style={[styles.textInput, {
                        // ...borderStyle
                    }, textInputStyle]}
                    blurOnSubmit={false}
                    {...props}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    secureTextEntry={props.secureTextEntry && securedText}
                />

                {renderToggleSecureInput()}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {

    },
    labelText: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    },
    textInput: {
        flex: 1,
        height: moderateScale(45),
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(8),
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getAppId() === appTypes.yabalash.id ? moderateScale(5) : 0
    },
    secureTextImageContainer: {
        height: moderateScale(48),
        width: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: moderateScale(10),
    }
});

export { TextInputWithLabel };
