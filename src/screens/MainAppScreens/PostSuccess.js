import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { WhiteContainer, Button } from '../../components/common';
import { strings } from '../../localization';
import { fonts, icons } from '../../../assets';
import { colors, screenNames, appTypes } from '../../utilities/constants';
import { getAppId } from '../../utilities/helperFunctions';

const PostSuccess = (props) => {
    const adData = props.navigation.getParam('adData', {});

    const onPreviewPostPress = () => {
        props.navigation.replace(screenNames.PreviewPost, { adData });
    };

    const getTickIcon = () => {
        if (getAppId() === appTypes.yabalash.id) {
            return icons.tick;
        } else if (getAppId() === appTypes.shilengae.id) {
            return icons.ic_congratulations;
        }

        return icons.ic_congratulations_pink;
    };

    return (
        <WhiteContainer style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={getTickIcon()} />

                <Text style={styles.congratulations}>
                    {strings.congratulations}
                </Text>

                <Text style={styles.postWillGoLiveShortly}>
                    {strings.postWillGoLiveShortly}
                </Text>
            </View>

            <Button
                label={strings.previewPost}
                style={styles.button}
                onPress={onPreviewPostPress}
            />
        </WhiteContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    subContainer: {
        alignItems: 'center'
    },
    congratulations: {
        fontSize: moderateScale(30),
        fontFamily: fonts.regular,
        marginTop: moderateScale(25)
    },
    postWillGoLiveShortly: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8,
        marginTop: moderateScale(5)
    },
    button: {
        marginTop: moderateScale(35),
        marginHorizontal: moderateScale(20)
    }
});

export default PostSuccess;

