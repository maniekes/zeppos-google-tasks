import {TODO_MSG} from "../utils/constants";
import {readListsFromFile, writeListsToFile} from "../utils/fs";

const {messageBuilder} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks')

Page({
    state: {
        header: {title: 'Lists.'},
        items: [{title: 'loading'}],
        footer: {title: 'fajnie, nie?'},
        list: null,
        title: null,
        savedLists: {}
    },

    onInit() {
        logger.debug('page onInit invoked')
        this.state.savedLists = readListsFromFile()
        if (this.state.savedLists.items) {
            logger.debug('prepopulating list from cache')
            this.state.items = this.state.savedLists.items
        }
    },

    build() {
        logger.debug('page build invoked')
        this.state.list = this.initList()
        this.updateList()
        this.fetchLists()
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },

    updateList() {
        this.state.list.setProperty(hmUI.prop.UPDATE_DATA, {
            data_array: [this.state.header, ...this.state.items, this.state.footer],
            data_count: this.state.items.length + 2,
            on_page: 1,
            data_type_config: [
                {start: 0, end: 1, type_id: 1},
                {start: 1, end: this.state.items.length + 1, type_id: 2},
                {start: this.state.items.length + 1, end: this.state.items.length + 1, type_id: 3}
            ],
            data_type_config_count: 3
        })
    },

    fetchLists() {
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
                this.state.header.title = 'Lists'
                this.state.savedLists.items = result.items
                this.state.items = result.items
                this.updateList()
                writeListsToFile(this.state.savedLists)
            }
        }).catch((err) => logger.error(err))
    },

    scrollListItemClick(tthis, list, index) {
        logger.info('item clickedg')
        const item = tthis.state.items[index - 1]
        const listObject = {id: item.id, title: item.title};
        tthis.state.savedLists.defaultList = listObject
        logger.info(`clicked ${item.title} / ${item.id}`)
        writeListsToFile(tthis.state.savedLists)
        hmApp.reloadPage({
            url: 'page/tasks.page',
            param: JSON.stringify(listObject)
        })
    },

    initList() {
        return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
            x: 0,
            y: 0,
            h: px(454),
            w: px(454),
            item_space: 20,
            item_config: [
                {
                    type_id: 1,
                    item_bg_color: 0x000000,
                    item_bg_radius: 20,
                    text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 30}
                    ],
                    text_view_count: 1,
                    item_height: 80
                },
                {
                    type_id: 2,
                    item_bg_color: 0x333333,
                    item_bg_radius: 20,
                    text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 30}
                        // ,{x: 0, y: 40, w: 200, h: 20, key: 'etag', color: 0xffffff}
                    ],
                    text_view_count: 1,
                    item_height: 80
                },
                {
                    type_id: 3,
                    item_bg_color: 0x000000,
                    item_bg_radius: 20,
                    text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 20}
                    ],
                    text_view_count: 1,
                    item_height: 160
                }],
            item_config_count: 3,
            data_array: [this.state.header, ...this.state.items, this.state.footer],
            data_count: this.state.items.length + 2,
            item_click_func: (l, i) => this.scrollListItemClick(this, l, i),
            data_type_config: [
                {start: 0, end: 1, type_id: 1},
                {start: 1, end: this.state.items.length + 1, type_id: 2},
                {start: this.state.items.length + 1, end: this.state.items.length + 1, type_id: 3}
            ],
            data_type_config_count: 3
        })
    },
})