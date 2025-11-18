import { tokenList } from "../../config/data/hardcode"
import messageHelper from "../../helpers/internationalization/messageHelper"
import logger from "../../helpers/logger"

export const getTokenMeta = (chainId: number, address: `0x${string}`) => {
    const found = tokenList.find((e) => e.chainId === chainId)?.tokens?.find((token) => token.address.toLowerCase() === address.toLocaleLowerCase())
    if (!found) throw new Error(messageHelper.getMessage('token_not_found', chainId, address))
    return found
}

export const getTokenPriceFromAlchemy = async () => {
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
    throw new Error('response is not ok to get token price');
    }
    const payload = await response.json()
    return payload
}