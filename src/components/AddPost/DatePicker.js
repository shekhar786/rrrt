import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { moderateScale } from 'react-native-size-matters';

import { DATE_FORMAT, colors } from '../../utilities/constants';
import { fonts } from '../../../assets';

const DatePicker = ({
    onDateSelect,
    value,
    containerStyle,
    dateStyle,
    datePickerProps
}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = date => {
        hideDatePicker();
        onDateSelect(date);
    };

    let date = DATE_FORMAT;

    if (value) {
        date = dayjs(value).format(DATE_FORMAT);
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={showDatePicker}
            >
                <Text style={[styles.date, dateStyle]}>
                    {date}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={'date'}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={new Date()}
                {...datePickerProps}
                locale={'ba'}
                headerTextIOS={'Pick a date (YYYY-MM-DD)'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white1,
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3
    },
    date: {
        marginVertical: moderateScale(15),
        marginHorizontal: moderateScale(10),
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    }
});

export { DatePicker };
