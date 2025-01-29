export const HOST = 'http://172.20.10.3:8000';

// export const HOST = 'http://172.16.0.29:8000';

export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user_info`;
export const UPDATE_USER_PROFILE_PIC = `${AUTH_ROUTES}/update-profile-pic`;
export const UPDATE_USERNAME = `${AUTH_ROUTES}/update-username`;
export const UPDATE_PIN = `${AUTH_ROUTES}/update-pin`;
export const UPDATE_DISSAPEARING_MESSAGES = `${AUTH_ROUTES}/update-dissappearing-messages`;

export const CONTACTS_ROUTES = 'api/contacts';
export const SEARCH = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_CONVERSATIONS = `${CONTACTS_ROUTES}/get-conversations`;
export const DELETE_CONVERSATION = `${CONTACTS_ROUTES}/delete-conversation`;
export const GET_ALL_FRIENDS = `${CONTACTS_ROUTES}/get-all-friends`;
export const GET_SCANNED_USER = `${CONTACTS_ROUTES}/get-scanner-user`;
export const ADD_FRIEND = `${CONTACTS_ROUTES}/add-friend`;
export const DELETE_FRIEND = `${CONTACTS_ROUTES}/delete-friend`;

export const MESSAGES_ROUTES = 'api/messages';
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
export const DELETE_MESSAGE = `${MESSAGES_ROUTES}/delete-message`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-files`;
export const SEND_MESSAGE = `${MESSAGES_ROUTES}/send-message`;
