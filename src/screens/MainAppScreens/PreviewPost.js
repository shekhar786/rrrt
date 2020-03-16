import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import dayjs from 'dayjs';
import MapView from 'react-native-maps';

import { WhiteContainer, Header } from '../../components/common';
import { layout } from '../../utilities/layout';
import {
    colors,
    DATE_FORMAT,
    FILED_TYPES,
    urls,
    POST_TITLE,
    appTypes,
    commonColors
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { getAppId, formatNumber } from '../../utilities/helperFunctions';
import logger from '../../utilities/logger';

//After Ad post
const PreviewPost = (props) => {
    useEffect(() => {
        StatusBar.setBarStyle('light-content');
    }, []);

    const onLeftPress = () => goBack();

    const adData = props.navigation.getParam('adData', {});

    logger.log('itemdata posted in PreviewPost: ', adData);

    const renderPrice = (priceData) => {
        let price = (
            <Text style={styles.value}>
                {strings.free}
            </Text>
        );

        if (priceData.price) {
            price = (
                <Text style={styles.label}>
                    {formatNumber(priceData.price)} {strings.aed}
                </Text>
            );
        }

        return price;
    };

    const renderBasicDetails = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return (
                <View style={styles.itemContainer}>
                    <View style={styles.nameAndLikeContainer}>
                        <Text style={styles.value}>
                            {adData.title}
                        </Text>
                        {/* <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.favButton}
                        >
                            <Image source={icons.ic_fav_active} />
                        </TouchableOpacity> */}
                    </View>
                    {/* <Text style={styles.label}>
                        {adData.description}
                    </Text>
                    <Text style={styles.yourAddWillExpireOn}>
                        {strings.yourAddWillExpireOn} 17/05/2019
                    </Text> */}
                </View>
            );
        }

        const priceData = adData.postData.find((parameter) => {
            if (parameter.field_type === FILED_TYPES.price) {
                return true;
            }

            return false;
        });

        let priceView = null;

        if (priceData && priceData.value) {
            priceView = renderPrice(priceData.value);
        }

        return (
            <>
                <View style={styles.itemContainer}>
                    {priceView}

                    <Text style={styles.title}>
                        {adData.title}
                    </Text>

                    <View style={styles.locationContainerAndDate}>
                        <View style={styles.locationContainer}>
                            <Image
                                source={icons.ic_location}
                                style={styles.locationPin}
                            />
                            <Text
                                style={styles.location}
                                numberOfLines={1}
                            >
                                {`${adData.city.city}, ${adData.city.state}`}
                            </Text>
                        </View>

                        <Text style={styles.date}>
                            {dayjs(adData.created_at).format(DATE_FORMAT)}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    return (
        <WhiteContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <Swiper
                    height={300}
                    activeDotColor={colors.white1}
                    dotColor={colors.white3}
                    style={styles.swiper}
                >
                    {adData.uploadedImages && adData.uploadedImages.length > 0 ?
                        adData.uploadedImages.map((image) => (
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

                {renderBasicDetails()}

                <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.id} {adData.id}
                    </Text>
                </View>

                {getAppId() === appTypes.yabalash.id
                    ?
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>
                            {strings.location}
                        </Text>
                        <Text style={styles.value}>
                            {`${adData.city.city}, ${adData.city.state}`}
                        </Text>
                    </View>
                    : null
                }

                {/* <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.mobileNumber}
                    </Text>
                    <Text style={styles.value}>
                        +97175464661
                    </Text>
                </View>

                <View style={styles.postAddedAtContainer}>
                    <Text style={styles.label}>
                        {strings.adPostedAt}
                    </Text>
                    <View style={styles.mapView} />
                </View> */}

                {
                    adData.postData.map((parameter) => {
                        let valueView = null;

                        switch (parameter.field_type) {
                            case FILED_TYPES.simple_text:
                            case FILED_TYPES.multiline_text: {
                                if (!parameter.value || parameter.field_name === POST_TITLE) { //to hide value if its empty
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

                            case FILED_TYPES.price: {
                                if (getAppId() !== appTypes.yabalash.id) {
                                    valueView = null;
                                    break;
                                }

                                valueView = renderPrice(parameter.value);
                                break;
                            }

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

                <View style={styles.postAddedAtContainer}>
                    <Text style={styles.adPostedAt}>
                        {strings.location}
                    </Text>

                    <View style={styles.mapView}>
                        <MapView
                            style={{
                                ...styles.mapView,
                                marginTop: 0
                            }}
                            region={{
                                latitude: parseFloat(adData.city.latitude),
                                longitude: parseFloat(adData.city.longitude),
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
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
                                    {`${adData.city.city}, ${adData.city.state}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

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
                <Header
                    leftIconSource={icons.ic_cross_white}
                    onLeftPress={onLeftPress}
                    containerStyle={styles.header}
                />
            </View>
        </WhiteContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: moderateScale(40)
    },
    productImage: {
        height: moderateScale(300),
        width: layout.size.width,
        backgroundColor: colors.grey7
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    header: {
        position: 'absolute',
        top: (!layout.isOldOsVesion) ? layout.statusBarHeight : 0,
        left: 0,
        right: 0
    },
    itemContainer: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    label: {
        fontSize: moderateScale(15),
        fontFamily: fonts.semiBold,
    },
    value: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        color: colors.black13
    },
    nameAndLikeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    favButton: {
        padding: moderateScale(2)
    },
    yourAddWillExpireOn: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.olive1,
        marginTop: moderateScale(8)
    },
    postAddedAtContainer: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15)
    },
    mapView: {
        height: moderateScale(210),
        backgroundColor: colors.grey9,
        marginTop: moderateScale(10)
    },
    imageContainer: {
        height: moderateScale(100),
        width: moderateScale(100),
    },
    image: {
        flex: 1,
        borderRadius: moderateScale(5),
        backgroundColor: colors.grey1
    },
    imagesContainer: {
        marginTop: moderateScale(15)
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8,
        marginVertical: moderateScale(2)
    },
    locationPin: {
        tintColor: colors.grey8,
        left: -5
    },
    locationContainerAndDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        color: commonColors().themeColor,
    },
    adPostedAt: {
        fontSize: moderateScale(15),
        fontFamily: fonts.semiBold,
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

export default PreviewPost;
