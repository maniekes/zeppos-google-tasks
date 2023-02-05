import {MessageBuilder} from '../shared/message'
import {fetchLists} from "./google-api";

const messageBuilder = new MessageBuilder()


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