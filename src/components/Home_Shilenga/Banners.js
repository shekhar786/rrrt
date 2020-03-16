import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { moderateScale } from 'react-native-size-matters';

import { colors, commonColors } from '../../utilities/constants';
import { BannerCard } from './BannerCard';
import { layout } from '../../utilities/layout';
import { Loader } from '../common';

const Banners = ({ gettingBanners, banners }) => {
    const [activeSlide, setactiveSlide] = useState(0);

    const renderBanner = ({ item, index }) => (
        <BannerCard
            key={item.id}
            banner={item}
            index={index}
        />
    );

    if (gettingBanners) {
        return (
            <Loader
                isLoading
                containerStyle={styles.loaderContainer}
            />
        );
    }

    return (
        <>
            <Carousel
                data={banners}
                renderItem={renderBanner}
                sliderWidth={layout.size.width - 30}
                itemWidth={layout.size.width - 40}
                onBeforeSnapToItem={setactiveSlide}
                inactiveSlideScale={1}
                contentContainerCustomStyle={styles.crouselContentContainer}
            />

            <Pagination
                dotsLength={banners.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotColor={commonColors().themeColor}
                inactiveDotColor={colors.black3}
                inactiveDotOpacity={1}
                inactiveDotScale={1}
            />
        </>
    );
};

const styles = StyleSheet.create({
    crouselContentContainer: {
        height: 180,
        marginTop: moderateScale(15)
    },
    paginationContainer: {
        paddingVertical: 0,
        marginHorizontal: 10,
        marginTop: moderateScale(15),
        marginBottom: moderateScale(20)
    },
    loaderContainer: {
        height: 180
    }
});

export { Banners };
