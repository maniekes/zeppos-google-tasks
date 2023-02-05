import * as fs from './../shared/fs'
import {TODO_LISTS_FILE, TODO_LISTS_TASKS_FILE_PREFIX} from './constants'

export function readListsFromFile() {
    const resData = fs.readFileSync(`${TODO_LISTS_FILE}.json`)
    return !resData ? {} : JSON.parse(resData)
}

export function writeListsToFile(data) {
    fs.writeFileSync(`${TODO_LISTS_FILE}.json`, JSON.stringify(data))
}

export function readTasksFromFile(listId) {
    const resData = fs.readFileSync(`${TODO_LISTS_TASKS_FILE_PREFIX}${listId}.json`)
    return !resData ? [] : JSON.parse(resData)
}

export function writeTasksToFile(listId, data) {
    fs.writeFileSync(`${TODO_LISTS_TASKS_FILE_PREFIX}${listId}.json`, JSON.stringify(data))
}

