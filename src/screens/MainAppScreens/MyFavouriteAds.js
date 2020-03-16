import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { moderateScale } from 'react-native-size-matters';
import cloneDeep from 'clone-deep';
import debounce from 'lodash.debounce';

import {
    getMyFavouriteAds,
    adAddToFavourites,
    updateListViewTypePreference
} from '../../store/actions';
import {
    Header,
    Wrapper,
    Loader,
    ItemCard,
    EmptyListComponent,
    ListItemSeparator,
    ChooseListViewType
} from '../../components/common';
import { icons } from '../../../assets';
import { colors, viewListItemType } from '../../utilities/constants';
import { goBack } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import {
    showErrorAlert,
    keyExtractor,
    generateRandomNumber
} from '../../utilities/helperFunctions';
import commonStyles from '../../utilities/commonStyles';
import logger from '../../utilities/logger';

class MyFavouriteAds extends PureComponent {
    state = {
        myFavourites: [],
        myFavouriteAdsPageNo: 1,
        loading: true,
        loadingMore: false,
        isOpenViewTypePicker: false
    };

    componentDidMount() {
        this.navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.getFavouriteAds();
    }

    componentWillUnmount() {
        this.navListener.remove();
    }

    onLeftPress = () => goBack();
    onToggleViewTypePress = () => this.setState({ isOpenViewTypePicker: true });
    onRequetClosePickerModal = () => this.setState({ isOpenViewTypePicker: false });
    onEndReached = () => {
        logger.log('My Favourites List End Reached');

        if (!this.onEndReachedCalledDuringMomentum) {
            this.getFavouriteAds();
            this.onEndReachedCalledDuringMomentum = true;
        }
    };
    onMomentumScrollBegin = () => { this.onEndReachedCalledDuringMomentum = false; };
    onEndReachedDelayed = debounce(
        this.onEndReached,
        1000,
        { leading: true, trailing: false }
    );
    onFavPress = (adData) => {
        const { isFocused } = this.props;
        const myFavourites = cloneDeep(this.state.myFavourites);
        const updatedFavAds = myFavourites.filter((ad) => ad.post_id !== adData.post_id);
        if (isFocused) {
            this.setState({ myFavourites: updatedFavAds });
        }
        return this.props.adAddToFavourites(adData);
    };

    getListViewOptions = () => [
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

    getFavouriteAds = () => {
        const { isFocused } = this.props;
        const { myFavouriteAdsPageNo, myFavourites } = this.state;

        const cb = (error, favouritesData) => {
            if (isFocused) {
                this.setState({ loading: false, loadingMore: false });
            }

            if (error) {
                return showErrorAlert(error);
            }

            logger.log('favouritesData', favouritesData);

            if (isFocused) {
                this.setState({
                    myFavourites: favouritesData.allFavourites,
                    myFavouriteAdsPageNo: favouritesData.pageNo
                });
            }
        };

        this.props.getMyFavouriteAds({
            cb,
            myFavouriteAdsPageNo,
            myFavourites: cloneDeep(myFavourites)
        });
    };

    updateListViewTypePreference = (listViewTypePreference) => {
        const { isFocused } = this.props;

        if (isFocused) {
            this.setState({ isOpenViewTypePicker: false });
        }

        this.props.updateListViewTypePreference({
            listViewTypePreference
        });
    };

    renderProducts = ({ item, index }) => (
        <ItemCard
            item={item.form}
            index={index}
            adAddToFavourites={this.onFavPress}
            viewType={this.props.otherUserData.listViewTypePreference}
        />
    );

    renderListEmptyComponent = () => (
        <EmptyListComponent
            message={strings.noFavouritesYet}
            containerStyle={commonStyles.emptyListContainer}
            emptyTextStyle={commonStyles.emptyListText}
        />
    );

    render() {
        const { myFavourites, loading, isOpenViewTypePicker } = this.state;

        const { listViewTypePreference } = this.props.otherUserData;

        let content = <Loader isLoading />;

        let headerRightIcon = icons.ic_grid_view;

        if (listViewTypePreference === viewListItemType.list) {
            headerRightIcon = icons.ic_list_view;
        }

        if (!loading) {
            content = (
                <FlatList
                    key={listViewTypePreference}
                    data={myFavourites}
                    renderItem={this.renderProducts}
                    style={styles.list}
                    contentContainerStyle={styles.listContainer}
                    keyExtractor={keyExtractor}
                    bounces={false}
                    numColumns={listViewTypePreference === viewListItemType.grid ? 2 : 1}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={ListItemSeparator}
                    ListEmptyComponent={this.renderListEmptyComponent}

                    onEndReached={this.onEndReachedDelayed}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                />
            );
        }

        return (
            <Wrapper wrapperBackgroundColor={colors.white1}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onLeftPress}
                    rightIconSource={headerRightIcon}
                    onRightPress={this.onToggleViewTypePress}
                    title={strings.favourites}
                    blackTitle
                    titlePosition={'left'}
                    containerStyle={styles.header}
                    showBottomBorder={!layout.isIOS}
                />

                {content}

                <ChooseListViewType
                    visible={isOpenViewTypePicker}
                    onClose={this.onRequetClosePickerModal}
                    viewOptions={this.getListViewOptions()}
                    title={strings.selectViewType}
                />
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    list: {
        marginTop: moderateScale(15)
    },
    listContainer: {
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(60),
    },
});

const mapStateToProps = ({ user, lang }) => ({
    otherUserData: user.otherData,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    getMyFavouriteAds,
    adAddToFavourites,
    updateListViewTypePreference
})(withNavigationFocus(MyFavouriteAds));
