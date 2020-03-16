import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { strings } from '../../localization';
import { icons, fonts } from '../../../assets';
import { yabalashServices } from '../../utilities/constants';

class YabalashServices extends PureComponent {
    state = {
        selectedServices: this.props.selectedServices || []
    };

    getSelectedServices = () => this.state.selectedServices;

    getIcon = (id) => {
        if (this.state.selectedServices.includes(id)) {
            return icons.ic_check;
        }

        return icons.ic_uncheck;
    };

    toggleSelection = (id) => {
        let selectedServices = [...this.state.selectedServices];

        if (!selectedServices.includes(id)) {
            selectedServices.push(id);
        } else {
            selectedServices = selectedServices.filter((serviceId) => serviceId !== id);
        }

        this.setState({ selectedServices });
    };

    render() {
        return yabalashServices.map((service) => (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.container}
                key={service.id}
                onPress={this.toggleSelection.bind(this, service.id)}
                disabled={this.props.disabled}
            >
                <Image source={this.getIcon(service.id)} />
                <Text style={styles.label}>{service.label}</Text>
            </TouchableOpacity>
        ));
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10)
    },
    label: {
        marginLeft: moderateScale(10),
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold
    }
});

export { YabalashServices };
