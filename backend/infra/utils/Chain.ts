import { createPublicClient, http, Chain } from 'viem'
import { chainUrls } from '../../config/data/hardcode';
import logger from '../../helpers/logger';

export const createBlockchainClient = (chainId: number) => {
    const chainDetail = chainUrls.get(chainId)
    if (!chainDetail) {
        throw new Error(`Unsupported chainId: ${chainId}`)
    }
    logger.debug('transport:', chainDetail[1])
    const publicClient = createPublicClient({
        chain: chainDetail[0],
        transport: http(chainDetail[1])
    })
    return publicClient
}