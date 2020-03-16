import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { fonts } from '../../../assets';
import { colors, commonColors } from '../../utilities/constants';
import { strings } from '../../localization';

const TermsAndConditionCard = () => (
    <>
        <Text style={styles.bySigningup}>
            {`${strings.bySigningup} `}
            <Text
                style={styles.span}
            >
                {`${strings.termsAndCondition} `}
            </Text>

            {`\n${strings.and} `}

            <Text
                style={styles.span}
            >
                {`${strings.privacyPolicy} `}
            </Text>
        </Text>
    </>
);

const styles = StyleSheet.create({
    bySigningup: {
        fontSize: moderateScale(14),
        fontFamily: fonts.semiBold,
        color: colors.grey1,
        textAlign: 'center',
        lineHeight: moderateScale(20)
    },
    span: {
        color: commonColors().themeColor
    }
});

export { TermsAndConditionCard };
