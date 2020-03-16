import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors, screenNames } from '../../utilities/constants';
import { fonts } from '../../../assets';
import { navigate } from '../../utilities/NavigationService';

const CategoryCard = ({ category, index }) => {
    const onCategorySelect = () => {
        const cat = {
            id: category.id,
            name: category.name,
        };

        if (category.sub.length === 0) { //no subCategory; navigate directly to all products
            return navigate(screenNames.Products, { //user is trying to view the category posts
                category: cat,
                subCategory: {}
            });
        }

        navigate(screenNames.SubCategories, {
            category: cat,
            subCategories: category.sub
        });
    };
    
    return (
        <TouchableOpacity
            style={{
                ...styles.container,
                marginLeft: index === 0 ? 0 : moderateScale(5)
            }}
            activeOpacity={0.6}
            onPress={onCategorySelect}
        >
            <View style={styles.icon}>
                <Image
                    source={{ uri: category.image }}
                    style={{
                        height: moderateScale(30),
                        width: moderateScale(30),
                        resizeMode: 'center'
                    }}
                />
            </View>
            <Text style={styles.categoryName}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        height: moderateScale(30),
        width: moderateScale(30)
    },
    categoryName: {
        fontSize: moderateScale(10),
        fontFamily: fonts.semiBold,
        color: colors.black9,
        marginTop: moderateScale(5)
    }
});

export { CategoryCard };
