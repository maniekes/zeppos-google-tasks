import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET, GOOGLE_API_REDIRECT_URI} from "../env";

export const fetchLists = async () => {
    return getGoogleEndpoint('https://tasks.googleapis.com/tasks/v1/users/@me/lists?fields=items.id,items.title')
}

export const fetchTasksForList = async (listId) => {
    return getGoogleEndpoint(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=false&fields=items.id,items.title`)
    // return getGoogleEndpoint(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showDeleted=true&showHidden=true`)
}

export const completeTask = async (listId, task) => {
    const newTask = {id: task.id, title: task.title, status: 'completed'}
    return putGoogleEndpoint(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${newTask.id}`, newTask);
}
const getGoogleEndpoint = async (url) => {
    try {
        const authToken = await getAuthToken()
        setSetting('apiCallDebug', authToken);
        const {body: data} = await fetch({
            url: url, method: 'GET', headers: {
                'Authorization': `Bearer ${authToken.access_token}`
            }
        })
        setSetting('apiCallResult', data);
        const dat = (typeof data == 'string') ? JSON.parse(data) : data
        if (dat.error) {
            return {error: 'error calling google api. please go to settings'}
        } else return dat;
    } catch (error) {
        setSetting('apiCallResult', error);
        return {error: 'error calling google api. please go to settings'}
    }
}

const setSetting = (name, value) => {
    if (typeof value == 'object') {
        settings.settingsStorage.setItem(name, JSON.stringify(value));
    } else {
        settings.settingsStorage.setItem(name, value);
    }
}

// i have no idea why but PATCH request which will be much better than PUT
// is not working on T-REX2, however it works fine on simulator
// TODO: create bug for it and investigate later on
const putGoogleEndpoint = async (url, payload) => {
    try {
        const authToken = await getAuthToken()
        setSetting('apiCallDebug', url);
        const {body: data} = await fetch({
            url: url,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken.access_token}`
            },
            body: typeof payload === 'object' ? JSON.stringify(payload) : payload
        })
        setSetting('apiCallDebug', data);
        const dat = (typeof data == 'string') ? JSON.parse(data) : data
        if (dat.error) {
            return {error: 'error calling google api. please go to settings'}
        } else return dat;
    } catch (error) {
        setSetting('apiCallResult', error);
        return {error: 'error calling google api. please go to settings'}
    }
}

const getAuthToken = async () => {
    let authToken = JSON.parse(settings.settingsStorage.getItem('tokenAuth'));
    console.info('token from settings:')
    console.info(authToken)
    setSetting('debugState1', 'calling getAuthToken0');
    settings.settingsStorage.setItem('debugState1', 'calling getAuthToken0')
    if (authToken.expiry_date === null || authToken.expiry_date < new Date().toISOString()) {
        console.log(`refreshing tocken because ${authToken?.expiry_date} and ${Date()}`)
        return await refreshToken()
    }
    setSetting('debugState1', 'calling getAuthToken5');
    return authToken;
}

const refreshToken = async () => {
    console.log('refreshing token')
    setSetting('debugState1', 'calling refreshToken1');
    const authToken = JSON.parse(settings.settingsStorage.getItem('tokenAuth'));
    setSetting('debugState1', 'calling refreshToken2');
    const {body: data} = await fetch({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${authToken.refresh_token}&client_id=${GOOGLE_API_CLIENT_ID}&client_secret=${GOOGLE_API_CLIENT_SECRET}`
    })
    setSetting('debugState1', 'calling refreshToken3');
    const dat = (typeof data == 'string') ? JSON.parse(data) : data
    authToken.access_token = dat.access_token
    let d = new Date();
    d.setTime(d.getTime() + dat.expires_in * 1000)
    authToken.requested_date = new Date()
    authToken.expiry_date = d
    setSetting('debugState1', 'calling refreshToken4');
    setSetting('tokenAuth', authToken);
    return authToken
}

export const requestToken = async (authResponse) => {
    const data = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&client_id=${GOOGLE_API_CLIENT_ID}&client_secret=${GOOGLE_API_CLIENT_SECRET}&redirect_uri=${GOOGLE_API_REDIRECT_URI}&code=${authResponse.code}`
    }).then(response => {
        return response.json();
    });
    console.log(data);
    return data;
}

