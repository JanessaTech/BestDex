import { ethers } from "ethers";
import logger from "../helpers/logger";
import { getHttpByChainId } from "../infra/utils/Chain";
import { UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES, UNISWAP_V3_POSITION_MANAGER_ABI } from "../helpers/common/constants";
import { PositionError } from "../routes/position/PositionErrors";
import { PositionService } from "./types";
import { PositionInfoType } from "../controllers/types";

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
            const tokenOfOwnerByIndex: string =
              await positionContract.tokenOfOwnerByIndex(owner, i)
            tokenIds.push(tokenOfOwnerByIndex)
        }
        return tokenIds
    }

    private getPositionInfo = async (provider: ethers.providers.JsonRpcProvider, 
        positionMangerAddress: `0x${string}`, tokenId: string, owner: `0x${string}`): Promise<PositionInfoType> => {
        const positionContract = new ethers.Contract(
            positionMangerAddress,
            UNISWAP_V3_POSITION_MANAGER_ABI,
            provider
          )
        const position = await positionContract.positions(tokenId)

        return {
            tokenId: tokenId,
            tickLower: position.tickLower,
            tickUpper: position.tickLower,
            token0: position.token0,
            token1: position.token1,
            owner: owner,
            fee: position.fee
        }
    }

    async getPositions(chainId: number, owner: `0x${string}`) {
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
        } catch(error) {
            throw error
        }
    }
}

const positionService = new PositionServiceImpl()
export default positionService