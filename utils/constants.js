import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

export const GOOGLE_API = {
    clientId: GOOGLE_API_CLIENT_ID,
    clientSecret: GOOGLE_API_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/tasks',
    // redirectUri: 'https://zepp-os-staging.zepp.com/app-settings/redirect.html',
    // overrideRefreshToken: '1//0cEbiAJV6ibq9CgYIARAAGAwSNwF-L9IrbPK0EOcfuX-k8xcovZkeNoNXyWRho6b57eYOdzZBFe_NPKtTS3Oav_OVaRBA7N-7304',
    forceAsk: true
}

export const TODO_MSG = {
    GET_LISTS: 'GET_LISTS',
    GET_TASKS_FOR_LIST: 'GET_TASKS_FOR_LIST',
    COMPLETE_TASK: 'COMPLETE_TASK'}

export const TODO_LISTS_FILE = 'fs_todo_lists'
export const TODO_LISTS_TASKS_FILE_PREFIX = 'fs_todo_lists_'
export const APP_VERSION = '1.0.0'