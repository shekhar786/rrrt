import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { icons, fonts } from '../../../assets';
import { colors } from '../../utilities/constants';

dayjs.extend(relativeTime);

const NotificationCard = ({ notification }) => (
    <View style={styles.container}>
        <Image
            source={icons.ic_placeholder}
            style={styles.profileImage}
        />
        <View style={styles.nameAndDateContainer}>
            <Text style={styles.title}>
                {notification.title}
            </Text>
            <Text style={styles.date}>
                {dayjs().fromNow()}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontFamily: fonts.regular
    },
    nameAndDateContainer: {
        marginLeft: 15
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    date: {
        fontSize: 12,
        color: colors.grey8,
        marginTop: 2
    }
});

export { NotificationCard };
