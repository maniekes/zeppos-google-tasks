import './shared/device-polyfill';
import { MessageBuilder } from './shared/message';
import kpayApp from 'kpay-amazfit/app';
import {KPAY_CONFIG} from "./env";

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks');
const appDevicePort = 20;
const appSidePort = 0;
const appId = 1019779;
const messageBuilder = new MessageBuilder({
  appId,
  appDevicePort,
  appSidePort,
});

const kpay = new kpayApp({ ...KPAY_CONFIG, dialogPath: 'page/kpay/index.page', messageBuilder });

App({
  globalData: {
    messageBuilder,
    kpay,
  },
  onCreate() {
    logger.log('app onCreate invoked');
    messageBuilder.connect();
    kpay.init();
    logger.log('kpay license: ' + kpay.isLicensed())
    hmApp.setScreenKeep(true);
    if (!kpay.isLicensed()) {
      const timer1 = timer.createTimer(
          5000,
          1000,
          function (option) {
            //callback
            kpay.startPurchase();
          },
          { hour: 0, minute: 15, second: 30 }
      )
    }
  },
  onDestroy() {
    logger.log('app onDestroy invoked');
    messageBuilder.disConnect();
  },
});
