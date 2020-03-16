import { strings } from '../../localization';
import { icons } from '../../../assets';

const categories = [
    {
        id: '1',
        categoryName: strings.furniture,
        icon: icons.ic_frurniture,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1',
                // reinsert: true
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '2',
        categoryName: strings.homeAccessories,
        icon: icons.ic_home_accessories,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '3',
        categoryName: strings.rugsAndCarpets,
        icon: icons.ic_rugs_carpets,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '4',
        categoryName: strings.curtaineAndBlinds,
        icon: icons.ic_curtains,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '5',
        categoryName: strings.gardenAndOutdoor,
        icon: icons.ic_garden,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '6',
        categoryName: strings.lighteningAndFans,
        icon: icons.ic_lightning,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '7',
        categoryName: strings.toolsAndHomeImprovements,
        icon: icons.ic_tools,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
    {
        id: '8',
        categoryName: strings.clothsAndAccessories,
        icon: icons.ic_clothes,
        subCategories: [
            {
                id: '1',
                subCategoryName: 'test1'
            },
            {
                id: '2',
                subCategoryName: 'test2'
            },
        ]
    },
];

export { categories };
