import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { fonts, icons } from '../../../assets';
import { getAppId } from '../../utilities/helperFunctions';
import { appTypes } from '../../utilities/constants';

const MultiSelectOptions = ({ options, selectedOptions, onSelect }) => {
    const getIcon = (value) => {
        if (selectedOptions.includes(value)) {
            if (getAppId() === appTypes.yabalash.id) {
                return icons.ic_check;
            } else if (getAppId() === appTypes.shilengae.id) {
                return icons.ic_check_red;
            } else if (getAppId() === appTypes.beault.id) {
                return icons.ic_check_pink;
            }
            
            return null;
        }

        if (getAppId() === appTypes.shilengae.id) {
            return icons.ic_uncheck_grey;
        } else if (getAppId() === appTypes.beault.id) {
            return icons.ic_uncheck_grey;
        }
        return icons.ic_uncheck;
    };

    const toggleSelection = (value) => {
        let sOptions = [...selectedOptions];

        if (!sOptions.includes(value)) {
            sOptions.push(value);
        } else {
            sOptions = sOptions.filter((v) => v !== value);
        }

        onSelect(sOptions);
    };

    return options.map((option) => (
        <TouchableOpacity
            activeOpacity={0.6}
            style={styles.container}
            key={option.value}
            onPress={() => toggleSelection(option.value)}
        >
            <Image source={getIcon(option.value)} />
            <Text style={styles.label}>
                {option.label}
            </Text>
        </TouchableOpacity>
    ));
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    label: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: fonts.semiBold
    }
});

export { MultiSelectOptions };
