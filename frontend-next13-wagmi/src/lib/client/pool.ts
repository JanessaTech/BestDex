import logger from '@/common/Logger'
import messageHelper from '@/common/internationalization/messageHelper'
import { PoolInfo } from '@/common/types'
import axios from 'axios'

export const fetchLatestPoolInfo = async (poolAddress: `0x${string}`, chainId: number) => {
    logger.debug('[API client: pool] fetchLatestPoolInfo. poolAddress=', poolAddress, ' chainId=', chainId)
    try {
        const response = await axios.get<DexResponseType<PoolInfo>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/pool/getLatestPoolInfo/${chainId}?poolAddress=${poolAddress}`)
        const pooInfo = response?.data.data
        if (!pooInfo) throw new Error('pooInfo is null')
        return pooInfo
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: pool] fetchLatestPoolInfo.', messageHelper.getMessage('pool_fetch_latest_failed', poolAddress, chainId, reason))
        logger.error(error)
        throw error
    }
}