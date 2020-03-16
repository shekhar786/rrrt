import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    Keyboard
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import {
    Wrapper,
    Header,
    WhiteContainer,
    TextInputWithLabel,
    Button
} from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import {
    colors,
    GOOGLE_API_KEY,
    commonColors,
    regex,
    yabalashServices
} from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import logger from '../../utilities/logger';
import {
    showErrorAlert,
    distanceBetweenCoords,
    formatNumber,
} from '../../utilities/helperFunctions';

const CalculateEstimate = (props) => {
    const [destination, setDestination] = useState(null);
    const [estimatedWeight, setEstimatedWeight] = useState(null);
    const [estimatedPrice, setEstimatedPrice] = useState(null);

    const city = props.navigation.getParam('city', {});
    const adPrice = props.navigation.getParam('adPrice', {});
    const selectedYabalashServices = props.navigation.getParam('selectedYabalashServices', []);

    useEffect(() => {
        // code to run on component mount
        StatusBar.setBarStyle('dark-content');
    }, []);

    const onLeftPress = () => goBack();

    const onLocationPress = (data, details) => {
        const location = {
            lat: details.geometry.location.lat,
            long: details.geometry.location.lng,
            address: details.formatted_address
        };

        logger.log('location is: ', location);

        setDestination(location);
    };

    const onCalculateEstimatePress = () => {
        Keyboard.dismiss();

        if (!destination) {
            return showErrorAlert(strings.pleaseEnterDestination);
        } else if (!estimatedWeight) {
            return showErrorAlert(strings.pleaseEnterEstimatedWeight);
        } else if (!regex.price.test(estimatedWeight)) {
            return showErrorAlert(strings.pleaseEnterValidEstimatedWeight);
        }

        const distance = distanceBetweenCoords(
            destination.lat,
            destination.long,
            parseFloat(city.latitude),
            parseFloat(city.longitude),
            'K'
        );

        const perKgCost = 5; //in AED
        const perKmCost = 10; //in AED

        let price = (distance * perKmCost) + (estimatedWeight * perKgCost) + parseInt(adPrice, 10);

        selectedYabalashServices.forEach((serviceId) => {
            yabalashServices.forEach(yabalashService => {
                if (yabalashService.id === serviceId) {
                    price += yabalashService.price;
                }
            });
        });

        setEstimatedPrice(Math.round(price));
    };

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                containerStyle={styles.header}
                title={strings.calculateEstimate}
                blackTitle
                showBottomBorder={Platform.OS === 'android'}
            />

            <WhiteContainer>
                <View style={styles.subContainer}>
                    <Text style={styles.label}>
                        {strings.destination}
                    </Text>
                    <TextInputWithLabel
                        label={strings.estimatedWeight}
                        onChangeText={setEstimatedWeight}
                        value={estimatedWeight}
                        containerStyle={{
                            ...styles.textInputContainer,
                            marginTop: moderateScale(60)
                        }}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        placeholder={strings.estimatedWeight}
                        bottomBorderOnly
                        blurOnSubmit
                        noColorChange
                    />

                    {estimatedPrice
                        ?
                        <View style={styles.estimatedPriceContainer}>
                            <Text style={styles.estimatedPrice}>
                                {`${strings.estimatedPrice}: `}
                            </Text>

                            <Text style={styles.price}>
                                {`${formatNumber(estimatedPrice)} ${strings.aed}`}
                            </Text>
                        </View>
                        : null}

                    <GooglePlacesAutocomplete
                        placeholder={strings.searchCityOrArea}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        keyboardAppearance={'light'}
                        listViewDisplayed={'false'}
                        fetchDetails
                        onPress={onLocationPress}
                        query={{ key: GOOGLE_API_KEY, language: 'en' }}
                        currentLocationLabel={'Current location'}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GooglePlacesSearchQuery={{ rankby: 'distance' }}
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                        debounce={200}
                        styles={{
                            container: styles.searchboxContainer,
                            textInputContainer: styles.searchboxTextInputContainer,
                            textInput: styles.searchboxTextinput,
                            description: styles.searchDescription,
                            powered: styles.searchboxPoweredBy,
                            row: styles.searchboxRow
                        }}
                    />
                </View>

                <Button
                    label={strings.calculateEstimate}
                    borderRadius={0.1}
                    onPress={onCalculateEstimatePress}
                />
            </WhiteContainer>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    header: {
        backgroundColor: colors.white1,
        ...commonStyles.shadow,
        shadowRadius: moderateScale(2),
        elevation: 0,
        marginBottom: moderateScale(5)
    },
    subContainer: {
        flex: 1,
        marginHorizontal: moderateScale(15),
        paddingBottom: moderateScale(50)
    },
    currentLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(80),
        paddingVertical: moderateScale(10),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4,
    },
    currentLocationIcon: {
        tintColor: commonColors().themeColor
    },
    currentLocation: {
        color: commonColors().themeColor,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        marginLeft: moderateScale(10)
    },
    recent: {
        fontFamily: fonts.regular,
        marginTop: moderateScale(20)
    },
    location: {
        marginTop: moderateScale(10),
        fontSize: moderateScale(12),
        fontFamily: fonts.regular
    },
    searchboxContainer: {
        backgroundColor: colors.white1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: moderateScale(30)
    },
    searchboxTextInputContainer: {
        width: '100%',
        padding: 0,
        borderTopWidth: 0,
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.black3,
        borderRadius: moderateScale(4),
        backgroundColor: colors.white1,
        alignItems: 'center',
        paddingHorizontal: moderateScale(0),
    },
    searchboxTextinput: {
        height: moderateScale(44),
        borderRadius: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: 'transparent',
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(14)
    },
    searchDescription: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    searchboxPoweredBy: {
        height: 0,
        width: 0
    },
    searchboxRow: {
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(30)
    },
    textInputContainer: {
        marginTop: moderateScale(15),
        height: moderateScale(56)
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
        color: colors.black5,
        marginTop: moderateScale(10)
    },
    estimatedPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(15)
    },
    estimatedPrice: {
        fontSize: moderateScale(18),
        fontFamily: fonts.semiBold,
    },
    price: {
        fontSize: moderateScale(18),
        fontFamily: fonts.regular,
    }
});

export default CalculateEstimate;

