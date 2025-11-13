import { ethers } from "ethers";
import logger from "../helpers/logger";
import { getHttpByChainId } from "../infra/utils/Chain";
import { UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES, UNISWAP_V3_POSITION_MANAGER_ABI, MULTICALL_ADDRESS, MULTICALL_ABI, THEGRAPH_ENDPOINTS } from "../helpers/common/constants";
import { PositionError } from "../routes/position/PositionErrors";
import { PositionService } from "./types";
import { PositionInfoType } from "../controllers/types";
import { request, gql } from 'graphql-request'
import { positionListQuery } from "../helpers/common/queries";

class PositionServiceImpl implements PositionService {

    private getPositionIds = async (provider: ethers.providers.JsonRpcProvider, positionMangerAddress: `0x${string}`, owner: `0x${string}`) => {
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

    private getPositionInfo = async (provider: ethers.providers.JsonRpcProvider, 
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

    private getPositionListByGraph  = async (chainId: number, owner: `0x${string}`) => {
        const endpoint = THEGRAPH_ENDPOINTS[chainId]
        if (!endpoint) {
            throw new PositionError({key: 'position_thegraph_url_not_found', params: [chainId]})
        }
        
        const headers = {
            Authorization: `Bearer ${process.env.THEGRAPH_API_KEY}`,
        };
        const positions: PositionInfoType[] = []
        try {
            const data = await request(endpoint, positionListQuery, {owner: owner}, headers);
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
        } catch (error: any) {
            if (!(error instanceof PositionError)) {
                throw new PositionError({key: 'positions_get_by_theGraph_failed', params: [error?.message]})
            }
            throw error
        }
    }

    private getPositionListByRPC = async (chainId: number, owner: `0x${string}`) => {
        try {
            const http = getHttpByChainId(chainId)
            const provider = new ethers.providers.JsonRpcProvider(http)
            const positionMangerAddress = UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES[chainId]
            if (!positionMangerAddress) {
                new PositionError({key: 'position_positionManager_not_found', params: [chainId]})
            }

            const positionIds = await this.getPositionIds(provider, positionMangerAddress, owner)
            const positions: PositionInfoType[] = []
            for (let tokenId of positionIds) {
                const position = await this.getPositionInfo(provider, positionMangerAddress, tokenId, owner)
                positions.push(position)
            }
            return positions
        } catch(error: any) {
            if (!(error instanceof PositionError)) {
                throw new PositionError({key: 'positions_get_by_rpc_failed', params: [error?.message]})
            }
            throw error
        }
    }


    async getPositions(chainId: number, owner: `0x${string}`) {
        logger.info('PositionService.getPositions. chainId=', chainId, ' owner=', owner)
        const positions = this.getPositionListByRPC(chainId, owner)
        return positions
    }
}

const positionService = new PositionServiceImpl()
export default positionService