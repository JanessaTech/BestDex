import { 
    NonfungiblePositionManager,
    CollectOptions
    } from '@uniswap/v3-sdk'
import {CurrencyAmount, Token, ChainId} from '@uniswap/sdk-core'
import { maxUint128, decodeFunctionData} from 'viem'
import { useAccount, useChainId} from 'wagmi'
import DexModal from "../common/DexModal"
import { useCallback, useEffect, useState } from 'react';
import CollectFeeSuccess from './CollectFeeSuccess';
import CollectFeeExecutor from './CollectFeeExecutor';
import { toast } from "sonner"
import { UNISWAP_V3_POSITION_MANAGER_ABI } from '@/config/constants';
import { CollectFeeParamsType, LocalChainIds, PositionProps } from '@/common/types'
import logger from '@/common/Logger'


const parseCalldata = (calldata: `0x${string}`) => {
    try {
        logger.debug('calldata:', calldata)
        const decoded = decodeFunctionData({
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            data: calldata
        })
        logger.debug('decoded', decoded)
        const name = decoded['functionName']
        const args = decoded['args'][0] as CollectFeeParamsType
        logger.debug('name=', name)
        logger.debug('args=', args)
        return  args
    } catch (error) {
        logger.error('[CollectFee] Failed to parse calldata due to:', error)
    }
}

type CollectFeeProps = {
    dexPosition: PositionProps;
    closeDexModal: () => void
}
const CollectFee: React.FC<CollectFeeProps> = ({dexPosition, closeDexModal}) => {
    const {address} = useAccount()
    const [showSuccess, setShowSuccess] = useState(false)
    const [deposited, setDeposited] = useState({token0: '0', token1: '0'})
    const [data, setData] = useState<{calldata: `0x${string}`, parsedCalldata: CollectFeeParamsType}>()
    const chainId = useChainId() as (ChainId | LocalChainIds)
    
    useEffect(() => {
        updateCallData()
    }, [])

    const updateCallData = () => {
        try {
            const callData = generateCallData()
            const parsedCalldata = parseCalldata(callData as `0x${string}`)
            logger.debug('[CollectFee] parsedCalldata=', parsedCalldata)
            if (!parsedCalldata) {
                throw new Error('Failed to parse calldata')
            }
            setData({calldata: callData, parsedCalldata: parsedCalldata})
        } catch (error) {
            logger.error('[CollectFee] We failed to get calldata or parse calldata:', error)
            toast.error('There is something wrong. Please try again')
        }
    }

    const generateCallData = () => {
        if (!address) throw new Error('Failed to get current wallet account')
        const token0 = new Token(dexPosition.token0.chainId, dexPosition.token0.address, dexPosition.token0.decimal, dexPosition.token0.symbol, dexPosition.token0.name)
        const token1 = new Token(dexPosition.token1.chainId, dexPosition.token1.address, dexPosition.token1.decimal, dexPosition.token1.symbol, dexPosition.token1.name)
        const collectOptions: CollectOptions = {
            tokenId: dexPosition.tokenId,
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(token0, maxUint128.toString()),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(token1, maxUint128.toString()),
            recipient: address,
        }
        const { calldata, value } =
        NonfungiblePositionManager.collectCallParameters(collectOptions)
        return calldata as `0x${string}`
    }

    const handleCollectFeeSuccess = useCallback((token0Deposited: string, token1Deposited: string) => {
        setShowSuccess(true)
        setDeposited({token0: token0Deposited, token1: token1Deposited})
    }, [])

    return (
        <DexModal 
            onClick={closeDexModal} 
            title="Collecting fee">
                {
                    showSuccess
                    ? <CollectFeeSuccess positionId={dexPosition.tokenId} token0={dexPosition.token0} token1={dexPosition.token1} 
                    depositedToken0={deposited.token0} depositedToken1={deposited.token1}/>
                    : 
                    <div className="text-sm flex flex-col gap-3">
                        <div><span className="mr-2">PositionId:</span><span>{dexPosition.tokenId}</span></div>
                        <div><span className="mr-2">Total liquidity:</span><span>{dexPosition.liquidity.toString()}</span></div>
                        <div>
                            {
                                data && <CollectFeeExecutor
                                        chainId={chainId}
                                        data={data}
                                        token0={dexPosition.token0} token1={dexPosition.token1}
                                        handleCollectFeeSuccess={handleCollectFeeSuccess}/>
                            }
                        </div>
                    </div>
                }
            
        </DexModal>
    )
}

export default CollectFee