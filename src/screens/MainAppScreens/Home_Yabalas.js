import React, { PureComponent } from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import { Wrapper } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { colors, screenNames, commonColors } from '../../utilities/constants';
import { WhiteContainer } from '../../components/common/WhiteContainer';
import { CategoryCard } from '../../components/Home_Yabalas/CategoryCard';
import { strings } from '../../localization';
import { navigate } from '../../utilities/NavigationService';
import { getCurrentLocation, getAllCategories } from '../../store/actions';
import { layout } from '../../utilities/layout';
import { Loader } from '../../components/common/Loader';
import { EmptyListComponent } from '../../components/common/EmptyListComponent';
import socketServices from '../../utilities/socketServices';
import logger from '../../utilities/logger';

class Home_Yabalas extends PureComponent {
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
        });
        this.props.getCurrentLocation({ updateUseLocation: true });
        this.props.getAllCategories();

        if (!socketServices.socket) { //connect socket
            socketServices.initializeSocket(this.props.userToken);
        }
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onSearchPress = () => navigate(screenNames.SearchWithLocation);
    onLocationPress = () => navigate(screenNames.ChooseLocation, {
        onLocationSelect: (location) => logger.log('Location is: ', location)
    });
    onNotificationPress = () => navigate(screenNames.Notifications);
    onRefresh = () => this.props.getAllCategories();

    renderCategory = ({ item, index }) => (
        <CategoryCard
            category={item}
            index={index}
        />
    );

    renderItemSeparatorComponent = () => <View style={styles.separator} />;

    render() {
        const {
            currentAddress,
            gettingAllCategories,
            allCategories
        } = this.props;

        let content = null;

        if (gettingAllCategories && allCategories.length === 0) {
            content = (
                <Loader
                    isLoading={gettingAllCategories}
                />
            );
        } else {
            content = (
                <FlatList
                    data={allCategories}
                    renderItem={this.renderCategory}
                    numColumns={2}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent}
                    style={styles.list}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <EmptyListComponent
                            message={strings.categoriesNotFound}
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={gettingAllCategories}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
            );
        }

        return (
            <Wrapper wrapperBackgroundColor={commonColors().themeColor}>
                <View style={styles.header}>
                    <View style={styles.headerLeftContainer}>
                        <Text style={styles.locationLabel}>
                            {strings.location}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.onLocationPress}
                            style={styles.locationButton}
                        >
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

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onNotificationPress}
                        style={styles.notificationButton}
                    >
                        <Image source={icons.ic_notifications} />
                        <View style={styles.notificationRedDot} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.searchBarContainer}
                    activeOpacity={0.6}
                    onPress={this.onSearchPress}
                >
                    <Image source={icons.ic_search} />
                    <Text style={styles.searchText}>
                        {strings.searchHere}
                    </Text>
                </TouchableOpacity>

                <WhiteContainer style={styles.container}>
                    <Text style={styles.categoriesTitle}>
                        {strings.categories}
                    </Text>

                    {content}
                </WhiteContainer>
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
        flex: 1,
        paddingLeft: moderateScale(15)
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
    notificationButton: {
        height: moderateScale(44),
        width: moderateScale(54),
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationRedDot: {
        backgroundColor: colors.red1,
        height: moderateScale(12),
        width: moderateScale(12),
        borderRadius: moderateScale(6),
        position: 'absolute',
        top: moderateScale(9),
        right: moderateScale(15)
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
        paddingTop: moderateScale(15)
    },
    categoriesTitle: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    list: {
        marginTop: moderateScale(20)
    },
    listContainer: {
        paddingBottom: moderateScale(60)
    },
    separator: { height: moderateScale(10) }
});

const mapStateToProps = ({ location, product, user, lang }) => ({
    currentAddress: location.currentAddress,
    gettingAllCategories: product.gettingAllCategories,
    allCategories: product.allCategories,
    userToken: user.token,
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    getCurrentLocation,
    getAllCategories
})(Home_Yabalas);
