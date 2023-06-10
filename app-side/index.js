import {MessageBuilder} from '../shared/message'
import {completeTask, fetchLists, fetchTasksForList} from "./google-api";
import {TODO_MSG} from "../utils/constants";
import kpayAppSide from 'kpay-amazfit/app-side';
import {KPAY_CONFIG} from "../env";

const messageBuilder = new MessageBuilder()
const kpay = new kpayAppSide({...KPAY_CONFIG, messageBuilder});


AppSideService({
    onInit() {
        console.log('app side service invoke onInit')
        kpay.init();
        messageBuilder.listen(() => {
        })

        settings.settingsStorage.addListener('change', ({key, newValue, oldValue}) => {
            console.log(key, newValue, oldValue)
            if (key === "LISTS") {
                fetchLists({}).then((c) => {
                    console.log(c)
                });
            }
        },)

        messageBuilder.on('request', (ctx) => {
            const payload = messageBuilder.buf2Json(ctx.request.payload)
            if (!kpay.onRequest(payload)) {
                switch (payload.method) {
                    case TODO_MSG.GET_LISTS:
                        fetchLists().then(lists => {
                            ctx.response({
                                data: {result: lists},
                            })
                        })
                        break;

                    case TODO_MSG.GET_TASKS_FOR_LIST:
                        fetchTasksForList(payload.listId).then(tasks => {
                            ctx.response({
                                data: {result: tasks},
                            })
                        })
                        break;

                    case TODO_MSG.COMPLETE_TASK:
                        completeTask(payload.listId, payload.task).then(tasks => {
                            ctx.response({
                                data: {result: tasks},
                            })
                        })
                        break;

                    default:
                        console.warn(`unknown message type ${payload.method}!`)
                }
            }
        })

    }, onRun() {
        console.log('app side service invoke onRun')
    }, onDestroy() {
        kpay.destroy();
        console.log('app side service invoke onDestroy')
    }
})