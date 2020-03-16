import React, { useEffect } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { Wrapper } from '../../components/common';
import { colors, screenNames, appTypes } from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { strings } from '../../localization';
import { goBack, navigate } from '../../utilities/NavigationService';
import { CategoryCard } from '../../components/PostAd';
import { getAppId } from '../../utilities/helperFunctions';

const PostAd = ({ allCategories, navigation }) => {
    useEffect(() => {
        // code to run on component mount
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onCrossPress = () => goBack();

    const onCategorySelect = (category) => {
        // logger.data('category Id in Post Ad', category.id);

        const postAdScreenKey = navigation.state.key;

        const cat = {
            id: category.id,
            name: category.name,
        };

        if (
            category.sub.length === 0
            || (category.sub.length === 1 && category.sub[0].isFirstCategory)
        ) { //no subCategory; navigate directly to add post
            return navigate(screenNames.AddPost, {
                category,
                subCategory: {},
                postAdScreenKey,
                superParentCategoryId: category.id
            });
        }

        return navigate(screenNames.SubCategories, {
            isAddCategory: true,
            category: cat,
            subCategories: category.sub,
            postAdScreenKey,
            superParentCategoryId: category.id
        });
    };

    const getCrossIcon = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return icons.ic_cross;
        } else if (getAppId() === appTypes.shilengae.id) {
            return icons.ic_big_cross_red;
        } else if (getAppId() === appTypes.beault.id) {
            return icons.ic_big_cross_pink;
        }
        return null;
    };

    let title = strings.selectTheCategory;

    if (getAppId() === appTypes.yabalash.id) {
        title = strings.whatAreYouOffering;
    }

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <View style={styles.header}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onCrossPress}
                >
                    <Image source={getCrossIcon()} />
                </TouchableOpacity>
            </View>

            <Text style={styles.whatAreYouOffering}>
                {title}
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContainer}
            >
                {
                    allCategories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            index={index}
                            onCategorySelect={onCategorySelect}
                        />
                    ))
                }
            </ScrollView>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: moderateScale(10)
    },
    whatAreYouOffering: {
        fontSize: moderateScale(20),
        fontFamily: fonts.semiBold,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: moderateScale(10),
        marginHorizontal: 15,
        lineHeight: moderateScale(24)
    },
    list: {
        marginTop: moderateScale(30),
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        paddingBottom: moderateScale(40),
        justifyContent: 'space-between'
    },
});

const mapStateToProps = ({ product, lang }) => ({
    allCategories: product.allCategories,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps)(PostAd);
