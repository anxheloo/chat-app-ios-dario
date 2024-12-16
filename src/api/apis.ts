import {API_BASE} from '@env';

export const HOST = API_BASE;

export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user_info`;
export const GET_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = 'api/contacts';
export const SEARCH = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = 'api/messages';
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-files`;

// export const CHANNEL_ROUTES = 'api/channels';
// export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
// export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`;
// export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;
