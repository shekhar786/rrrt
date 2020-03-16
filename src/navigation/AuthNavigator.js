import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import Login from '../screens/AuthScreens/Login';
import Signup from '../screens/AuthScreens/Signup';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import EnterMobileNumber from '../screens/AuthScreens/EnterMobileNumber';
import MobileVerification from '../screens/AuthScreens/MobileVerification';
import ForceChangePassword from '../screens/AuthScreens/ForceChangePassword';
import { transitionConfig } from '../utilities/constants';
import ChooseLanguage from '../screens/AuthScreens/ChooseLanguage';
import LoginOptions from '../screens/AuthScreens/LoginOptions';

const signinStack = createStackNavigator({
    ChooseLanguage,
    Login,
    Signup,
    ForgotPassword,
    ForceChangePassword,
    EnterMobileNumber,
    MobileVerification: {
        screen: MobileVerification,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    LoginOptions
}, {
    defaultNavigationOptions: {
        header: null,
    },
    transitionConfig,
    // initialRouteName: 'MobileVerification'
});

export default createSwitchNavigator({
    signinStack
});
