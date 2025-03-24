export const ERROR_CODE = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    QUOTA_LIMIT_ERROR: 412,
    ENTITY_TOO_LARGE: 413,
    ECONNABORTED: 408,
};


export const SUCCESS_CODE = {
    RESPONSE_DEFAULT: 200,
};

export const ERROR_MESSAGAE_HTTP = {
    AUTHENTICATION_ERROR: 'Session expired, please try again',
    FORBIDDEN_ERROR: 'Not authorized, please try again',
    NOT_FOUND_ERROR: 'No data found, please try again',
    NETWORK_ERROR: 'A network error has occurred, please try again',
    DEFAULT: 'An error has occurred, please try again later',
};

export const AUTHENTICATION_ERROR_CODE = {
    UNAUTHORIZED: '401',
    LOGIN_TIMEOUT: 'OAuthCallback', // this error code will be set by Zitadel when login timeout
};