import React, { useState } from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../../utilities/constants';
import {
    EmptyListComponent,
    Wrapper,
    Header,
    Button
} from '../../components/common';
import { strings } from '../../localization';
import { icons, fonts } from '../../../assets';
import { popScreen, goBack } from '../../utilities/NavigationService';
import { layout } from '../../utilities/layout';
import commonStyles from '../../utilities/commonStyles';

const FilterOptions = (props) => {
    const filterOptions = props.navigation.getParam('filterOptions', []);
    const preSelectedValues = props.navigation.getParam('selectedValues', []);
    const onFilterOptionSelect = props.navigation.getParam('onFilterOptionSelect', null);

    const [selectedValues, setSelectedValues] = useState(preSelectedValues);

    const getIcon = (value) => {
        if (selectedValues.includes(value)) {
            return icons.ic_check_red;
        }

        return icons.ic_uncheck_grey;
    };

    const onDonePress = () => {
        if (onFilterOptionSelect) {
            const filterId = props.navigation.getParam('filterId', null);

            onFilterOptionSelect({
                selectedValues,
                filterId
            });
        }

        goBack();
    };

    const renderContent = () => {
        if (filterOptions.length === 0) {
            return (
                <EmptyListComponent
                    message={strings.noFilterParametersFound}
                    emptyTextStyle={commonStyles.emptyListText}
                />
            );
        }

        return (
            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {
                    filterOptions.map((optionData) => {
                        const onSelect = () => {
                            let sOptions = [...selectedValues];

                            if (!sOptions.includes(optionData.value)) {
                                sOptions.push(optionData.value);
                            } else {
                                sOptions = sOptions.filter((v) => v !== optionData.value);
                            }

                            setSelectedValues(sOptions);
                        };

                        return (
                            <TouchableOpacity
                                key={optionData.value}
                                activeOpacity={0.6}
                                style={styles.optionContainer}
                                onPress={onSelect}
                            >
                                <Text style={styles.label}>
                                    {optionData.label}
                                </Text>

                                <Image source={getIcon(optionData.value)} />
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        );
    };

    return (
        <Wrapper>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                containerStyle={styles.header}
                showBottomBorder={!layout.isIOS}
                title={strings.selectOptions}
                blackTitle
            />

            {renderContent()}

            <Button
                label={strings.done}
                style={styles.buttonStyle}
                onPress={onDonePress}
            />
        </Wrapper >
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(110)
    },
    label: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    optionContainer: {
        borderBottomWidth: moderateScale(0.5),
        borderColor: colors.grey4,
        paddingVertical: moderateScale(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonStyle: {
        position: 'absolute',
        bottom: moderateScale(30),
        left: moderateScale(15),
        right: moderateScale(15)
    }
});

export default FilterOptions;
