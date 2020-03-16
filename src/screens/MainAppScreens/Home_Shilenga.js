import React, { PureComponent } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    StatusBar,
    FlatList,
    RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import {
    getCurrentLocation,
    getAllCategories,
    getTrendingAds,
    adAddToFavourites,
    getBanners
} from '../../store/actions';
import { Wrapper, ItemCard, Loader } from '../../components/common';
import { strings } from '../../localization';
import { icons, fonts } from '../../../assets';
import {
    colors,
    screenNames,
    commonColors,
    getAppdata
} from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { navigate } from '../../utilities/NavigationService';
import { Banners, Categories } from '../../components/Home_Shilenga';
import logger from '../../utilities/logger';

class Home_Shilenga extends PureComponent {
    state = {
        loadingTreandingAds: true,
        trendingAds: [],
        refreshingHomeData: false,
        banners: [],
        gettingBanners: true
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
        });

        this.props.getCurrentLocation({ updateUseLocation: true });
        this.props.getAllCategories();
        this.getTrendingAds();
        this.getBanners();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onLocationPress = () => navigate(screenNames.ChooseLocation, {
        onLocationSelect: (location) => logger.log('Location is: ', location)
    });
    onSearchPress = () => navigate(screenNames.SearchWithLocation);
    onFavouritePress = () => navigate(screenNames.MyFavouriteAds);

    getTrendingAds = () => {
        this.props.getTrendingAds({
            cb: (error, trendingAds) => {
                this.setState({
                    loadingTreandingAds: false,
                    refreshingHomeData: false,
                    gettingBanners: false
                });
                if (error) {
                    return;
                }

                this.setState({ trendingAds });
            }
        });
    };
    getBanners = () => {
        this.props.getBanners({
            cb: (error, banners) => {
                this.setState({ gettingBanners: false });
                if (error) {
                    return;
                }
                this.setState({ banners });
            }
        });
    };

    refreshHomeData = () => {
        this.setState({ refreshingHomeData: true });
        this.props.getAllCategories();
        this.getTrendingAds();
        this.getBanners();
    };

    renderListHeaderComponent = () => (
        <>
            <Categories />
            <Banners
                gettingBanners={this.state.gettingBanners}
                banners={this.state.banners}
            />
            <Text style={styles.trendingOn}>
                {strings.formatString(strings.trendingOn, getAppdata().name)}
            </Text>
        </>
    );

    renderListEmptyComponent = () => {
        if (this.state.loadingTreandingAds) {
            return (
                <Loader
                    isLoading
                    containerStyle={styles.trendingLoader}
                />
            );
        }
        return (
            <View style={styles.emptyListContainer}>
                <Text style={styles.noTrendingPostsAvailable}>
                    {strings.noTrendingPostsAvailable}
                </Text>
            </View>
        );
    };

    renderTrendingProducts = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={!this.props.userId || item.user_id === this.props.userId}
            adAddToFavourites={this.props.adAddToFavourites}
        />
    );

    renderItemSeparatorComponent = () => <View style={styles.separator} />;

    render() {
        const { currentAddress, gettingAllCategories } = this.props;
        const { trendingAds, loadingTreandingAds, refreshingHomeData } = this.state;

        return (
            <Wrapper wrapperBackgroundColor={commonColors().themeColor}>
                <View style={styles.header}>
                    <View style={styles.headerLeftContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.onLocationPress}
                            style={styles.locationButton}
                        >
                            <Text style={styles.locationLabel}>
                                {strings.location}
                            </Text>
                            <View style={styles.locationContainer}>
                                <Image
                                    source={icons.ic_location}
                                    style={styles.locationPin}
                                />
                                <Text
                                    style={styles.locationName}
                                    numberOfLines={1}
                                >
                                    {currentAddress}
                                </Text>
                                <Image
                                    source={icons.ic_down}
                                    style={styles.pinDown}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.onFavouritePress}
                            style={styles.headerRightButtton}
                        >
                            <Image source={icons.ic_fav} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.onNotificationPress}
                            style={{
                                ...styles.headerRightButtton,
                                marginRight: moderateScale(5)
                            }}
                        >
                            <Image source={icons.ic_notifications} />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.searchBarContainer}
                    activeOpacity={0.6}
                    onPress={this.onSearchPress}
                >
                    <Image source={icons.ic_search} />
                    <Text style={styles.searchText}>
                        {strings.whatAreYouLookingFor}
                    </Text>
                </TouchableOpacity>

                <FlatList
                    style={styles.container}
                    data={trendingAds}
                    extraData={gettingAllCategories || loadingTreandingAds}
                    numColumns={2}
                    renderItem={this.renderTrendingProducts}
                    ListHeaderComponent={this.renderListHeaderComponent}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContentContainer}
                    columnWrapperStyle={styles.listColumnWrapperStyle}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshingHomeData}
                            onRefresh={this.refreshHomeData}
                            colors={[commonColors().themeColor]}
                            tintColor={commonColors().themeColor}
                        />
                    }
                />
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeftContainer: {
        flex: 0.7,
        paddingLeft: moderateScale(15),
    },
    locationButton: {
        flex: 1,
        paddingVertical: moderateScale(5),
        maxWidth: (layout.size.width * 2) / 3
    },
    locationLabel: {
        fontSize: moderateScale(12),
        color: colors.white3
    },
    locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationPin: {
        left: -moderateScale(5)
    },
    locationName: {
        flex: 1,
        color: colors.white1,
        fontFamily: fonts.regular,
        fontSize: moderateScale(14)
    },
    pinDown: {
        marginLeft: moderateScale(5)
    },
    headerRightButtton: {
        height: moderateScale(44),
        width: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: moderateScale(5),
    },
    notificationDot: {
        backgroundColor: colors.green1,
        height: moderateScale(8),
        width: moderateScale(8),
        borderRadius: moderateScale(4),
        position: 'absolute',
        bottom: moderateScale(14),
        right: moderateScale(8)
    },
    searchBarContainer: {
        height: moderateScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white1,
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(10),
    },
    searchText: {
        marginLeft: moderateScale(10),
        fontFamily: fonts.regular,
        color: colors.grey6
    },
    container: {
        marginTop: moderateScale(15),
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(15),
        backgroundColor: colors.white1
    },
    swiper: {
        marginTop: moderateScale(20)
    },
    trendingOn: {
        fontSize: moderateScale(16),
        fontFamily: fonts.bold,
        color: colors.black9
    },
    emptyListContainer: {
        alignItems: 'center',
        marginTop: moderateScale(30)
    },
    noTrendingPostsAvailable: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    listContentContainer: {
        paddingBottom: moderateScale(50)
    },
    separator: {
        height: moderateScale(12)
    },
    listColumnWrapperStyle: {
        marginTop: moderateScale(15)
    },
    trendingLoader: {
        marginTop: moderateScale(20)
    }
});

const mapStateToProps = ({ location, product, lang, user }) => ({
    currentAddress: location.currentAddress,
    gettingAllCategories: product.gettingAllCategories,
    selectedLanguage: lang.selectedLanguage,
    userId: user.id,
});

export default connect(mapStateToProps, {
    getCurrentLocation,
    getAllCategories,
    getTrendingAds,
    adAddToFavourites,
    getBanners
})(Home_Shilenga);
