import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import { CategoryCard } from './CategoryCard';
import { getAllCategories } from '../../store/actions';
import { Loader } from '../common';

const CategoriesList = (props) => {
    if (props.gettingAllCategories) {
        return (
            <Loader
                isLoading
                containerStyle={styles.loaderContainer}
            />
        );
    }

    return (
        <View style={styles.categoriesContainer}>
            {props.allCategories.map((category, index) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row'
    },
    loaderContainer: {
        height: moderateScale(47)
    }
});

const mapStateToProps = ({ product: { gettingAllCategories, allCategories } }) => ({
    gettingAllCategories,
    allCategories
});

const Categories = connect(mapStateToProps, {
    getAllCategories
})(CategoriesList);

export { Categories };
