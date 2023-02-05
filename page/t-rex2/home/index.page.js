import {TODO_MSG} from "../../../utils/constants";

const {messageBuilder} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('helloworld')
const dataList = [{name: 'a', age: 12, like: 2}, {name: 'b', age: 13, like: 3}, {name: 'c', age: 13, like: 4}]

function updateList(list, dataArray) {
    list.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataArray, data_count: dataArray.length,
        on_page: 1
    })
}

function initList(dataArray) {
    return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        x: 0,
        y: 0,
        h: px(454),
        w: px(454),
        item_space: 10,
        item_config: [{
            type_id: 1,
            item_bg_color: 0xef5350,
            item_bg_radius: 20,
            text_view: [{x: 10, y: 10, w: 410, h: 40, key: 'title', color: 0xffffff, text_size: 30}
                // ,{x: 0, y: 40, w: 200, h: 20, key: 'etag', color: 0xffffff}
            ],
            text_view_count: 1,
            item_height: 80
        }],
        item_config_count: 1,
        data_array: dataArray,
        data_count: dataArray.length,
        item_click_func: scrollListItemClick,
        data_type_config_count: 2
    })
}

function scrollListItemClick(list, index) {
    logger.info('item clickedg')
    messageBuilder.request({
        method: TODO_MSG.GET_LISTS
    }).then(({result}) => {
        if (result.error || result === 'ERROR') {
            hmUI.showToast({
                text: 'error'
            })
            logger.info(JSON.stringify(result))
        } else {
            logger.info(JSON.stringify(result))
            updateList(list, result.items)
        }
    }).catch((err) => logger.error(err))
}


Page({
    build() {
        logger.debug('page build invoked')
        const l = initList(dataList)
    },

    onInit() {
        logger.debug('page onInit invoked')
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },
})