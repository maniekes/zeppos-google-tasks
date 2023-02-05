import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

export const refreshToken = async () => {
    console.log('refreshing token')
    try {
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
    } catch (error) {
        return 'ERROR'
    }
}

export const getAuthToken = async () => {
    let authToken = settings.settingsStorage.getItem('tokenAuth');
    if (authToken.expiry_date === null || authToken.expiry_date < Date()) {
        const resp = await refreshToken()
        if (resp !== "ERROR") {
            authToken = resp
        } else {
            return 'ERROR'
        }
    }
    return authToken;

}

export const fetchLists = async () => {
    const authToken = await getAuthToken()
    try {
        const {body: data} = await fetch({
            url: 'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access_token}`
            }
        })
        return JSON.parse(data)
    } catch (error) {
        return 'ERROR'
    }
}

export const fetchTasksForList = async (listId) => {
    const authToken = await getAuthToken()
    try {
        const {body: data} = await fetch({
            url: `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showDeleted=true&showHidden=true`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access_token}`
            }
        })
        return JSON.parse(data)
    } catch (error) {
        return 'ERROR'
    }
}

