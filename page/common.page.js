import {APP_VERSION} from "../utils/constants";

export const initList = (tthis, callback) => {
    const itemConfig = buildItemConfig()
    return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        x: 0,
        y: 0,
        h: px(454),
        w: px(454),
        item_space: 20,
        item_config: itemConfig,
        item_config_count: itemConfig.length,
        item_click_func: (l, i) => callback(tthis, l, i),
        ...buildDataArrayProps(tthis.state.header, tthis.state.items, tthis.state.footer)
    })
}

export const updateList = (list, header, items, footer) => {
    list.setProperty(hmUI.prop.UPDATE_DATA, {
        on_page: 1,
        ...buildDataArrayProps(header, items, footer)
    })
}

const buildDataArrayProps = (header, items, footer) => {
    return {
        data_array: [header, ...items, footer],
        data_count: items.length + 2,
        data_type_config: [
            {start: 0, end: 1, type_id: 1},
            {start: 1, end: items.length + 1, type_id: 2},
            {start: items.length + 1, end: items.length + 1, type_id: 3}
        ],
        data_type_config_count: 3
    }
}

const buildItemConfig = () => {
    const titleWidth = 300
    return [
        {
            type_id: 1,
            item_bg_color: 0x000000,
            item_bg_radius: 20,
            text_view: [{
                x: (454 - titleWidth) / 2,
                y: 35,
                w: titleWidth,
                h: 40,
                key: 'title',
                color: 0xffffff,
                text_size: 30
            },
                {x: 0, y: 0, w: 454, h: 20, key: 'mode', color: 0xffffff, text_size: 13}],
            text_view_count: 2,
            item_height: 80
        },
        {
            type_id: 2,
            item_bg_color: 0x333333,
            item_bg_radius: 40,
            text_view: [{x: 20, y: 0, w: 414, h: 80, key: 'displayTitle', color: 0xffffff, text_size: 30}],
            text_view_count: 1,
            item_height: 85
        },
        {
            type_id: 3,
            item_bg_color: 0x000000,
            item_bg_radius: 20,
            text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 20},
                {x: 0, y: 45, w: 454, h: 40, key: 'license', color: 0xffffff, text_size: 20}],
            text_view_count: 2,
            item_height: 160
        }]
}

export const beautifyElement = element => {
    const max_length = 28
    const l = element.title.length
    if (l < max_length) {
        element.displayTitle = element.title
    } else {
        const middle = Math.round(l / 2)
        const left = element.title.lastIndexOf(' ', middle)
        const right = element.title.indexOf(' ', middle)
        const leftSpace = left === -1 ? 0 : left
        const rightSpace = left === -1 ? element.title.length : right
        const bestMiddleSpaceCut = Math.abs(leftSpace - middle) < Math.abs(rightSpace - middle) ? leftSpace : rightSpace
        if (Math.abs(bestMiddleSpaceCut - middle) > max_length) {
            element.displayTitle = `${element.title.substring(0, middle)}\n${element.title.substring(middle)}`
        } else {
            element.displayTitle = `${element.title.substring(0, bestMiddleSpaceCut)}\n${element.title.substring(bestMiddleSpaceCut + 1)}`
        }
    }
    return element
}

export const LIST_HEADER = {
    OFFLINE: 'offline',
    CACHE: 'cache',
    ONLINE: 'online',
    UPDATING: 'updating'
}

export const buildFooterTitle = () => {
    return "Google Tasks v " + APP_VERSION;
}
export const buildFooterLicense = (k) => {
    return "license: " + k.isLicensed();
}