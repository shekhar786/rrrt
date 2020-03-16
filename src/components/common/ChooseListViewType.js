import React from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { colors } from '../../utilities/constants';
import { strings } from '../../localization';
import { fonts } from '../../../assets';

const Button = ({ icon, label, onPress }) => (
    <TouchableOpacity
        activeOpacity={0.6}
        style={styles.button}
        onPress={onPress}
    >
        {icon ? <Image source={icon} /> : null}

        <View
            style={{
                ...styles.buttonLeftContainer,
                marginLeft: icon ? moderateScale(15) : 0,
            }}
        >
            <Text style={styles.buttonLabel}>
                {label}
            </Text>
        </View>
    </TouchableOpacity>
);

const ChooseListViewType = ({
    visible,
    onClose,
    viewOptions,
    title
}) => (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            onDismiss={onClose}
            transparent
            animationType={'fade'}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.selectViewType}>
                            {title}
                        </Text>

                        {viewOptions.map((option) => (
                            <Button
                                key={option.id}
                                icon={option.icon}
                                label={option.label}
                                onPress={option.onPress}
                            />
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.black15
    },
    subContainer: {
        backgroundColor: colors.white1,
        marginHorizontal: moderateScale(25),
        padding: moderateScale(20),
        justifyContent: 'center',
        borderRadius: moderateScale(4)
    },
    selectViewType: {
        fontSize: moderateScale(16),
        fontFamily: fonts.semiBold
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(8)
    },
    buttonLeftContainer: {
        flex: 1,
        paddingVertical: moderateScale(15),
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.black10
    },
    buttonLabel: {
        fontSize: moderateScale(16),
        fontFamily: fonts.regular,
        color: colors.grey8
    }
});

export { ChooseListViewType };
