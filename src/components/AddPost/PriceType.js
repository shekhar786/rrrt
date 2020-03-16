import React, { PureComponent } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { priceTypes, appTypes } from '../../utilities/constants';
import { icons, fonts } from '../../../assets';
import { CustomTextInput } from './CustomTextInput';
import { strings } from '../../localization';
import { getAppId } from '../../utilities/helperFunctions';

class PriceType extends PureComponent {
    state = {
        selectedPriceType: '1',
        itemPrice: ''
    };

    onItemPriceChange = (itemPrice) => {
        const { onPriceAndPriceTypeChange, priceObj } = this.props;

        if (onPriceAndPriceTypeChange) {
            return onPriceAndPriceTypeChange({
                price_type: priceObj.price_type,
                price: itemPrice
            });
        }

        return this.setState({ itemPrice });
    };

    getSelectedPriceType = () => ({
        priceType: this.state.selectedPriceType,
        itemPrice: this.state.itemPrice.trim()
    });

    selectPrice = (selectedPriceType) => {
        const { onPriceAndPriceTypeChange, priceObj } = this.props;

        if (onPriceAndPriceTypeChange) {
            let price = priceObj.price;

            if (selectedPriceType == 3) {
                price = '';
            }
            return onPriceAndPriceTypeChange({
                price_type: selectedPriceType,
                price
            });
        }

        this.setState({ selectedPriceType });
    };

    renderPriceInput = () => {
        const { priceObj } = this.props;
        const { selectedPriceType } = this.state;

        if (priceObj) {
            if (priceObj.price_type != '3') {
                return (
                    <CustomTextInput
                        value={priceObj.price}
                        onChangeText={this.onItemPriceChange}
                        placeholder={strings.itemPrice}
                        keyboardType={'number-pad'}
                    />
                );
            }

            return null;
        }

        if (selectedPriceType != '3') {
            return (
                <CustomTextInput
                    value={this.state.itemPrice}
                    onChangeText={this.onItemPriceChange}
                    placeholder={strings.itemPrice}
                    keyboardType={'number-pad'}
                />
            );
        }
    };

    render() {
        const { priceObj } = this.props;

        const { selectedPriceType } = this.state;

        if (getAppId() !== appTypes.yabalash.id) {
            return this.renderPriceInput();
        }

        return (
            <>
                {priceTypes.map((priceType) => {
                    let buttonImage = icons.ic_radio_inactive;

                    if (priceObj) {
                        if (priceObj.price_type === priceType.id) {
                            buttonImage = icons.ic_radio;
                        }
                    } else if (selectedPriceType === priceType.id) {
                        buttonImage = icons.ic_radio;
                    }

                    return (
                        <TouchableOpacity
                            key={priceType.id}
                            activeOpacity={0.6}
                            onPress={this.selectPrice.bind(this, priceType.id)}
                            style={styles.button}
                        >
                            <Image source={buttonImage} />
                            <Text style={styles.priceTitle}>{priceType.priceTitle}</Text>
                        </TouchableOpacity>
                    );
                })}

                {this.renderPriceInput()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(12)
    },
    priceTitle: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        marginLeft: moderateScale(10)
    }
});

export { PriceType };
