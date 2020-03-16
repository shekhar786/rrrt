import { appTypes, initialAppState } from './appTypes';

let baseUrl = '';
let imagePath = '';
let socketUrl = '';

switch (initialAppState.appId) {
    case appTypes.yabalash.id:
        baseUrl = 'https://yabalas.netsolutionindia.com/api/';
        imagePath = 'https://yabalas.netsolutionindia.com/media/';
        socketUrl = 'http://yabalas-chat.netsolutionindia.com';
        break;
    case appTypes.shilengae.id:
        baseUrl = 'https://shilenga.netsolutionindia.com/api/';
        imagePath = 'https://shilenga.netsolutionindia.com/media/';
        socketUrl = 'http://shilenga-chat.netsolutionindia.com';
        break;
    case appTypes.beault.id:
        baseUrl = 'https://ludmilla.netsolutionindia.com/api/';
        imagePath = 'https://ludmilla.netsolutionindia.com/media/';
        socketUrl = 'http://ludmilla-chat.netsolutionindia.com';
        break;
    default:
        break;
}

const urls = {
    baseUrl,
    imagePath,
    socketUrl,
    uploadMedia: 'uploadmedia',

    register: 'register',
    login: 'login',
    forgotPassword: 'forgot_password',
    forceChangePassword: 'force_change_password',
    changePassword: 'change_password',
    appSocialLogin: 'app_social_login',
    editProfile: 'edit_profile',
    removeResume: 'removeresume',
    changeEmail: 'change_email',
    changePhone: 'change_phone',
    getUserProfile: 'getuser',
    requestOTP: 'sendOtp',

    getStatesAndCities: 'getCities',
    getCategories: 'getCategories',
    getCategoryFieldsForm: 'formdata',
    addPost: 'saveformdata',
    editPost: 'editpost',
    getAds: 'getads',
    getAdsbyKeyword: 'getadsbykeyword',
    getAllAdsByKeyword: 'getsearchedadsbykeyword',
    addtofavourites: 'addtofavourites',
    getAdsBySeller: 'getadsbyuser',
    getSimilarAds: 'getsimilarads',
    getFilteredAds: 'getfilteredads',
    getMyAds: 'getmyads',
    activateDeactivateAd: 'activate-deactivate-ad',
    getMyFavouriteAds: 'getfavouriteads',
    deleteAd: 'delete-ad',
    getCommentsOnAd: 'getcommnetonpost',
    postCommentOnAd: 'commnetonpost',
    connectFacebook: 'connect_facebook',
    sendEmailVerificationLink: 'verify_email',
    getBanners: 'getbanners',

    getAllChats: 'chats',
    getChatHistory: 'chat_history',
    clearOrDeleteChat: 'clear_chat',

    getTermsAndConditions: 'terms-conditions',
    getFaq: 'faq',
    getFilters: 'getfilters',
    getTrendingAds: 'gettrendingads',
    getAdsByFilters_Shilengae: 'getadsbyfilters'
};

export { urls };
