import './shared/device-polyfill'
import {MessageBuilder} from './shared/message'

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks')
const appId = 692137
const messageBuilder = new MessageBuilder({
    appId
})

App({
    globalData: {
        messageBuilder: messageBuilder,
    },
    onCreate() {
        logger.log('app onCreate invoked')
        messageBuilder.connect()
    },

    onDestroy() {
        logger.log('app onDestroy invoked')
        messageBuilder.disConnect()
    },
})
