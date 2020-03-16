import React, { useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { checkIfLoggedIn } from '../../store/actions';

const AuthLoading = (props) => {
    useEffect(() => {
        props.checkIfLoggedIn();
    }, []);

    return (
        <View />
    );
};

export default connect(null, {
    checkIfLoggedIn
})(AuthLoading);
