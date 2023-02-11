export const initList = (tthis, callback) => {
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
                text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 30}],
                text_view_count: 1,
                item_height: 80
            },
            {
                type_id: 2,
                item_bg_color: 0x333333,
                item_bg_radius: 20,
                text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 30}],
                text_view_count: 1,
                item_height: 80
            },
            {
                type_id: 3,
                item_bg_color: 0x000000,
                item_bg_radius: 20,
                text_view: [{x: 0, y: 15, w: 454, h: 40, key: 'title', color: 0xffffff, text_size: 20}],
                text_view_count: 1,
                item_height: 160
            }],
        item_config_count: 3,
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