import logger from '@/common/Logger'
import messageHelper from '@/common/internationalization/messageHelper'
import axios from 'axios'
import { DexResponseType } from './types'

export const getLatestPrices = async () => {
    logger.debug('[API client: TokenPrices]: getLatestPrices')
    try {
        const response = await axios.get<DexResponseType>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/price/getTokenPrices`)
        return response?.data?.data
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: TokenPrices]  getLatestPrices.', messageHelper.getMessage('token_price_get_failed', reason))
        logger.error(error)
        throw error
    }
}