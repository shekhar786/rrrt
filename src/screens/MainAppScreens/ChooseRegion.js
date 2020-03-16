import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import { Wrapper } from '../../components/common';
import { StateAndCityPicker } from '../../components/AddPost';

const ChooseRegion = () => {
    useEffect(() => {

    }, []);

    return (
        <Wrapper>
            <StateAndCityPicker
            // ref={this.statesRef}
            // stateAndCities={this.state.stateAndCities}
            />
        </Wrapper>
    );
};

export default ChooseRegion;
