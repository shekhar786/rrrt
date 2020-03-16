import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    FlatList,
    Platform
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';

import { Wrapper, Header, WhiteContainer, Loader } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { colors, dummyList, GOOGLE_API_KEY, commonColors } from '../../utilities/constants';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import logger from '../../utilities/logger';
import { getLocationAndAddress, showErrorAlert } from '../../utilities/helperFunctions';

const ChooseLocation = ({ navigation }) => {
    const [recentLocations, setRecentLoction] = useState(dummyList);
    const [loading, setLoading] = useState(false);

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

        const onLocationSelect = navigation.getParam('onLocationSelect', null);

        if (onLocationSelect) {
            onLocationSelect(location);
            goBack();
        }
    };

    const onCurrentLocationPress = async () => {
        try {
            setLoading(true);

            const onLocationSelect = navigation.getParam('onLocationSelect', null);

            const currentLocation = await getLocationAndAddress();

            if (onLocationSelect) {
                onLocationSelect(currentLocation);
                goBack();
            }
        } catch (error) {
            logger.log('get current location error: ', error);

            setLoading(false);

            showErrorAlert(error);
        }
    };

    /* const renderLocation = ({ item }) => (
        <Text style={styles.location}>
            {item.title}
        </Text>
    ); */

    const renderSearchImage = () => <Image source={icons.ic_search} />;

    /* const renderRecentLocations = () => {
        if (recentLocations.length > 0) {
            return (
                <>
                    <Text style={styles.recent}>
                        {strings.recent}
                    </Text>
                    <FlatList
                        data={recentLocations}
                        renderItem={renderLocation}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            );
        }

        return null;
    }; */

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_cross_black}
                onLeftPress={onLeftPress}
                containerStyle={styles.header}
                showBottomBorder={Platform.OS === 'android'}
            />
            <WhiteContainer>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.currentLocationContainer}
                        activeOpacity={0.6}
                        onPress={onCurrentLocationPress}
                    >
                        <Image
                            source={icons.ic_current_location}
                            style={styles.currentLocationIcon}
                        />
                        <Text style={styles.currentLocation}>
                            {strings.currentLocation}
                        </Text>
                    </TouchableOpacity>

                    {/* {renderRecentLocations()} */}

                    <GooglePlacesAutocomplete
                        // getDefaultValue={() => ''}
                        placeholder={strings.searchCityOrArea}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        keyboardAppearance={'light'}
                        listViewDisplayed={'auto'}
                        fetchDetails
                        onPress={onLocationPress}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en'
                        }}
                        currentLocationLabel={'Current location'}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GooglePlacesSearchQuery={{ rankby: 'distance' }}
                        // GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                        debounce={200}
                        renderLeftButton={renderSearchImage}
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
            </WhiteContainer>

            <Loader
                isLoading={loading}
                isAbsolute
            />
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
        top: moderateScale(15)
    },
    searchboxTextInputContainer: {
        width: '100%',
        padding: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRadius: moderateScale(4),
        backgroundColor: colors.white4,
        alignItems: 'center',
        paddingHorizontal: moderateScale(15)
    },
    searchboxTextinput: {
        height: moderateScale(44),
        borderRadius: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: 'transparent',
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
        paddingHorizontal: moderateScale(30)
    }
});

const mapStateToProps = ({ lang }) => ({
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {})(ChooseLocation);

