import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';
import path from 'path-parse';
import ActionSheet from 'react-native-action-sheet';
import { moderateScale } from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';

import { icons, fonts } from '../../../assets';
import { colors, appTypes, maxFileSize, commonColors } from '../../utilities/constants';
import { strings } from '../../localization';
import { requestCameraPermission, getAppId, showErrorAlert } from '../../utilities/helperFunctions';
import logger from '../../utilities/logger';

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

/**
 * This component is controllable by state and props
 * If `selectedImages` and `onImageSelect` are not provided, then it used its own state
 */

class PickImages extends PureComponent {
    state = {
        pickedImages: []
    };

    onCrossPress = (index) => {
        const { selectedImages, onImageSelect } = this.props;

        let pickedImages = [];

        if (selectedImages) {
            pickedImages = [...selectedImages];
        } else {
            pickedImages = [...this.state.pickedImages];
        }

        pickedImages.splice(index, 1);

        if (selectedImages) {
            onImageSelect(pickedImages);
        } else {
            this.setState({ pickedImages });
        }

        if (this.imageNameScroll) {
            this.imageNameScroll.scrollTo({ y: 0 });
        }

        if (this.imageScroll) {
            this.imageScroll.scrollTo({ y: 0 });
        }
    };

    getPickedImages = () => this.state.pickedImages;

