/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import dayjs from 'dayjs';
import CountryPicker from 'react-native-country-picker-modal';

import { Header, Button, fbLoginRequest, Loader } from '../../components/common';
import { icons, fonts } from '../../../assets';
import { layout } from '../../utilities/layout';
import {
    colors,
    screenNames,
    urls,
    appTypes,
    genderOptions,
    salaryExpectattions,
    PROVIDERS,
    commonColors,
    industryOptions,
    DATE_FORMAT,
    otpRequestType,
    countries
} from '../../utilities/constants';
import { navigate } from '../../utilities/NavigationService';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { getAppId } from '../../utilities/helperFunctions';
import { FieldCard } from '../../components/Profile/FieldCard';
import { DocumentCard } from '../../components/EditProfile_Professional';
import logger from '../../utilities/logger';
import {
    getUserProfile,
    connectFacebook,
    sendEmailVerificationLink
} from '../../store/actions';

class Profile extends PureComponent {
    state = {
        loading: false
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onSettingsPress = () => navigate(screenNames.Settings);
    onEditProfilePress = () => navigate(screenNames.EditProfile_Yabalas);
    onLoginPress = () => navigate(screenNames.Login, { hasComeFromMainApp: true });
    onEmailPress = () => {
        if (!this.props.email) {
            navigate(screenNames.ChangeEmail);
        }
    };
    onMobilePress = () => {
        if (!this.props.mobile || !this.props.calling_code) {
            navigate(screenNames.ChangePhoneNumber);
        }
    };

    onConnectToFbPress = async () => {
        try {
            const fbUserData = await fbLoginRequest();

            const data = {
                provider_id: fbUserData.id,
                provider: PROVIDERS.fb
            };

            this.props.connectFacebook({ data });
        } catch (error) {
            logger.error('FB login error: ', error);
        }
    };

    getProfileImageSource = () => {
        const { profile_image } = this.props;

        if (profile_image) {
            return {
                uri: urls.imagePath + profile_image
            };
        }

        if (getAppId() === appTypes.yabalash.id) {
            return icons.ic_profile_placeholder;
        }
        return icons.ic_edit_profile_shilenga;
    };

    openDocument = async () => {
        try {
            const { resume } = this.props;

            await Linking.openURL(urls.imagePath + resume);
        } catch (error) {
            logger.log('Open document error: ', error);
        }
    };

    renderOtherInfo = () => {
        const {
            dob, //date of birth
            clevel, //career level
            cposition, //current position
            gender,
            resume,
            rsize,
            salary,
            business,
            industry
        } = this.props;

        let industryName = '';

        const industryObj = industryOptions.find((i) => i.value == industry);

        if (industryObj) {
            industryName = industryObj.label;
        }

        if (business) {
            return (
                <FieldCard
                    label={strings.industry}
                    value={industryName}
                />
            );
        }

        let genderName = genderOptions[0].label;
        let salaryName = salaryExpectattions[0].label;
        let resumeView = null;

        const genderObj = genderOptions.find((g) => g.value == gender);
        const salaryObj = salaryExpectattions.find((s) => s.value == salary);

        if (genderObj) {
            genderName = genderObj.label;
        }

        if (salaryObj) {
            salaryName = salaryObj.label;
        }

        if (resume) {
            resumeView = (
                <>
                    <Text style={styles.yourCV}>
                        {strings.yourCV}
                    </Text>

                    <DocumentCard
                        resume={resume}
                        rsize={rsize}
                        onDocumentPress={this.openDocument}
                    />
                </>
            );
        }

        return (
            <>
                <FieldCard
                    label={strings.gender}
                    value={genderName}
                />

                <FieldCard
                    label={strings.dateOfBirth}
                    value={dob ? dayjs(parseInt(dob, 10)).format(DATE_FORMAT) : null}
                />

                <FieldCard
                    label={strings.careerLevel}
                    value={clevel}
                />

                <FieldCard
                    label={strings.currentPostition}
                    value={cposition}
                />

                <FieldCard
                    label={strings.salaryExpectation}
                    value={salaryName}
                />

                {resumeView}
            </>
        );
    };

    renderVerifyEmailButton = () => {
        const { email, verified } = this.props;

        if (!email || (email && verified)) {
            return null;
        }

        return (
            <TouchableOpacity
                style={styles.rightButton}
                activeOpacity={0.6}
                onPress={this.props.sendEmailVerificationLink}
            >
                <Text style={styles.rightButtonLabel}>
                    {strings.verify}
                </Text>
            </TouchableOpacity>
        );
    };

    renderVerifyMobileButton = () => {
        const { mobile, mverified, calling_code } = this.props;

        if (!mobile || !calling_code || (mobile && mverified)) {
            return null;
        }

        return (
            <TouchableOpacity
                style={styles.rightButton}
                activeOpacity={0.6}
                onPress={() => navigate(screenNames.MobileVerification, {
                    data: { callingCode: calling_code, mobile },
                    verificationType: otpRequestType.changePhoneNo,
                })}
            >
                <Text style={styles.rightButtonLabel}>
                    {strings.verify}
                </Text>
            </TouchableOpacity>
        );
    };

    renderFbVerifiedView = (provider) => {
        if (provider === PROVIDERS.fb) {
            return (
                <View style={styles.fbVerifiedContainer}>
                    <Text style={styles.facebook}>
                        {strings.facebook}
                    </Text>

                    <Image source={icons.ic_verified_blue} />
                </View>
            );
        }

        return (
            <TouchableOpacity
                label={'Connect to fb'}
                style={styles.fbButton}
                activeOpacity={0.6}
                onPress={this.onConnectToFbPress}
            >
                <Image source={icons.ic_facebook_logo} />
                <Text style={styles.connectToFacebook}>
                    {strings.connectToFacebook}
                </Text>
            </TouchableOpacity>
        );
    };

    renderMobileNumber = (mobile, calling_code) => {
        if (getAppId() === appTypes.yabalash.id && mobile) {
            return (
                <>
                    <Text style={styles.label}>
                        {strings.mobileNumber}
                    </Text>
                    <Text style={styles.emailAndPhone}>
                        {calling_code ? `+${calling_code} ${mobile}` : mobile}
                    </Text>
                </>
            );
        } else if (getAppId() === appTypes.shilengae.id && mobile && calling_code) {
            return `+${calling_code} ${mobile}`;
        }

        return null;
    };

    renderProfile = () => {
        const {
            id,
            name,
            first_name,
            last_name,
            email,
            user_country,
            pcode, //postal/zip code
            calling_code,
            mobile,
            provider,
            description,
            verified,
            mverified,
            business
        } = this.props;

        // console.log('user_country:', user_country)

        let fullname = name;
        let header = <View style={styles.header} />;

        let descriptionComponent = null;
        let emailComponent = null;
        let content = null;

        if (!business && getAppId() !== appTypes.yabalash.id) {
            fullname = `${first_name} ${last_name}`;
        }

        const profileImage = (
            <View style={styles.profileimageContainer}>
                <Image
                    source={this.getProfileImageSource()}
                    style={styles.profileImage}
                />
            </View>
        );

        if (description) {
            descriptionComponent = (
                <Text style={styles.bio}>
                    {description}
                </Text>
            );
        }

        if (email) {
            emailComponent = (
                <>
                    <Text style={styles.label}>
                        {strings.emailAddress}
                    </Text>
                    <Text style={styles.emailAndPhone}>
                        {email}
                    </Text>
                </>
            );
        }

        if (getAppId() === appTypes.yabalash.id && !id) {
            header = (
                <Header
                    containerStyle={styles.header}
                />
            );

            content = (
                <>
                    {profileImage}

                    <View
                        style={{
                            ...commonStyles.guestUserView,
                            marginTop: (layout.size.height * (1 / 5)) - 4,
                        }}
                    >
                        <Text style={commonStyles.guestUserMessage}>
                            {strings.formatString(strings.pleaseLoginFirst, strings.seeYourProfile)}
                        </Text>

                        <Button
                            onPress={this.onLoginPress}
                            label={strings.login}
                            style={{
                                ...commonStyles.loginButton,
                                marginHorizontal: 15
                            }}
                        />
                    </View>
                </>
            );
        } else if (getAppId() === appTypes.yabalash.id) {
            content = (
                <>
                    {profileImage}

                    <View style={styles.nameContainer}>
                        <Text
                            style={styles.username}
                            numberOfLines={1}
                        >
                            {fullname}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.editProfileButton}
                            onPress={this.onEditProfilePress}
                        >
                            <Image source={icons.ic_edit} />
                        </TouchableOpacity>
                    </View>

                    {descriptionComponent}

                    <Text style={styles.contactInfo}>
                        {strings.contactInfo}
                    </Text>

                    {emailComponent}

                    {this.renderMobileNumber(mobile, calling_code)}
                </>
            );

            header = (
                <Header
                    rightIconSource={icons.ic_settings}
                    onRightPress={this.onSettingsPress}
                    containerStyle={styles.header}
                />
            );
        } else {
            const renderHeaderCenterComponent = () => (
                <View style={styles.headerEditProfileButton}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                            ...commonStyles.headerButton,
                            alignItems: 'flex-end'
                        }}
                        onPress={() => navigate(screenNames.EditProfile_Shilenga)}
                    >
                        <Image source={icons.ic_edit_white} />
                    </TouchableOpacity>
                </View>
            );

