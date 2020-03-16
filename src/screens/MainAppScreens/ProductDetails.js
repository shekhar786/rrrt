import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Alert,
    Keyboard,
    Linking,
    Platform
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { moderateScale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper';
import dayjs from 'dayjs';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import firebase from 'react-native-firebase';
import Share from 'react-native-share';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigationFocus } from 'react-navigation';
import cloneDeep from 'clone-deep';
import uuid from 'uuid';

import {
    WhiteContainer,
    Button,
    ItemCard,
    Loader,
    HeaderWith3Buttons
} from '../../components/common';
import {
    colors,
    screenNames,
    appTypes,
    DATE_FORMAT,
    FILED_TYPES,
    urls,
    POST_TITLE,
    commonColors,
    getAppdata
} from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { icons, fonts } from '../../../assets';
import { goBack, navigate } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { YabalashServices, AdComments } from '../../components/ProductDetails';
import {
    formatNumber,
    getAppId,
    showErrorAlert,
    showSuccessAlert,
    intoHiddenName,
    getSMSDivider,
    isUserVerified,
    showInfoAlert
} from '../../utilities/helperFunctions';
import {
    adAddToFavourites,
    getAds,
    activateDeactivateAd,
    deleteAd,
    getCommentsOnAd,
    postCommentOnAd
} from '../../store/actions';
import commonStyles from '../../utilities/commonStyles';
import logger from '../../utilities/logger';

class ProductDetails extends PureComponent {
    constructor(props) {
        super(props);

        this.adData = props.navigation.getParam('adData', {});

        this.state = {
            favourite: this.adData.favourite,
            isActive: !!this.adData.isactive,
            loadingSimilarAds: true,
            loadingComments: false,
            loading: false,
            comments: [],
            similarAds: []
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
        });

        this.getSimilarAds();
        this.getComments();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onLeftPress = () => goBack();

    onHeaderRightPress = () => {
        const { isFocused, userId } = this.props;

        if (this.adData.user_id === userId) {
            this._menu.show();
        } else {
            if (isFocused) {
                this.setState({
                    favourite: !this.state.favourite
                });
            }

            const onAdFavourite = this.props.navigation.getParam('onAdFavourite', null);

            const cb = (error, data) => {
                if (error) {
                    return;
                }

                if (isFocused) {
                    this.setState({ favourite: data.value });
                }

                this.adData.favourite = data.value;

                if (onAdFavourite) { //to update parent list favourite status
                    onAdFavourite(data.value);
                }
            };

            this.props.adAddToFavourites({ post_id: this.adData.id, cb });
        }
    };

    onOpenSellerAdsPress = () => navigate(screenNames.ItemsSoldBySeller, {
        seller: this.adData.user
    });

    onChatPress = () => {
        const { email, mobile, emailVerified, mobileVerified } = this.props;
        const verficationIssue = isUserVerified({
            email,
            mobile,
            emailVerified,
            mobileVerified
        });

        if (verficationIssue) {
            return showInfoAlert(verficationIssue);
        }

        navigate(screenNames.OneToOneChat, {
            chatData: {
                receiverid: this.adData.user.id,
                appId: getAppId(),
                post_id: this.adData.id,
                // receiver_name: getUserName(this.adData.user),
                ...this.adData.user,
                receiver_image: this.adData.user.profile_image,
                receiver_showname: this.adData.user.showname
            }
        });
    };

    onEditAdPress = () => {
        this._menu.hide();

        setTimeout(() => {
            navigate(screenNames.EditPost, {
                adData: this.adData
            });
        }, 500);
    };

    onShareAdPress = async () => {
        try {
            this.setState({ loading: true });

            // logger.log('app data is: ', getAppdata(), true);

            const link =
                new firebase.links.DynamicLink(`${getAppdata().appLink}?productId=${this.adData.id}`, getAppdata().firebaseDomainPrefix)
                    .android.setPackageName(getAppdata().bundleId)
                    .ios.setBundleId(getAppdata().bundleId);
            const url = await firebase.links()
                .createShortDynamicLink(link, 'UNGUESSABLE');

            logger.log('Dynamic Link is: ', url);

            this.setState({ loading: false });

            await Share.open({
                url,
                message: 'Please have a look at this ad. Its a nice ad: ',
                title: 'Share this ad'
            });
        } catch (error) {
            logger.apiError('dynamic link error is: ', error);
            this.setState({ loading: false });
        }
    };

