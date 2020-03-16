import React from 'react';
import { connect } from 'react-redux';

import { Wrapper, Header, Container } from '../../components/common';
import { icons } from '../../../assets';
import { popScreen } from '../../utilities/NavigationService';
import { strings } from '../../localization';
import { layout } from '../../utilities/layout';
import { SubCategoryCard } from '../../components/SubCategories';
import { LANGUAGES } from '../../utilities/constants';
import { updateLanguage } from '../../store/actions';

const SelectLanguage = (props) => {
    const changeLanguage = (selectedLanguage) => {
        props.updateLanguage(selectedLanguage.shortName);
    };

    return (
        <Wrapper>
            <Header
                leftIconSource={icons.ic_back}
                onLeftPress={popScreen}
                title={strings.selectLanguage}
                blackTitle
                showBottomBorder={!layout.isIOS}
            />

            <Container>
                <SubCategoryCard
                    subCategory={{
                        name: 'Amheric',
                        shortName: LANGUAGES.amheric
                    }}
                    onSubcategorySelect={changeLanguage}
                    selected={props.selectedLanguage === LANGUAGES.amheric}
                />

                <SubCategoryCard
                    subCategory={{
                        name: 'English',
                        shortName: LANGUAGES.english
                    }}
                    onSubcategorySelect={changeLanguage}
                    selected={props.selectedLanguage === LANGUAGES.english}
                />

            </Container>
        </Wrapper>
    );
};

const mapStateToProps = ({ lang, user }) => ({
    selectedLanguage: lang.selectedLanguage || user.language
});

export default connect(mapStateToProps, {
    updateLanguage
})(SelectLanguage);
