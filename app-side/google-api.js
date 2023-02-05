import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

export const fetchLists = async () => {
    return getGoogleEndpoint('https://tasks.googleapis.com/tasks/v1/users/@me/lists')
}

export const fetchTasksForList = async (listId) => {
    return getGoogleEndpoint(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showDeleted=true&showHidden=true`)
}

const getGoogleEndpoint = async (url) => {
    try {
        const authToken = await getAuthToken()
        const {body: data} = await fetch({
            url: url, method: 'GET', headers: {
                'Authorization': `Bearer ${authToken.access_token}`
            }
        })
        return JSON.parse(data)
    } catch (error) {
        return 'ERROR'
    }
}

const getAuthToken = async () => {
    let authToken = settings.settingsStorage.getItem('tokenAuth');
    console.info('token from settings:')
    console.info(authToken)
    if (!(authToken?.expiry_date > Date())) {
        return await refreshToken()
    }
    return authToken;
}

const refreshToken = async () => {
    console.log('refreshing token')
    const authToken = settings.settingsStorage.getItem('tokenAuth');
    const {body: data} = await fetch({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${authToken.refresh_token}&client_id=${GOOGLE_API_CLIENT_ID}&client_secret=${GOOGLE_API_CLIENT_SECRET}`
    })
    authToken.access_token = data.access_token
    let d = new Date();
    d.setTime(d.getTime() + data.expires_in * 1000)
    authToken.requested_date = new Date()
    authToken.expiry_date = d
    settings.settingsStorage.setItem('tokenAuth', authToken)
    return JSON.parse(data)
}

