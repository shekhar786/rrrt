import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import { withNavigationFocus } from 'react-navigation';
import uuid from 'uuid';
import cloneDeep from 'clone-deep';

import { Wrapper, Header, Button, Loader, pickerProps } from '../../components/common';
import { colors, FILED_TYPES, appTypes, urls } from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';
import { strings } from '../../localization';
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
import { getStatesAndCities, editPost } from '../../store/actions';
import logger from '../../utilities/logger';

class EditPost extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stateAndCities: {},
            loading: true,
            formFields: [],
            errored: false,
            selectedState: null,
            selectedCity: null,
            editingPost: false
        };

        this.statesRef = React.createRef();
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });

        this.getStatesAndCities();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    onLeftPress = () => goBack();

    onContinuePress = (v) => {
        this.setState({ editingPost: true });

        const values = cloneDeep(v);

        logger.log('values are: ', values);

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

        const adData = this.props.navigation.getParam('adData', {});

        const updatedAdData = {
            post_id: adData.id,
            parameters: tempParameters,
            selectedStateAndCity,
        };

        logger.log('updated adData: ', updatedAdData);

        this.props.editPost({
            updatedAdData,
            cb: (error) => {
                if (error) {
                    return this.setState({ editingPost: false });
                }

                return this.props.navigation.popToTop();
            }
        });
    };

    getStatesAndCities = async () => {
        const { isFocused } = this.props;

        const cb = (error, stateAndCities) => {
            if (error) {
                showErrorAlert(error);

                if (isFocused) {
                    this.setState({ errored: true, loading: false });
                }

                return;
            }

            this.setFormFields(stateAndCities);
        };

        this.props.getStatesAndCities({ cb });
    };

    setFormFields = (stateAndCities) => {
        const { isFocused, navigation } = this.props;
        const adData = navigation.getParam('adData', {});

        logger.log('adData: ', adData);

        const selectedState = Object.keys(stateAndCities).find((state) => state.toLocaleLowerCase() === adData.city.state.toLocaleLowerCase());

        const parameters = cloneDeep(adData.data);

        const formFields = parameters.map((parameter) => {
            parameter.id = parameter.id || uuid();

            if (parameter.field_type === FILED_TYPES.picture) {
                parameter.value = parameter.value.split(',').map((image) => ({ path: urls.imagePath + image }));
            }

            return parameter;
        });

        if (isFocused) {
            this.setState({
                stateAndCities,
                selectedState,
                selectedCity: adData.city.id,
                formFields,
                loading: false
            });
        }
    };

    render() {
        const {
            loading,
            formFields,
            errored,
            stateAndCities,
            selectedCity,
            selectedState,
            editingPost
        } = this.state;

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
            title = strings.addSomeDetails;

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

                                                            <DatePicker
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
                                        stateAndCities={stateAndCities}
                                        selectedState={selectedState}
                                        selectedCity={selectedCity}
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
            <Wrapper>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={this.onLeftPress}
                    showBottomBorder
                    title={title}
                    blackTitle
                    titlePosition={'left'}
                />

                {content}

                <Loader isLoading={editingPost} isAbsolute />
            </Wrapper>
        );
    }
}

const styles = StyleSheet.create({
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
});

const mapStateToProps = ({ lang }) => ({
    selectedLanguage: lang.selectedLanguage
});

export default connect(mapStateToProps, {
    getStatesAndCities,
    editPost
})(withNavigationFocus(EditPost));