    onActivateDeactivateAd = () => {
        const { isActive } = this.state;
        const updatedIsActive = isActive ? 0 : 1;

        this._menu.hide();

        setTimeout(() => {
            if (isActive) {
                return Alert.alert(
                    strings.deactivate,
                    strings.areYouSureYouWantToDeactivateAd,
                    [
                        {
                            text: strings.cancel,
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: strings.deactivate,
                            onPress: () => this.toggleActivationStatus(updatedIsActive)
                        },
                    ],
                    { cancelable: false },
                );
            }

            this.toggleActivationStatus(updatedIsActive);
        }, 500);
    };

    onDeleteAdPress = () => {
        this._menu.hide();

        setTimeout(() => {
            Alert.alert(
                strings.deleteAd,
                strings.areYouSureYouWantToDeleteAd,
                [
                    {
                        text: strings.cancel,
                        onPress: () => { },
                        style: 'cancel',
                    },
                    { text: strings.delete, onPress: this.deleteAd },
                ],
                { cancelable: false },
            );
        }, 500);
    };

    onSendCommentPress = (comment) => {
        Keyboard.dismiss();
        const { isFocused, navigation, userId, userName, profileImage } = this.props;
        const adData = navigation.getParam('adData', {});

        if (isFocused) {
            this.setState({ loading: true });
        }

        this.props.postCommentOnAd({
            comment,
            post_id: adData.id,
            cb: (error, data) => {
                if (isFocused) {
                    this.setState({ loading: false });
                }

                if (error) {
                    return showErrorAlert(error);
                }

                if (isFocused) {
                    const newComment = {
                        id: uuid(),
                        user_id: userId,
                        post_id: uuid(),
                        comment,
                        created_at: '2020-01-13 10:37:33',
                        updated_at: '2020-01-13 10:37:33',
                        user: {
                            id: userId,
                            name: userName,
                            profile_image: profileImage
                        }
                    };

                    const comments = cloneDeep(this.state.comments);
                    comments.push(newComment);

                    this.setState({ comments });
                }
            }
        });
    };

    onCalculatePricePress = () => {
        const priceData = this.adData.data.find((parameter) => {
            if (parameter.field_type === FILED_TYPES.price) {
                return true;
            }

            return false;
        });

        let price = 0;

        if (priceData && priceData.value && priceData.value.price) {
            price = priceData.value.price;
        }

        const selectedYabalashServices = this.yabalashServices.getSelectedServices();

        navigate(screenNames.CalculateEstimatedPrice, {
            city: this.adData.city,
            adPrice: price,
            selectedYabalashServices
        });
    };

