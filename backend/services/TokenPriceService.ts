import logger from "../helpers/logger";
import { TokenPriceError } from "../routes/tokenPrice/TokenPriceErrors";
import { TOKEN_PRICE_FETCH_INTERVAL, TOKEN_PRICE_KEY, TOKEN_PRICE_REDIS_EXPIRY } from "../helpers/common/constants";
import { TokenPriceService } from "./types";
import { redisClient } from "../infra";
import { getTokenPriceFromAlchemy } from "../infra/utils/Token";

class TokenPriceServiceImpl implements TokenPriceService {
    private interval !:NodeJS.Timeout | null;

    private pollFetchTokenPrice = async () => {
        logger.debug('Poll: Get the latest token prices from alchemy')
        try {
            const tokenPrice = await getTokenPriceFromAlchemy()
            const saveToRedis = await redisClient.set(TOKEN_PRICE_KEY, JSON.stringify(tokenPrice), TOKEN_PRICE_REDIS_EXPIRY)
            if (!saveToRedis) throw new TokenPriceError({key: 'token_price_redis_save_failed'})
        } catch (error: any) {
            logger.error('Failed to get the token price due to:', error?.message)
        }
    }
    
    constructor() {
        this.initPoll()
    }

    private initPoll(): void {
        this.interval = setInterval(this.pollFetchTokenPrice, TOKEN_PRICE_FETCH_INTERVAL)
    }

    async getLatestPrices() {
        try {
            const tokenPrices = await redisClient.get(TOKEN_PRICE_KEY)
            if (tokenPrices) {
                logger.debug('Get the token price from cache')
                return JSON.parse(tokenPrices)
            } else {
                // Failed to hit cache, we get token prices from alchemy instead and set the result into cache
                logger.debug('Get the token price from alchemy instead')
                const tokenPrice = await getTokenPriceFromAlchemy()
                const saveToRedis = await redisClient.set(TOKEN_PRICE_KEY, JSON.stringify(tokenPrice), TOKEN_PRICE_REDIS_EXPIRY)
                if (!saveToRedis) throw new TokenPriceError({key: 'token_price_redis_save_failed'})
                return tokenPrice
            }
        } catch (error: any) {
            if (!(error instanceof TokenPriceError)) {
                throw new TokenPriceError({key: 'token_price_failed_others', params: [error?.message]})
            }
            throw error
        } 
    }
}

const tokenPriceService = new TokenPriceServiceImpl()
export default tokenPriceService