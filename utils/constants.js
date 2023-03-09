import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

export const GOOGLE_API = {
    clientId: GOOGLE_API_CLIENT_ID,
    clientSecret: GOOGLE_API_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/tasks',
    // redirectUri: 'https://zepp-os-staging.zepp.com/app-settings/redirect.html',
    overrideRefreshToken: '1//0c2_y5sIkP1SpCgYIARAAGAwSNwF-L9IrRnzuAf7JUlB_KE4BjUQRLRAJ8phFa7g_PBuD2PZw01QQ6T0fIAmN-eT7ZHPswrt1mMg',
    forceAsk: true
}

export const TODO_MSG = {
    GET_LISTS: 'GET_LISTS',
    GET_TASKS_FOR_LIST: 'GET_TASKS_FOR_LIST',
    COMPLETE_TASK: 'COMPLETE_TASK'}

export const TODO_LISTS_FILE = 'fs_todo_lists'
export const TODO_LISTS_TASKS_FILE_PREFIX = 'fs_todo_lists_'