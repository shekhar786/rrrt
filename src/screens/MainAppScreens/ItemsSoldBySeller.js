import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import {
    Wrapper,
    Header,
    ItemCard,
    Loader,
} from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { colors, urls } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { getAds, adAddToFavourites } from '../../store/actions';
import { strings } from '../../localization';
import { showErrorAlert, getUserName } from '../../utilities/helperFunctions';

const ItemsSoldBySeller = (props) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const seller = props.navigation.getParam('seller', {});

    const loadAds = () => {
        const callback = (error, adsData) => {
            setLoading(false);

            if (error) {
                return showErrorAlert(error);
            }

            // logger.log('all ads by seller: ', adsData);

            setAds(adsData);
        };

        const queryParams = {
            user_id: seller.id
        };

        props.getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getAdsBySeller
        });
    };

    useEffect(() => {
        const navListener = props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        loadAds();

        return () => {
            navListener.remove();
        };
    }, []);

    const renderItemsSoldBySeller = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={item.user_id === props.userId}
            adAddToFavourites={props.adAddToFavourites}
        />
    );

    const onLeftPress = () => goBack();

    const renderItemSeparatorComponent = () => <View style={styles.separator} />;

    let content = null;

    if (loading) {
        content = <Loader isLoading />;
    } else {
        content = (
            <>
                <Text style={styles.resultsCount}>
                    {ads.length} {strings.results}
                </Text>

                <FlatList
                    data={ads}
                    renderItem={renderItemsSoldBySeller}
                    contentContainerStyle={styles.listContainer}
                    bounces={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={renderItemSeparatorComponent}
                />
            </>
        );
    }

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                title={strings.formatString(strings.adsSoldBySeller, getUserName(seller))}
                titlePosition={'left'}
                titleStyle={styles.title}
                containerStyle={styles.header}
                showBottomBorder={Platform.OS === 'android'}
            />

            <View style={styles.subContainer}>
                {content}
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1,
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
    subContainer: {
        flex: 1,
        marginHorizontal: moderateScale(15),
    },
    listContainer: {
        paddingBottom: moderateScale(60),
    },
    separator: {
        height: moderateScale(15)
    },
    resultsCount: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        marginBottom: moderateScale(15),
        marginTop: moderateScale(10)
    },
});

const mapStateToProps = (({ user, lang }) => ({
    userId: user.id,
    selectedLanguage: lang.selectedLanguage
}));

export default connect(mapStateToProps, {
    getAds,
    adAddToFavourites
})(ItemsSoldBySeller);
