import {TEXT_STYLE} from './index.style'

const logger = DeviceRuntimeCore.HmLogger.getLogger('helloworld')
const dataList = [
    {name: 'a', age: 12, like: 2},
    {name: 'b', age: 13, like: 3},
    {name: 'c', age: 13, like: 4}
]

function updateList(list, dataArray) {
    console.log(4)
    list.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataArray,
        data_count: dataArray.length,
        //Refresh the data and stay on the current page. If it is not set or set to 0, it will return to the top of the list.
        on_page: 1
    })
}

function initList(dataArray) {
    return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        x: 10,
        y: 50,
        h: 404,
        w: 430,
        item_space: 10,
        item_config: [
            {
                type_id: 1,
                item_bg_color: 0xef5350,
                item_bg_radius: 10,
                text_view: [
                    {x: 0, y: 0, w: 200, h: 20, key: 'name', color: 0xffffff, text_size: 20},
                    {x: 0, y: 20, w: 50, h: 20, key: 'age', color: 0xffffff}
                ],
                text_view_count: 2,
                item_height: 40
            }
        ],
        item_config_count: 1,
        data_array: dataArray,
        data_count: dataArray.length,
        item_click_func: scrollListItemClick,
        data_type_config_count: 2
    })
}

function scrollListItemClick(list, index) {
    dataList.push({name: 'd', age: 14, like: 6})
    updateList(list, dataList)
}


Page({
    build() {
        logger.debug('page build invoked')
        const l = initList(dataList)
        hmUI.createWidget()
    },

    onInit() {
        logger.debug('page onInit invoked')
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },
})