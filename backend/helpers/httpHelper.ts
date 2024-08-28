import urls from '../config/urls'
import logger from './logger'
import axios from 'axios'
import messageHelper from './internationalization/messageHelper'

function getRoles(originalUrl: string) {
    for (const prop in urls) {
        let key = prop
        let value = urls[key]
        let matched = originalUrl.match(key)
        if (matched) return value
    }
    return []
}
/*
function getQueryObject({page, limit, sortBy, chainId, status, category, prices, title}) {
    const query = {}
    if (page) {
        query.page = Number(page)
    }
    if (limit) {
        query.limit = Number(limit)
    }
    if (sortBy) {
        query.sortBy = sortBy
    }
    if (chainId) {
        query.chainId = Number(chainId)
    }
    if (status) {
        query.status = status
    }
    if (category) {
        query.category = category
    }
    if (prices) {
        query.prices = prices
    }
    if (title) {
        query.title = title 
    }
    return query
}*/


const getResponseData = async (url: string) => {
    try {
        const response = await axios.get(url)
        return response?.data
    } catch (err) {
        const errMsg = messageHelper.getMessage('httpHelper_failed_getData', url, err)
        logger.error(errMsg)
        throw new Error(errMsg)
    }
}


export  default {
    getRoles, getResponseData
}