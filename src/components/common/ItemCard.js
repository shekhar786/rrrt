import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { layout } from '../../utilities/layout';
import {
    colors,
    screenNames,
    urls,
    commonColors,
    viewListItemType
} from '../../utilities/constants';
import { fonts, icons } from '../../../assets';
import { push } from '../../utilities/NavigationService';
import { Gradient } from './Gradient';
import { strings } from '../../localization';
import { formatNumber } from '../../utilities/helperFunctions';

class ItemCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            favourite: props.item ? !!props.item.favourite : false
        };
    }

    render() {
        const {
            item,
            index,
            hideFavouriteButton,
            disabled,
            adAddToFavourites,
            containerStyle,
            viewType
        } = this.props;

        let featuredBadge = null;

        const onPress = () => push(screenNames.ProductDetails, {
            adData: item,
            onAdFavourite: (favourite) => this.setState({ favourite }) //to update parent list favourite status
        });

        if (item && item.promoted) {
            featuredBadge = (
                <View style={styles.featuredBadgeContainer}>
                    <Image source={icons.ic_check_white} />

                    <Text style={styles.featured}>
                        {strings.featured}
                    </Text>
                </View>
            );
        }

        const renderImage = () => {
            if (item && item.images && item.images.length > 0 && item.images[0].value) {
                const images = item.images[0].value.split(',');

                return (
                    <Image
                        source={{ uri: urls.imagePath + images[0] }}
                        style={styles.adImage}
                    />
                );
            }

            return (
                <View style={styles.placeholderContainer}>
                    <Image
                        source={icons.ic_placeholder_ad}
                        style={styles.placeholderImage}
                    />
                </View>
            );
        };

        let location = '';

        if (item && item.city) {
            location = `${item.city.city}, ${item.city.state}`;
        }

        const onFavouritePress = () => {
            if (adAddToFavourites) {
                item.favourite = !this.state.favourite;
                this.setState({ favourite: !this.state.favourite });

                const cb = (error, data) => {
                    if (error) {
                        return;
                    }

                    console.log('data.value: ', data.value)
                    item.favourite = data.value;

                    this.setState({ favourite: data.value });
                };

                adAddToFavourites({
                    post_id: item.id,
                    cb
                });
            }
        };

        let favouriteButton = null;
        let favouriteIcon = icons.ic_fav_white;

        if (this.state.favourite) {
            favouriteIcon = icons.ic_fav_active;
        } else if (viewType === viewListItemType.list) {
            favouriteIcon = icons.ic_fav_inactive;
        }

        if (!hideFavouriteButton) {
            favouriteButton = (
                <TouchableOpacity
                    style={styles.favImage}
                    activeOpacity={0.6}
                    onPress={onFavouritePress}
                >
                    <Image source={favouriteIcon} />
                </TouchableOpacity>
            );
        }

        if (viewType === viewListItemType.list) {
            return (
                <TouchableOpacity
                    style={styles.listViewContainer}
                    activeOpacity={0.6}
                    onPress={onPress}
                    disabled={disabled}
                >
                    <View style={styles.productImageListContainer}>
                        {renderImage()}
                    </View>

                    <View style={styles.listViewRightContainer}>
                        {item && item.price ?
                            <Text
                                style={styles.price}
                                numberOfLines={1}
                            >
                                {formatNumber(item.price)} {strings.aed}
                            </Text>
                            : null}

                        <Text
                            style={styles.itemName}
                            numberOfLines={1}
                        >
                            {item ? item.title : null}
                        </Text>

                        <View style={styles.locationContainer}>
                            <Image
                                source={icons.ic_location}
                                style={styles.locationIcon}
                            />
                            <Text
                                style={styles.location}
                                numberOfLines={1}
                            >
                                {location || 'Loaction not found'}
                            </Text>
                        </View>

                    </View>

                    {favouriteButton}
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                style={[{
                    ...styles.container,
                    marginRight: index % 2 === 0 ? 5 : 0,
                    marginLeft: index % 2 === 0 ? 0 : 5,
                },
                    containerStyle
                ]}
                activeOpacity={0.6}
                onPress={onPress}
                disabled={disabled}
            >
                <View style={styles.productImageContainer}>
                    {renderImage()}

                    <Gradient
                        height={50}
                        width={(layout.size.width / 2) - 22}
                        reversed
                        startColor={colors.grey8}
                        endColor={colors.black8}
                    />

                    {favouriteButton}

                    {featuredBadge}
                </View>

                {item && item.price ?
                    <Text
                        style={styles.price}
                        numberOfLines={1}
                    >
                        {formatNumber(item.price)} {strings.aed}
                    </Text>
                    : null}
                <Text
                    style={styles.itemName}
                    numberOfLines={1}
                >
                    {item ? item.title : null}
                </Text>

                <View style={styles.locationContainer}>
                    <Image
                        source={icons.ic_location}
                        style={styles.locationIcon}
                    />
                    <Text
                        style={styles.location}
                        numberOfLines={1}
                    >
                        {location || 'Loaction not found'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 192,
        width: (layout.size.width / 2) - 22,
    },
    productImageContainer: {
        height: 132,
        width: (layout.size.width / 2) - 22,
        backgroundColor: colors.grey9
    },
    favImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingTop: 8,
        paddingRight: 5,
        paddingLeft: 12,
        paddingBottom: 12,
    },
    price: {
        fontSize: 14,
        color: commonColors().themeColor,
        fontFamily: fonts.semiBold,
        marginTop: 4
    },
    itemName: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        marginTop: moderateScale(4)
    },
    locationContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    locationIcon: {
        tintColor: colors.grey6,
        left: -5
    },
    location: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: colors.grey6,
        left: -8,
        flex: 1,
    },
    featuredBadgeContainer: {
        backgroundColor: colors.yellow1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        position: 'absolute',
        bottom: 8,
        left: 6,
        borderRadius: 6
    },
    featured: {
        fontSize: 12,
        fontFamily: fonts.regular,
        marginLeft: 5
    },
    adImage: { flex: 1 },
    listViewContainer: {
        height: moderateScale(130),
        paddingHorizontal: moderateScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: moderateScale(1),
        borderColor: colors.grey12,
        borderRadius: moderateScale(2)
    },
    productImageListContainer: {
        height: moderateScale(110),
        width: moderateScale(110),
        backgroundColor: colors.grey9,
        borderRadius: moderateScale(2)
    },
    listViewRightContainer: {
        marginLeft: moderateScale(10),
        flex: 1
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain'
    }
});

export { ItemCard };
