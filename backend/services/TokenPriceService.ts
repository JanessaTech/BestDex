import { tokenList } from "../config/data/hardcode";
import logger from "../helpers/logger";
import { TokenPriceError } from "../routes/tokenPrice/TokenPriceErrors";
import { TokenPriceService } from "./types/TypesInService";
import tokenPriceCacheService from "./cache/TokenPriceCacheService"
import { TOKEN_PRICE_FETCH_INTERVAL } from "../helpers/common/constants";

class TokenPriceServiceImpl implements TokenPriceService {
    private interval !:NodeJS.Timeout | null;
    
    private getTokenPriceFromAlchemy = async () => {
        logger.info('Get the token price from alchemy')
        const url = `https://api.g.alchemy.com/prices/v1/${process.env.PUBLIC_ALCHEMY_ID}/tokens/by-address`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PUBLIC_ALCHEMY_ID}`,
        }

        const addresses: any = []
        tokenList.filter((chain) => chain.network_enum !== 'localhost' && chain.network_enum !== 'testnet').forEach((chain) => chain.tokens.forEach((token) => addresses.push({network: chain.network_enum, address: token.address})))
        const data = {addresses: addresses}
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
            });
    
        if (!response.ok) {
        throw new TokenPriceError({key: 'token_price_response_not_ok', params: ['response not ok']});
        }
        const payload = await response.json()
        const saveToRedis = await tokenPriceCacheService.setLatestPrices(JSON.stringify(payload))
        if (!saveToRedis) throw new TokenPriceError({key: 'token_price_redis_save_failed'})
        return payload
    }

    private pollFetchTokenPrice = async () => {
        logger.debug('Poll: Get the latest token prices from alchemy')
        try {
            await this.getTokenPriceFromAlchemy()
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
            const tokenPrices = await tokenPriceCacheService.getLatestPrices()
            if (tokenPrices) {
                logger.debug('Get the token price from cache')
                return JSON.parse(tokenPrices)
            } else {
                // Failed to hit cache, we get token prices from alchemy instead and set the result into cache
                logger.debug('Get the token price from alchemy instead')
                const payload = await this.getTokenPriceFromAlchemy()
                return payload
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