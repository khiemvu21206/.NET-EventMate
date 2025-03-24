export const IGNORES_MESSAGE_KEY: string[] = [];

export const EM_STATUS = {
    unauthenticated: 'unauthenticated',
    loading: 'loading',
    RefreshAccessTokenError: 'RefreshAccessTokenError',
    authenticated: 'authenticated',
};

export const KEY_AUTH_TOKEN = 'EVENTMATE_AUTH_TOKEN';

export enum BUTTON_COMMON_TYPE {
    GOOGLE = 'google',
    CANCEL = 'cancel',
    CANCEL_BLACK = 'cancel-black',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SECONDARY_OUTLINE = 'secondary-outline',
    PRIMARY_OUTLINE = 'primary-outline',
    PRIMARY_WITH_CHILDREN = 'primary-with-children',
    PRIMARY_OUTLINE_WITH_CHILDREN = 'primary-outline-with-children',
    CANCEL_WITH_CHILDREN = 'cancel-with-children',
    DELETE_WITH_CHILDREN = 'cancel-black-with-children',
    DELETE = 'delete',
    ICON_NO_BORDER = 'icon-no-border',
    FLOATING_ACTION = 'floating-action',
}
export const THEME_WS = {
    LIGHT: 'light',
    DARK: 'dark',
};

export const WHITELIST_URLS = Object.freeze([
    '/eventlist',
    '/login',
    '/waitlist',
    '/intro',
    '/error/404',
    '/error/500',
    '/',
    '/signUp',
    '/resetPass',
    '/item',
    '/home',
]);
export const WHITELIST_URLS_AUTHEN = Object.freeze([
    '/signUp',
    '/login',
]);
export const Languages = [
    'vi',
    'en',
]
export const SKELETON_COLOR = {
    base:  '#ebebeb',

    highlight: '#f5f5f5',
    
};

export const EventTypes = {
    MUSIC: 'Music',
    CONCERT: 'Concert',
    OTHER: 'Other',
};

export const EventTypeMap: Record<string, number> = {
    Music: 1,
    Concert: 2,
    Other: 3,
};

export const getEventTypeId = (eventType: string): number | undefined => {
    return EventTypeMap[eventType];
};