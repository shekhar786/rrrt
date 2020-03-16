import { Easing, Animated } from 'react-native';

//transition configuration for router sceens
const transitionConfig = () => ({
	screenInterpolator: sceneProps => {
		const { layout, position, scene } = sceneProps;
		const { index } = scene;
		const width = layout.initWidth;

		const inputRange = [index - 1, index, index + 1];

		const translateX = position.interpolate({
			inputRange,
			outputRange: ([width, 0, 0]),
		});

		return {
			transform: [
				{ translateX }
			],
		};
	},
	transitionSpec: {
		duration: 350,
		easing: Easing.out(Easing.poly(4)),
		timing: Animated.timing,
		useNativeDriver: true,
	},
});

const screenNames = {
	AuthLoading: 'AuthLoading',
	AuthNavigator: 'AuthNavigator',
	YabalasNavigator: 'YabalasNavigator',
	Login: 'Login',
	Signup: 'Signup',
	EnterMobileNumber: 'EnterMobileNumber',
	ForgotPassword: 'ForgotPassword',
	MobileVerification: 'MobileVerification',
	ForceChangePassword: 'ForceChangePassword',
	LoginOptions: 'LoginOptions',
	
	Home_Yabalas: 'Home_Yabalas',
	Home_Shilenga: 'Home_Shilenga',
	AllChats: 'AllChats',
	MyAdds: 'MyAdds',
	Profile: 'Profile',
	YabalasTabNavigator: 'YabalasTabNavigator',
	ShilengaNavigator: 'ShilengaNavigator',
	ShilengaTabNavigator: 'ShilengaTabNavigator',
	SubCategories: 'SubCategories',
	Products: 'Products',
	ProductDetails: 'ProductDetails',
	SearchWithLocation: 'SearchWithLocation',
	ChooseLocation: 'ChooseLocation',
	Notifications: 'Notifications',
	PostAd: 'PostAd',
	AddPost: 'AddPost',
	ReviewPost: 'ReviewPost',
	PostSuccess: 'PostSuccess',
	PromoteBeforePostAd: 'PromoteBeforePostAd',
	PreviewPost: 'PreviewPost',
	Settings: 'Settings',
	Filter: 'Filter',
	Filter_Shilengae: 'Filter_Shilengae',
	FilterOptions: 'FilterOptions',
	OneToOneChat: 'OneToOneChat',
	ChangePassword: 'ChangePassword',
	EditProfile_Yabalas: 'EditProfile_Yabalas',
	EditProfile_Shilenga: 'EditProfile_Shilenga',
	ChooseCategories: 'ChooseCategories',
	SearchAds: 'SearchAds',
	ItemsSoldBySeller: 'ItemsSoldBySeller',
	MyFavouriteAds: 'MyFavouriteAds',
	FilteredAds: 'FilteredAds',
	WebView: 'WebView',
	EditPost: 'EditPost',
	ContactUs: 'ContactUs',
	SelectLanguage: 'SelectLanguage',
	ChangeEmail: 'ChangeEmail',
	CalculateEstimatedPrice: 'CalculateEstimatedPrice',
	ChangePhoneNumber: 'ChangePhoneNumber'
};

const ReplaceCurrentScreenAndRemovePrevScreens = 'ReplaceCurrentScreenAndRemovePrevScreens';

export {
	transitionConfig,
	screenNames,
	ReplaceCurrentScreenAndRemovePrevScreens
};
