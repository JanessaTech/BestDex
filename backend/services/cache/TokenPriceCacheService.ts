import { TOKEN_PRICE_KEY, TOKEN_PRICE_REDIS_EXPIRY } from '../../helpers/common/constants';
import redisClient from '../../infra/redis/RedisClient';

class TokenPriceCacheService {
    
    async getLatestPrices() {
        const res = await redisClient.get(TOKEN_PRICE_KEY)
        return res
    }

    async setLatestPrices(value: string) {
        const res = await redisClient.set(TOKEN_PRICE_KEY, value, TOKEN_PRICE_REDIS_EXPIRY)
        return res
    }
}

const tokenPriceCacheService = new TokenPriceCacheService()
export default tokenPriceCacheService