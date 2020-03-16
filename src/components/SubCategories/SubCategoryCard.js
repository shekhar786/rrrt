import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, commonColors, appTypes } from '../../utilities/constants';
import { fonts } from '../../../assets';
import { getAppId } from '../../utilities/helperFunctions';

const SubCategoryCard = ({
    subCategory,
    onSubcategorySelect,
    selected,
    isAddCategory
}) => {
    if (
        (subCategory.isFirstCategory && isAddCategory)
        || (subCategory.isFirstCategory && getAppId() === appTypes.yabalash.id)
    ) {
        return null;
    }

    const onPress = () => onSubcategorySelect(subCategory);

    return (
        <TouchableOpacity
            style={[styles.container, {
                backgroundColor: selected ? commonColors().themeColor : colors.white1
            }]}
            activeOpacity={0.6}
            onPress={onPress}
        >
            <Text
                style={[styles.label, {
                    color: selected ? colors.white1 : colors.grey8
                }]}
            >
                {subCategory.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: moderateScale(1),
        borderColor: colors.grey4,
        height: moderateScale(56),
        justifyContent: 'center',
        paddingHorizontal: moderateScale(30)
    },
    label: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
    }
});

export { SubCategoryCard };
