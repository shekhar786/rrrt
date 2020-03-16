import React, { useState, useEffect } from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import RNPickerSelect from 'react-native-picker-select';

import { Wrapper, Button, pickerProps } from '../../components/common';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import {
    colors,
    screenNames,
    commonColors,
    countries,
    languages,
    LANGUAGES,
    appTypes,
    countries_yabalash
} from '../../utilities/constants';
import { navigate } from '../../utilities/NavigationService';
import { updateLanguageAndCountry } from '../../store/actions';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';

const ChooseLanguage = (props) => {
    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    let allCountries = [];

    if (getAppId() === appTypes.yabalash.id) {
        allCountries = countries_yabalash;
    } else {
        allCountries = countries;
    }

    const [pickedCountry, setPickedCountry] = useState(allCountries[0].value);
    const [pickedLanguage, setPickedLanguage] = useState(LANGUAGES.english);

    const onCountryChange = (country) => setPickedCountry(country);
    const onLanguageChange = (language) => setPickedLanguage(language);

    const onNextPress = () => {
        if (!pickedCountry) {
            return showErrorAlert(strings.pleaseChooseACountry);
        } else if (!pickedLanguage) {
            return showErrorAlert(strings.pleaseChooseALanguage);
        }

        props.updateLanguageAndCountry({
            selectedLanguage: pickedLanguage,
            selectedCountry: pickedCountry
        });

        navigate(screenNames.LoginOptions);
    };

    const renderAppNameIcon = () => {
        let appNameIcon = null;

        switch (getAppId()) {
            case appTypes.yabalash.id:
                appNameIcon = icons.ic_yabalas;
                break;
            case appTypes.shilengae.id:
                appNameIcon = icons.ic_shilenga;
                break;
            case appTypes.beault.id:
                appNameIcon = icons.ic_beault;
                break;
            default:
                break;
        }

        if (appNameIcon) {
            return <Image source={appNameIcon} />;
        }

        return null;
    };

    return (
        <Wrapper containerStyle={styles.containerStyle}>
            <View style={styles.appTitleContainer}>
                {/* <Text style={styles.appTitle}>
                    {getAppdata(getAppId()).name}
                </Text> */}

                {renderAppNameIcon()}
            </View>

            <View style={styles.pickerView}>
                <View style={styles.pickerOuterContainer}>
                    <RNPickerSelect
                        onValueChange={onCountryChange}
                        value={pickedCountry}
                        items={allCountries}
                        placeholder={{}}
                        {...pickerProps}
                    />

                </View>

                <View style={styles.pickerOuterContainer}>
                    <RNPickerSelect
                        onValueChange={onLanguageChange}
                        value={pickedLanguage}
                        items={languages}
                        placeholder={{}}
                        {...pickerProps}
                    />
                </View>

                <Button
                    label={'Continue'}
                    style={styles.continueButton}
                    onPress={onNextPress}
                />
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        backgroundColor: colors.white1
    },
    appTitleContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 0.4
    },
    appTitle: {
        fontSize: moderateScale(50),
        fontFamily: fonts.regular,
        color: commonColors().themeColor
    },
    pickerView: {
        flex: 0.6,
        marginTop: moderateScale(50),
        paddingHorizontal: moderateScale(25),
    },
    pickerOuterContainer: {
        backgroundColor: colors.white,
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: commonColors().themeColor,
        height: moderateScale(48),
        marginTop: moderateScale(10)
    },
    continueButton: {
        marginTop: moderateScale(30)
    }
});

export default connect(null, {
    updateLanguageAndCountry
})(ChooseLanguage);