    openActionSheet = () => {
        const { selectedImages, onImageSelect, max_count } = this.props; //to control component by parent component

        if (selectedImages && selectedImages.length === max_count) {
            return showErrorAlert(strings.formatString(strings.maxPhotoLimit, max_count), { duration: 5000 });
        } else if (!selectedImages && this.state.pickedImages.length === max_count) {
            return showErrorAlert(strings.formatString(strings.maxPhotoLimit, max_count), { duration: 5000 });
        }

        ActionSheet.showActionSheetWithOptions({
            options: (Platform.OS === 'ios') ? BUTTONSiOS : BUTTONSandroid,
            cancelButtonIndex: CANCEL_INDEX,
            // tintColor: colors.olive1,
            title: strings.chooseImagesFrom
        },
            async (buttonIndex) => {
                try {
                    if (buttonIndex === 0 || buttonIndex === 1) {
                        await requestCameraPermission();
                        console.log('read write permission granted');
                    }

                    let maxFiles = max_count - this.state.pickedImages.length;

                    if (selectedImages) {
                        maxFiles = max_count - selectedImages.length;
                    }

                    const imagePickerOptions = {
                        compressImageQuality: 0.4,
                        mediaType: 'photo',
                        multiple: true,
                        maxFiles
                    };

                    switch (buttonIndex) {
                        case 0: { //camera
                            imagePickerOptions.compressImageQuality = 0.2;

                            const pickedImage = await ImagePicker.openCamera(imagePickerOptions);

                            // console.log('picked Image is: ', pickedImage);

                            let combinedImages;

                            if (selectedImages) {
                                combinedImages = [...selectedImages, pickedImage];
                            } else {
                                combinedImages = [...this.state.pickedImages, pickedImage];
                            }

                            const first6Images = combinedImages.slice(0, max_count);

                            if (onImageSelect) {
                                onImageSelect(first6Images);
                            } else {
                                this.setState({ pickedImages: first6Images });
                            }

                            break;
                        }
                        case 1: { //gallery
                            const pickedImages = await ImagePicker.openPicker(imagePickerOptions);

                            // console.log('picked Image are: ', pickedImages);
                            let combinedImages;

                            pickedImages.forEach((image) => {
                                if (image.size > maxFileSize) {
                                    showErrorAlert(strings.formatString(strings.maxFileSizeLimitAlert, 5), {
                                        duration: 5000
                                    });
                                    throw strings.formatString(strings.maxFileSizeLimitAlert, 5);
                                }
                            });

                            if (selectedImages) {
                                combinedImages = [...selectedImages, ...pickedImages];
                            } else {
                                combinedImages = [...this.state.pickedImages, ...pickedImages];
                            }

                            const first6Images = combinedImages.slice(0, max_count);

                            if (onImageSelect) {
                                onImageSelect(first6Images);
                            } else {
                                this.setState({ pickedImages: first6Images });
                            }
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

    renderPickedImagesName = () => {
        const { selectedImages } = this.props;

        let images = [];

        if (selectedImages) {
            images = selectedImages.map((image) => {
                if (Platform.OS === 'android') {
                    return path(image.path).base;
                }
                return image.filename;
            });
        } else {
            images = this.state.pickedImages.map((image) => {
                if (Platform.OS === 'android') {
                    return path(image.path).base;
                }
                return image.filename;
            });
        }

        return (<Text>{images.toString()}</Text>);
    };

    renderPickedImages = () => {
        const { selectedImages } = this.props;

        let iconSource;

        if (getAppId() === appTypes.yabalash.id) {
            iconSource = icons.ic_cross_small;
        } else if (getAppId() === appTypes.shilengae.id) {
            iconSource = icons.ic_cancel_red;
        } else if (getAppId() === appTypes.beault.id) {
            iconSource = icons.ic_cancel_pink;
        }

        let images = [];

        if (selectedImages) {
            images = [...selectedImages];
        } else {
            images = [...this.state.pickedImages];
        }

        return images.map((image, index) => (
            <View
                key={image.path}
                style={styles.imageContainer}
            >
                <Image
                    source={{ uri: image.path }}
                    style={styles.image}
                />

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.cross}
                    onPress={this.onCrossPress.bind(this, index)}
                >
                    <Image source={iconSource} />
                </TouchableOpacity>
            </View>
        ));
    };

    renderPickImageOptionView = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return (
                <View style={styles.imageNamesContainer}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.camera}
                        onPress={this.openActionSheet}
                    >
                        <Image source={icons.ic_camera} />
                    </TouchableOpacity>

                    <ScrollView
                        ref={(imageNameScroll) => (this.imageNameScroll = imageNameScroll)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageNamesScollView}
                    >
                        {this.renderPickedImagesName()}
                    </ScrollView>
                </View>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.addYourPhotoButton}
                onPress={this.openActionSheet}
            >
                <Image
                    source={icons.ic_camera}
                    style={styles.cameraIcon}
                />
                <Text style={styles.addYourPhoto}>
                    {strings.addYourPhoto}
                </Text>
            </TouchableOpacity>
        );
    };

    renderAddImageCard = () => {
        const { selectedImages, max_count } = this.props; //to control component by parent component

        if (selectedImages && selectedImages.length === max_count) { //max limit reached(if controlled by props)
            return null;
        }

        if (getAppId() === appTypes.shilengae.id) {
            return (
                <TouchableOpacity
                    style={{
                        ...styles.addImageContainer,
                        marginTop: selectedImages.length > 0
                            ? moderateScale(5) : moderateScale(12)
                    }}
                    activeOpacity={0.6}
                    onPress={this.openActionSheet}
                >
                    <Image
                        source={icons.ic_ad_plus}
                        style={styles.icPlus}
                    />
                </TouchableOpacity>
            );
        }

        return null;
    };

    render() {
        const { selectedImages } = this.props;
        const { pickedImages } = this.state;

        let imagesLength = 0;
        let containerStyle = {};

        if (selectedImages) {
            imagesLength = selectedImages.length;
        } else {
            imagesLength = pickedImages.length;
        }

        if (getAppId() === appTypes.yabalash.id) {
            containerStyle = {
                borderRadius: moderateScale(5),
                borderWidth: moderateScale(1),
                borderColor: colors.black3,
                paddingRight: moderateScale(15),
                marginTop: moderateScale(10),
                padding: moderateScale(6),
            };
        }

        return (
            <>
                <View style={[styles.container, containerStyle]}>
                    {this.renderPickImageOptionView()}
                </View>

                <ScrollView
                    ref={(imageScroll) => (this.imageScroll = imageScroll)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        marginTop: getAppId() === appTypes.yabalash.id
                            ? moderateScale(2) : moderateScale(15),
                        paddingTop: imagesLength > 0 ? moderateScale(8) : 0,
                        paddingBottom: (imagesLength > 0 && getAppId() === appTypes.yabalash.id)
                            ? moderateScale(8) : 0,
                    }}
                >
                    {this.renderPickedImages()}

                    {this.renderAddImageCard()}
                </ScrollView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    imageNamesContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageNamesScollView: {
        marginLeft: moderateScale(10),
    },
    image: {
        flex: 1,
        borderRadius: moderateScale(5),
        backgroundColor: colors.grey9
    },
    camera: {
        padding: moderateScale(8)
    },
    imageContainer: {
        height: moderateScale(110),
        width: moderateScale(110),
        padding: moderateScale(5),
    },
    cross: {
        position: 'absolute',
        top: -2,
        right: 0,
    },
    addYourPhotoButton: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(8),
        borderColor: commonColors().themeColor,
        borderWidth: moderateScale(1),
        marginTop: moderateScale(15),
        flexDirection: 'row',
    },
    cameraIcon: {
        tintColor: commonColors().themeColor,
        marginRight: moderateScale(5)
    },
    addYourPhoto: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    icPlus: {
        tintColor: commonColors().themeColor
    },
    addImageContainer: {
        height: moderateScale(100),
        width: moderateScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: moderateScale(1),
        borderColor: colors.black3,
        marginHorizontal: moderateScale(5),
        marginBottom: moderateScale(5),
        borderRadius: moderateScale(8),
    }
});

export { PickImages };
