import { actionTypes } from '../../utilities/constants';

const uploadMedia = (params) => ({
    type: actionTypes.UPLOAD_MEDIA_REQUESTED,
    params
});

export {
    uploadMedia,
};
