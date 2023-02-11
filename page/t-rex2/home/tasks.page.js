import {TODO_MSG} from "../../../utils/constants";
import {readListsFromFile, writeListsToFile} from "../../../utils/fs";

const {messageBuilder} = getApp()._options.globalData

const logger = DeviceRuntimeCore.HmLogger.getLogger('zeppos-google-tasks')

Page({
    state: {
        items: [{title: 'loading'}],
        list: null,
        title: null,
        currentList: {}
    },

    onInit(p) {
        logger.debug('page onInit invoked')
        const param = p !== undefined ? JSON.parse(p) : {}
        logger.debug('received following param: ' + param.id)
        const savedLists = readListsFromFile()
        logger.info(`fetched savedlists ${savedLists}`)
        if (param.id) {
            logger.info(`setting list from param ${param.id} ${param.title}`)
            this.state.currentList = {id: param.id, title: param.title}
        } else if (savedLists.defaultList?.id) {
            logger.info(`setting saved list ${param.id} ${param.title}`)
            this.state.currentList = savedLists.defaultList
        }
    },

    build() {
        logger.debug('page build invoked')

        if (!this.state.currentList.id) {
            logger.info('no default list set, going to lists')
            hmApp.reloadPage({
                url: 'page/t-rex2/home/lists.page'
            })
        } else {
            this.initTitle()
            this.state.list = this.initList()
            this.fetchTasks(this.state.currentList.id)
            this.registerGestures()
        }
    },

    onDestroy() {
        logger.debug('page onDestroy invoked')
    },

    scrollListItemClick(tthis, list, index) {
        logger.info('item clickedg')
        const item = tthis.state.items[index]
        logger.info(`clicked ${item.title} / ${item.id} on list ${this.state.currentList.id}`)
        this.completeTask(this.state.currentList.id, item.id, item)
    },

    updateList() {
        this.state.list.setProperty(hmUI.prop.UPDATE_DATA, {
            data_array: this.state.items, data_count: this.state.items.length, on_page: 1
        })
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
                this.state.currentList.items = result.items
                this.state.items = result.items
                this.updateList()
            }
        }).catch((err) => logger.error(err))
    },

    completeTask(listId, taskId, task) {
        messageBuilder.request({
            method: TODO_MSG.COMPLETE_TASK_PUT,
            listId: listId,
            taskId: taskId,
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
                        url: 'page/t-rex2/home/lists.page'
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

    initList() {
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
            data_array: this.state.items,
            data_count: this.state.items.length,
            item_click_func: (l, i) => this.scrollListItemClick(this, l, i),
            data_type_config_count: 2
        })
    },

    initTitle() {
        return hmUI.createWidget(hmUI.widget.TEXT, {
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
    },
})