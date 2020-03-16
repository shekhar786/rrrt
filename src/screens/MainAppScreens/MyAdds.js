import React, { PureComponent } from 'react';
import {
    Text,
    StatusBar,
    StyleSheet,
    View,
    FlatList,
    RefreshControl
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import debounce from 'lodash.debounce';

import {
    Wrapper,
    HeaderWithLeftTitle,
    Button,
    EmptyListComponent
} from '../../components/common';
import { colors, screenNames, appTypes } from '../../utilities/constants';
import { fonts } from '../../../assets';
import { layout } from '../../utilities/layout';
import { Ads, Favourites, AdCard } from '../../components/MyAdds';
import { strings } from '../../localization';
import commonStyles from '../../utilities/commonStyles';
import { navigate } from '../../utilities/NavigationService';
import { getAppId, keyExtractor } from '../../utilities/helperFunctions';
import { getMyAds, activateDeactivateAd } from '../../store/actions';
import logger from '../../utilities/logger';

class MyAdds extends PureComponent {
    state = {
        index: 0,
        routes: [
            { key: 'ads', title: strings.ads },
            { key: 'favourites', title: strings.favourites },
        ],
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.getMyAds();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onIndexChange = index => this.setState({ index });
    onLoginPress = () => navigate(screenNames.Login, { hasComeFromMainApp: true });

    onEndReached = () => {
        logger.log('My Ads List End Reached');

        if (!this.onEndReachedCalledDuringMomentum) {
            this.getMyAds();
            this.onEndReachedCalledDuringMomentum = true;
        }
    };

    onMomentumScrollBegin = () => { this.onEndReachedCalledDuringMomentum = false; };

    onEndReachedDelayed = debounce(
        this.onEndReached,
        1000,
        { leading: true, trailing: false }
    );


    getMyAds = () => {
        const { myAdsPageNo, myAds, userId } = this.props;

        if (!userId) {
            return;
        }

        this.props.getMyAds({
            pageno: myAdsPageNo,
            myAds
        });
    };

    renderLabel = ({ route, color }) => {
        let textTransform = 'none';
        let title = '';

        if (route.key === 'ads') {
            title = strings.ads;
        } else if (route.key === 'favourites') {
            title = strings.favourites;
        }

        if (route.key === 'ads') {
            textTransform = 'uppercase';
        }

        return (
            <Text
                style={{
                    ...styles.tabLabel,
                    textTransform,
                    color
                }}
            >
                {title}
            </Text>
        );
    };

    renderTabBar = props => (
        <TabBar
            {...props}
            activeColor={colors.olive1}
            inactiveColor={colors.grey6}
            indicatorStyle={styles.tabIndicator}
            renderLabel={this.renderLabel}
            pressOpacity={0.6}
            style={styles.tabBar}
        />
    );

    renderMyAds = ({ item }) => (
        <AdCard
            ad={item}
            activateDeactivateAd={this.props.activateDeactivateAd}
        />
    );

    renderListEmptyComponent = () => {
        const { gettingMyAds } = this.props;

        if (gettingMyAds) {
            return null;
        }

        return (
            <EmptyListComponent
                message={strings.noAdsYet}
                emptyTextStyle={commonStyles.emptyListText}
                containerStyle={styles.emptyListContainer}
            />
        );
    };

    renderItemSeparatorComponent = () => <View style={styles.separator} />;

    render() {
        const { userId, myAds, gettingMyAds } = this.props;

        let content = (
            <View style={commonStyles.guestUserView}>
                <Text style={commonStyles.guestUserMessage}>
                    {strings.formatString(strings.pleaseLoginFirst, strings.getYourAds)}
                </Text>

                <Button
                    onPress={this.onLoginPress}
                    label={strings.login}
                    style={commonStyles.loginButton}
                />
            </View>
        );

        if (userId && getAppId() === appTypes.yabalash.id) {
            content = (
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        ads: Ads,
                        favourites: Favourites,
                    })}
                    onIndexChange={this.onIndexChange}
                    initialLayout={styles.tabView}
                    renderTabBar={this.renderTabBar}
                    swipeEnabled={false}
                />
            );
        } else if (userId) {
            content = (
                <FlatList
                    data={myAds}
                    renderItem={this.renderMyAds}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={gettingMyAds}
                            onRefresh={this.getMyAds}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    keyExtractor={keyExtractor}
                    style={styles.myAds}
                    contentContainerStyle={styles.listContainer}

                    onEndReached={this.onEndReachedDelayed}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                />
            );
        }

        return (
            <Wrapper>
                <HeaderWithLeftTitle
                    leftTitle={strings.myads}
                />

                {content}
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    tabView: { width: layout.size.width },
    tabIndicator: {
        backgroundColor: colors.olive1
    },
    tabLabel: {
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(18),
    },
    tabBar: {
        backgroundColor: colors.white1
    },
    myAds: {
        borderTopWidth: moderateScale(1),
        borderTopColor: colors.black14,
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(15)
    },
    listContainer: {
        paddingBottom: moderateScale(60)
    },
    separator: {
        height: moderateScale(15)
    },
    emptyListContainer: {
        height: layout.size.height * (2 / 3),
        width: layout.size.width - 30
    }
});

const mapStateToProps = ({ user, product, lang }) => ({
    userId: user.id,
    myAds: product.myAds,
    myAdsPageNo: product.myAdsPageNo,
    gettingMyAds: product.gettingMyAds,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    getMyAds,
    activateDeactivateAd
})(MyAdds);
