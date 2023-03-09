import {GOOGLE_API} from "../utils/constants";

AppSettingsPage({
    state: {
        test: 'dupa',
        auth: {
            "access_token": "ya29.a0AVvZVsr3ax5gcithlrdT2bOabixC6OGGVRwNakjkpx2rBXVi4vh-Dqy8LA-NoToi4fFVy2chTUFNd9v0B3_qKKdVeOCDU-N96unHffiN5mjFIXM50agMKv-yX3WfqxjvSgIq_ahUlpSt_-GRgpQVcDsPmx2uaCgYKAWwSARMSFQGbdwaISsMEbkesi57dyczIP6DtnA0163",
            "expires_in": 3599,
            "refresh_token": "1//0cJ9K5qzylH4ICgYIARAAGAwSNwF-L9Irqi2p7Q3b3NyS3eFhUvKPez_68EtTO4v1n3W8qSUAlmCgXiJlhEQX0pq1JDkBV1fvqMc",
            "scope": "https://www.googleapis.com/auth/tasks",
            "token_type": "Bearer",
        },
        props: {}
    },
    setState(props) {
        this.state.props = props;
    },

    build(props) {
        this.setState(props);
        const tokenText = Text({}, this.state.props.settingsStorage.getItem('tokenAuth'))
        const apiCallDebugText = Text({}, this.state.props.settingsStorage.getItem('apiCallDebug'))
        const lastApiCallText = Text({}, this.state.props.settingsStorage.getItem('apiCallResult'))
        const debugText = Text({}, this.state.props.settingsStorage.getItem('debugState1'))
        const extraDebugText = Text({}, this.state.props.settingsStorage.getItem('debugState2'))
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
            }
        });
        const s = {style: {display: 'block', marginBottom: '20px'}};
        return View({}, [
            Section({title: 'OAUTH:', ...s}, [auth]),
            Section({...s}, [testApiButton, overrideAuthButton]),
            Section({title: 'Current token:', ...s}, [tokenText]),
            Section({title: 'Api call debug:', ...s}, [apiCallDebugText]),
            Section({title: 'Last api call:', ...s}, [lastApiCallText]),
            Section({title: 'Debug1:', ...s}, [debugText]),
            Section({title: 'Debug2:', ...s}, [extraDebugText]),
        ])
    },
})