    onMapPress = async () => {
        try {
            const adData = this.props.navigation.getParam('adData', {});
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${parseFloat(adData.city.latitude)},${parseFloat(adData.city.longitude)}`;
            const label = this.adData.title;

            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });

            await Linking.openURL(url);
        } catch (error) {
            logger.error('Open map error', error);
        }
    };

    onEmailPress = async () => {
        try {
            const { email, mobile, emailVerified, mobileVerified } = this.props;
            const verficationIssue = isUserVerified({
                email,
                mobile,
                emailVerified,
                mobileVerified
            });

            if (verficationIssue) {
                return showInfoAlert(verficationIssue);
            }
            if (!this.adData.user || !this.adData.user.email) {
                return showErrorAlert(strings.sellerHasntProvidedHisEmail);
            }

            await Linking.openURL(`mailto:${this.adData.user.email}?subject=Adv. details`);
        } catch (error) {
            logger.error('open email error: ', error);

            showErrorAlert(strings.emailServiceNotAvailableNow);
        }
    };
    onSmsPress = async () => {
        try {
            const { email, mobile, emailVerified, mobileVerified } = this.props;
            const verficationIssue = isUserVerified({
                email,
                mobile,
                emailVerified,
                mobileVerified
            });

            if (verficationIssue) {
                return showInfoAlert(verficationIssue);
            }

            if (!this.adData.user || !this.adData.user.mobile) {
                return showErrorAlert(strings.sellerHasntProvidedHisMobile);
            }

            await Linking.openURL(`sms:${this.adData.user.mobile}${getSMSDivider()}body=Adv. details`);
        } catch (error) {
            logger.error('open sms error: ', error);

            showErrorAlert(strings.mobileServiceNotAvailableNow);
        }
    };
    onMobilePress = async () => {
        try {
            const { email, mobile, emailVerified, mobileVerified } = this.props;
            const verficationIssue = isUserVerified({
                email,
                mobile,
                emailVerified,
                mobileVerifised
            });

            if (verficationIssue) {
                return showInfoAlert(verficationIssue);
            }

            if (!this.adData.user || !this.adData.user.mobile) {
                return showErrorAlert(strings.sellerHasntProvidedHisMobile);
            }

            let phoneNumber = '';

            if (layout.isIOS) {
                phoneNumber = `telprompt:${this.adData.user.mobile}`;
            } else {
                phoneNumber = `tel:${this.adData.user.mobile}`;
            }

            await Linking.openURL(phoneNumber);
        } catch (error) {
            logger.error('open mobile dialer error: ', error);

            return showErrorAlert(strings.mobileServiceNotAvailableNow);
        }
    };

    getSimilarAds = () => {
        const { isFocused } = this.props;

        if (getAppId() === appTypes.yabalash.id) { //do not load similar ads for yabalash
            return;
        }

        const callback = (error, adsData) => {
            if (isFocused) {
                this.setState({ loadingSimilarAds: false });

                if (error) {
                    return showErrorAlert(error);
                }

                this.setState({ similarAds: adsData, loadingSimilarAds: false });
            }
        };

        const queryParams = {
            post_id: this.adData.id,
            user_id: this.props.userId
        };

        this.props.getAds({
            queryParams,
            cb: callback,
            apiUrl: urls.getSimilarAds
        });
    };

    getComments = () => {
        const { isFocused } = this.props;

        this.setState({ loadingComments: true });

        if (getAppId() !== appTypes.yabalash.id) { //load comments only for yabalash
            return;
        }

        const callback = (error, comments) => {
            if (isFocused) {
                this.setState({ loadingComments: false });

                if (error) {
                    return showErrorAlert(error);
                }

                this.setState({ comments });
            }
        };

        this.props.getCommentsOnAd({
            post_id: this.adData.id,
            cb: callback
        });
    };

    getUploadedImages = () => {
        const images = [];
        if (this.adData.images && this.adData.images.length > 0) {
            this.adData.images.forEach((imageData) => {
                if (imageData.value) {
                    const imagesArray = imageData.value.split(',');
                    images.push(...imagesArray);
                }
            });
        }

        return images;
    };

    toggleActivationStatus = (updatedIsActive) => {
        const { isFocused } = this.props;

        if (isFocused) {
            this.setState({ loading: true });
        }

        const cb = (error) => {
            if (isFocused) {
                this.setState({ loading: false });
            }

            if (error) {
                return;
            }

            if (isFocused) {
                this.setState({ isActive: updatedIsActive });
            }

            this.adData.isactive = updatedIsActive;
        };

        this.props.activateDeactivateAd({
            post_id: this.adData.id,
            isactive: updatedIsActive,
            cb
        });
    };

    deleteAd = () => {
        const { isFocused } = this.props;

        if (isFocused) {
            this.setState({ loading: true });
        }

        const cb = (error) => {
            if (isFocused) {
                this.setState({ loading: false });
            }

            if (!error) {
                goBack();

                showSuccessAlert(strings.adDeletedSuccessfully);
            }
        };

        this.props.deleteAd({ post_id: this.adData.id, cb });
    };

    hideMenu = () => {
        this._menu.hide();
    };

    renderPrice = (priceData) => {
        let price = (
            <Text style={styles.price}>
                {strings.free}
            </Text>
        );

        if (priceData.price) {
            price = (
                <Text style={styles.price}>
                    {formatNumber(priceData.price)} {strings.aed}
                </Text>
            );
        }

        return price;
    };

    renderBasicDetails = () => {
        const priceData = this.adData.data.find((parameter) => {
            if (parameter.field_type === FILED_TYPES.price) {
                return true;
            }

            return false;
        });

        let priceView = null;

        if (priceData && priceData.value) {
            priceView = this.renderPrice(priceData.value);
        }

        if (getAppId() === appTypes.yabalash.id) {
            return (
                <View style={styles.itemContainer}>
                    {priceView}
                    <View style={styles.nameAndLikeContainer}>
                        <Text style={styles.value}>
                            {this.adData.title}
                        </Text>
                        {/* <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.favButton}
                        >
                            <Image source={icons.ic_fav_active} />
                        </TouchableOpacity> */}
                    </View>

                    <View style={styles.locationContainerAndDate}>
                        {this.adData.city && this.adData.city.city ?
                            <View style={styles.locationContainer}>
                                <Image
                                    source={icons.ic_location}
                                    style={styles.locationPin}
                                />
                                <Text
                                    style={styles.location}
                                    numberOfLines={1}
                                >
                                    {`${this.adData.city.city}, ${this.adData.city.state}`}
                                </Text>
                            </View>
                            : null
                        }

                        <Text style={styles.date}>
                            {dayjs(this.adData.created_at).format(DATE_FORMAT)}
                        </Text>
                    </View>
                    {/*
                    <Text style={styles.yourAddWillExpireOn}>
                        {strings.yourAddWillExpireOn} 17/05/2019
                    </Text> */}
                </View>
            );
        }

        return (
            <>
                <View style={styles.itemContainer}>
                    <Text style={styles.adId}>
                        {strings.id} {this.adData.id}
                    </Text>
                </View>
                <View style={styles.itemContainer}>
                    {priceView}

                    <Text style={styles.title}>
                        {this.adData.title}
                    </Text>

                    <View style={styles.locationContainerAndDate}>
                        {this.adData.city && this.adData.city.city ?
                            <View style={styles.locationContainer}>
                                <Image
                                    source={icons.ic_location}
                                    style={styles.locationPin}
                                />
                                <Text
                                    style={styles.location}
                                    numberOfLines={1}
                                >
                                    {`${this.adData.city.city}, ${this.adData.city.state}`}
                                </Text>
                            </View>
                            : null}

                        <Text style={styles.date}>
                            {dayjs(this.adData.created_at).format(DATE_FORMAT)}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    renderSimilarAd = ({ item, index }) => (
        <ItemCard
            item={item}
            index={index}
            hideFavouriteButton={item.user_id === this.props.userId}
            adAddToFavourites={this.props.adAddToFavourites}
            containerStyle={styles.similarAdsItemContainer}
        />
    );

    renderListEmptyComponent = () => {
        if (this.state.loadingSimilarAds) {
            return (
                <View
                    style={{
                        width: layout.size.width,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Loader isLoading />
                </View>
            );
        }

        return (
            <View
                style={{
                    width: layout.size.width,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={styles.label}>
                    {strings.noSimilarAdsFound}
                </Text>
            </View>
        );
    };

    // eslint-disable-next-line react/sort-comp
    getSellerName = () => {
        if (this.adData.user.name) {
            return this.adData.user.name;
        } else if (this.adData.user.first_name && this.adData.user.last_name) {
            return `${this.adData.user.first_name} ${this.adData.user.last_name}`;
        } else if (this.adData.user.first_name) {
            return this.adData.user.first_name;
        }

        return '';
    };

    renderSellerProfile = () => {
        const adData = this.props.navigation.getParam('adData', {});

        let userProfileImage = icons.ic_user;

        if ((adData.user_id === this.props.userId) || !adData.user) { //own post or seller not returned by the server
            return null;
        }

        if (adData.user && adData.user.profile_image) {
            userProfileImage = {
                uri: urls.imagePath + adData.user.profile_image
            };
        }

        if (getAppId() === appTypes.yabalash.id) {
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.seller}
                    </Text>

                    <View style={styles.sellerContainer}>
                        <View style={styles.sellerProfileContainer}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={userProfileImage}
                                    style={styles.profileImage}
                                />
                            </View>

                            <Text
                                style={{
                                    ...styles.sellerName,
                                    flex: 1,
                                    marginLeft: moderateScale(10)
                                }}
                            >
                                {this.adData.user.name}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.label}>
                    {strings.seller}
                </Text>

                <View style={styles.sellerContainer}>
                    <View style={styles.sellerProfileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={icons.ic_user}
                                style={styles.profileImage}
                            />
                        </View>

                        <View style={styles.profileNameContainer}>
                            <Text style={styles.sellerName}>
                                {this.adData.user.showname
                                    ? this.getSellerName()
                                    : intoHiddenName(this.getSellerName())
                                }
                            </Text>

                            <View style={styles.sellerVerifiedContainer}>
                                {adData.user.provider_id || adData.user.email || adData.user.mobile
                                    ? <Text style={styles.sellerVerified}>
                                        {strings.sellerVerified}
                                    </Text>
                                    : null
                                }


                                {adData.user.provider_id
                                    ? <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.contactSellerButton}
                                    >
                                        <Image source={icons.ic_facebook} />

                                        <View style={styles.verifiedTickContainer}>
                                            <Image source={icons.ic_verified_blue} />
                                        </View>
                                    </TouchableOpacity>
                                    : null
                                }

                                {adData.user.email
                                    ? <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.contactSellerButton}
                                    >
                                        <Image source={icons.ic_message} />

                                        <View style={styles.verifiedTickContainer}>
                                            <Image source={icons.ic_verified_green} />
                                        </View>
                                    </TouchableOpacity>
                                    : null}

                                {adData.user.mobile
                                    ?
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.contactSellerButton}
                                    >
                                        <Image source={icons.ic_call} />

                                        <View style={styles.verifiedTickContainer}>
                                            <Image source={icons.ic_verified_green} />
                                        </View>
                                    </TouchableOpacity>
                                    : null}
                            </View>
                        </View>
                    </View>

                    <View style={styles.itemsSoldBySellerContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.onOpenSellerAdsPress}
                        >
                            <Text style={styles.itemsSoldBySeller}>
                                {strings.itemsSoldBySeller}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    renderHeaderRightButton = () => {
        const { favourite, isActive } = this.state;

        if (this.adData.user_id === this.props.userId) { //own post
            return (
                <Menu
                    ref={(_menu) => (this._menu = _menu)}
                    button={
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={commonStyles.headerButton}
                            onPress={this.onHeaderRightPress}
                        >
                            <Image source={icons.ic_edit_dot} />
                        </TouchableOpacity>
                    }
                >
                    <View style={styles.menuContainer}>
                        <MenuItem
                            onPress={this.onEditAdPress}
                            textStyle={styles.menuItemText}
                        >
                            {strings.edit}
                        </MenuItem>

                        <MenuDivider />

                        <MenuItem
                            onPress={this.onDeleteAdPress}
                            textStyle={styles.menuItemText}
                        >
                            {strings.delete}
                        </MenuItem>

                        <MenuDivider />

                        {getAppId() !== appTypes.yabalash.id ?
                            <MenuItem
                                onPress={this.onActivateDeactivateAd}
                                textStyle={styles.menuItemText}
                            >
                                {isActive ? strings.deactivate : strings.activate}

                            </MenuItem>
                            : null}
                        <MenuDivider />
                    </View>
                </Menu>
            );
        }

        let headerRightIcon = icons.ic_fav_white;

        if (favourite) {
            headerRightIcon = icons.ic_fav_active;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={commonStyles.headerButton}
                onPress={this.onHeaderRightPress}
            >
                <Image source={headerRightIcon} />
            </TouchableOpacity>
        );
    };

    renderBottomButtons = () => {
        const { userId } = this.props;

        if (
            !userId
            || (this.adData.user_id === userId &&
                getAppId() === appTypes.yabalash.id)
        ) { //guest user or own post and app is yabalash
            return null;
        } else if (
            this.adData.user_id === userId
            && (getAppId() === appTypes.shilengae.id || getAppId() === appTypes.beault.id)
        ) { //own post and in shilengae
            return (
                <Button
                    label={strings.promoteNow}
                    style={styles.buttonStyle}
                />
            );
        } else if (
            this.adData.user_id !== userId &&
            getAppId() === appTypes.yabalash.id
        ) { //other's post and in yabalash
            return (
                <Button
                    label={strings.chat}
                    style={styles.buttonStyle}
                    onPress={this.onChatPress}
                />
            );
        }

        //in shilengae and other user's post
        return (
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.bottomButton}
                    onPress={this.onChatPress}
                >
                    <Image source={icons.ic_chat_product_details} />

                    <Text style={styles.bottomButtonLabel}>
                        {strings.chat}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.bottomButton}
                    onPress={this.onEmailPress}
                >
                    <Image source={icons.ic_email} />

                    <Text style={styles.bottomButtonLabel}>
                        {strings.email}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.bottomButton}
                    onPress={this.onSmsPress}
                >
                    <Image source={icons.ic_sms} />

                    <Text style={styles.bottomButtonLabel}>
                        {strings.sms}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.bottomButton}
                    onPress={this.onMobilePress}
                >
                    <Image source={icons.ic_call_product_details} />

                    <Text style={styles.bottomButtonLabel}>
                        {strings.call}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderSimilarAdsList = () => {
        if (getAppId() !== appTypes.yabalash.id) { //shilengae or other app
            return (
                <View style={styles.similarAdsConatainer}>
                    <Text style={styles.similarAds}>
                        {strings.similarAds}
                    </Text>

                    <FlatList
                        data={this.state.similarAds}
                        renderItem={this.renderSimilarAd}
                        ListEmptyComponent={this.renderListEmptyComponent}
                        horizontal
                        style={styles.similarAdsList}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => String(item.id)}
                    />
                </View>
            );
        }

        return null;
    };

    render() {
        const { loading, comments, loadingComments } = this.state;
        const { userId, navigation } = this.props;

        const adData = navigation.getParam('adData', {});

        return (
            <WhiteContainer>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <Swiper
                        height={300}
                        activeDotColor={colors.white1}
                        dotColor={colors.white3}
                        style={styles.swiper}
                    >
                        {this.adData.images && this.adData.images.length > 0 ?
                            this.getUploadedImages().map((image) => (
                                <Image
                                    key={image}
                                    source={{ uri: urls.imagePath + image }}
                                    style={styles.productImage}
                                />
                            ))
                            :
                            <View style={styles.placeholderContainer}>
                                <Image
                                    source={icons.ic_placeholder_ad}
                                    style={styles.placeholderImage}
                                />
                            </View>
                        }
                    </Swiper>

                    {this.renderBasicDetails()}

                    {
                        adData.data.map((parameter) => {
                            let valueView = null;

                            switch (parameter.field_type) {
                                case FILED_TYPES.simple_text:
                                case FILED_TYPES.multiline_text: {
                                    if (
                                        !parameter.value
                                        || (parameter.field_name === POST_TITLE)
                                    ) { //to hide value if its empty
                                        valueView = null;
                                        break;
                                    }

                                    valueView = (
                                        <Text style={styles.value}>
                                            {parameter.value}
                                        </Text>
                                    );
                                    break;
                                }

                                case FILED_TYPES.multi_select_option: {
                                    if (parameter.value.length === 0) { //to hide value if its empty
                                        valueView = null;
                                        break;
                                    }

                                    valueView = (
                                        <Text style={styles.value}>
                                            {parameter.value.map((v) => v.replace(/_/g, ' '))}
                                        </Text>
                                    );
                                    break;
                                }

                                case FILED_TYPES.radio_button:
                                case FILED_TYPES.picker: {
                                    if (!parameter.value) { //to hide value if its empty
                                        valueView = null;
                                        break;
                                    }

                                    valueView = (
                                        <Text style={styles.value}>
                                            {parameter.value.replace(/_/g, ' ')}
                                        </Text>
                                    );
                                    break;
                                }

                                /* case FILED_TYPES.price: {
                                    if (getAppId() !== appTypes.yabalash.id) {
                                        valueView = null;
                                        break;
                                    }

                                    valueView = this.renderPrice(parameter.value);
                                    break;
                                } */

                                case FILED_TYPES.location: {
                                    if (!parameter.value.address) { //to hide value if its empty
                                        valueView = null;
                                        break;
                                    }

                                    valueView = (
                                        <Text style={styles.value}>
                                            {parameter.value.address}
                                        </Text>
                                    );
                                    break;
                                }

                                case FILED_TYPES.date: {
                                    if (!parameter.value) { //to hide value if its empty
                                        valueView = null;
                                        break;
                                    }

                                    valueView = (
                                        <Text style={styles.value}>
                                            {dayjs(parameter.value).format(DATE_FORMAT)}
                                        </Text>
                                    );
                                    break;
                                }

                                default:
                                    valueView = null;
                            }

                            if (!valueView) { //to hide value if its empty
                                return null;
                            }

                            return (
                                <View key={parameter.field_name} style={styles.itemContainer}>
                                    <Text style={styles.label}>
                                        {parameter.title}
                                    </Text>

                                    {valueView}
                                </View>
                            );
                        })
                    }

                    {getAppId() === appTypes.yabalash.id ?
                        <>
                            <AdComments
                                comments={comments}
                                onSendCommentPress={this.onSendCommentPress}
                                loadingComments={loadingComments}
                                hideTextInput={!userId}
                            />

                            {this.renderSellerProfile()}

                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>
                                    {strings.yabalasService}
                                </Text>
                                <YabalashServices
                                    ref={(yabalashServices) => (this.yabalashServices = yabalashServices)}
                                />

                                <View style={styles.calculateEstimateContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.calculateEstimateButton}
                                        onPress={this.onCalculatePricePress}
                                    >
                                        <Text style={styles.calculateEstimate}>
                                            {strings.calculateEstimate}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.detailContainer}>
                                <Text style={styles.adId}>
                                    {`${strings.adId}: ${adData.id}`}
                                </Text>
                            </View>

                        </>
                        : this.renderSellerProfile()
                    }


                    {this.adData.city && this.adData.city.city ?
                        <View style={styles.itemContainer}>
                            <Text style={styles.adPostedAt}>
                                {strings.adPostedAt}
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.onMapPress}
                                style={styles.mapView}
                            >
                                <MapView
                                    style={{ ...styles.mapView, marginTop: 0 }}
                                    region={{
                                        latitude: parseFloat(adData.city.latitude),
                                        longitude: parseFloat(adData.city.longitude),
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05,
                                    }}
                                    liteMode
                                    showsMyLocationButton={false}
                                    showsCompass={false}
                                    showsScale={false}
                                    zoomEnabled={false}
                                    zoomTapEnabled={false}
                                    zoomControlEnabled={false}
                                    pitchEnabled={false}
                                    scrollEnabled={false}
                                    toolbarEnabled={false}
                                />

                                <View style={styles.markerContainer}>
                                    <Image source={icons.ic_pin} />

                                    <Image
                                        source={icons.ic_top_corner}
                                        style={styles.calloutPin}
                                    />

                                    <View style={styles.locationCallout}>
                                        <Text style={styles.locationNameCallout}>
                                            {`${this.adData.city.city}, ${this.adData.city.state}`}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        : null}

                    {this.renderSimilarAdsList()}
                </KeyboardAwareScrollView>

                <SafeAreaView>
                    {this.renderBottomButtons()}
                </SafeAreaView>

                <View style={styles.headerContainer}>
                    <Svg height={layout.statusBarHeight + moderateScale(60)} width={layout.size.width}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor={colors.black6} stopOpacity="0.4" />
                                <Stop offset="100%" stopColor={colors.black7} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Rect
                            x={'0'}
                            y={'0'}
                            width={layout.size.width}
                            height={layout.statusBarHeight + moderateScale(60)}
                            fill={'url(#grad)'}
                        />
                    </Svg>

                    <HeaderWith3Buttons
                        firstIconSource={icons.ic_cross_white}
                        onFirstPress={this.onLeftPress}
                        secondIconSource={icons.ic_share}
                        onSecondPress={this.onShareAdPress}
                        renderThirdIcon={this.renderHeaderRightButton}
                        containerStyle={styles.header}
                        hideThirdButton={!userId}
                    />
                </View>

                <Loader isLoading={loading} isAbsolute />
            </WhiteContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: moderateScale(40)
    },
    productImage: {
        height: moderateScale(300),
        width: layout.size.width,
        backgroundColor: colors.grey9,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    header: {
        position: 'absolute',
        top: (!layout.isOldOsVesion) ? layout.statusBarHeight : 0,
        left: 0,
        right: 0
    },
    detailContainer: {
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(20),
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey2
    },
    price: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    productName: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8
    },
    locationSubContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationIcon: {
        tintColor: colors.grey8,
        left: -moderateScale(5)
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
    },
    subLabel: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8
    },
    sellerProfilePic: {
        height: moderateScale(24),
        width: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: colors.grey1
    },
    sellerName: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    calculateEstimateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(20)
    },
    calculateEstimateButton: {
        padding: moderateScale(5)
    },
    calculateEstimate: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
        color: colors.olive1
    },
    adId: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular
    },
    mapView: {
        height: moderateScale(210),
        backgroundColor: colors.grey9,
        marginTop: moderateScale(10)
    },
    buttonStyle: {
        borderRadius: 0,
    },
    bottomButtonsContainer: {
        flexDirection: 'row'
    },
    itemContainer: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    value: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        color: colors.black13
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8,
        marginVertical: moderateScale(2)
    },
    favButton: {
        padding: moderateScale(2)
    },
    locationContainerAndDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: moderateScale(5)
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    location: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8,
        flex: 1
    },
    date: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: getAppId() === appTypes.yabalash.id
            ? colors.black13 : commonColors().themeColor,
    },
    adPostedAt: {
        fontSize: moderateScale(15),
        fontFamily: fonts.semiBold,
    },
    locationPin: {
        tintColor: colors.grey8,
        left: -5
    },
    swiper: {
        backgroundColor: colors.grey9
    },
    markerContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationCallout: {
        backgroundColor: colors.white1,
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(2),
        top: -2,
        elevation: 3
    },
    locationNameCallout: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8,
    },
    calloutPin: {
        marginTop: 5
    },
    sellerContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: moderateScale(10)
    },
    sellerProfileContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    profileImageContainer: {
        height: moderateScale(24),
        width: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: colors.grey9,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    profileImage: {
        height: moderateScale(24),
        width: moderateScale(24),
    },
    profileNameContainer: {
        marginLeft: moderateScale(10),
        flex: 1,
    },
    sellerVerifiedContainer: {
        flex: 1,
        marginTop: moderateScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    sellerVerified: {
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
        color: colors.grey13
    },
    itemsSoldBySellerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: moderateScale(1),
        borderLeftColor: colors.grey14
    },
    itemsSoldBySeller: {
        fontSize: moderateScale(12),
        fontFamily: fonts.semiBold,
        color: commonColors().themeColor,
        margin: moderateScale(5)
    },
    contactSellerButton: {
        marginLeft: moderateScale(10)
    },
    verifiedTickContainer: {
        position: 'absolute',
        bottom: -9,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    bottomButton: {
        flex: 1,
        borderRadius: 0,
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: commonColors().themeColor
    },
    bottomButtonLabel: {
        fontFamily: fonts.semiBold,
        color: colors.white1,
        fontSize: moderateScale(12),
        marginTop: moderateScale(2)
    },
    similarAdsConatainer: {
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(15)
    },
    similarAds: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        marginBottom: moderateScale(10)
    },
    similarAdsList: {
        minHeight: 192
    },
    nameAndLikeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    similarAdsItemContainer: {
        marginRight: 0,
        marginLeft: 10
    },
    menuItemText: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    menuContainer: {
        paddingHorizontal: moderateScale(5)
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderImage: {
        height: 70,
        width: 70,
        resizeMode: 'contain',
    }
});

const mapStateToProps = ({ user }) => ({
    userId: user.id,
    userName: user.name,
    emailVerified: user.verified,
    mobileVerified: user.mverified,
    email: user.email,
    mobile: user.mobile,
    profileImage: user.profile_image
});

export default connect(mapStateToProps, {
    adAddToFavourites,
    getAds,
    activateDeactivateAd,
    deleteAd,
    getCommentsOnAd,
    postCommentOnAd
})(withNavigationFocus(ProductDetails));
