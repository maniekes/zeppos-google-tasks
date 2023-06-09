import {GOOGLE_API} from "../utils/constants";
import {requestToken} from "../app-side/google-api";

const buildInstruction = (s) => {
    return View({...s}, [
        tb('Follow those steps to request Google Tasks API Token:'),
        t('(you can do this everytime you see auth error on watch)'),
        t('0. See if google api already have valid token(click on "Test Google API" button and check if section "Last api call" starts with "items" and not with "error")'),
        t('1. Click on "Click here to authorize" on top of this page'),
        t('2. You will be redirected to google authentication link in your web browser. follow steps on screen and allow access'),
        t('3. At the end you will be redirected back to this screen'),
        t('4. Click on "Test Google API" button (see point 0)'),
        t('5. if you see any error, click enable debug on the bottom, take screenshot and send to me ( rafal@klimonda.pl )')
    ]);
}

const t = (txt, s) => {
    return Text({paragraph: true, ...s}, txt);
}
const tb = (txt, s) => {
    return Text({paragraph: true, bold: true, ...s}, txt);
}

AppSettingsPage({
    state: {
        test: 'dupa',
        props: {}
    },
    setState(props) {
        this.state.props = props;
    },

    build(props) {
        this.setState(props);
        // override token on PC because OAUTH not working there
        const overrideAuthButton = (GOOGLE_API.overrideRefreshToken) ? Button({
            label: 'Override RefreshToken',
            onClick: () => {
                const token = {}
                token.expiry_date = new Date().toISOString();
                token.refresh_token = GOOGLE_API.overrideRefreshToken
                this.state.props.settingsStorage.setItem('tokenAuth', JSON.stringify(token))
            }
        }) : null;
        const testApiButton = Button({
            label: 'Test Google API',
            onClick: () => {
                this.state.props.settingsStorage.setItem('LISTS', 123)
            }
        })
        const removeTokenButton = Button({
            label: 'Remove API Token',
            onClick: () => {
                this.state.props.settingsStorage.setItem('tokenAuth', '{}')
            }
        })
        const auth = Auth({
            label: 'Click here to authorize',
            authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            requestTokenUrl: 'https://oauth2.googleapis.com/token',
            clientId: GOOGLE_API.clientId,
            clientSecret: GOOGLE_API.clientSecret,
            scope: GOOGLE_API.scope,
            oAuthParams: {
                access_type: 'offline',
                ...GOOGLE_API.redirectUri && {redirect_uri: GOOGLE_API.redirectUri},
                ...GOOGLE_API.forceAsk && {prompt: 'consent'}
            },
            onAccessToken: (token) => {
                let d = new Date();
                d.setTime(d.getTime() + token.expires_in * 1000)
                token.requested_date = new Date()
                token.expiry_date = d
                this.state.props.settingsStorage.setItem('tokenAuth', JSON.stringify(token))
                console.log(props)
            },
            onReturn: async (ret) => {
                console.log(ret);
                let token = await requestToken(ret);
                let d = new Date();
                d.setTime(d.getTime() + token.expires_in * 1000)
                token.requested_date = new Date()
                token.expiry_date = d
                this.state.props.settingsStorage.setItem('tokenAuth', JSON.stringify(token))
            }
        });
        const enableDebug = Toggle({label: 'enable debug', settingsKey: 'debug_enabled'});
        const debug = this.state.props.settingsStorage.getItem('debug_enabled') === 'true';
        const s = {style: {display: 'block', marginBottom: '20px'}};
        return View({style: {maxWidth: '100%'}}, [
            View({...s}, [tb("Oauth:"), auth]),
            View({...s}, [testApiButton, removeTokenButton, overrideAuthButton]),
            buildInstruction(s),
            debug && tb('Current token:'),
            debug && t(this.settingAsString('tokenAuth'), s),
            debug && tb('Api call debug:'),
            debug && t(this.settingAsString('apiCallDebug'), s),
            tb('Last api call:'),
            t(this.settingAsString('apiCallResult'), s),
            debug && tb('Debug1:'),
            debug && t(this.settingAsString('debugState1'), s),
            debug && tb('Debug2:'),
            debug && t(this.settingAsString('debugState2'), s),
            enableDebug
        ])
    },
    settingAsString(name) {
        let o = this.state.props.settingsStorage.getItem(name);
        return typeof o == 'object' ? JSON.stringify(o) : o;
    },
})