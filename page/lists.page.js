import {TODO_MSG} from "../utils/constants";
import {readListsFromFile, writeListsToFile} from "../utils/fs";
import {beautifyElement, buildFooterLicense, buildFooterTitle, initList, LIST_HEADER, updateList} from "./common.page";

const {messageBuilder, kpay} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks')

Page({
    state: {
        header: {title: 'Lists', mode: LIST_HEADER.OFFLINE},
        items: [{displayTitle: 'loading'}],
        footer: {title: buildFooterTitle(), license: buildFooterLicense(kpay)},
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
            this.state.header.mode = LIST_HEADER.CACHE
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
                    text: result.error ? result.error : 'error'
                })
                logger.info(JSON.stringify(result))
            } else {
                logger.info(JSON.stringify(result))
                this.state.header.mode = LIST_HEADER.ONLINE
                this.state.items = result.items.map(beautifyElement)
                this.state.savedLists.items = this.state.items
                updateList(this.state.list, this.state.header, this.state.items, this.state.footer)
                writeListsToFile(this.state.savedLists)
            }
        }).catch((err) => {
            logger.error(err)
        })
    },

    scrollListItemClick(tthis, list, index) {
        if (index === 0 || index === tthis.state.items.length + 1) {
            return
        }
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