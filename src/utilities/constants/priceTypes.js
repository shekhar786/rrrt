import { strings } from '../../localization';

const priceTypes = [
    {
        id: '1',
        priceTitle: strings.marketPrice,
    },
    {
        id: '2',
        priceTitle: strings.giveawayPrice,
    },
    {
        id: '3',
        priceTitle: strings.free,
    }
];

const yabalasPriceTypes = {
    marketPrice: 1,
    giveawayPrice: 2,
    free: 3
};

export { priceTypes, yabalasPriceTypes };
