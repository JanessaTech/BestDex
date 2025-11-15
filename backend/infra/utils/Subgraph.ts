import { PositionProps, TokenType } from "../../controllers/types";
import { THEGRAPH_ENDPOINTS, UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES } from "../../helpers/common/constants";
import messageHelper from "../../helpers/internationalization/messageHelper";
import { request } from 'graphql-request'
import { positionListQuery } from "./Queries";
import { getHttpByChainId } from "./Chain";
import { ethers} from "ethers";
import logger from "../../helpers/logger";
import { getTokenMeta } from "./Token";

export const fetchPositionListInPageByGraph = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    logger.debug('Get position list from graph')
    const endpoint = THEGRAPH_ENDPOINTS[chainId]
    if (!endpoint) {
        throw new Error(messageHelper.getMessage('position_thegraph_url_not_found', chainId))
    }
    
    const headers = {
        Authorization: `Bearer ${process.env.THEGRAPH_API_KEY}`,
    };
    const positions: PositionProps[] = []
    const variables = {owner: owner, first: first, skip: skip}
    const data = await request(endpoint, positionListQuery, variables, headers);
    for (let pos of data['positions']) {
        const tokenId = pos['id']
        const owner = pos['owner']
        const fee = Number(pos['pool']['feeTier'])
        const token0: TokenType = {
                        chainId: chainId, 
                        name: pos['token0']['name'], 
                        symbol: pos['token0']['symbol'], 
                        decimal: Number(pos['token0']['decimals']),
                        alias: (pos['token0']['symbol'] as string).toLowerCase(),
                        address: pos['token0']['id'] as `0x${string}`
                    }
        const token1: TokenType = {
                        chainId: chainId, 
                        name: pos['token1']['name'], 
                        symbol: pos['token1']['symbol'], 
                        decimal: Number(pos['token1']['decimals']),
                        alias: (pos['token1']['symbol'] as string).toLowerCase(),
                        address: pos['token1']['id'] as `0x${string}`
                    }
        const tickLower = Number(pos['tickLower']['tickIdx'])
        const tickUpper = Number(pos['tickUpper']['tickIdx'])
        positions.push({
                tokenId: tokenId, 
                tickLower: tickLower, 
                tickUpper: tickUpper, 
                token0: token0, 
                token1: token1, 
                fee: fee, 
                owner: owner})
    }
    return positions
            
}
const getPositionIds = async (provider: ethers.providers.JsonRpcProvider, positionMangerAddress: `0x${string}`, owner: `0x${string}`) => {
    const positionContract = new ethers.Contract(
        positionMangerAddress,
        UNISWAP_V3_POSITION_MANAGER_ABI,
        provider
      )
    const balance: number = await positionContract.balanceOf(owner)
    const tokenIds = []
    for (let i = 0; i < balance; i++) {
        const tokenOfOwnerByIndex: bigint =
          await positionContract.tokenOfOwnerByIndex(owner, i)
        tokenIds.push(tokenOfOwnerByIndex)
    }
    return tokenIds
}

const getPositionInfo = async (provider: ethers.providers.JsonRpcProvider, 
    positionMangerAddress: `0x${string}`, tokenId: bigint, owner: `0x${string}`): Promise<PositionProps | undefined> => {
    const positionContract = new ethers.Contract(
        positionMangerAddress,
        UNISWAP_V3_POSITION_MANAGER_ABI,
        provider
      )
    const chainId = (await provider.getNetwork()).chainId
    const position = await positionContract.positions(tokenId)
    const token0 = getTokenMeta(chainId, position.token0)
    if (!token0) logger.error('Failed to get tokenMeta for token0 =', position.token0)
    const token1 = getTokenMeta(chainId, position.token1)
    if (token1) logger.error('Failed to get tokenMeta for token1 =', position.token1)
    if (token0 && token1) {
        return {
            tokenId: tokenId.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            token0: token0,
            token1: token1,
            owner: owner,
            fee: position.fee
        }
    }

    return undefined
}
export const fetchPositionListInPageByRPC = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    logger.debug('Get position list from rpc')
    const http = getHttpByChainId(chainId)
    const provider = new ethers.providers.JsonRpcProvider(http)
    const positionMangerAddress = UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES[chainId]
    if (!positionMangerAddress) {
        throw new Error(messageHelper.getMessage('position_positionManager_not_found', chainId))
    }

    const positionIds = await getPositionIds(provider, positionMangerAddress, owner)
    logger.debug('positionIds = ', positionIds)
    const idsInPage = positionIds.slice(skip, skip + first)
    logger.debug('idsInPage = ', idsInPage)
    const positions: PositionProps[] = []
    for (let tokenId of idsInPage) {
        const position = await getPositionInfo(provider, positionMangerAddress, tokenId, owner)
        if (position) {
            positions.push(position)
        }
        
    }
    return positions
}

export const fetchPositionListInPage = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    if (chainId === 31337) {
        return fetchPositionListInPageByRPC(chainId, owner, first, skip)
    }
    return fetchPositionListInPageByGraph(chainId, owner, first, skip)
}