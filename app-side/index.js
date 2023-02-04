import {MessageBuilder} from '../shared/message'
import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

const messageBuilder = new MessageBuilder()

const refreshToken = async (ctx) => {
    console.log('refreshing token')
    try {
        const authToken = settings.settingsStorage.getItem('tokenAuth');
        const {body: data } = await fetch({
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
        // ctx.response({
        //     data: {result: data},
        // })
        return {data: {result: JSON.parse(data)}}
    } catch (error) {
        // ctx.response({
        //     data: {result: 'ERROR'},
        // })
        return {data: {result: 'ERROR', error: error}}
    }
}

const fetchLists = async (ctx) => {
    let authToken = settings.settingsStorage.getItem('tokenAuth');
    if (authToken.expiry_date === null || authToken.expiry_date < Date()) {
        const resp = await refreshToken(ctx)
        if(resp.data?.result !== "ERROR") {
            authToken=resp.data.result
        } else {
            return {data: {result: 'ERROR', error: 'cannot authorize'}}
        }
    }
    try {
        const {body: data} = await fetch({
            url: 'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access_token}`
            }
        })
        // ctx.response({
        //     data: {result: data},
        // })
        return {data: {result: JSON.parse(data)}}
    } catch (error) {
        // ctx.response({
        //     data: {result: 'ERROR'},
        // })
        return {data: {result: 'ERROR', error: error}}
    }
}


AppSideService({
    onInit() {
        console.log('app side service invoke onInit')
        messageBuilder.listen(() => {
        })
        const ct = {response: (data) => {return data}}
        settings.settingsStorage.addListener(
            'change',
            ({key, newValue, oldValue}) => {
                console.log(key, newValue, oldValue)
                if(key==="LISTS") {
                     fetchLists({}).then((c) => {
                         console.log(c)
                     });
                }
            },
        )
    },
    onRun() {
        console.log('app side service invoke onRun')
    },
    onDestroy() {
        console.log('app side service invoke onDestroy')
    }
})