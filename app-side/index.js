import {MessageBuilder} from '../shared/message'
import {GOOGLE_API_CLIENT_ID, GOOGLE_API_CLIENT_SECRET} from "../env";

const messageBuilder = new MessageBuilder()

const refreshToken = async (ctx) => {
    console.log('refreshing token')
    try {
        const authToken = settings.settingsStorage.getItem('tokenAuth');
        const {body: {data = {}} = {}} = await fetch({
            url: 'https://oauth2.googleapis.com/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${authToken.refresh_token}&client_id=${GOOGLE_API_CLIENT_ID}&client_secret=${GOOGLE_API_CLIENT_SECRET}`
        })
        authToken.access_token = data.auth_token
        let d = new Date();
        d.setTime(d.getTime() + authToken.expires_in * 1000)
        authToken.requested_date = new Date()
        authToken.expiry_date = d
        settings.settingsStorage.setItem('tokenAuth', authToken)
        console.log(JSON.stringify(data))
        ctx.response({
            data: {result: data},
        })
    } catch (error) {
        ctx.response({
            data: {result: 'ERROR'},
        })
    }
}

const fetchLists = async (ctx) => {
    let authToken = settings.settingsStorage.getItem('tokenAuth');
    if (authToken.expiry_date < Date()) {
        await refreshToken(ctx)
        if(ctx.response.data.result !== "ERROR") {
            authToken=ctx.response.data.result
            cts.response.data.message='cannot authorize'
        } else {
            return;
        }
    }
    try {
        const {body: {data = {}} = {}} = await fetch({
            url: 'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken.access_token}`,
            }
        })
        console.log(JSON.stringify(data))
        ctx.response({
            data: {result: data},
        })
    } catch (error) {
        ctx.response({
            data: {result: 'ERROR'},
        })
    }
}


AppSideService({
    onInit() {
        console.log('app side service invoke onInit')
        messageBuilder.listen(() => {
        })
        settings.settingsStorage.addListener(
            'change',
            ({key, newValue, oldValue}) => {
                console.log(key, newValue, oldValue)
                if(key==="LISTS") {
                     fetchLists({}).then((c) => {
                         console.log(JSON.stringify(c))
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