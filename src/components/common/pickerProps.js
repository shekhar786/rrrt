import React from 'react';
import { moderateScale } from 'react-native-size-matters';

import { colors } from '../../utilities/constants';
import { PickerRightIcon } from './PickerRightIcon';
import { fonts } from '../../../assets';

const pickerProps = {
    style: {
        iconContainer: {
            top: moderateScale(11),
            right: moderateScale(10),
        },
        inputAndroid: {
            color: colors.black1,
            fontSize: moderateScale(14),
            paddingHorizontal: moderateScale(15),
            fontFamily: fonts.regular,
        },
        inputIOS: {
            paddingHorizontal: moderateScale(15),
            color: colors.black1,
            fontFamily: fonts.regular,
            fontSize: moderateScale(14),
            height: moderateScale(45),
        }
    },
    Icon: () => <PickerRightIcon />,
    pickerProps: {
        mode: 'dropdown'
    },
    useNativeAndroidPickerStyle: false
};

export { pickerProps };
