import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import { moderateScale } from 'react-native-size-matters';

import { colors, DATE_FORMAT } from '../../utilities/constants';
import { layout } from '../../utilities/layout';
import { fonts } from '../../../assets';
import { strings } from '../../localization';

const CustomDatePicker = ({
    onDateSelect,
    value,
    containerStyle,
    dateStyle,
    datePickerProps
}) => {
    let defaultValue = new Date();
    let formatedDate = DATE_FORMAT;

    if (value) {
        defaultValue = dayjs(value).toDate();
        formatedDate = dayjs(value).format(DATE_FORMAT);
    }

    const [date, setDate] = useState(defaultValue);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const onDonePress = () => {
        setDatePickerVisibility(false);
        if (onDateSelect) {
            onDateSelect(date);
        }
    };

    return (
        <View>
            <Modal
                isVisible={isDatePickerVisible}
                style={styles.modal}
                onBackButtonPress={hideDatePicker}
            >
                <View style={styles.wrapper}>
                    <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={hideDatePicker}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.cancel}>
                                    {strings.cancel}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onDonePress}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.done}>
                                    {strings.done}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            date={date}
                            onDateChange={setDate}
                            mode={'date'}
                            style={styles.datePicker}
                            fadeToColor={colors.white4}
                            {...datePickerProps}
                        />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.dateButton}
                onPress={showDatePicker}
            >
                <Text style={[styles.date, dateStyle]}>
                    {formatedDate}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modal: {
        marginBottom: 0
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: colors.white2,
        paddingBottom: moderateScale(10)
    },
    buttonContainer: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(15)
    },
    datePicker: {
        width: layout.size.width,
        paddingTop: moderateScale(5)
    },
    done: {
        color: colors.blue1,
        paddingVertical: moderateScale(15),
        fontFamily: fonts.regular,
        fontSize: moderateScale(16)
    },
    cancel: {
        color: colors.grey1,
        paddingVertical: moderateScale(15),
        fontFamily: fonts.regular,
        fontSize: moderateScale(16)
    },
    dateButton: {
        paddingVertical: moderateScale(15),
        paddingHorizontal: moderateScale(10),

        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3
    },
    date: {
        // marginVertical: moderateScale(15),
        // marginHorizontal: moderateScale(10),
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    }
});

export { CustomDatePicker };
