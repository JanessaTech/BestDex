import logger from "@/common/Logger"
import messageHelper from "@/common/internationalization/messageHelper"
import { PositionProps } from "@/common/types"
import { PAGE_SIZE } from "@/config/constants"
import axios from 'axios'

export const getPositionsByPage = async (chainId: number, owner: `0x${string}`, page: number = 1) => {
    logger.debug('[API client: Position] getPositions', 'chainId=', chainId, 'owner=', owner, 'page=', page)
    try {
        const response = await axios.get<DexResponseType<PositionProps[]>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/positions/${chainId}?owner=${owner}&pageSize=${PAGE_SIZE}&page=${page}`)
        const rawPositions = response?.data.data
        const positions = rawPositions?.map((position) => ({
            ...position,
            liquidity: BigInt(position.liquidity),
        }))
        return positions
    } catch (error: any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: Position] getPositions.', messageHelper.getMessage('positions_get_failed', chainId, owner, reason))
        logger.error(error)
        throw error
    }
}