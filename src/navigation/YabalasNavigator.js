import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import TabBarComponent from '../components/TabBarComponent';
import Home_Yabalas from '../screens/MainAppScreens/Home_Yabalas';
import AllChats from '../screens/MainAppScreens/AllChats';
import MyAdds from '../screens/MainAppScreens/MyAdds';
import Profile from '../screens/MainAppScreens/Profile';
import SubCategories from '../screens/MainAppScreens/SubCategories';
import Products from '../screens/MainAppScreens/Products';
import ProductDetails from '../screens/MainAppScreens/ProductDetails';
import SearchWithLocation from '../screens/MainAppScreens/SearchWithLocation';
import ChooseLocation from '../screens/MainAppScreens/ChooseLocation';
import Notifications from '../screens/MainAppScreens/Notifications';
import PostAd from '../screens/MainAppScreens/PostAd';
import AddPost from '../screens/MainAppScreens/AddPost';
import ReviewPost from '../screens/MainAppScreens/ReviewPost';
import PostSuccess from '../screens/MainAppScreens/PostSuccess';
import PreviewPost from '../screens/MainAppScreens/PreviewPost';
import Settings from '../screens/MainAppScreens/Settings';
import Filter from '../screens/MainAppScreens/Filter';
import OneToOneChat from '../screens/MainAppScreens/OneToOneChat';
import ChangePassword from '../screens/MainAppScreens/ChangePassword';
import EditProfile_Yabalas from '../screens/MainAppScreens/EditProfile_Yabalas';
import ChooseCategories from '../screens/MainAppScreens/ChooseCategories';

import {
    transitionConfig,
    ReplaceCurrentScreenAndRemovePrevScreens
} from '../utilities/constants';

import Login from '../screens/AuthScreens/Login';
import Signup from '../screens/AuthScreens/Signup';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import EnterMobileNumber from '../screens/AuthScreens/EnterMobileNumber';
import MobileVerification from '../screens/AuthScreens/MobileVerification';
import ForceChangePassword from '../screens/AuthScreens/ForceChangePassword';
import SearchAds from '../screens/MainAppScreens/SearchAds';
import FilteredAds from '../screens/MainAppScreens/FilteredAds';
import WebView from '../screens/MainAppScreens/WebView';
import EditPost from '../screens/MainAppScreens/EditPost';
import ContactUs from '../screens/MainAppScreens/ContactUs';
import SelectLanguage from '../screens/MainAppScreens/SelectLanguage';
import CalculateEstimatedPrice from '../screens/MainAppScreens/CalculateEstimatedPrice';

const YabalasTabNavigator = createBottomTabNavigator(
    {
        Home_Yabalas,
        AllChats,
        MyAdds,
        Profile
    },
    {
        defaultNavigationOptions: {
            header: null,
        },
        tabBarComponent: TabBarComponent
    },
);

const yabalashStackNavigator = createStackNavigator({
    YabalasTabNavigator,
    SubCategories,
    Products,
    ProductDetails,
    SearchWithLocation,
    ChooseLocation,
    Notifications,
    PostAd,
    AddPost: {
        screen: AddPost,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    ReviewPost,
    PostSuccess,
    PreviewPost,
    Settings,
    Login,
    Signup,
    ForgotPassword,
    EnterMobileNumber,
    MobileVerification: {
        screen: MobileVerification,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    ForceChangePassword,
    Filter,
    OneToOneChat,
    ChangePassword,
    EditProfile_Yabalas: {
        screen: EditProfile_Yabalas,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    ChooseCategories,
    SearchAds,
    FilteredAds,
    WebView,
    EditPost,
    ContactUs,
    SelectLanguage,
    CalculateEstimatedPrice
}, {
    defaultNavigationOptions: {
        header: null
    },
    transitionConfig
});

const prevGetStateForActionShilengaeNavigator = yabalashStackNavigator.router.getStateForAction;

yabalashStackNavigator.router = {
    ...yabalashStackNavigator.router,
    getStateForAction(action, state) {
        if (state && action.type === ReplaceCurrentScreenAndRemovePrevScreens) {
            // console.log('actions is: ', action);

            let numberOfScreensToBePopped = 1;

            state.routes.forEach((route, index) => {
                if (route.key === action.replaceFrom) {
                    numberOfScreensToBePopped = state.routes.length - index;
                }
            });

            const routes = state.routes.slice(0, state.routes.length - numberOfScreensToBePopped); //all routes without last route

            routes.push(action);

            return {
                ...state,
                routes,
                index: routes.length - 1,
            };
        }

        return prevGetStateForActionShilengaeNavigator(action, state);
    },
};

export default yabalashStackNavigator;
