import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import cloneDeep from 'clone-deep';
import {
    Wrapper,
    Header,
    Loader,
    Button,
    EmptyListComponent
} from '../../components/common';
import { icons, fonts } from '../../../assets';
import { popScreen, navigate } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import { commonColors, colors, screenNames } from '../../utilities/constants';
import { getFilters } from '../../store/actions';
import { showErrorAlert } from '../../utilities/helperFunctions';
import commonStyles from '../../utilities/commonStyles';
import logger from '../../utilities/logger';

class Filter_Shilengae extends PureComponent {
    state = {
        loading: true,
        filterFields: []
    };

    componentDidMount() {
        const cat_id = this.props.navigation.getParam('category_id', null);

        this.props.getFilters({
            cat_id,
            cb: (error, filterFields) => {
                const { isFocused } = this.props.navigation;
                if (isFocused()) {
                    this.setState({ loading: false });
                }
                if (error) {
                    return showErrorAlert(error);
                }
                if (isFocused()) {
                    return this.setState({ filterFields });
                }
            }
        });
    }

    onClearFilterPress = () => {
        let filterFields = cloneDeep(this.state.filterFields);

        filterFields = filterFields.map((field) => {
            field.selectedValues = field.options.map((option) => option.value);
            return field;
        });

        this.setState({ filterFields });
    };

    onFilterOptionSelect = ({ selectedValues, filterId }) => {
        const filterFields = cloneDeep(this.state.filterFields);
        const filterFieldIndex = filterFields.findIndex((field) => field.id === filterId);
        if (filterFieldIndex > -1) {
            filterFields[filterFieldIndex].selectedValues = selectedValues;
        }
        this.setState({ filterFields });
    };

    onDonePress = () => {
        const cat_id = this.props.navigation.getParam('category_id', null);
        const filterData = [];

        this.state.filterFields.forEach((filter) => {
            filterData.push({
                id: filter.id,
                selectedValues: filter.selectedValues
            });
        });

        const data = { cat_id, filterData };

        navigate(screenNames.FilteredAds, { queryParams: data });
    };
    renderRightButton = () => {
        const { filterFields } = this.state;
        if (filterFields.length === 0) {
            return <View style={styles.headerEmptyRightButton} />;
        }

        return (
            <TouchableOpacity
                style={styles.headerRightButton}
                activeOpacity={0.6}
                onPress={this.onClearFilterPress}
            >
                <Text style={styles.clearAllText}>
                    {strings.clearAll}
                </Text>
            </TouchableOpacity>
        );
    };

    renderFilterOptions = () => {
        const { filterFields, loading } = this.state;

        if (loading) {
            return <Loader isLoading />;
        } else if (filterFields.length === 0) {
            return (
                <EmptyListComponent
                    message={strings.noFilterFound}
                    emptyTextStyle={commonStyles.emptyListText}
                />
            );
        }

        return (
            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {filterFields.map((filter) => {
                    const onFilterItemPress = () => {
                        navigate(screenNames.FilterOptions, {
                            filterOptions: filter.options,
                            filterId: filter.id,
                            selectedValues: filter.selectedValues,
                            onFilterOptionSelect: this.onFilterOptionSelect
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={filter.id}
                            style={styles.filterFieldContainer}
                            activeOpacity={0.6}
                            onPress={onFilterItemPress}
                        >
                            <Text style={styles.label}>
                                {filter.title}
                            </Text>

                            <Text style={styles.value}>
                                {/* {filter.selectedValues.sort().toString()} */}
                                {filter.selectedValues.length === filter.options.length
                                    ? strings.all
                                    : filter.selectedValues.sort().toString()
                                }
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    render() {
        const { filterFields } = this.state;
        return (
            <Wrapper>
                <Header
                    leftIconSource={icons.ic_back}
                    onLeftPress={popScreen}
                    containerStyle={styles.header}
                    showBottomBorder={!layout.isIOS}
                    title={strings.filters}
                    blackTitle
                    renderRightButton={this.renderRightButton}
                />

                {this.renderFilterOptions()}

                {filterFields.length > 0 &&
                    <Button
                        label={strings.applyFilter}
                        style={styles.buttonStyle}
                        onPress={this.onDonePress}
                    />
                }
            </Wrapper >
        );
    }
}

const styles = StyleSheet.create({
    headerRightButton: {
        height: moderateScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: moderateScale(15)
    },
    headerEmptyRightButton: {
        height: moderateScale(56),
        width: moderateScale(70)
    },
    clearAllText: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        color: commonColors().themeColor,
    },
    scrollView: {
        paddingHorizontal: moderateScale(15),
        paddingBottom: moderateScale(15)
    },
    filterFieldContainer: {
        borderBottomWidth: moderateScale(0.5),
        borderColor: colors.grey4,
        paddingVertical: moderateScale(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
    },
    value: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: fonts.regular,
        textAlign: 'right',
        color: colors.grey6
    },
    buttonStyle: {
        position: 'absolute',
        bottom: moderateScale(30),
        left: moderateScale(15),
        right: moderateScale(15)
    }
});

export default connect(null, {
    getFilters
})(Filter_Shilengae);
