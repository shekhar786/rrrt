import React, { useEffect, useState } from 'react';
import {
    View,
    Platform,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker from 'react-native-country-picker-modal';
import { connect } from 'react-redux';

import {
    Wrapper,
    Header,
    TextInputWithLabel,
    Button,
    KeyboardAccessoryView,
    Loader
} from '../../components/common';
import { icons, fonts } from '../../../assets';
import { strings } from '../../localization';
import {
    colors,
    regex,
    appTypes,
    commonColors,
    MIME_TYPE,
    urls
} from '../../utilities/constants';
import {
    showErrorAlert,
    requestCameraPermission,
    getAppId
} from '../../utilities/helperFunctions';
import { goBack } from '../../utilities/NavigationService';
import logger from '../../utilities/logger';
import { layout } from '../../utilities/layout';
import { editProfile } from '../../store/actions';
import commonStyles from '../../utilities/commonStyles';

const BUTTONSiOS = [
    'Camera',
    'Gallery',
    'Cancel'
];

const BUTTONSandroid = [
    'Camera',
    'Gallery',
];

const CANCEL_INDEX = 2;

const EditProfile_Yabalas = (props) => {
    useEffect(() => { //cdm
        StatusBar.setBarStyle('dark-content');
    }, []);

    let profilePic = null;

    if (props.profile_image) {
        profilePic = urls.imagePath + props.profile_image;
    }

    const [profile_image, setProfilePic] = useState(profilePic);
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [mobileFocused, setMobileFocused] = useState(false);

    const [countryCode, setCountryCode] = useState(props.selectedCountry.toUpperCase());
    const [mobile, setMobile] = useState(props.mobile);
    const [description, setDescription] = useState(props.description);

    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const mobileRef = React.createRef();
    const descriptionRef = React.createRef();

    const onLeftPress = () => goBack();

    const onNameSubmit = () => emailRef.current.focus();
    const onEmailSubmit = () => mobileRef.current.focus();
    const onMobileSubmit = () => descriptionRef.current.focus();

    const onSelectCountry = (countryData) => {
        setCountryCode(countryData.cca2);
    };

    const onSubmit = () => {
        if (!name) {
            showErrorAlert(strings.nameRequired);
        } else if (!email) {
            showErrorAlert(strings.emailRequired);
        } else if (!regex.email.test(email)) {
            showErrorAlert(strings.enterValidEmail);
        } else if (!mobile) {
            showErrorAlert(strings.phoneRequired);
        } else if (!regex.mobileNo.test(mobile)) {
            showErrorAlert(strings.enterValidMobileNo);
        } else {
            const data = new FormData();

            data.append('name', name);
            data.append('email', email);
            data.append('mobile', mobile);

            data.append('description', description || '');

            if (
                profile_image &&
                (!profile_image.startsWith('http') && !profile_image.startsWith('https'))
            ) {
                data.append('profile_image', {
                    uri: layout.isIOS ? `file:///${profile_image}` : profile_image,
                    name: 'profile_image.jpg',
                    type: MIME_TYPE.image
                });
            }

            logger.data('edit profile data is: ', data);

            props.editProfile({ data });
        }
    };

    const getProfileImagePath = () => {
        if (profile_image) {
            return { uri: profile_image };
        }

        if (getAppId() === appTypes.yabalash.id) {
            return icons.ic_edit_profile;
        }

        return icons.ic_edit_profile_shilenga;
    };

    const openActionSheet = () => {
        ActionSheet.showActionSheetWithOptions({
            options: (Platform.OS === 'ios') ? BUTTONSiOS : BUTTONSandroid,
            cancelButtonIndex: CANCEL_INDEX,
            title: strings.chooseImagesFrom
        },
            async (buttonIndex) => {
                try {
                    if (buttonIndex === 0 || buttonIndex === 1) {
                        await requestCameraPermission();
                    }

                    const imagePickerOptions = {
                        compressImageQuality: 0.4,
                        mediaType: 'photo',
                        cropping: false
                    };

                    switch (buttonIndex) {
                        case 0: {
                            const pickedImage = await ImagePicker.openCamera(imagePickerOptions);

                            // console.log('picked Image is: ', pickedImage);

                            setProfilePic(pickedImage.path);
                            break;
                        }
                        case 1: {
                            const pickedImage = await ImagePicker.openPicker(imagePickerOptions);

                            // console.log('picked Image is: ', pickedImage);

                            setProfilePic(pickedImage.path);
                            break;
                        }
                        default:
                            break;
                    }
                } catch (error) {
                    console.log('Image Picker Error: ', error);
                }
            });
    };

    const toggleMobileInputFocus = () => setMobileFocused(!mobileFocused);

    const mobileInputAccessoryViewID = 'mobileNumber';

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={onLeftPress}
                blackTitle
            />
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}
            >
                <View style={styles.profileImageOuterContainer}>
                    <View style={styles.profileImageInnerContainer}>
                        <Image
                            source={getProfileImagePath()}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.editPencil}
                            onPress={openActionSheet}
                        >
                            <Image source={icons.ic_edit_2} />
                        </TouchableOpacity>

                        <Text style={{ ...commonStyles.maxFileSizeLimit, textAlign: 'center' }}>
                            {strings.formatString(strings.maxFileSizeLimit, 5)}
                        </Text>
                    </View>
                </View>

                <TextInputWithLabel
                    label={strings.name}
                    ref={nameRef}
                    onSubmitEditing={onNameSubmit}
                    returnKeyType={'next'}
                    value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />

                <TextInputWithLabel
                    label={strings.email}
                    ref={emailRef}
                    returnKeyType={'next'}
                    onSubmitEditing={onEmailSubmit}
                    value={email}
                    keyboardType={'email-address'}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />

                <View style={styles.mobileNumberContainer}>
                    <Text
                        style={{
                            ...styles.label,
                            color: mobileFocused
                                ? commonColors().themeColor : colors.black5
                        }}
                    >
                        {strings.mobileNumber}
                    </Text>
                    <View
                        style={{
                            ...styles.mobileNumberSubContainer,
                            borderColor: mobileFocused
                                ? commonColors().themeColor : colors.black3
                        }}
                    >
                        <View style={styles.countryCodeContainer}>
                            <CountryPicker
                                withAlphaFilter
                                withCloseButton
                                withFilter
                                withCallingCode
                                withCallingCodeButton={countryCode}
                                countryCode={countryCode}
                                onSelect={onSelectCountry}
                            />
                            <View style={styles.absoluteView} />
                        </View>
                        <TextInputWithLabel
                            ref={mobileRef}
                            returnKeyType={'next'}
                            keyboardType={'number-pad'}
                            onSubmitEditing={onMobileSubmit}
                            value={mobile}
                            onChangeText={setMobile}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            disableBorder
                            containerStyle={styles.mobileInputContainer}
                            textInputContainer={{ marginTop: 0 }}
                            bottomBorderOnly
                            inputAccessoryViewID={mobileInputAccessoryViewID}
                            maxLength={12}
                            onFocus={toggleMobileInputFocus}
                            onBlur={toggleMobileInputFocus}
                        />
                    </View>
                </View>

                <TextInputWithLabel
                    label={strings.addDescription}
                    ref={descriptionRef}
                    value={description}
                    onChangeText={setDescription}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                    multiline
                    textInputStyle={styles.descriptionInput}
                    placeholder={strings.writeSomethingHere}
                />

                <Button
                    label={strings.save}
                    style={styles.saveButton}
                    onPress={onSubmit}
                />
            </KeyboardAwareScrollView>

            <KeyboardAccessoryView
                inputAccessoryViewID={mobileInputAccessoryViewID}
                onPress={onMobileSubmit}
                label={strings.next}
            />

            <Loader
                isLoading={props.loading}
                isAbsolute
            />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    profileImageOuterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(15)
    },
    profileImageInnerContainer: {
        height: moderateScale(150),
        width: moderateScale(150),
    },
    profileImage: {
        height: moderateScale(150),
        width: moderateScale(150),
        backgroundColor: colors.grey9,
        borderRadius: moderateScale(75)
    },
    editPencil: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    textInputContainer: {
        marginTop: moderateScale(15)
    },
    firstNameContainer: {
        flex: 1,
        marginRight: moderateScale(5)
    },
    contentContainerStyle: {
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(60),
        paddingTop: moderateScale(15)
    },
    saveButton: {
        marginTop: moderateScale(50)
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(50)
    },
    descriptionInput: {
        height: moderateScale(100),
        textAlignVertical: 'top',
        marginTop: moderateScale(20),
        borderBottomWidth: 0
    },
    mobileNumberContainer: {
        marginTop: moderateScale(15)
    },
    mobileNumberSubContainer: {
        flexDirection: 'row',
        borderBottomWidth: moderateScale(1),
        marginTop: moderateScale(2),
        paddingHorizontal: moderateScale(5),
        paddingVertical: moderateScale(1),
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mobileInputContainer: {
        flex: 1,
        marginLeft: moderateScale(0),
    },
    label: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.black5
    },
    absoluteView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent'
    }
});

const mapStateToProps = ({ lang, user }) => {
    const {
        name,
        email,
        profile_image,
        mobile,
        description,
        loading,
        user_country
    } = user;

    return {
        loading,
        selectedCountry: user_country || lang.selectedCountry,
        selectedLanguage: lang.selectedLanguage,
        name,
        email,
        profile_image,
        mobile,
        description
    };
};

export default connect(mapStateToProps, {
    editProfile
})(EditProfile_Yabalas);
