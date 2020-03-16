import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Wrapper, Header, WhiteContainer } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack, push, navigate } from '../../utilities/NavigationService';
import { colors, screenNames } from '../../utilities/constants';
import { SubCategoryCard } from '../../components/SubCategories';
import { keyExtractor } from '../../utilities/helperFunctions';
import { layout } from '../../utilities/layout';

const SubCategoriesList = (props) => {
    const isAddCategory = props.navigation.getParam('isAddCategory', false);
    const category = props.navigation.getParam('category', {});
    const subCategories = props.navigation.getParam('subCategories', []);
    const superParentCategoryId = props.navigation.getParam('superParentCategoryId', 0);

    const [currentSubCategories, setCurrentSubCategories] = useState([...subCategories]);

    useEffect(() => {
        // code to run on component mount
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onSubcategorySelect = (subCategory) => {
        const postAdScreenKey = props.navigation.getParam('postAdScreenKey', null);

        if (subCategory.sub.length > 0) { //further subcategory exists; open same screen again
            return push(screenNames.SubCategories, {
                isAddCategory: isAddCategory || false,
                category,
                subCategories: subCategory.sub,
                postAdScreenKey,
                superParentCategoryId
            });
        } else if (isAddCategory) { //is the user adding the post
            return navigate(screenNames.AddPost, {
                category: {
                    id: subCategory.id,
                    name: subCategory.name
                },
                subCategory: {},
                postAdScreenKey,
                superParentCategoryId
            });
        }

        return navigate(screenNames.Products, { //user is trying to view the category posts
            category,
            subCategory: {
                id: subCategory.id,
                name: subCategory.name
            }
        });
    };
    /* 
        const onClearInputPress = () => {
            inputRef.current.clear();
            setCurrentSubCategories(subCategories);
        };
    
        const onChangeText = (text) => {
            if (!text.trim()) {
                return setCurrentSubCategories(subCategories);
            }
    
            if (text.trim()) {
                const categories = subCategories.filter((sub) => {
                    if (sub.name.toLowerCase().includes(text.trim().toLowerCase())) {
                        return true;
                    }
    
                    return false;
                });
    
                setCurrentSubCategories(categories);
            }
        };
     */
    const renderSubCategories = ({ item }) => (
        <SubCategoryCard
            subCategory={item}
            isAddCategory={isAddCategory}
            category={category}
            onSubcategorySelect={onSubcategorySelect}
        />
    );

    const onLeftPress = () => goBack();
    /* 
        const renderSearchInput = () => {
            if (getAppId() !== appTypes.yabalash.id) {
                return (
                    <View style={styles.searchBarContainer}>
                        <Image source={icons.ic_search} />
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            onChangeText={onChangeText}
                            placeholder={strings.searchHere}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={onClearInputPress}
                            style={styles.crossButton}
                        >
                            <Image source={icons.ic_search_cross} />
                        </TouchableOpacity>
                    </View>
                );
            }
    
            return null;
        };
     */
    
    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                title={category.name}
                titlePosition={'left'}
                titleStyle={styles.title}
                containerStyle={styles.header}
                showBottomBorder={!layout.isIOS}
            />
            <WhiteContainer>
                {/* {renderSearchInput()} */}

                <FlatList
                    data={currentSubCategories}
                    renderItem={renderSubCategories}
                    contentContainerStyle={styles.listContainer}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                />
            </WhiteContainer>

        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        backgroundColor: colors.white1,
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    title: {
        color: colors.black1
    },
    listContainer: {
        paddingBottom: moderateScale(60),
    },
    searchBarContainer: {
        height: moderateScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white4,
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(12),
        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(15)
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        paddingLeft: moderateScale(5)
    },
    crossButton: {
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(8),
    }
});

export default SubCategoriesList;
