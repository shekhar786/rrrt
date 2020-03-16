import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { icons, fonts } from '../../../assets';
import { colors } from '../../utilities/constants';
import { keyExtractor } from '../../utilities/helperFunctions';
import { strings } from '../../localization';

const SearchBox = ({
    containerStyle,
    placeholder,
    onChangeText,
    value,
    searchResults,
    onSearchResultPress,
    onFocus,
    onSubmitEditing,
    hideSearchDropdown,
    onClearInputPress
}) => {
    const inputRef = React.createRef();

    const onCrossPress = () => {
        inputRef.current.clear();
        onClearInputPress();
    };

    const renderSearchItem = ({ item, index }) => (
        <TouchableOpacity
            style={{
                ...styles.searchItemContainer,
                paddingBottom: index === searchResults.length - 1
                    ? moderateScale(20) : moderateScale(10)
            }}
            activeOpacity={0.6}
            onPress={() => onSearchResultPress(item)}
        >
            <Text style={styles.searchItemTitle}>
                {item.title || item.keyword}
            </Text>
        </TouchableOpacity>
    );

    const renderList = () => {
        if (hideSearchDropdown) {
            return null;
        }

        return (
            <>
                {!value ?
                    <Text style={styles.recentSearches}>
                        {strings.recentSearches}
                    </Text>
                    : null}
                <FlatList
                    data={searchResults}
                    renderItem={renderSearchItem}
                    contentContainerStyle={{
                        paddingBottom: searchResults.length > 0
                            ? moderateScale(20) : 0,
                    }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent' }}
                    keyExtractor={keyExtractor}
                    keyboardShouldPersistTaps={'handled'}
                />
            </>
        );
    };

    return (
        <>
            <View style={[styles.searchBarContainer, containerStyle]}>
                <Image source={icons.ic_search} />
                <TextInput
                    ref={inputRef}
                    style={styles.searchTextInput}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    onFocus={onFocus}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={'search'}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onCrossPress}
                    style={styles.crossButton}
                >
                    <Image source={icons.ic_search_cross} />
                </TouchableOpacity>
            </View>

            {renderList()}
        </>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white1,
        alignItems: 'center',
        marginHorizontal: 15,
        borderRadius: 4,
        paddingHorizontal: 15,
        marginTop: 10
    },
    searchTextInput: {
        height: 40,
        marginLeft: 10,
        flex: 1,
        fontFamily: fonts.regular
    },
    crossButton: {
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(8),
    },
    searchItemContainer: {
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(10),
        backgroundColor: 'white',
        borderBottomWidth: moderateScale(1),
        borderBottomColor: colors.grey7
    },
    searchItemTitle: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(14)
    },
    recentSearches: {
        fontFamily: fonts.semiBold,
        fontSize: moderateScale(14),
        color: colors.grey11,
        marginTop: moderateScale(5)
    },
});

export { SearchBox };
