import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fonts } from '../../../assets';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import { MultiSlider } from '../common';

class ChooseDistanceRange extends PureComponent {
    state = {
        distance: [0, 60]
    };

    onValuesChange = (distance) => this.setState({ distance });

    render() {
        return (
            <View style={styles.distanceContainer}>
                <View style={styles.distanceUpperContainer}>
                    <Text style={styles.distance}>
                        {strings.distance}
                    </Text>
                    <Text style={styles.distance}>
                        {`${this.state.distance[0]} ${strings.km}`} - {`${this.state.distance[1]} ${strings.km}`}
                    </Text>
                </View>
                <MultiSlider
                    max={100}
                    onValuesChange={this.onValuesChange}
                    sliderLength={layout.size.width - 50}
                    values={this.state.distance}
                    containerStyle={styles.sliderContainer}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    distanceContainer: {
        marginTop: 20
    },
    distance: {
        fontSize: 14,
        fontFamily: fonts.regular
    },
    distanceUpperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sliderContainer: {
        marginLeft: 13
    }
});

export { ChooseDistanceRange };