            header = (
                <Header
                    rightIconSource={icons.ic_settings}
                    onRightPress={this.onSettingsPress}
                    renderCenterTitle={renderHeaderCenterComponent}
                    containerStyle={styles.header}
                />
            );

            content = (
                <>
                    <View style={styles.profileImageWrapper}>
                        {profileImage}
                    </View>

                    <View style={styles.basicInfoContainer}>
                        <Text
                            style={styles.username}
                            numberOfLines={1}
                        >
                            {fullname}
                        </Text>

                        {this.renderFbVerifiedView(provider)}

                        {/* <Text style={styles.verified}>
                            {strings.verified}
                        </Text> */}
                    </View>

                    <View style={styles.profileDetailsContainer}>
                        <FieldCard
                            label={strings.email}
                            value={email}
                            renderVerifiedBadge={!!email && verified}
                            marginTop={moderateScale(30)}
                            renderRightButton={this.renderVerifyEmailButton}
                            onPress={this.onEmailPress}
                        />

                        <FieldCard
                            label={strings.mobileNumber}
                            value={this.renderMobileNumber(mobile, calling_code)}
                            renderVerifiedBadge={!!mobile && !!calling_code && mverified}
                            onPress={this.onMobilePress}
                            renderRightButton={this.renderVerifyMobileButton}
                        />

                        {/* <FieldCard
                            label={strings.country}
                            value={getCountryName(user_country)}
                        /> */}

                        <View style={styles.countryContainer}>
                            <Text style={styles.label}>
                                {strings.country}
                            </Text>
                            <CountryPicker
                                withAlphaFilter
                                withCloseButton
                                withFilter
                                withCountryNameButton
                                countryCode={user_country
                                    ? user_country.toUpperCase()
                                    : countries[0].value}
                            />
                            <View style={styles.countryAbsoluteView} />
                        </View>

                        <FieldCard
                            label={strings.postalCode}
                            value={pcode}
                        />

                        {this.renderOtherInfo()}
                    </View>
                </>
            );
        }

        return (
            <>
                {header}
                {content}
            </>
        );
    };

    render() {
        const { gettingUserProfile, loading } = this.props;

        let gradientHeight = 140;

        if (!layout.isIOS) {
            gradientHeight += layout.statusBarHeight;
        }

        let gradientColors = { //for yabalash
            startColor: colors.olive2,
            endColor: colors.olive3
        };

        if (getAppId() === appTypes.shilengae.id) { //for shilengae
            gradientColors = {
                startColor: colors.red2,
                endColor: colors.red1
            };
        } else if (getAppId() === appTypes.beault.id) {
            gradientColors = {
                startColor: colors.pink2,
                endColor: colors.pink3
            };
        }

        return (
            <SafeAreaView style={styles.wrapper}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={gettingUserProfile}
                            onRefresh={this.props.getUserProfile}
                            colors={[commonColors().themeColor]}
                            tintColor={commonColors().themeColor}
                        />
                    }
                >
                    <View style={styles.gradientContainer}>
                        <Svg height={gradientHeight} width={layout.size.width}>
                            <Defs>
                                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor={gradientColors.startColor} stopOpacity="0.8" />
                                    <Stop offset="100%" stopColor={gradientColors.endColor} stopOpacity="1" />
                                </LinearGradient>
                            </Defs>
                            <Rect
                                x={'0'}
                                y={'0'}
                                width={layout.size.width}
                                height={gradientHeight}
                                fill={'url(#grad)'}
                            />
                        </Svg>
                    </View>

                    {this.renderProfile()}
                </ScrollView>

                <Loader isAbsolute isLoading={loading} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: commonColors().themeColor
    },
    container: {
        flex: 1,
        backgroundColor: colors.white1
    },
    contentContainerStyle: {
        paddingBottom: moderateScale(60),
        paddingHorizontal: moderateScale(15),
    },
    header: {
        right: -15,
        marginTop: layout.paddingTop
    },
    gradientContainer: {
        position: 'absolute'
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: moderateScale(20),
    },
    profileImageWrapper: {
        alignItems: 'center'
    },
    profileimageContainer: {
        height: 130,
        width: 130,
        backgroundColor: colors.grey9,
        borderRadius: 70,
        marginTop: 15,
        borderWidth: 3,
        borderColor: colors.white1,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage: {
        height: 125,
        width: 125,
    },
    username: {
        fontSize: moderateScale(16),
        flex: 1,
        fontFamily: fonts.semiBold
    },
    bio: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular
    },
    contactInfo: {
        marginTop: moderateScale(25),
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    },
    label: {
        marginTop: moderateScale(15),
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey5
    },
    emailAndPhone: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
    },
    editProfileButton: {
        paddingVertical: moderateScale(10),
        paddingLeft: moderateScale(5)
    },
    basicInfoContainer: {
        alignItems: 'center',
        marginTop: moderateScale(15)
    },
    fbVerifiedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(5)
    },
    facebook: {
        fontFamily: fonts.regular,
        color: colors.blue1,
        fontSize: moderateScale(14),
        marginRight: moderateScale(4)
    },
    verified: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(12),
        color: colors.red1,
        marginTop: moderateScale(2)
    },
    profileDetailsContainer: {
        marginTop: moderateScale(15)
    },
    yourCV: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        marginTop: moderateScale(12),
        marginBottom: moderateScale(5)
    },
    headerEditProfileButton: {
        flex: 1,
        alignItems: 'flex-end'
    },
    fbButton: {
        height: moderateScale(40),
        backgroundColor: colors.blue1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(10)
    },
    connectToFacebook: {
        color: colors.white1,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        marginLeft: moderateScale(15)
    },
    rightButton: {
        alignSelf: 'center',
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
        backgroundColor: colors.green2,
        borderRadius: moderateScale(5)
    },
    rightButtonLabel: {
        color: colors.white1,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular
    },
    countryContainer: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey12,
        paddingBottom: moderateScale(5)
    },
    countryAbsoluteView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent'
    }
});

const mapStateToProps = ({ user, lang }) => {
    const {
        id,
        name,
        first_name,
        last_name,
        profile_image,
        email,
        dob, //date of birth
        clevel, //career level
        user_country,
        cposition, //current position
        gender,
        pcode, //postal/zip code
        resume,
        rsize,
        salary,
        industry,

        business,
        calling_code,
        mobile,
        description,
        provider_id,
        provider,
        verified,
        mverified,
        gettingUserProfile,
        loading
    } = user;

    return {
        id,
        email,
        name,
        first_name,
        last_name,
        business,
        profile_image,
        calling_code,
        mobile,
        description,
        selectedCountry: lang.selectedCountry,
        dob, //date of birth
        clevel, //career level
        user_country,
        cposition, //current position
        gender,
        pcode, //postal/zip code
        resume,
        rsize,
        salary,
        provider_id,
        provider,
        verified,
        mverified,
        gettingUserProfile,
        selectedLanguage: lang.selectedLanguage,
        industry,
        loading
    };
};

export default connect(mapStateToProps, {
    getUserProfile,
    connectFacebook,
    sendEmailVerificationLink
})(Profile);
