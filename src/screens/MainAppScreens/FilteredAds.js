import React, { PureComponent } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import { Wrapper, Header, Loader, ItemCard } from '../../components/common';
import { colors, urls, appTypes } from '../../utilities/constants';
import { icons } from '../../../assets';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import { getAds, adAddToFavourites, getAdsByFilters } from '../../store/actions';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';
import { goBack } from '../../utilities/NavigationService';

class FilteredAds extends PureComponent {
    constructor(props) {
        super(props);

        this.queryParams = props.navigation.getParam('queryParams', {});

        this.state = {
            ads: [],
            loading: true,
            loadingMore: false
        };
    }

    componentDidMount() {
        this.loadAds();
    }

    onLeftPress = () => goBack();

    loadAds = () => {
        const { isFocused } = this.props.navigation;

        const callback = (error, adsData) => {
            if (isFocused()) {
                this.setState({ loading: false });
            }

            if (error) {
                return showErrorAlert(error);
            }

            if (isFocused()) {
                this.setState({ ads: adsData });
            }
        };

        if (getAppId() === appTypes.yabalash.id) {
            this.props.getAds({
                queryParams: this.queryParams,
                cb: callback,
                apiUrl: urls.getFilteredAds
            });
        } else {
            this.props.getAdsByFilters({
                data: this.queryParams,
                cb: callback,
            });
        }
    };

    renderAds = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={item.user_id === this.props.userId}
            adAddToFavourites={this.props.adAddToFavourites}
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

    render() {
        const { ads } = this.state;

        return (
            <Wrapper wrapperBackgroundColor={colors.white1}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onLeftPress}
                    title={strings.filteredAds}
                    titlePosition={'left'}
                    blackTitle
                    showBottomBorder={!layout.isIOS}
                />

                <FlatList
                    data={ads}
                    renderItem={this.renderAds}
                    contentContainerStyle={styles.listContainer}
                    bounces={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    ListEmptyComponent={this.renderListEmptyComponent}
                />
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: moderateScale(60),
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(15)
    },
    separator: {
        height: moderateScale(15)
    },
    noDataFoundContainer: {
        height: layout.size.height - 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = (({ user, lang }) => ({
    userId: user.id,
    selectedLanguage: lang.selectedLanguage
}));

export default connect(mapStateToProps, {
    getAds,
    adAddToFavourites,
    getAdsByFilters
})(FilteredAds);
