import logger from "../helpers/logger";
import { PositionError } from "../routes/position/PositionErrors";
import { PositionService } from "./types";
import { PositionProps } from "../controllers/types";
import { redisClient } from "../infra";
import { fetchPositionListInPage } from "../infra/utils/Subgraph";
import { POSITION_REDIS_EXPIRY } from "../helpers/common/constants";

class PositionServiceImpl implements PositionService {

    async getPositions(chainId: number, owner: `0x${string}`, page: number, pageSize: number) {
        logger.info('PositionService.getPositions. chainId=', chainId, ' owner=', owner)
        const positionListInPageKey = `positions:user:${owner}:chainId:${chainId}:page:${page}`
        try {
            const cachedPositions = await redisClient.get(positionListInPageKey)
            if (cachedPositions) {
                logger.debug('Get position list from redis')
                return JSON.parse(cachedPositions) as PositionProps[]
            } 
            const skip = (page - 1) * pageSize
            logger.debug(`Get position list. first=${pageSize} skip=${skip}`)
            const positions = await fetchPositionListInPage(chainId, owner, pageSize, skip)
            if (positions.length) {
                const saveToRedis = await redisClient.set(positionListInPageKey, JSON.stringify(positions), POSITION_REDIS_EXPIRY)
                if (!saveToRedis) throw new PositionError({key: 'positions_redis_save_failed'})
            }
            return positions
        } catch (error: any) {
            if (!(error instanceof PositionError)) {
                throw new PositionError({key: 'positions_get_by_theGraph_failed', params: [error?.message]})
            }
            throw error
        }
    }
}

const positionService = new PositionServiceImpl()
export default positionService