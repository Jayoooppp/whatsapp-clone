// export const HOST = process.env.MONGO;
export const HOST = process.env.NEXT_PUBLIC_HOST
const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGE_ROUTE = `${HOST}/api/message`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER = `${AUTH_ROUTE}/onboard-user`;
export const GETALL_USERS = `${MESSAGE_ROUTE}/getAllUsers`;
export const ADD_MESSAGE = `${MESSAGE_ROUTE}/addMessage`;
export const GET_MESSAGES = `${MESSAGE_ROUTE}/getMessages`;
export const ADD_IMAGE = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO = `${MESSAGE_ROUTE}/add-audio-message`;
export const GET_TOKEN = `${AUTH_ROUTE}/generate-token`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTE}/get-initial-contact`;