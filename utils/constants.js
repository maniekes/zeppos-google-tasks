import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

export const GOOGLE_API = {
    clientId: GOOGLE_API_CLIENT_ID,
    clientSecret: GOOGLE_API_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/tasks',
    // redirectUri: 'https://zepp-os-staging.zepp.com/app-settings/redirect.html',
    forceAsk: true
}