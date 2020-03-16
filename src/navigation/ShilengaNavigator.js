import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import TabBarComponent from '../components/TabBarComponent';
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
import EditProfile_Shilenga from '../screens/MainAppScreens/EditProfile_Shilenga';
import ChooseCategories from '../screens/MainAppScreens/ChooseCategories';

import Login from '../screens/AuthScreens/Login';
import Signup from '../screens/AuthScreens/Signup';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import EnterMobileNumber from '../screens/AuthScreens/EnterMobileNumber';
import MobileVerification from '../screens/AuthScreens/MobileVerification';
import ForceChangePassword from '../screens/AuthScreens/ForceChangePassword';
import Home_Shilenga from '../screens/MainAppScreens/Home_Shilenga';
import PromoteBeforePostAd from '../screens/MainAppScreens/PromoteBeforePostAd';
import SearchAds from '../screens/MainAppScreens/SearchAds';
import ItemsSoldBySeller from '../screens/MainAppScreens/ItemsSoldBySeller';
import MyFavouriteAds from '../screens/MainAppScreens/MyFavouriteAds';
import WebView from '../screens/MainAppScreens/WebView';
import EditPost from '../screens/MainAppScreens/EditPost';
import ContactUs from '../screens/MainAppScreens/ContactUs';

import {
    transitionConfig,
    ReplaceCurrentScreenAndRemovePrevScreens
} from '../utilities/constants';
import SelectLanguage from '../screens/MainAppScreens/SelectLanguage';
import ChangeEmail from '../screens/MainAppScreens/ChangeEmail';
import ChangePhoneNumber from '../screens/MainAppScreens/ChangePhoneNumber';
import Filter_Shilengae from '../screens/MainAppScreens/Filter_Shilengae';
import FilterOptions from '../screens/MainAppScreens/FilterOptions';
import FilteredAds from '../screens/MainAppScreens/FilteredAds';

const ShilengaTabNavigator = createBottomTabNavigator(
    {
        Home_Shilenga,
        AllChats,
        MyAdds,
        Profile
    },
    {
        defaultNavigationOptions: {
            header: null,
        },
        // initialRouteName: 'MyAdds',
        tabBarComponent: TabBarComponent,
        lazy: false
    },
);

const shilengaeStackNavigator = createStackNavigator({
    ShilengaTabNavigator,
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
    EditProfile_Shilenga: {
        screen: EditProfile_Shilenga,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    ChooseCategories,
    PromoteBeforePostAd,
    SearchAds,
    ItemsSoldBySeller,
    MyFavouriteAds,
    WebView,
    EditPost,
    ContactUs,
    SelectLanguage,
    ChangeEmail,
    ChangePhoneNumber,
    Filter_Shilengae,
    FilterOptions,
    FilteredAds
}, {
    defaultNavigationOptions: {
        header: null
    },
    // initialRouteName: 'ContactUs',
    transitionConfig
});

const prevGetStateForActionShilengaeNavigator = shilengaeStackNavigator.router.getStateForAction;

shilengaeStackNavigator.router = {
    ...shilengaeStackNavigator.router,
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

export default shilengaeStackNavigator;
