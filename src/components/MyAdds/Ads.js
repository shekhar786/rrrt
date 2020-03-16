import React from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { AdCard } from './AdCard';
import { EmptyListComponent, ListItemSeparator } from '../common';
import { strings } from '../../localization';
import commonStyles from '../../utilities/commonStyles';
import { getMyAds, activateDeactivateAd } from '../../store/actions';
import { keyExtractor } from '../../utilities/helperFunctions';
import logger from '../../utilities/logger';

const AdsComponent = React.memo((props) => {
    const { myAdsPageNo, myAds, gettingMyAds } = props;

    const renderAd = ({ item }) => (
        <AdCard
            ad={item}
            activateDeactivateAd={props.activateDeactivateAd}
        />
    );

    const renderListEmptyComponent = () => {
        if (gettingMyAds) {
            return null;
        }

        return (
            <EmptyListComponent
                message={strings.noAdsYet}
                emptyTextStyle={commonStyles.emptyListText}
                containerStyle={commonStyles.emptyListContainer}
            />
        );
    };

    const getMyOwnAds = () => {
        // return;

        props.getMyAds({
            pageno: myAdsPageNo,
            myAds,
            isLoadMore: false
        });
    };

    const loadMoreAds = () => {
        return
        if (myAds.length !== 0) {
            logger.log('Loading more');

            props.getMyAds({
                pageno: myAdsPageNo,
                myAds,
                isLoadMore: true
            });
        }
    };

    return (
        <FlatList
            data={myAds}
            renderItem={renderAd}
            ItemSeparatorComponent={ListItemSeparator}
            ListEmptyComponent={renderListEmptyComponent}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            refreshControl={
                <RefreshControl
                    refreshing={gettingMyAds}
                    onRefresh={getMyOwnAds}
                />
            }
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreAds}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        padding: moderateScale(15),
        paddingBottom: moderateScale(60)
    }
});

const mapStateToProps = ({ product, lang }) => ({
    myAds: product.myAds,
    myAdsPageNo: product.myAdsPageNo,
    gettingMyAds: product.gettingMyAds,
    selectedLanguage: lang.selectedLanguage
});

const Ads = connect(mapStateToProps, {
    getMyAds,
    activateDeactivateAd
})(AdsComponent);

export { Ads };
