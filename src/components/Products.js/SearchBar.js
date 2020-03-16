import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { SearchBox } from '../common';
import { colors, urls, screenNames } from '../../utilities/constants';
import { navigate } from '../../utilities/NavigationService';

class SearchBar extends PureComponent {
    state = {
        searchResults: [],
        query: ''
    };

    onSearchResultPress = (ad) => {
        if (ad.keyword) {
            this.searchAds(ad.keyword);

            return this.setState({ query: ad.keyword, searchResults: [] });
        }

        Keyboard.dismiss();

        navigate(screenNames.ProductDetails, { adData: ad });

        this.setState({ searchResults: [], query: '' });
    };

    onInputFocus = () => {
        if (!this.state.query.trim()) {
            this.searchAds('')
        }
    };

    searchAds = (query) => {
        this.setState({ query });

        const { categoryId, getAds, userId } = this.props;

        // if (!query.trim()) {
        //     this.setState({ searchResults: [] });

        //     return;
        // }

        const callback = (error, adsData) => {
            // setLoading(false);
            // console.log('search ads data: ', adsData);

            if (error) {
                return;
                // return showErrorAlert(error);
            }

            this.setState({ searchResults: adsData });
        };

        const queryParams = {
            cat_id: categoryId,
            keyword: query.trim(),
            user_id: userId
        };

        getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getAdsbyKeyword
        });
    };

    render() {
        const { placeholder } = this.props;
        const { searchResults, query } = this.state;

        return (
            <SearchBox
                containerStyle={styles.inputContainer}
                placeholder={placeholder}
                onChangeText={this.searchAds}
                searchResults={searchResults}
                onSearchResultPress={this.onSearchResultPress}
                value={query}
                onFocus={this.onInputFocus}
            />
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: colors.white4,
        marginVertical: moderateScale(10),
        marginHorizontal: 0
    },
});

export { SearchBar };
