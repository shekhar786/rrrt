import React from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { Wrapper, Header } from '../../components/common';
import { colors } from '../../utilities/constants';
import { CategoryCard } from '../../components/PostAd';
import { icons } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import commonStyles from '../../utilities/commonStyles';

const ChooseCategories = (props) => {
    const onLeftPress = () => goBack();

    const selectCategory = props.navigation.getParam('onCategorySelect', () => { });

    const onCategorySelect = (category) => {
        const cat = {
            id: category.id,
            name: category.name,
        };

        selectCategory(cat);
        goBack();
    };

    const renderCategory = ({ item, index }) => (
        <CategoryCard
            category={item}
            index={index}
            isChooseCategory
            onCategorySelect={onCategorySelect}
        />
    );

    const renderSeparator = () => <View style={styles.separator} />;

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                containerStyle={styles.header}
                showBottomBorder={Platform.OS === 'android'}
                blackTitle
            />
            <FlatList
                data={props.allCategories}
                renderItem={renderCategory}
                numColumns={2}
                ItemSeparatorComponent={renderSeparator}
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        ...commonStyles.header
    },
    list: {
        marginTop: moderateScale(20),
        paddingHorizontal: moderateScale(15)
    },
    listContainer: {
        paddingBottom: moderateScale(60),
        paddingTop: moderateScale(20),
        paddingHorizontal: moderateScale(5)
    },
    separator: { height: moderateScale(10) }
});

const mapStateToProps = ({ product, lang }) => ({
    allCategories: product.allCategories,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {})(ChooseCategories);
