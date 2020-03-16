import React, { PureComponent } from 'react';
import {
    View,
    Platform,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    BackHandler,
    Switch
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker from 'react-native-country-picker-modal';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import RNPickerSelect from 'react-native-picker-select';
import DocumentPicker from 'react-native-document-picker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
    KeyboardAccessoryView,
    Button,
    TextInputWithLabel,
    Header,
    Wrapper,
    pickerProps,
    Loader,
    CustomDatePicker,
} from '../../components/common';
import { strings } from '../../localization';
import {
    colors,
    appTypes,
    urls,
    actionsheetImagePickerButtonsiOS,
    actionsheetImagePickerButtonsAndroid,
    countries,
    genderOptions,
    salaryExpectattions,
    DATE_FORMAT,
    MIME_TYPE,
    MIN_DATE,
    maxFileSize,
    industryOptions,
    commonColors
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { getAppId, requestCameraPermission, showErrorAlert } from '../../utilities/helperFunctions';
import { DatePicker } from '../../components/AddPost/DatePicker';
import { DocumentCard } from '../../components/EditProfile_Professional';
import logger from '../../utilities/logger';
import { editProfile, removeResume } from '../../store/actions';
import { layout } from '../../utilities/layout';
import commonStyles from '../../utilities/commonStyles';

dayjs.extend(customParseFormat);

class EditProfile_Shilenga extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            first_name: props.first_name,
            last_name: props.last_name,
            selectedCountry: props.selectedCountry,
            profile_image: props.profile_image
                ? urls.imagePath + props.profile_image : null,
            mobileFocused: false,
            dob: props.dob ? parseInt(props.dob, 10) : null,
            clevel: props.clevel, //career level
            user_country: props.user_country
                ? props.user_country.toUpperCase()
                : countries[0].value,
            cposition: props.cposition, //current position
            gender: props.gender,
            pcode: props.pcode, //postal/zip code
            resume: props.resume,
            salary: props.salary,
            rsize: props.rsize,
            resumeUri: null,
            resumeName: '',
            industry: props.industry,
            showname: !!props.showname
        };

        this.lastNameRef = React.createRef();
        this.pCodeRef = React.createRef();
        this.cLevel = React.createRef();
        this.cPosition = React.createRef();
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content');

        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    onGoBackPress = () => {
        Alert.alert(
            strings.goBack,
            strings.areYouSureYouWantToGoBack,
            [
                {
                    text: strings.cancel,
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: strings.goBack, onPress: () => goBack() },
            ],
            { cancelable: false },
        );
    };

    onSubmitFirstname = () => this.lastNameRef.current.focus();
    onSubmitLastname = () => this.pCodeRef.current.focus();
    onNameSubmit = () => this.pCodeRef.current.focus();
    onPcodeSubmit = () => {
        if (!this.props.business) {
            return this.cLevel.current.focus();
        }

        return;
    };
    onClevelSubmit = () => this.cPosition.current.focus();
    onChangeShowName = (showname) => this.setState({ showname });

    onSubmit = () => {
        const { business } = this.props;
        const {
            name,
            first_name,
            last_name,
            dob,
            clevel,
            user_country,
            cposition,
            gender,
            pcode,
            salary,
            profile_image,
            resumeUri,
            resumeName,
            industry,
            showname
        } = this.state;

        if (!name && business) {
            return showErrorAlert(strings.nameRequired);
        } else if (!first_name && !business) {
            return showErrorAlert(strings.firstNameRequired);
        } else if (!last_name && !business) {
            return showErrorAlert(strings.lastNameRequired);
        } else if (!user_country) {
            return showErrorAlert(strings.countryRequired);
        }

        const data = new FormData();

        if (!business) {
            data.append('first_name', first_name);
            data.append('last_name', last_name);
        } else {
            data.append('name', name);
        }

        data.append('user_country', user_country);
        data.append('showname', showname ? 1 : 0);

        if (dob) {
            data.append('dob', dob);
        }

        if (clevel) {
            data.append('clevel', clevel);
        }

        if (cposition) {
            data.append('cposition', cposition);
        }

        if (gender) {
            data.append('gender', gender);
        }

        if (pcode) {
            data.append('pcode', pcode);
        }

        if (salary) {
            data.append('salary', salary);
        }

        if (industry) {
            data.append('industry', industry);
        }

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

        if (resumeUri) {
            data.append('resume', {
                uri: resumeUri,
                name: resumeName,
                type: MIME_TYPE.formData
            });
        }

        this.props.editProfile({ data });
    };

    onUploadDocumentPress = async () => {
        try {
            const res = await DocumentPicker.pick({
                // type: [DocumentPicker.types.pdf],
            });

            logger.log('picked document is: ', res);

            if (res.size > maxFileSize) {
                return showErrorAlert(strings.formatString(strings.maxFileSizeLimitAlert, 5), {
                    duration: 5000
                });
            }

            this.setState({
                resumeUri: res.uri,
                resume: res.name,
                rsize: res.size,
                resumeName: res.name
            });
        } catch (error) {
            console.log('document picker error: ', error);
            if (DocumentPicker.isCancel(error)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            }
        }
    };

    onRemoveResumePress = () => {
        Alert.alert(
            strings.removeResume,
            strings.areYouSureYouWantToRemoveResume,
            [
                {
                    text: strings.cancel,
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: strings.remove, onPress: () => this.removeResume() },
            ],
            { cancelable: false },
        );
    };

    onDOBSelect = (dob) => this.updateState('dob')(dayjs(dob).valueOf());
    onUserCountrySelect = (countryData) => {
        this.updateState('user_country')(countryData.cca2);
    };

    getProfileImagePath = () => {
        const { profile_image } = this.state;

        if (profile_image) {
            return {
                uri: profile_image
            };
        }

        if (getAppId() === appTypes.yabalash.id) {
            return icons.ic_edit_profile;
        }

        return icons.ic_edit_profile_shilenga;
    };

    handleBackButtonPressAndroid = () => {
        if (!this.props.navigation.isFocused()) {
            // The screen is not focused, so don't do anything
            return false;
        } else if (this.props.navigation.isFocused()) {
            this.onGoBackPress();

            // We have handled the back button
            // Return `true` to prevent react-navigation from handling it
            return true;
        }

        return false;
    };

    removeResume = () => {
        this.props.removeResume({
            cb: () => {
                this.setState({
                    resumeUri: null,
                    resume: null,
                    rsize: null
                });
            }
        });
    };

    updateState = (key) => (value) => {
        const state = { ...this.state };
        state[key] = value;

        this.setState(state);
    };

    openActionSheet = () => {
        const CANCEL_INDEX = 2;
        ActionSheet.showActionSheetWithOptions({
            options: (Platform.OS === 'ios')
                ? actionsheetImagePickerButtonsiOS : actionsheetImagePickerButtonsAndroid,
            cancelButtonIndex: CANCEL_INDEX,
            title: strings.chooseImagesFrom
        },
            async (buttonIndex) => {
                try {
                    if (buttonIndex === 0 || buttonIndex === 1) {
                        await requestCameraPermission();
                    }

                    const imagePickerOptions = {
                        compressImageQuality: 0.2,
                        mediaType: 'photo',
                        cropping: false
                    };

                    switch (buttonIndex) {
                        case 0: {
                            imagePickerOptions.compressImageQuality = 0.2;

                            const pickedImage = await ImagePicker.openCamera(imagePickerOptions);

                            // console.log('picked Image is: ', pickedImage);

                            this.updateState('profile_image')(pickedImage.path);
                            break;
                        }
                        case 1: {
                            const pickedImage = await ImagePicker.openPicker(imagePickerOptions);

                            // logger.log('picked Image is: ', pickedImage);

                            if (pickedImage.size > maxFileSize) {
                                return showErrorAlert(strings.formatString(strings.maxFileSizeLimitAlert, 5), {
                                    duration: 5000
                                });
                            }

                            this.updateState('profile_image')(pickedImage.path);
                            break;
                        }
                        default:
                            break;
                    }
                } catch (error) {
                    logger.error('Image Picker Error: ', error);
                }
            });
    };

    toggleMobileInputFocus = () => this.updateState('mobileFocused')(!this.state.mobileFocused);

    renderUploadedDocuments = () => {
        const { resume, rsize } = this.state;

        if (resume) {
            return (
                <>
                    <Text style={styles.uploadedResumes}>
                        {strings.uploadedResumes}
                    </Text>

                    <DocumentCard
                        key={resume}
                        resume={resume}
                        rsize={rsize}
                        renderRemoveButton
                        onRemovePress={this.onRemoveResumePress}
                    />
                </>
            );
        }

        return null;
    };

    renderOtherInfo = () => {
        const {
            dob, //date of birth
            clevel, //career level
            cposition, //current position
            gender,
            resume,
            salary,
            industry
        } = this.state;

        if (this.props.business) {
            return (
                <>
                    <View style={styles.pickerOuterContainer}>
                        <Text style={styles.label}>
                            {strings.industry}
                        </Text>
                        <RNPickerSelect
                            onValueChange={this.updateState('industry')}
                            value={industry}
                            items={industryOptions}
                            placeholder={{}}
                            {...pickerProps}
                        />
                    </View>
                </>
            );
        }

        return (
            <>
                <View style={styles.pickerOuterContainer}>
                    <Text style={styles.label}>
                        {strings.gender}
                    </Text>
                    <RNPickerSelect
                        onValueChange={this.updateState('gender')}
                        value={gender}
                        items={genderOptions}
                        placeholder={{}}
                        {...pickerProps}
                    />
                </View>

                <View style={styles.pickerOuterContainer}>
                    <Text style={styles.label}>
                        {strings.dateOfBirth}
                    </Text>
                    {/* <DatePicker
                        containerStyle={styles.datePicker}
                        onDateSelect={this.onDOBSelect}
                        value={dob}
                        dateStyle={styles.date}
                        datePickerProps={{
                            maximumDate: dayjs().subtract(10, 'year').toDate(),
                            minimumDate: dayjs(MIN_DATE, DATE_FORMAT).toDate()
                        }}
                    /> */}

                    <CustomDatePicker
                        onDateSelect={this.onDOBSelect}
                        value={dob}
                        datePickerProps={{
                            maximumDate: dayjs().subtract(10, 'year').toDate(),
                            minimumDate: dayjs(MIN_DATE, DATE_FORMAT).toDate()
                        }}
                        dateStyle={styles.date}
                    />
                </View>

                <TextInputWithLabel
                    label={strings.careerLevel}
                    ref={this.cLevel}
                    onSubmitEditing={this.onClevelSubmit}
                    returnKeyType={'next'}
                    value={clevel}
                    onChangeText={this.updateState('clevel')}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                />

                <TextInputWithLabel
                    label={strings.currentPostition}
                    ref={this.cPosition}
                    returnKeyType={'done'}
                    value={cposition}
                    onChangeText={this.updateState('cposition')}
                    containerStyle={styles.textInputContainer}
                    bottomBorderOnly
                    blurOnSubmit
                />

                <View style={styles.pickerOuterContainer}>
                    <Text style={styles.label}>
                        {strings.salaryExpectation}
                    </Text>
                    <RNPickerSelect
                        onValueChange={this.updateState('salary')}
                        value={parseInt(salary, 10)}
                        items={salaryExpectattions}
                        placeholder={{}}
                        {...pickerProps}
                    />
                </View>

                {!resume ?
                    <>
                        <Text style={styles.uploadResume}>
                            {strings.uploadResume}
                        </Text>

                        <Text style={commonStyles.maxFileSizeLimit}>
                            {strings.formatString(strings.maxFileSizeLimit, 5)}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.uploadDocButton}
                            onPress={this.onUploadDocumentPress}
                        >
                            <Image
                                source={icons.ic_ad_plus}
                                style={styles.addIcon}
                            />
                            <Text style={styles.uploadDocument}>
                                {strings.uploadDocument}
                            </Text>
                        </TouchableOpacity>
                    </>
                    : null
                }

                {this.renderUploadedDocuments()}
            </>
        );
    };

    renderNameInputs = () => {
        const { first_name, last_name, name } = this.state;

        if (!this.props.business) {
            return (
                <>
                    <TextInputWithLabel
                        label={strings.firstName}
                        value={first_name}
                        onChangeText={this.updateState('first_name')}
                        containerStyle={styles.name}
                        onSubmitEditing={this.onSubmitFirstname}
                        returnKeyType={'next'}
                        bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                    />

                    <TextInputWithLabel
                        ref={this.lastNameRef}
                        label={strings.lastName}
                        value={last_name}
                        onChangeText={this.updateState('last_name')}
                        containerStyle={styles.textInputContainer}
                        onSubmitEditing={this.onSubmitLastname}
                        returnKeyType={'next'}
                        bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
                    />
                </>
            );
        }

        return (
            <TextInputWithLabel
                label={strings.name}
                value={name}
                onChangeText={this.updateState('name')}
                containerStyle={styles.name}
                onSubmitEditing={this.onSubmitLastname}
                returnKeyType={'next'}
                bottomBorderOnly={getAppId() !== appTypes.yabalash.id}
            />
        );
    };

    render() {
        const inputAccessoryViewID = 'postalCode';
        const { user_country, pcode, showname } = this.state;

        return (
            <Wrapper wrapperStyle={styles.wrapperStyle}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onGoBackPress}
                    blackTitle
                />

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    <View style={styles.profileImageOuterContainer}>
                        <View style={styles.profileImageInnerContainer}>
                            <Image
                                source={this.getProfileImagePath()}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.editPencil}
                                onPress={this.openActionSheet}
                            >
                                <Image source={icons.ic_edit_2} />
                            </TouchableOpacity>

                            <Text style={{ ...commonStyles.maxFileSizeLimit, textAlign: 'center' }}>
                                {strings.formatString(strings.maxFileSizeLimit, 5)}
                            </Text>
                        </View>
                    </View>

                    {/* <TextInputWithLabel
                        label={strings.name}
                        onSubmitEditing={this.onNameSubmit}
                        returnKeyType={'next'}
                        value={name}
                        onChangeText={this.updateState('name')}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        containerStyle={styles.textInputContainer}
                        bottomBorderOnly
                    /> */}

                    {this.renderNameInputs()}

                    <View style={styles.pickerOuterContainer}>
                        <Text style={styles.label}>
                            {strings.country}
                        </Text>

                        {/* <RNPickerSelect
                            onValueChange={this.updateState('user_country')}
                            value={user_country}
                            items={countries}
                            placeholder={{}}
                            {...pickerProps}
                        /> */}

                        <CountryPicker
                            withAlphaFilter
                            withCloseButton
                            withFilter
                            withCountryNameButton
                            // withCallingCodeButton={values.userCountryCode}
                            countryCode={user_country}
                            onSelect={this.onUserCountrySelect}
                            containerButtonStyle={styles.countryPickerContainer}
                        />
                    </View>

                    <TextInputWithLabel
                        label={strings.postalCode}
                        ref={this.pCodeRef}
                        onSubmitEditing={this.onPcodeSubmit}
                        returnKeyType={this.props.business ? 'done' : 'next'}
                        keyboardType={'numeric'}
                        value={pcode}
                        onChangeText={this.updateState('pcode')}
                        containerStyle={styles.textInputContainer}
                        inputAccessoryViewID={inputAccessoryViewID}
                        bottomBorderOnly
                        blurOnSubmit={!!this.props.business}
                    />

                    {this.renderOtherInfo()}

                    <View style={styles.notificationContainer}>
                        <Text style={styles.label}>
                            Show Name on ads
                        </Text>

                        <Switch
                            value={showname}
                            onValueChange={this.onChangeShowName}
                            style={commonStyles.switch}
                            trackColor={{ true: commonColors().themeColor }}
                            thumbColor={Platform.select({ android: colors.white1 })}
                        />
                    </View>

                    <Button
                        label={strings.save}
                        style={styles.saveButton}
                        onPress={this.onSubmit}
                    />
                </KeyboardAwareScrollView>

                <KeyboardAccessoryView
                    inputAccessoryViewID={inputAccessoryViewID}
                    onPress={this.onPcodeSubmit}
                    label={strings.next}
                />

                <Loader isLoading={this.props.loading} isAbsolute />
            </Wrapper>
        );
    }
}

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
        right: 0,
    },
    textInputContainer: {
        marginTop: moderateScale(15)
    },
    contentContainerStyle: {
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(60),
        paddingTop: moderateScale(15)
    },
    saveButton: {
        marginTop: moderateScale(50)
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.black5
    },
    pickerOuterContainer: {
        marginTop: moderateScale(15),
        borderBottomWidth: moderateScale(1),
        borderColor: colors.black3
    },
    datePicker: {
        borderWidth: 0,
        marginTop: 0
    },
    date: {
        fontSize: moderateScale(16),
    },
    uploadResume: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        marginTop: moderateScale(12)
    },
    uploadDocButton: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(8),
        borderColor: colors.grey3,
        borderWidth: moderateScale(1),
        marginTop: moderateScale(15),
        flexDirection: 'row'
    },
    uploadDocument: {
        fontSize: moderateScale(16),
        color: colors.grey3,
        fontFamily: fonts.regular
    },
    addIcon: {
        tintColor: colors.grey3,
        marginRight: moderateScale(5)
    },
    uploadedResumes: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        marginTop: moderateScale(15),
        color: colors.black5
    },
    notificationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: moderateScale(50)
    },
    name: { marginTop: moderateScale(40) },
    countryPickerContainer: {
        paddingVertical: moderateScale(10)
    }
});

const mapStateToProps = ({ lang, user }) => {
    const {
        name,
        first_name,
        last_name,
        profile_image,
        dob, //date of birth
        clevel, //career level
        user_country,
        cposition, //current position
        gender,
        pcode, //postal/zip code
        resume,
        rsize,
        salary,
        loading,
        business,
        industry,
        showname
    } = user;

    return {
        loading,
        selectedCountry: lang.selectedCountry,
        selectedLanguage: lang.selectedLanguage,
        name,
        first_name,
        last_name,
        profile_image,
        dob, //date of birth
        clevel, //career level
        user_country,
        cposition, //current position
        gender,
        pcode, //postal/zip code
        resume,
        rsize,
        salary,
        business,
        industry,
        showname
    };
};

export default connect(mapStateToProps, {
    editProfile,
    removeResume
})(EditProfile_Shilenga);
