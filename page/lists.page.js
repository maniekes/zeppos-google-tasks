import {TODO_MSG} from "../utils/constants";
import {readListsFromFile, writeListsToFile} from "../utils/fs";
import {initList, updateList} from "./common.page";

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
        this.state.list = initList(this, this.scrollListItemClick)
        this.fetchLists()
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
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
                updateList(this.state.list, this.state.header, this.state.items, this.state.footer)
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
})