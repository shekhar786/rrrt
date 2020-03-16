import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import RNPickerSelect from 'react-native-picker-select';

import { colors, appTypes } from '../../utilities/constants';
import { strings } from '../../localization';
import { fonts } from '../../../assets';
import { pickerProps } from '../common';
import { getAppId } from '../../utilities/helperFunctions';

class StateAndCityPicker extends React.PureComponent {
    constructor(props) {
        super(props);

        const states = Object.keys(props.stateAndCities) || [];

        let pickedState;

        if (props.selectedState) {
            pickedState = props.selectedState;
        } else if (states.length > 0) {
            pickedState = states[0];
        }

        let pickedCity;

        if (props.selectedCity) {
            pickedCity = props.selectedCity;
        } else if (states.length > 0 && props.stateAndCities[states[0]]) {
            pickedCity = props.stateAndCities[states[0]][0].value;
        }

        this.state = {
            states,
            pickedState,
            pickedCity,
        };
    }

    onStateSelect = (pickedState) => this.setState({
        pickedState,
        pickedCity: this.props.stateAndCities[pickedState][0].value
    });

    onCitySelect = (pickedCity) => this.setState({ pickedCity });

    getSelectedStateAndCity = () => ({
        pickedState: this.state.pickedState,
        pickedCity: this.state.pickedCity,
    });

    getStateOptions = () => {
        const { states } = this.state;

        return states.map((state) => ({
            label: state,
            value: state
        }));
    };

    getCityOptions = () => {
        const { pickedState } = this.state;
        const { stateAndCities } = this.props;

        let cityOptions = [];

        if (
            Object.keys(stateAndCities).length > 0
            && stateAndCities[pickedState]
            && stateAndCities[pickedState].length > 0
        ) {
            cityOptions = stateAndCities[pickedState];
        }

        return cityOptions;
    };

    render() {
        const { pickedCity, pickedState } = this.state;

        let stateLabel = strings.setYourState;

        if (getAppId() === appTypes.yabalash.id) {
            stateLabel = strings.setYourArea;
        }

        return (
            <View>
                <Text
                    style={{
                        ...styles.label,
                        fontSize: moderateScale(16),
                        marginTop: moderateScale(25),
                    }}
                >
                    {strings.setYourLocation}
                </Text>

                <Text style={styles.label}>
                    {stateLabel}
                </Text>
                <View style={styles.pickerOuterContainer}>
                    <RNPickerSelect
                        onValueChange={this.onStateSelect}
                        value={pickedState}
                        items={this.getStateOptions()}
                        placeholder={{}}
                        {...pickerProps}
                    />
                </View>

                <Text style={styles.label}>
                    {strings.setYourCity}
                </Text>
                <View style={styles.pickerOuterContainer}>
                    <RNPickerSelect
                        onValueChange={this.onCitySelect}
                        value={pickedCity}
                        items={this.getCityOptions()}
                        placeholder={{}}
                        {...pickerProps}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pickerOuterContainer: {
        backgroundColor: colors.white1,
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3
    },
    label: {
        marginTop: moderateScale(10),
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    }
});

export { StateAndCityPicker };
