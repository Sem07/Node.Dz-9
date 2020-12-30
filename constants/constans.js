module.exports = {
    AUTHORIZATION: 'Authorization',
    CURRENT_YEAR: new Date().getFullYear(),
    CURRENT_DATE: new Date(),
    DAY_IN_MS: 86400000,

    PHOTO_MIMETYPES: [
        'image/gif',
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/webp'
    ],
    DOC_MIMETYPES: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/pdf'
    ],
    MAX_PHOTO_SIZE: 10 * 1024 * 1024,
    MAX_DOC_SIZE: 30 * 1024 * 1024,

    ACTION_REGISTERED_USER: 'User created',
    ACTION_UPDATE_USER: 'User update',
    ACTION_DELETE_USER: 'User delete',
    ACTION_CREATED_CAR: 'User created car',
    ACTION_UPDATE_CAR: 'User update car',
    ACTION_DELETE_CAR: 'User delete car',
};
