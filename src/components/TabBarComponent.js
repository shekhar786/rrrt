import React, { Fragment } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
// eslint-disable-next-line import/no-extraneous-dependencies
import SafeAreaView from 'react-native-safe-area-view';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';

import { icons, fonts } from '../../assets';
import { colors, screenNames, appTypes, commonColors, MESSAGE_STATUS } from '../utilities/constants';
import { layout } from '../utilities/layout';
import { strings } from '../localization';
import { navigate } from '../utilities/NavigationService';
import { getAppId } from '../utilities/helperFunctions';

const xml = `
    <svg width="100%" height="93px" viewBox="0 0 383 93" version="1.1">
        <defs>
            <path d="M154.130536,30 C155.649316,47.3725738 170.23323,61 188,61 C205.76677,61 220.350684,47.3725738 221.869464,30 L224,30 L375,30 L375,86 L0,86 L0,30 L154.130536,30 Z" id="path-1"></path>
            <filter x="-1.7%" y="-13.4%" width="103.5%" height="123.2%" filterUnits="objectBoundingBox" id="filter-2">
                <feOffset dx="0" dy="-1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.11 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
            <circle id="path-3" cx="188" cy="28" r="28"></circle>
            <filter x="-14.3%" y="-12.5%" width="128.6%" height="128.6%" filterUnits="objectBoundingBox" id="filter-4">
                <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.25 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="App" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="tab_bar-copy" transform="translate(4.000000, 4.000000)">
                <g id="Combined-Shape">
                    <use fill="black1" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                    <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use>
                </g>
                <g id="Oval">
                    <use fill="black1" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                    <use fill=${commonColors().themeColor} fill-rule="evenodd" xlink:href="#path-3"></use>
                </g>
                <text id="Post-Ad" font-family="CircularStd-Bold, Circular Std" font-size="10" font-weight="bold" line-spacing="12" letter-spacing="-0.2222222" fill="#FFFFFF">
                    <tspan x="170.908854" y="43">Post Ad</tspan>
                </text>
                <g id="ic_add" transform="translate(179.266927, 12.794271)" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
                    <path d="M9,0 L9,17.8657696" id="Path-2"></path>
                    <path d="M9,-3.55271368e-15 L9,17.8657696" id="Path-2-Copy" transform="translate(9.000000, 8.932885) rotate(90.000000) translate(-9.000000, -8.932885) "></path>
                </g>
            </g>
        </g>
    </svg>
`;

const TabBarComponent = (props) => {
    const buttons = [
        {
            id: 0,
            screenName: strings.home,
            onPress: () => {
                if (getAppId() === appTypes.yabalash.id) {
                    props.jumpTo(screenNames.Home_Yabalas);
                } else if (getAppId() === appTypes.shilengae.id || getAppId() === appTypes.beault.id) {
                    props.jumpTo(screenNames.Home_Shilenga);
                } else {
                    return;
                }
            },
            activeIcon: () => {
                if (getAppId() === appTypes.yabalash.id) {
                    return icons.ic_home_active;
                } else if (getAppId() === appTypes.shilengae.id) {
                    return icons.ic_home_active_red;
                } else if (getAppId() === appTypes.beault.id) {
                    return icons.ic_home_active_pink;
                }

                return null;
            },
            inactiveIcon: icons.ic_home_inactive,
        },
        {
            id: 1,
            screenName: strings.chat,
            onPress: () => props.jumpTo(screenNames.AllChats),
            activeIcon: () => {
                if (getAppId() === appTypes.yabalash.id) {
                    return icons.ic_chat_active;
                } else if (getAppId() === appTypes.shilengae.id) {
                    return icons.ic_chat_active_red;
                } else if (getAppId() === appTypes.beault.id) {
                    return icons.ic_chat_active_pink;
                }

                return null;
            },
            inactiveIcon: icons.ic_chat_inactive,
        },
        {
            id: 4,
            screenName: 'Post ad',
            onPress: () => navigate('PostAd')
        },
        {
            id: 2,
            screenName: strings.myAds,
            onPress: () => props.jumpTo(screenNames.MyAdds),
            activeIcon: () => {
                if (getAppId() === appTypes.yabalash.id) {
                    return icons.ic_ads_active;
                } else if (getAppId() === appTypes.shilengae.id) {
                    return icons.ic_ads_active_red;
                } else if (getAppId() === appTypes.beault.id) {
                    return icons.ic_ads_active_pink;
                }

                return null;
            },
            inactiveIcon: icons.ic_ads_inactive,
        },
        {
            id: 3,
            screenName: strings.profile,
            onPress: () => props.jumpTo(screenNames.Profile),
            activeIcon: () => {
                if (getAppId() === appTypes.yabalash.id) {
                    return icons.ic_profile_active;
                } else if (getAppId() === appTypes.shilengae.id) {
                    return icons.ic_profile_active_red;
                } else if (getAppId() === appTypes.beault.id) {
                    return icons.ic_profile_active_pink;
                }

                return null;
            },

            inactiveIcon: icons.ic_profile_inactive,
        },
    ];

    const renderUnreadChatStatus = (button) => {
        if (getAppId() === appTypes.yabalash.id || button.screenName !== strings.chat) {
            return null;
        }

        const unreadChat = props.allChats.find((chat) => {
            if (chat.message_status !== MESSAGE_STATUS.read) {
                return true;
            }

            return false;
        });

        if (unreadChat) {
            return <View style={styles.unreadChatView} />;
        }

        return (
            <View
                style={{
                    ...styles.unreadChatView,
                    backgroundColor: 'transparent'
                }}
            />
        );
    };

    let Wrapper = Fragment;

    if (Platform.OS === 'ios') {
        Wrapper = SafeAreaView;
    }

    return (
        <Wrapper>
            <View>
                <SvgXml
                    xml={xml}
                    width={layout.size.width + 6}
                    style={styles.svgXml}
                />
                <View style={styles.tabContainer}>
                    {buttons.map((button) => {
                        if (button.id === 4) {
                            return (
                                <View
                                    key={button.id}
                                    style={styles.buttonOuterContainer}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={styles.postButton}
                                        onPress={button.onPress}
                                    />
                                </View>
                            );
                        }

                        let icon = button.inactiveIcon;
                        let textColor = colors.grey3;

                        if (props.navigation.state.index === button.id) {
                            icon = button.activeIcon();
                            textColor = commonColors().themeColor;
                        }

                        return (
                            <View
                                style={styles.buttonOuterContainer}
                                key={button.id}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.buttonInnerContainer}
                                    onPress={button.onPress}
                                >
                                    <Image source={icon} />
                                    <Text
                                        style={{
                                            ...styles.screenName,
                                            color: textColor
                                        }}
                                    >
                                        {button.screenName}
                                    </Text>

                                    {renderUnreadChatStatus(button)}
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    svgXml: {
        position: 'absolute',
        left: -moderateScale(2),
        bottom: -moderateScale(5),
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(54)
    },
    buttonOuterContainer: {
        flex: 1
    },
    buttonInnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    postButton: {
        position: 'absolute',
        top: -moderateScale(60),
        left: moderateScale(11),
        height: moderateScale(54),
        width: moderateScale(54)
    },
    screenName: {
        fontSize: moderateScale(10),
        fontFamily: fonts.regular
    },
    unreadChatView: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: commonColors().themeColor,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10,
        position: 'absolute',
        top: 0,
        right: 15
    }
});

const mapStateToProps = ({ lang, chat }) => ({
    selectedLanguage: lang.selectedLanguage,
    allChats: chat.allChats
});

export default connect(mapStateToProps)(TabBarComponent);
