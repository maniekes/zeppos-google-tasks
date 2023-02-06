import {TODO_MSG} from "../../../utils/constants";
import {readListsFromFile} from "../../../utils/fs";

const {messageBuilder} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('helloworld')
const dataList = [{title: 'loading'}]

function updateList(list, dataArray) {
    list.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataArray, data_count: dataArray.length, on_page: 1
    })
}

function initList(dataArray, callback) {
    return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        x: 0,
        y: 60,
        h: px(454),
        w: px(454),
        item_space: 20,
        item_config: [{
            type_id: 1,
            item_bg_color: 0x333333,
            item_bg_radius: 20,
            text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 30}
                // ,{x: 0, y: 40, w: 200, h: 20, key: 'etag', color: 0xffffff}
            ],
            text_view_count: 1,
            item_height: 80
        }],
        item_config_count: 1,
        data_array: dataArray,
        data_count: dataArray.length,
        item_click_func: callback,
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
    state: {
        savedLists: null
    },
    onInit(p) {
        logger.debug('page onInit invoked')
        const param = p !== undefined ? JSON.parse(p) : {}
        this.state.savedLists = readListsFromFile()
    },

    build() {
        logger.debug('page build invoked')

        if(!this.savedLists.defaultList) {
            logger.info('no default list set, going to lists')
            hmApp.gotoPage({
                url: 'page/t-rex2/home/lists.page'
            })
            return;
        }

        const text = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 0,
            w: 454,
            h: 40,
            color: 0xffffff,
            text_size: 36,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: 'Tasks'
        })

        const l = initList(dataList, scrollListItemClick)

        scrollListItemClick(l, 0)
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },
})