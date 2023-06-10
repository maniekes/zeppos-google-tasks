import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET, GOOGLE_API_REDIRECT_URI} from "../env";

export const GOOGLE_API = {
    clientId: GOOGLE_API_CLIENT_ID,
    clientSecret: GOOGLE_API_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/tasks',
    redirectUri: GOOGLE_API_REDIRECT_URI,
    // overrideRefreshToken: '1//0cXAuWxfHeSPaCgYIARAAGAwSNwF-L9IrLBjvKiStbtDna8eK1famoGGR_LFnYAN-FT-4-WhUrwYJkqdKXJ08PT2pL_o-2XyAG44',
    forceAsk: true
}

export const TODO_MSG = {
    GET_LISTS: 'GET_LISTS',
    GET_TASKS_FOR_LIST: 'GET_TASKS_FOR_LIST',
    COMPLETE_TASK: 'COMPLETE_TASK'
}

export const TODO_LISTS_FILE = 'fs_todo_lists'
export const TODO_LISTS_TASKS_FILE_PREFIX = 'fs_todo_lists_'
export const APP_VERSION = '1.0.2'