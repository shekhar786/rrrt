import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, appTypes } from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { fonts } from '../../../assets';
import commonStyles from '../../utilities/commonStyles';
import { getAppId } from '../../utilities/helperFunctions';

const CategoryCard = ({
    category,
    index,
    onCategorySelect,
}) => {
    const containerStyle = {
        ...styles.container
    };

    if (
        getAppId() === appTypes.shilengae.id
        || getAppId() === appTypes.beault.id
    ) {
        containerStyle.width = (index + 1) % 3 === 0
            ? layout.size.width - 30 : (layout.size.width / 2) - 20;
    } else {
        containerStyle.marginRight = index % 2 === 0 ? 5 : 0;
        containerStyle.marginLeft = index % 2 === 0 ? 0 : 5;
    }

    return (
        <TouchableOpacity
            style={containerStyle}
            activeOpacity={0.6}
            onPress={() => onCategorySelect(category)}
        >
            <Image
                source={{ uri: category.icon }}
                style={styles.icon}
            />
            <Text style={styles.categoryName}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white1,
        height: moderateScale(128),
        width: (layout.size.width / 2) - 20,
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(10),
        ...commonStyles.shadow,
    },
    categoryName: {
        marginHorizontal: 10,
        marginTop: moderateScale(10),
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: moderateScale(14)
    },
    icon: {
        height: moderateScale(50),
        width: moderateScale(50)
    }
});

export { CategoryCard };
