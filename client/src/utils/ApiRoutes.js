export const HOST = "http://localhost:5050";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGE_ROUTE = `${HOST}/api/message`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER = `${AUTH_ROUTE}/onboard-user`;
export const GETALL_USERS = `${MESSAGE_ROUTE}/getAllUsers`;
export const ADD_MESSAGE = `${MESSAGE_ROUTE}/addMessage`;
export const GET_MESSAGES = `${MESSAGE_ROUTE}/getMessages`;
export const ADD_IMAGE = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO = `${MESSAGE_ROUTE}/add-audio-message`;