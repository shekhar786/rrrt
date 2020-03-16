import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import YabalasNavigator from './YabalasNavigator';
import AuthLoading from '../screens/AuthScreens/AuthLoading';
import ShilengaNavigator from './ShilengaNavigator';

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading,
    AuthNavigator,
    YabalasNavigator,
    ShilengaNavigator
  },
  {
    // initialRouteName: 'YabalasNavigator',
  }
));
