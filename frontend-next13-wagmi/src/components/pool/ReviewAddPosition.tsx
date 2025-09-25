import SVGClose from "@/lib/svgs/svg_close"
import { TokenType ,LocalChainIds, MintPositionParamsType} from "@/lib/types";
import { default as DexToken } from "../common/Token";
import AddPositionExecutor from "./AddPositionExecutor";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useEffect, useState } from "react";
import SVGCheck from "@/lib/svgs/svg_check";
import { useChainId, useAccount} from 'wagmi'
import { Decimal } from 'decimal.js'
import QuestionMarkToolTip from "../common/QuestionMarkToolTip";
import { 
    FeeAmount,
    Position,
    MintOptions,
    NonfungiblePositionManager,
    Pool} from '@uniswap/v3-sdk';
import {Token, Percent, ChainId} from '@uniswap/sdk-core';
import { PoolInfo } from "@/lib/tools/pool";
import { fromReadableAmount2 } from "@/lib/utils";
import { useUpdateSetting } from '@/config/store';
import {decodeFunctionData} from 'viem'
import { UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants";
import { toast } from "sonner"
import Link from "next/link";
import DexModal from "../common/DexModal";

const parseCalldata = (calldata: `0x${string}`) => {
    try {
        console.log('calldata:', calldata)
        const decoded = decodeFunctionData({
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            data: calldata
        })
        console.log('decoded', decoded)
        const name = decoded['functionName']
        const args = decoded['args'][0] as MintPositionParamsType
        console.log('name=', name)
        console.log('args=', args)
      
        return  args
    } catch (error) {
        console.log('Failed to parse calldata due to:', error)
    }
}
type AddSuccessProps = {
    token0: TokenType;
    token1: TokenType;
    depositedToken0: string;
    depositedToken1: string;
}
const AddSuccess:React.FC<AddSuccessProps> = ({token0, token1, depositedToken0, depositedToken1}) => {
    return (
        <div className="flex flex-col gap-y-4 items-center">
            <div className="flex flex-col gap-y-4 items-center">
                <div className="py-3">
                    <SVGCheck className="text-white bg-green-600 size-14 p-2 rounded-full"/>
                </div>
                <div className="font-semibold">A new position was added!</div>
            </div>
            <div className="border-t-[1px] border-zinc-600 my-4 text-sm">
                <div className="py-2 flex items-center">
                    <span>You deposited:</span>
                    <QuestionMarkToolTip>
                        <div className="w-48">The actual amounts are determined by the live data in the UniswapV3Pool</div>
                    </QuestionMarkToolTip>
                </div>
                <div className="flex py-2">
                    <span className="text-pink-600 pr-2">{depositedToken0}</span>
                    <DexToken token={token0} imageSize={20}/>
                </div>
                <div className="flex">
                    <span className="text-pink-600 pr-2">{depositedToken1}</span>
                    <DexToken token={token1} imageSize={20}/>
                </div>
            </div>
            <div><Link href="www.baidu.com" className="text-xs text-pink-600">View details</Link></div>
        </div>
        
    )
}
type ReviewAddPositionProps = {
    token0: TokenType;
    token1: TokenType;
    token0Input:string;
    token1Input:string;
    poolInfo: PoolInfo; 
    lowerTick: number;
    curTick: number;
    upperTick: number;
    closeAddPositionModal: () => void
}
const ReviewAddPosition: React.FC<ReviewAddPositionProps> = ({token0, token1, token0Input, token1Input,
                                                              poolInfo,lowerTick, curTick, upperTick,
                                                              closeAddPositionModal}) => {
    const [showSuccess, setShowSuccess] = useState(false)
    const [deposit, setDeposit] = useState<{token0: string, token1: string}>({token0: '', token1: ''})
    const [tokensUSD, setTokensUSD] = useState<{token0: string, token1: string}>({token0: '0', token1: '0'})
    const [data, setData] = useState<{calldata: string, parsedCalldata: MintPositionParamsType}>()
    const {slipage, deadline} = useUpdateSetting()
    const { address} = useAccount()
    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)

    console.log('[ReviewAddPosition] token0Input=', token0Input, '  token1Input=', token1Input)

    useEffect(() => {
        updateUSD()
        updateCallData()
    }, [])

    const updateCallData = () => {
        try{
            const callData = generateCallData()
            const parsedCalldata = parseCalldata(callData as `0x${string}`)
            console.log('parsedCalldata=', parsedCalldata)
            if (!parsedCalldata) {
                throw new Error('Failed to parse calldata')
            }
            setData({calldata: callData, parsedCalldata: parsedCalldata})
        } catch (error) {
            console.log('We failed to get calldata or parse calldata:', error)
            toast.error('There is something wrong. Please try again')
        }
    }

    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price0 = tokenPrices[targetChainId]?.get(token0.address)
        const price1 = tokenPrices[targetChainId]?.get(token1.address)
        let token0USD = '0'
        let token1USD = '0'
        
        if (price0) {
            token0USD = new Decimal(price0).times(token0Input ? new Decimal(token0Input) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        if (price1) {
            token1USD = new Decimal(price1).times(token1Input ? new Decimal(token1Input) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        console.log(`token0Input=${token0Input}, token1Input=${token1Input}, price0=${price0?.toString()}, price1=${price1?.toString()}`)
        setTokensUSD({token0: token0USD, token1: token1USD})
    }

    const constructPosition = () => {
        const feeAmount_enum = poolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            poolInfo.sqrtPriceX96.toString(),
            poolInfo.liquidity.toString(),
            poolInfo.tick
        )

        let position = undefined
        if (upperTick <= curTick) { // token0 is hidden
            position = Position.fromAmount1({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount1: fromReadableAmount2(token1Input, token1.decimal)
            })
            const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
            const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
            console.log('[token0 is hidden] burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        } else if (lowerTick >= curTick) { // token1 is hidden
            position = Position.fromAmount0({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount0: fromReadableAmount2(token0Input, token0.decimal),
                useFullPrecision: true,
            })
            const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
            const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
            console.log('[token1 is hidden] burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        } else {
            // no tokens hidden
            position = Position.fromAmounts({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount0: fromReadableAmount2(token0Input, token0.decimal),
                amount1: fromReadableAmount2(token1Input, token1.decimal),
                useFullPrecision: true,
            })
            const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
            const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
            console.log('[no tokens hidden]burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        }
        return position 
    }

    const generateCallData = () => {
        const positionToMint = constructPosition()
        const mintOptions: MintOptions = {
            recipient: address!, 
            deadline: Math.floor(Date.now() / 1000) + (deadline === '' ? 1800 : deadline * 60),
            slippageTolerance: new Percent(slipage * 100, 10_000),
        }
        const { calldata } = NonfungiblePositionManager.addCallParameters(
            positionToMint,
            mintOptions
        )
        return calldata
    }

    const handleAddSuccess = (token0ActualDeposit: string, token1ActualDeposit: string) => {
        setShowSuccess(true)
        setDeposit({token0: token0ActualDeposit, token1: token1ActualDeposit})
    }
    return (
        <DexModal onClick={closeAddPositionModal} title="Adding position">
            {
                showSuccess
                ? <AddSuccess token0={token0} token1={token1} 
                              depositedToken0={deposit.token0} depositedToken1={deposit.token1}/>
                : <div>
                    <div className="pb-2 text-sm">Deposit tokens:</div>
                    <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                        <div className="text-sm p-2">
                            <div className="text-pink-600">${token0Input}</div>
                            <div className="text-xs text-zinc-400">${tokensUSD.token0}</div>
                        </div>
                        <div><DexToken token={token0} imageSize={30}/></div>
                    </div>
                    <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                        <div className="text-sm p-2">
                            <div className="text-pink-600">${token1Input}</div>
                            <div className="text-xs text-zinc-400">${tokensUSD.token1}</div>
                        </div>
                        <div><DexToken token={token1} imageSize={30}/></div>
                    </div>
                    {
                        data?.calldata && data.parsedCalldata &&
                        <AddPositionExecutor 
                            data={data}
                            token0={token0}
                            token1={token1}
                            token0Input={token0Input}
                            token1Input={token1Input}
                            handleAddSuccess={handleAddSuccess}/>
                    }
                    
                  </div>
            }
        </DexModal>
    )
}

export default ReviewAddPosition