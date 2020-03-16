import React, { PureComponent } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { fonts } from '../../../assets';
import { colors } from '../../utilities/constants';

class CustomTextInput extends PureComponent<TextInputProps> {
    state = {
        value: this.props.initialValue || ''
    };

    onChangeText = (value) => this.setState({ value });

    getValue = () => this.state.value.trim();

    render() {
        return (
            <TextInput
                ref={this.props.innerRef}
                value={this.state.value}
                onChangeText={this.onChangeText}
                {...this.props}
                style={[
                    styles.textInput,
                    this.props.style, {
                        textAlignVertical: this.props.multiline ? 'top' : 'center',
                    }
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        backgroundColor: colors.white1,
        padding: moderateScale(10),
        marginTop: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: colors.black3
    }
});

export { CustomTextInput };
