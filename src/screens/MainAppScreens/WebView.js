import React from 'react';
import { StyleSheet } from 'react-native';
import RNWebView from 'react-native-webview';

import { Wrapper, Header, Loader } from '../../components/common';
import { icons } from '../../../assets';
import { goBack } from '../../utilities/NavigationService';

const WebView = ({ navigation }) => {
    const uri = navigation.getParam('uri', null);
    const headerTitle = navigation.getParam('headerTitle', '');

    const renderLoader = () => (
        <Loader
            isLoading
            containerStyle={StyleSheet.absoluteFillObject}
        />
    );

    return (
        <Wrapper>
            <Header
                title={headerTitle}
                leftIconSource={icons.ic_back}
                onLeftPress={() => goBack()}
                blackTitle
                titlePosition={'left'}
            />

            <RNWebView
                source={{ uri }}
                startInLoadingState
                renderLoading={renderLoader}
            />
        </Wrapper>
    );
};
export default WebView;
