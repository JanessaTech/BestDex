import { tokenList } from "../config/data/hardcode";
import logger from "../helpers/logger";
import { TokenPriceError } from "../routes/tokenPrice/TokenPriceErrors";
import { TokenPriceService } from "./types/TypesInService";

class TokenPriceServiceImpl implements TokenPriceService {
    async getLatestPrices() {
        const url = `https://api.g.alchemy.com/prices/v1/${process.env.NEXT_PUBLIC_ALCHEMY_ID}/tokens/by-address`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        }

        const addresses: any = []
        tokenList.filter((chain) => chain.network_enum !== 'localhost' && chain.network_enum !== 'testnet').forEach((chain) => chain.tokens.forEach((token) => addresses.push({network: chain.network_enum, address: token.address})))
        const data = {addresses: addresses}
        logger.debug('data:', data)

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
            });
    
        if (!response.ok) {
        throw new TokenPriceError({key: 'token_price_failed'});
        }
        const payload = await response.json()
        return payload
    }
}

const tokenPriceService = new TokenPriceServiceImpl()
export default tokenPriceService