import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    Alert,
    BackHandler
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import { withNavigationFocus } from 'react-navigation';

import {
    Wrapper,
    Header,
    Button,
    Loader,
    pickerProps,
    CustomDatePicker
} from '../../components/common';
import {
    colors,
    screenNames,
    FILED_TYPES,
    appTypes,
    commonColors
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack, navigate } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import commonStyles from '../../utilities/commonStyles';
import {
    CustomTextInput,
    PickImages,
    PriceType,
    /* ChooseLocation, */
    StateAndCityPicker,
    DatePicker,
    RadioButton,
    MultiSelectOptions
} from '../../components/AddPost';
import { showErrorAlert, getAppId } from '../../utilities/helperFunctions';
import { getStatesAndFormData } from '../../store/actions';
import logger from '../../utilities/logger';

class AddPost extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stateAndCities: {},
            loading: true,
            formFields: [],
            formId: null,
            errored: false
        };

        this.statesRef = React.createRef();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.getStatesCitiesAndForm();

        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    componentWillUnmount() {
        this._navListener.remove();

        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    onContinuePress = (v) => {
        const values = { ...v };

        const selectedStateAndCity = this.statesRef.current.getSelectedStateAndCity();

        if (!selectedStateAndCity.pickedState) {
            return showErrorAlert(strings.pleasePickAState);
        } else if (!selectedStateAndCity.pickedCity) {
            return showErrorAlert(strings.pleasePickACity);
        }

        const tempParameters = [...this.state.formFields];

        tempParameters.forEach((param) => {
            let value = values[param.field_name];

            switch (param.field_type) { //to remove white1 spaces form the value
                case FILED_TYPES.simple_text:
                case FILED_TYPES.multiline_text:
                    value = value.trim();
                    break;
                case FILED_TYPES.price:
                    value.price = value.price.trim();
                    break;
                default:
                    break;
            }

            param.value = value;
        });

        const category = this.props.navigation.getParam('category', {});
        const subCategory = this.props.navigation.getParam('subCategory', {});
        const postAdScreenKey = this.props.navigation.getParam('postAdScreenKey', null);
        const superParentCategoryId = this.props.navigation.getParam('superParentCategoryId', 0);

        const { stateAndCities } = this.state;

        let cityName = '';

        Object.keys(stateAndCities).forEach((states) => {
            stateAndCities[states].forEach((city) => {
                if (city.value === selectedStateAndCity.pickedCity) {
                    cityName = city.label;
                }
            });
        });

        const adData = {
            category,
            subCategory,
            parameters: tempParameters,
            selectedStateAndCity,
            formId: this.state.formId,
            cityName,
            superParentCategoryId,
            appCountry: this.props.app_country
        };

        navigate(screenNames.ReviewPost, {
            adData,
            postAdScreenKey
        });
    };

    onGoBackPress = () => {
        if (this.state.errored) {
            return goBack();
        }

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

    getStatesCitiesAndForm = async () => {
        const { isFocused } = this.props;
        const category = this.props.navigation.getParam('category', {});

        this.props.getStatesAndFormData({
            categoryId: category.id,
            cb: (error, response) => {
                if (error) {
                    logger.error('getStatesAndFormData error', error);
                    /* goBack(this.props.navigation.state.key);
                    return showErrorAlert(error); */

                    if (isFocused) {
                        return this.setState({ errored: true, loading: false });
                    }

                    return;
                }

                // logger.log('response.formData.formFields: ', response.formData.formFields);

                if (isFocused) {
                    return this.setState({
                        loading: false,
                        stateAndCities: response.statesData || {},
                        formFields: response.formData.formFields,
                        formId: response.formData.formId
                    });
                }
            }
        });
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

    render() {
        const { loading, formFields, errored } = this.state;

        const category = this.props.navigation.getParam('category', {});

        let content = null;

        let title;

        if (loading) {
            content = <Loader isLoading />;
        } else if (errored) {
            title = strings.noDataFound;

            content = (
                <View style={styles.noDataFoundContainer}>
                    <Image source={icons.ic_no_data_found} />
                </View>
            );
        } else {
            let formTitleView = null;

            if (getAppId() === appTypes.yabalash.id) {
                title = strings.addSomeDetails;
            } else {
                title = category.name;

                formTitleView = (
                    <>
                        <Text style={styles.almostThere}>
                            {strings.almostThere}
                        </Text>
                        <Text style={styles.theExcellenceIn}>
                            {strings.theExcellenceIn}
                        </Text>
                    </>
                );
            }


            const initialValues = {};
            const validationSchema = {};

            formFields.forEach((param) => {
                initialValues[param.field_name] = param.value;
                validationSchema[param.field_name] = param.validation;
            });

            content = (
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    {formTitleView}

                    <Formik
                        initialValues={{ ...initialValues }}
                        onSubmit={this.onContinuePress}
                        validationSchema={yup.object().shape(validationSchema)}
                        validateOnBlur={false}
                        validateOnChange={false}
                    >
                        {({
                            values,
                            handleSubmit,
                            handleChange,
                            isSubmitting,
                            isValidating,
                            validateForm
                        }) => {
                            const onSubmit = async () => {
                                const validationErrors = await validateForm();
                                if (
                                    !isSubmitting
                                    && !isValidating
                                    && Object.keys(validationErrors).length > 0
                                ) {
                                    let error = validationErrors[Object.keys(validationErrors)[0]]; //to get first error

                                    if (typeof error === 'object') { //to extract error from an object
                                        error = error[Object.keys(error)[0]];
                                    }

                                    showErrorAlert(error);
                                } else {
                                    handleSubmit();
                                }
                            };

                            return (
                                <>
                                    {
                                        formFields.map((parameter) => {
                                            switch (parameter.field_type) {
                                                case FILED_TYPES.simple_text: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>
                                                            <CustomTextInput
                                                                value={values[parameter.field_name]}
                                                                onChangeText={handleChange(parameter.field_name)}
                                                                placeholder={parameter.placeholder}
                                                                returnKeyType={'done'}
                                                            />
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.multiline_text: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>
                                                            <CustomTextInput
                                                                value={values[parameter.field_name]}
                                                                onChangeText={handleChange(parameter.field_name)}
                                                                style={styles.descriptionInput}
                                                                placeholder={parameter.placeholder}
                                                                multiline
                                                            />
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.picture: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>
                                                            <Text style={styles.maxUploadText}>
                                                                {strings.formatString(
                                                                    strings.maxPhotoLimit,
                                                                    parameter.max_count
                                                                )}
                                                            </Text>

                                                            <Text style={commonStyles.maxFileSizeLimit}>
                                                                {strings.formatString(strings.maxFileSizeLimit, 5)}
                                                            </Text>
                                                            <PickImages
                                                                max_count={parameter.max_count}
                                                                onImageSelect={handleChange(parameter.field_name)}
                                                                selectedImages={values[parameter.field_name]}
                                                            />
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.price: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>

                                                            {getAppId() === appTypes.yabalash.id ?
                                                                <Text style={styles.subLabel}>
                                                                    {strings.whatTypeOfPrice}
                                                                </Text>
                                                                : null
                                                            }

                                                            <PriceType
                                                                onPriceAndPriceTypeChange={handleChange(parameter.field_name)}
                                                                priceObj={values[parameter.field_name]}
                                                            />
                                                        </View>
                                                    );
                                                }
                                                /* case 'location': {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>
                                                            <ChooseLocation
                                                                selectedLocation={values[parameter.field_name]}
                                                                updateAddress={handleChange(parameter.field_name)}
                                                            />
                                                        </View>
                                                    );
                                                } */
                                                case FILED_TYPES.date: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>

                                                            {/* <DatePicker
                                                                onDateSelect={handleChange(parameter.field_name)}
                                                                value={values[parameter.field_name]}
                                                            /> */}

                                                            <CustomDatePicker
                                                                onDateSelect={handleChange(parameter.field_name)}
                                                                value={values[parameter.field_name]}
                                                            />
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.picker: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>

                                                            <View style={styles.pickerOuterContainer}>
                                                                <RNPickerSelect
                                                                    onValueChange={handleChange(parameter.field_name)}
                                                                    value={values[parameter.field_name]}
                                                                    items={parameter.options}
                                                                    placeholder={{}}
                                                                    {...pickerProps}
                                                                />
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.radio_button: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>

                                                            <View style={styles.radioPickerOuterContainer}>
                                                                <RadioButton
                                                                    onSelect={handleChange(parameter.field_name)}
                                                                    selectedValue={values[parameter.field_name]}
                                                                    options={parameter.options}
                                                                />
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                                case FILED_TYPES.multi_select_option: {
                                                    return (
                                                        <View key={parameter.id}>
                                                            <Text style={styles.label}>
                                                                {parameter.title}
                                                            </Text>

                                                            <View style={styles.multipickerOuterContainer}>
                                                                <MultiSelectOptions
                                                                    onSelect={handleChange(parameter.field_name)}
                                                                    selectedOptions={values[parameter.field_name]}
                                                                    options={parameter.options}
                                                                />
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                                default:
                                                    return null;
                                            }
                                        })
                                    }

                                    <StateAndCityPicker
                                        ref={this.statesRef}
                                        stateAndCities={this.state.stateAndCities}
                                    />

                                    <Button
                                        label={strings.continue}
                                        style={styles.button}
                                        onPress={onSubmit}
                                    />
                                </>
                            );
                        }}
                    </Formik>
                </KeyboardAwareScrollView>
            );
        }

        return (
            <Wrapper wrapperStyle={styles.wrapperStyle}>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onGoBackPress}
                    showBottomBorder
                    title={title}
                    blackTitle
                    titlePosition={'left'}
                />

                {content}
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    container: {
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: moderateScale(60),
        paddingHorizontal: 15,
    },
    label: {
        marginTop: moderateScale(25),
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    subLabel: {
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
        color: colors.grey5,
        marginTop: moderateScale(2)
    },
    addTitleInput: {
        fontSize: 14,
        fontFamily: fonts.regular,
        backgroundColor: colors.white1,
        padding: moderateScale(20),
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        ...commonStyles.shadow
    },
    descriptionInput: {
        height: moderateScale(120)
    },
    maxUploadText: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
        color: colors.grey5
    },
    button: {
        marginTop: moderateScale(50)
    },
    pickerOuterContainer: {
        backgroundColor: colors.white1,
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3
    },
    multipickerOuterContainer: {
        backgroundColor: colors.white1,
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3,
        paddingHorizontal: moderateScale(10),
        paddingBottom: moderateScale(10),
        paddingVertical: moderateScale(2)
    },
    radioPickerOuterContainer: {
        backgroundColor: colors.white1,
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4)
    },
    noDataFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    almostThere: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold,
        color: commonColors().themeColor,
        marginTop: moderateScale(20)
    },
    theExcellenceIn: {
        fontSize: moderateScale(14),
        color: colors.grey8,
        fontFamily: fonts.regular,
        marginTop: moderateScale(10)
    }
});

const mapStateToProps = ({ lang, user }) => ({
    selectedLanguage: lang.selectedLanguage,
    app_country: user.app_country
});

export default connect(mapStateToProps, {
    getStatesAndFormData
})(withNavigationFocus(AddPost));
