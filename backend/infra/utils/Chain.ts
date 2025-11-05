import { createPublicClient, http, Chain } from 'viem'
import { chainUrls } from '../../config/data/hardcode';

export const createBlockchainClient = (chainId: number) => {
    const chainDetail = chainUrls.get(chainId)
    if (!chainDetail) {
        throw new Error(`Unsupported chainId: ${chainId}`)
    }
    const publicClient = createPublicClient({
        chain: chainDetail[0],
        transport: http(chainDetail[1])
    })
    return publicClient
}