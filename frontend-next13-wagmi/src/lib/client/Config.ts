import logger from '@/common/Logger'
import messageHelper from '@/common/internationalization/messageHelper'
import axios from 'axios'
import { DexResponseType, FeeTierType, TokenListType } from './types'

export const getTokenListFromConfig = async () => {
    logger.debug('[API client: config] getTokenListFromConfig.')
    try {
        const response = await axios.get<DexResponseType<TokenListType>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/config/tokenList`)
        return response?.data?.data
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: config] getTokenListFromConfig.', messageHelper.getMessage('tokenList_get_failed',reason))
        logger.error(error)
        throw error
    }
}

export const getFeeTiersFromConfig = async () => {
    logger.debug('[API client: config] getFeeTiersFromConfig.')
    try {
        const response = await axios.get<DexResponseType<FeeTierType[]>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/config/feetiers`)
        return response?.data?.data
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: config] getFeeTiersFromConfig.', messageHelper.getMessage('feetiers_get_failed',reason))
        logger.error(error)
        throw error
    }
}