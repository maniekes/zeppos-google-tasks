import './shared/device-polyfill';
import { MessageBuilder } from './shared/message';
import { kpayConfig } from './shared/kpay-config';
import kpayApp from 'kpay-amazfit/app';

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks');
const appDevicePort = 20;
const appSidePort = 0;
const appId = 1019779;
const messageBuilder = new MessageBuilder({
  appId,
  appDevicePort,
  appSidePort,
});

const kpay = new kpayApp({ ...kpayConfig, dialogPath: 'page/kpay/index.page', messageBuilder });

App({
  globalData: {
    messageBuilder,
    kpay,
  },
  onCreate() {
    logger.log('app onCreate invoked');
    messageBuilder.connect();
    kpay.init();
  },
  onDestroy() {
    logger.log('app onDestroy invoked');
    messageBuilder.disConnect();
  },
});
