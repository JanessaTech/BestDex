import { PositionInfoType } from "../../controllers/types";
import { THEGRAPH_ENDPOINTS, UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES } from "../../helpers/common/constants";
import messageHelper from "../../helpers/internationalization/messageHelper";
import { request } from 'graphql-request'
import { positionListQuery } from "./Queries";
import { getHttpByChainId } from "./Chain";
import { ethers } from "ethers";

export const fetchPositionListInPageByGraph = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    const endpoint = THEGRAPH_ENDPOINTS[chainId]
    if (!endpoint) {
        throw new Error(messageHelper.getMessage('position_thegraph_url_not_found', chainId))
    }
    
    const headers = {
        Authorization: `Bearer ${process.env.THEGRAPH_API_KEY}`,
    };
    const positions: PositionInfoType[] = []
    const variables = {owner: owner, first: first, skip: skip}
    const data = await request(endpoint, positionListQuery, variables, headers);
    for (let pos of data['positions']) {
        const tokenId = pos['id']
        const owner = pos['owner']
        const fee = Number(pos['pool']['feeTier'])
        const token0 = pos['token0']['id']
        const token1 = pos['token1']['id']
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
    positionMangerAddress: `0x${string}`, tokenId: bigint, owner: `0x${string}`): Promise<PositionInfoType> => {
    const positionContract = new ethers.Contract(
        positionMangerAddress,
        UNISWAP_V3_POSITION_MANAGER_ABI,
        provider
      )
    const position = await positionContract.positions(tokenId)

    return {
        tokenId: tokenId.toString(),
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        token0: position.token0,
        token1: position.token1,
        owner: owner,
        fee: position.fee
    }
}
export const fetchPositionListInPageByRPC = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    const http = getHttpByChainId(chainId)
    const provider = new ethers.providers.JsonRpcProvider(http)
    const positionMangerAddress = UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES[chainId]
    if (!positionMangerAddress) {
        throw new Error(messageHelper.getMessage('position_positionManager_not_found', chainId))
    }

    const positionIds = await getPositionIds(provider, positionMangerAddress, owner)
    const idsInPage = positionIds.slice(skip, skip + first)
    const positions: PositionInfoType[] = []
    for (let tokenId of idsInPage) {
        const position = await getPositionInfo(provider, positionMangerAddress, tokenId, owner)
        positions.push(position)
    }
    return positions
}

export const fetchPositionListInPage = async (chainId: number, owner: `0x${string}`, first: number, skip: number) => {
    if (chainId === 31337) {
        return fetchPositionListInPageByRPC(chainId, owner, first, skip)
    }
    return fetchPositionListInPageByGraph(chainId, owner, first, skip)
}