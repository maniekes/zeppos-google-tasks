import {TODO_MSG} from "../utils/constants";
import {readListsFromFile, readTasksFromFile, writeListsToFile, writeTasksToFile} from "../utils/fs";
import {beutifyElement, initList, LIST_HEADER, updateList} from "./common.page";

const {messageBuilder} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks')

Page({
    state: {
        header: {title: 'Tasks', mode: LIST_HEADER.OFFLINE},
        items: [{displayTitle: 'loading'}],
        footer: {title: 'fajnie, nie?'},
        list: null,
        title: null,
        currentList: {}
        //TODO: cache completed tasks when offline and send to phone when online
    },

    onInit(p) {
        logger.debug('page onInit invoked')
        const param = p !== undefined ? JSON.parse(p) : {}
        logger.debug('received following param: ' + param.id)
        const savedLists = readListsFromFile()
        if (param.id) {
            logger.info(`setting list from param ${param.id} ${param.title}`)
            this.state.currentList = {id: param.id, title: param.title}
        } else if (savedLists.defaultList?.id) {
            logger.info(`setting saved list ${param.id} ${param.title}`)
            this.state.currentList = savedLists.defaultList
        }
        if (this.state.currentList.title) {
            this.state.header.title = this.state.currentList.title
        }
        if (this.state.currentList.id) {
            const cachedItems = readTasksFromFile(this.state.currentList.id)
            if (cachedItems.length !== 0) {
                this.state.items = cachedItems
                this.state.header.mode = LIST_HEADER.CACHE
            }
        }
    },

    build() {
        logger.debug('page build invoked')

        if (!this.state.currentList.id) {
            logger.info('no default list set, going to lists')
            hmApp.reloadPage({
                url: 'page/lists.page'
            })
        } else {
            this.state.list = initList(this, this.scrollListItemClick)
            this.fetchTasks(this.state.currentList.id)
            this.registerGestures()
        }
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },

    scrollListItemClick(tthis, list, index) {
        if (index === 0 || index === tthis.state.items.length + 1) {
            return
        }
        logger.info('item clickedg')
        const item = tthis.state.items[index - 1]
        tthis.removeTask(index - 1)
        logger.info(`clicked ${item.title} / ${item.id} on list ${tthis.state.currentList.id}`)
        tthis.completeTask(tthis.state.currentList.id, item)
    },

    fetchTasks(listId) {
        messageBuilder.request({
            method: TODO_MSG.GET_TASKS_FOR_LIST,
            listId: listId
        }).then(({result}) => {
            if (result.error || result === 'ERROR') {
                hmUI.showToast({
                    text: 'error'
                })
                logger.info(JSON.stringify(result))
            } else {
                logger.info(JSON.stringify(result))
                this.state.header.mode = LIST_HEADER.ONLINE
                this.state.items = result.items.map(beutifyElement)
                updateList(this.state.list, this.state.header, this.state.items, this.state.footer)
                writeTasksToFile(this.state.currentList.id, this.state.items)
            }
        }).catch((err) => logger.error(err))
    },

    completeTask(listId, task) {
        messageBuilder.request({
            method: TODO_MSG.COMPLETE_TASK,
            listId: listId,
            task: task
        }).then(({result}) => {
            if (result.error || result === 'ERROR') {
                hmUI.showToast({
                    text: 'error'
                })
                logger.info(JSON.stringify(result))
            } else {
                logger.info(JSON.stringify(result))
                this.fetchTasks(listId)
            }
        }).catch((err) => logger.error(err))
    },

    removeTask(index) {
        this.state.header.mode = LIST_HEADER.UPDATING
        this.state.items.splice(index, 1)
        updateList(this.state.list, this.state.header, this.state.items, this.state.footer)
    },

    registerGestures() {
//Registering a gesture listener Repeated registration of a JsApp will cause the last registered callback to fail.
        hmApp.registerGestureEvent(function (event) {
            let msg = 'none'
            switch (event) {
                case hmApp.gesture.UP:
                    msg = 'up'
                    break
                case hmApp.gesture.DOWN:
                    msg = 'down'
                    break
                case hmApp.gesture.LEFT:
                    msg = 'left'
                    hmApp.reloadPage({
                        url: 'page/lists.page'
                    })
                    break
                case hmApp.gesture.RIGHT:
                    msg = 'right'
                    break
                default:
                    break
            }
            console.log(`receive gesture event ${msg}`)

            //Not skipping default behavior
            return false
        })
    },
})