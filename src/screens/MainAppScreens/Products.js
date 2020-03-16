import React, { PureComponent } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import cloneDeep from 'clone-deep';

import {
    Wrapper,
    ItemCard,
    Loader,
    HeaderWith3Buttons,
    ChooseListViewType
} from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack, navigate } from '../../utilities/NavigationService';
import { colors, screenNames, urls, appTypes, viewListItemType } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { getAds, adAddToFavourites, updateListViewTypePreference } from '../../store/actions';
import { strings } from '../../localization';
import {
    showErrorAlert,
    getAppId,
    generateRandomNumber,
    sortAdsByPrice,
    keyExtractor
} from '../../utilities/helperFunctions';
import { layout } from '../../utilities/layout';
import logger from '../../utilities/logger';

class Products extends PureComponent {
    constructor(props) {
        super(props);
        this.subCategory = props.navigation.getParam('subCategory', {});
        this.category = props.navigation.getParam('category', {});

        this.state = {
            ads: [],
            loading: true,
            isOpenViewTypePicker: false,
            pageno: 1
        };
    }

    componentDidMount() {
        this.navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.loadAds();
    }

    componentWillUnmount() {
        this.navListener.remove();
    }

    onLeftPress = () => goBack();

    onFilterPress = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return navigate(screenNames.Filter, {
                category_id: this.subCategory.id || this.category.id,
            });
        } else if (getAppId() === appTypes.shilengae.id) {
            return navigate(screenNames.Filter_Shilengae, {
                category_id: this.subCategory.id || this.category.id,
            });
        }
    };

    onSearchPress = () => {
        let title = this.category.name;

        if (Object.keys(this.subCategory).length > 0 && this.subCategory.name) {
            title = this.subCategory.name;
        }

        navigate(screenNames.SearchAds, {
            title,
            categoryId: this.subCategory.id || this.category.id,
        });
    };

    onEndReached = () => {
        logger.log('Ads List End Reached');

        if (!this.onEndReachedCalledDuringMomentum) {
            this.loadAds(true);

            this.onEndReachedCalledDuringMomentum = true;
        }
    };

    onMomentumScrollBegin = () => { this.onEndReachedCalledDuringMomentum = false; };

    onEndReachedDelayed = debounce(
        this.onEndReached,
        1000,
        { leading: true, trailing: false }
    );

    onListViewPress = () => this.setState({ isOpenViewTypePicker: true });

    onRequetClosePickerModal = () => this.setState({ isOpenViewTypePicker: false });

    getListViewOptions = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return [
                {
                    id: generateRandomNumber(),
                    label: strings.ascendingPrice,
                    onPress: () => {
                        const sortedAds = sortAdsByPrice(this.state.ads);

                        this.setState({ isOpenViewTypePicker: false, ads: sortedAds });
                    }
                },
                {
                    id: generateRandomNumber(),
                    label: strings.descendingPrice,
                    onPress: () => {
                        const sortedAds = sortAdsByPrice(this.state.ads, true);

                        this.setState({ isOpenViewTypePicker: false, ads: sortedAds });
                    }
                },
            ];
        }

        return [
            {
                id: generateRandomNumber(),
                icon: icons.ic_grid_view,
                label: strings.viewInGrid,
                onPress: () => this.updateListViewTypePreference(viewListItemType.grid)
            },
            {
                id: generateRandomNumber(),
                icon: icons.ic_list_view,
                label: strings.viewInList,
                onPress: () => this.updateListViewTypePreference(viewListItemType.list)
            },
        ];
    };

    loadAds = (isLoadMore = false) => {
        const callback = (error, adsData) => {
            // if (this.props.navigation.isFocused()) {
                this.setState({ loading: false });
            // }

            if (error) {
                return showErrorAlert(error);
            }

            logger.log('all ads: ', adsData);

            // if (this.props.navigation.isFocused()) {
                if (isLoadMore) {
                    let allAds = [];

                    if (adsData.length > 0) {
                        allAds = [...cloneDeep(this.state.ads), ...adsData];
                    } else {
                        allAds = this.state.ads;
                    }

                    return this.setState({
                        ads: allAds,
                        pageno: this.state.pageno + 1
                    });
                }

                this.setState({ ads: adsData, pageno: this.state.pageno + 1 });
            // }
        };

        const queryParams = {
            cat_id: this.subCategory.id || this.category.id,
            pageno: this.state.pageno,
            pageoffset: 20
        };

        if (this.props.userId) {
            queryParams.user_id = this.props.userId;
        }

        this.props.getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getAds
        });
    };

    updateListViewTypePreference = (listViewTypePreference) => {
        const { isFocused } = this.props.navigation;

        if (isFocused()) {
            this.setState({ isOpenViewTypePicker: false });
        }

        this.props.updateListViewTypePreference({
            listViewTypePreference
        });
    };

    renderProducts = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={!this.props.userId || item.user_id === this.props.userId}
            adAddToFavourites={this.props.adAddToFavourites}
            viewType={this.props.otherUserData.listViewTypePreference}
        />
    );

    renderItemSeparatorComponent = () => <View style={styles.separator} />;

    renderListEmptyComponent = () => (
        <View style={styles.noDataFoundContainer}>
            {this.state.loading ?
                <Loader isLoading /> :
                <Image source={icons.ic_no_data_found} />
            }
        </View>
    );

    renderContent = () => {
        const { loading, ads } = this.state;
        const { listViewTypePreference } = this.props.otherUserData;

        if (loading) {
            return <Loader isLoading />;
        }

        return (
            <>
                <Text style={styles.resultsCount}>
                    {ads.length} {strings.results}
                </Text>

                <FlatList
                    key={listViewTypePreference}
                    data={ads}
                    renderItem={this.renderProducts}
                    contentContainerStyle={styles.listContainer}
                    bounces={false}
                    numColumns={listViewTypePreference === viewListItemType.grid ? 2 : 1}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    keyExtractor={keyExtractor}

                    initialNumToRender={10}
                    onEndReached={this.onEndReachedDelayed}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                />
            </>
        );
    };

    render() {
        const { isOpenViewTypePicker } = this.state;
        let title = this.category.name;
        let listViewModalTitle = strings.sortBy;

        if (getAppId() !== appTypes.yabalash.id) {
            listViewModalTitle = strings.selectViewType;
        }

        if (Object.keys(this.subCategory).length > 0 && this.subCategory.name) {
            title = this.subCategory.name;
        }

        return (
            <Wrapper>
                <HeaderWith3Buttons
                    firstIconSource={icons.ic_back}
                    onFirstPress={this.onLeftPress}

                    secondIconSource={icons.ic_list_view}
                    onSecondPress={this.onListViewPress}

                    thirdIconSource={icons.ic_filter}
                    onThirdPress={this.onFilterPress}
                    title={title}
                />

                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.searchBarContainer}
                        activeOpacity={0.8}
                        onPress={this.onSearchPress}
                    >
                        <Image source={icons.ic_search} />
                        <Text style={styles.searchText}>
                            {title}
                        </Text>
                    </TouchableOpacity>

                    {this.renderContent()}

                    {/* <SearchBar
                    placeholder={title}
                    getAds={props.getAds}
                    categoryId={subCategory.id || category.id}
                    userId={props.userId}
                /> */}
                </View>

                <ChooseListViewType
                    visible={isOpenViewTypePicker}
                    onClose={this.onRequetClosePickerModal}
                    viewOptions={this.getListViewOptions()}
                    title={listViewModalTitle}
                />
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        backgroundColor: colors.white1,
        ...commonStyles.shadow,
        shadowRadius: moderateScale(2),
        elevation: 0,
        marginBottom: moderateScale(5)
    },
    title: {
        color: colors.black1
    },
    listContainer: {
        paddingBottom: moderateScale(60),
    },
    separator: {
        height: moderateScale(15)
    },
    inputContainer: {
        backgroundColor: colors.white4,
        marginVertical: moderateScale(10),
        marginHorizontal: 0
    },
    subContainer: {
        flex: 1,
        marginHorizontal: moderateScale(15),
    },
    resultsCount: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        marginBottom: moderateScale(15),
        marginTop: moderateScale(10)
    },
    searchBarContainer: {
        height: moderateScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white4,
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(10),
    },
    searchText: {
        marginLeft: moderateScale(10),
        fontFamily: fonts.regular,
        color: colors.grey6
    },
    noDataFoundContainer: {
        height: layout.size.height / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = (({ user }) => ({
    userId: user.id,
    otherUserData: user.otherData || {},
}));

export default connect(mapStateToProps, {
    getAds,
    adAddToFavourites,
    updateListViewTypePreference
})(Products);
