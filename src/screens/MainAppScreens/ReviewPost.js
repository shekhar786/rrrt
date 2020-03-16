import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import { addPost } from '../../store/actions';
import {
    colors,
    screenNames,
    DATE_FORMAT,
    FILED_TYPES,
    appTypes,
    ReplaceCurrentScreenAndRemovePrevScreens
} from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { goBack, navigate } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { Header, Wrapper, Button, Loader } from '../../components/common';
import { getAppId } from '../../utilities/helperFunctions';

//Before ad post
const ReviewPost = (props) => {
    const [loading, setLoading] = useState(false);

    const adData = props.navigation.getParam('adData', {});

    const popScreen = () => goBack();

    const onPostNowPress = () => {
        if (!props.id) {
            return Alert.alert(
                strings.loginFirst,
                strings.formatString(strings.pleaseLoginFirst, strings.postAnAd),
                [
                    {
                        text: strings.ok,
                        onPress: () => navigate(screenNames.Login,
                            { hasComeFromMainApp: true }
                        )
                    }
                ]
            );
        }

        if (getAppId() !== appTypes.yabalash.id) {
            const postAdScreenKey = props.navigation.getParam('postAdScreenKey', null);

            return navigate(screenNames.PromoteBeforePostAd, { adData, postAdScreenKey });
        }

        setLoading(true);

        const successCallback = (error, data) => {
            if (error) {
                return setLoading(false);
            }

            const postAdScreenKey = props.navigation.getParam('postAdScreenKey', null);

            return props.navigation.dispatch({
                replaceFrom: postAdScreenKey, //start popping from
                type: ReplaceCurrentScreenAndRemovePrevScreens,
                routeName: screenNames.PostSuccess, //send popping to
                params: { adData: data },
            });
        };

        props.addPost({ adData, cb: successCallback });
    };

    const renderPickedImages = (uploadedImages) => uploadedImages.map((image, index) => (
        <View
            key={image.path}
            style={{
                ...styles.imageContainer,
                marginLeft: index === 0 ? 0 : moderateScale(10)
            }}
        >
            <Image
                source={{ uri: image.path }}
                style={styles.image}
            />
        </View>
    ));

    const renderPrice = (priceData) => {
        let price = (
            <Text style={styles.value}>
                {strings.free}
            </Text>
        );

        if (priceData.price) {
            price = (
                <Text style={styles.value}>
                    {priceData.price} {strings.aed}
                </Text>
            );
        }

        return price;
    };

    let subCategory = null;

    if (adData.subCategory.name) {
        subCategory = (
            <View style={styles.itemContainer}>
                <Text style={styles.label}>
                    {strings.subCategory}
                </Text>
                <Text style={styles.value}>
                    {adData.subCategory.name}
                </Text>
            </View>
        );
    }

    return (
        <Wrapper wrapperStyle={styles.wrapperStyle}>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                showBottomBorder
                title={strings.reviewYourPost}
                disableRight={getAppId() === appTypes.yabalash.id}
                // rightIconSource={icons.ic_edit_white}
                rightIconStyle={styles.headerRightIconStyle}
                onRightPress={popScreen}
                blackTitle
                titlePosition={getAppId() === appTypes.yabalash.id ? 'left' : 'center'}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
            >
                <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.category}
                    </Text>
                    <Text style={styles.value}>
                        {adData.category.name}
                    </Text>
                </View>

                {subCategory}

                {
                    adData.parameters.map((parameter) => {
                        let valueView = null;

                        switch (parameter.field_type) {
                            case FILED_TYPES.simple_text:
                            case FILED_TYPES.multiline_text: {
                                if (!parameter.value) { //to hide value if its empty
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

                            case FILED_TYPES.picture: {
                                if (parameter.value.length === 0) { //to hide value if its empty
                                    valueView = null;
                                    break;
                                }

                                valueView = (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.imagesContainer}
                                    >
                                        {renderPickedImages(parameter.value)}
                                    </ScrollView>
                                );

                                break;
                            }

                            case FILED_TYPES.price: {
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
                            <View key={parameter.id} style={styles.itemContainer}>
                                <Text style={styles.label}>
                                    {parameter.title}
                                </Text>

                                {valueView}
                            </View>
                        );
                    })
                }

                <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.state}
                    </Text>
                    <Text style={styles.value}>
                        {adData.selectedStateAndCity.pickedState}
                    </Text>
                </View>

                <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                        {strings.city}
                    </Text>
                    <Text style={styles.value}>
                        {adData.cityName}
                    </Text>
                </View>

                <Button
                    label={strings.postNow}
                    style={styles.button}
                    onPress={onPostNowPress}
                />

                {getAppId() === appTypes.yabalash.id
                    ? <Button
                        label={strings.editPost}
                        style={{ ...styles.button, marginTop: moderateScale(15) }}
                        onPress={popScreen}
                        whiteButton
                    />
                    : null}
            </ScrollView>

            <Loader isLoading={loading} isAbsolute />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: colors.white1
    },
    listContentContainer: {
        paddingBottom: moderateScale(40),
    },
    itemContainer: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: colors.grey8
    },
    value: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
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
    button: {
        marginTop: moderateScale(25),
        marginHorizontal: moderateScale(20)
    },
    headerRightIconStyle: {
        tintColor: colors.black1
    }
});

const mapStateToProps = ({ user }) => ({
    id: user.id
});

export default connect(mapStateToProps, {
    addPost
})(ReviewPost);
