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
        const txt = Text({style: {display: 'block', marginTop: '20px'}}, this.state.props.settingsStorage.getItem('tokenAuth'))
        const txt2 = Text({style: {display: 'block', marginTop: '20px'}}, this.state.props.settingsStorage.getItem('result1'))
        const txt3 = Text({style: {display: 'block', marginTop: '20px'}}, this.state.props.settingsStorage.getItem('result2'))
        const txt4 = Text({style: {display: 'block', marginTop: '20px'}}, this.state.props.settingsStorage.getItem('result3'))
        const btntmp = Button({
            label: 'overrideauth',
            onClick: () => {
                const token = {}
                token.expiry_date = Date();
                token.refresh_token = '1//0c_AZX_xMOVwuCgYIARAAGAwSNwF-L9IrKGXxrPevLuy2yWN7sEkaSy4KCjAj643vp4dQP22dHhi_g9Zzhm4Wyp56KCKivDJoo3g'
                this.state.props.settingsStorage.setItem('tokenAuth', JSON.stringify(token))
            }
        })
        const btn1 = Button({
            label: 'trololo1',
            onClick: () => {
                this.state.props.settingsStorage.setItem('LISTS', 123)
            }
        })
        const btn2 = Button({
            label: 'trololo2',
            onClick: () => {
                this.state.props.settingsStorage.setItem('LISTS', 1222223)
            }
        })
        const auth = Auth({
            title: 'oauth',
            label: 'Click here to authorize',
            description: 'blabla',
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
            // onReturn: (a) => {
            //     this.state.props.settingsStorage.setItem('test', JSON.stringify(a))
            //     console.log(props)
            // }
        });
        return Section({}, [auth, btntmp, btn1, btn2, txt, txt2, txt3, txt4])
    },
})