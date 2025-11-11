import { createPublicClient, http, Chain} from 'viem'
import { hardhat} from 'viem/chains';
import { chainUrls } from '../../config/data/hardcode';
import logger from '../../helpers/logger';

export const createBlockchainClient = (chainId: number) => {
    logger.debug('creating publicClient fro chainId: ', chainId)
    const chainDetail = chainUrls.get(chainId)
    if (!chainDetail) {
        throw new Error(`Unsupported chainId: ${chainId}`)
    }
    logger.debug('transport:', chainDetail[1])
    let chain = chainDetail[0]
    if (chainId === 31337) {
        chain = {
            ...hardhat,
            contracts: {
                multicall3: {
                    address: '0xca11bde05977b3631167028862be2a173976ca11',
                    blockCreated: 14353601
                }
            }
        }
    }
    const publicClient = createPublicClient({
        chain: chain,
        transport: http(chainDetail[1])
    })
    return publicClient
}