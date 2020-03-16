import React, { useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import { ItemCard, EmptyListComponent, ListItemSeparator } from '../common';
import { strings } from '../../localization';
import commonStyles from '../../utilities/commonStyles';
import { keyExtractor } from '../../utilities/helperFunctions';
import { getMyFavouriteAds, adAddToFavourites } from '../../store/actions';

const FavouritesComponent = React.memo((props) => {
    const { myFavouriteAdsPageNo, gettingMyFavouriteAds, myFavourites, userId } = props;

    const getAds = () => {
        if (!userId) {
            return;
        }

        props.getMyFavouriteAds({
            myFavouriteAdsPageNo,
            myFavourites
        });
    };

    useEffect(() => {
        getAds();
    }, []);

    const renderFavourites = ({ item, index }) => (
        <ItemCard
            item={item.form}
            index={index}
            adAddToFavourites={props.adAddToFavourites}
        />
    );

    const renderListEmptyComponent = () => {
        if (gettingMyFavouriteAds) {
            return null;
        }

        return (
            <EmptyListComponent
                message={strings.noFavouritesYet}
                emptyTextStyle={commonStyles.emptyListText}
                containerStyle={commonStyles.emptyListContainer}
            />
        );
    }

    return (
        <FlatList
            data={myFavourites}
            renderItem={renderFavourites}
            numColumns={2}
            ListEmptyComponent={renderListEmptyComponent}
            ItemSeparatorComponent={ListItemSeparator}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            refreshControl={
                <RefreshControl
                    refreshing={gettingMyFavouriteAds}
                    onRefresh={getAds}
                />
            }
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: moderateScale(15),
        paddingBottom: moderateScale(60)
    },
});

const mapStateToProps = ({ user, product, lang }) => ({
    userId: user.id,
    myFavourites: product.myFavourites,
    gettingMyFavouriteAds: product.gettingMyFavouriteAds,
    myFavouriteAdsPageNo: product.myFavouriteAdsPageNo,
    selectedLanguage: lang.selectedLanguage
});

const Favourites = connect(mapStateToProps, {
    getMyFavouriteAds,
    adAddToFavourites
})(FavouritesComponent);

export { Favourites };
