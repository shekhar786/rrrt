import React, { PureComponent } from 'react';
import { View, StyleSheet, Keyboard, StatusBar, FlatList, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { getAds, adAddToFavourites } from '../../store/actions';
import { colors, urls, screenNames } from '../../utilities/constants';
import { navigate, goBack } from '../../utilities/NavigationService';
import { SearchBox, Header, Wrapper, ItemCard, Loader } from '../../components/common';
import { icons } from '../../../assets';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import logger from '../../utilities/logger';

class SearchAds extends PureComponent {
    state = {
        searchResults: [],
        query: '',
        hideSearchDropdown: false,
        allProducts: [],
        loadingAllProducts: false
    };

    componentDidMount() {
        this.navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.searchAds('');
    }

    componentWillUnmount() {
        this.navListener.remove();
    }

    onLeftPress = () => goBack();

    onSearchSubmit = () => {
        this.setState({ hideSearchDropdown: true, loadingAllProducts: true });

        const { query } = this.state;

        const { navigation, userId } = this.props;

        const categoryId = navigation.getParam('categoryId', null);

        const callback = (error, adsData) => {
            if (error) {
                return;
            }

            this.setState({ allProducts: adsData, loadingAllProducts: false });
        };

        const queryParams = {
            cat_id: categoryId,
            keyword: query.trim(),
            user_id: userId
        };

        this.props.getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getAllAdsByKeyword
        });
    };

    onSearchResultPress = (ad) => {
        if (ad.keyword) {
            this.searchAds(ad.keyword);

            return this.setState({ query: ad.keyword, searchResults: [] });
        }

        Keyboard.dismiss();

        navigate(screenNames.ProductDetails, { adData: ad });

        this.setState({ searchResults: [], query: '' });
        this.searchAds('');
    };

    onInputFocus = () => {
        if (!this.state.query.trim()) {
            this.searchAds('');
        }

        this.setState({ allProducts: [], hideSearchDropdown: false });
    };

    onClearInputPress = () => {
        this.setState({ hideSearchDropdown: false });
        this.searchAds('');
    };

    searchAds = (query) => {
        this.setState({ query });

        const { navigation, userId } = this.props;

        const categoryId = navigation.getParam('categoryId', null);

        const callback = (error, adsData) => {
            logger.log('search ads data: ', adsData);

            if (error) {
                return;
            }

            this.setState({ searchResults: adsData });
        };

        const queryParams = {
            cat_id: categoryId,
            keyword: query.trim(),
            user_id: userId
        };

        this.props.getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getAdsbyKeyword
        });
    };

    renderItemSeparatorComponent = () => <View style={styles.separator} />;

    renderProducts = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={!this.props.userId || item.user_id === this.props.userId}
            adAddToFavourites={this.props.adAddToFavourites}
        />
    );

    renderListEmptyComponent = () => (
        <View style={styles.noDataFoundContainer}>
            {this.state.loadingAllProducts ?
                <Loader isLoading /> :
                <Image source={icons.ic_no_data_found} />
            }
        </View>
    );

    renderList = () => {
        const { hideSearchDropdown, allProducts } = this.state;

        if (hideSearchDropdown) {
            return (
                <FlatList
                    data={allProducts}
                    renderItem={this.renderProducts}
                    contentContainerStyle={styles.listContainer}
                    bounces={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    ListEmptyComponent={this.renderListEmptyComponent}
                />
            );
        }

        return null;
    };

    render() {
        const { searchResults, query, hideSearchDropdown } = this.state;

        const title = this.props.navigation.getParam('title', '');

        return (
            <Wrapper wrapperStyle={styles.wrapperStyle}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onLeftPress}
                    title={strings.formatString(strings.searchIn, title)}
                    titlePosition={'left'}
                    blackTitle
                    showBottomBorder={!layout.isIOS}
                />
                <View style={styles.container}>
                    <SearchBox
                        containerStyle={styles.inputContainer}
                        placeholder={title}
                        onChangeText={this.searchAds}
                        searchResults={searchResults}
                        onSearchResultPress={this.onSearchResultPress}
                        value={query}
                        onFocus={this.onInputFocus}
                        onSubmitEditing={this.onSearchSubmit}
                        hideSearchDropdown={hideSearchDropdown}
                        onClearInputPress={this.onClearInputPress}
                    />

                    {this.renderList()}
                </View>
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        backgroundColor: colors.white1
    },
    inputContainer: {
        backgroundColor: colors.white4,
        marginVertical: moderateScale(10),
        marginHorizontal: 0
    },
    separator: {
        height: moderateScale(15)
    },
    listContainer: {
        marginTop: moderateScale(15)
    },
    noDataFoundContainer: {
        height: layout.size.height - 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = (({ user }) => ({
    userId: user.id
}));

export default connect(mapStateToProps, {
    getAds,
    adAddToFavourites
})(SearchAds);
