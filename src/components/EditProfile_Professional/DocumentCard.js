import React from 'react';
import {
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { icons, fonts } from '../../../assets';
import { colors } from '../../utilities/constants';
import { formatBytes, truncateString } from '../../utilities/helperFunctions';

const DocumentCard = ({
    resume,
    rsize,
    renderRemoveButton,
    onRemovePress,
    onDocumentPress
}) => {
    let cancelButton = null;

    if (renderRemoveButton) {
        cancelButton = (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.cancelButton}
                onPress={onRemovePress}
            >
                <Image source={icons.ic_cancel_red} />
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            style={styles.docOuterContainer}
            activeOpacity={onDocumentPress ? 0.6 : 1}
            onPress={onDocumentPress}
        >
            <Image source={icons.ic_pdf} />

            <Text
                style={styles.docName}
                numberOfLines={1}
            >
                {truncateString(resume, 30)}
                {`  ${formatBytes(rsize)}`}
            </Text>

            {cancelButton}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    docOuterContainer: {
        backgroundColor: colors.black10,
        height: moderateScale(40),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(10),
        flexDirection: 'row'
    },
    docName: {
        color: colors.blue2,
        fontFamily: fonts.regular,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(5),
        flex: 1
    },
    cancelButton: {
        padding: moderateScale(5),
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export { DocumentCard };
