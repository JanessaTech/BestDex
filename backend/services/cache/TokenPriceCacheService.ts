import { TOKEN_PRICE_KEY, TOKEN_PRICE_REDIS_EXPIRY } from '../../helpers/common/constants';
import redis from '../../infra/RedisClient';

class TokenPriceCacheService {
    
    async getLatestPrices() {
        const res = await redis.get(TOKEN_PRICE_KEY)
        return res
    }

    async setLatestPrices(value: string) {
        const res = await redis.set(TOKEN_PRICE_KEY, value, TOKEN_PRICE_REDIS_EXPIRY)
        return res
    }
}

const tokenPriceCacheService = new TokenPriceCacheService()
export default tokenPriceCacheService