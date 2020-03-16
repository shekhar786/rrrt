import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import { colors, screenNames } from '../../utilities/constants';
import { layout } from '../../utilities/layout';
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
                marginRight: index % 2 === 0 ? 5 : 0,
                marginLeft: index % 2 === 0 ? 0 : 5,
            }}
            activeOpacity={0.6}
            onPress={onCategorySelect}
        >
            <Image
                source={{
                    uri: category.image
                }}
                style={styles.categoryImage}
            />
            <View style={StyleSheet.absoluteFill}>
                <Svg height={128} width={(layout.size.width / 2) - 22}>
                    <Defs>
                        <LinearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <Stop offset="100%" stopColor={colors.black7} stopOpacity="0" />
                            <Stop offset="0%" stopColor={colors.black6} stopOpacity="0.4" />
                        </LinearGradient>
                    </Defs>
                    <Rect
                        x={'0'}
                        y={'0'}
                        width={(layout.size.width / 2) - 22}
                        height={128}
                        fill={'url(#grad)'}
                    />
                </Svg>
            </View>

            <Text style={styles.categoryName}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 128,
        width: (layout.size.width / 2) - 22,
        borderRadius: 8,
        overflow: 'hidden'
    },
    categoryName: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        marginHorizontal: 10,
        color: colors.white1,
        fontFamily: fonts.semiBold,
        fontSize: 20,
        flex: 1
    },
    categoryImage: {
        ...StyleSheet.absoluteFill
    }
});

export { CategoryCard };
