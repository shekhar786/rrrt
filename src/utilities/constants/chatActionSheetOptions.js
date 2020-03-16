import uuid from 'uuid';

import { strings } from '../../localization';
import { icons } from '../../../assets';

const inputToolbarOptions = [
    {
        id: uuid(),
        title: strings.camera,
        icon: icons.ic_camera_chat_screen
    },
    {
        id: uuid(),
        title: strings.photoAndLibrary,
        icon: icons.ic_photo_library
    },
    // {
    //     id: uuid(),
    //     title: strings.document,
    //     icon: icons.ic_document
    // },
    // {
    //     id: uuid(),
    //     title: strings.location,
    //     icon: icons.ic_icon_location
    // },
    strings.cancel
];

export {
    inputToolbarOptions
};
