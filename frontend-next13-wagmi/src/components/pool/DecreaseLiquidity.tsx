import { PositionProps } from "@/lib/types";
import DexModal from "../common/DexModal"
import { useCallback, useState } from "react";
import Setting from "../common/Setting"
import { Button } from "../ui/button"
import { 
    FeeAmount,
    Position,
    CollectOptions,
    RemoveLiquidityOptions,
    NonfungiblePositionManager,
    Pool} from '@uniswap/v3-sdk';
import {CurrencyAmount, Token, Percent} from '@uniswap/sdk-core';
import { useAccount} from 'wagmi';
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { Decimal } from 'decimal.js'
import { useUpdateSetting } from "@/config/store";
import { maxUint128, decodeFunctionData} from 'viem'
import { UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants";
import DecreaseLiquidityExecutor from "./DecreaseLiquidityExecutor";
import DecreaseLiquiditySuccess from "./DecreaseLiquiditySuccess";

const parseCalldata = (calldata: `0x${string}`) => {
    try {
        const decoded = decodeFunctionData({
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            data: calldata
        })
        console.log('decoded', decoded)
        const name = decoded['functionName']
        const args = decoded['args'][0] as `0x${string}`[]
        console.log('name=', name)
        console.log('args=', args)
        return  args
    } catch (error) {
        console.log('Failed to parse calldata due to:', error)
    }
}

type DEcreaseLiquidityProps = {
    dexPosition: PositionProps;
    closeDexModal: () => void
}
const DecreaseLiquidity: React.FC<DEcreaseLiquidityProps> = ({dexPosition,
                                                              closeDexModal}) => {
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const {address} = useAccount()
    const [removePercent, setRemovePercent] = useState<number | ''>(50)
    const [executed, setExecuted] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [deposited, setDeposited] = useState({token0: '0', token1: '0', removedLiquidity: ''})
    const [data, setData] = useState<{calldata: `0x${string}`, parsedCalldata: readonly `0x${string}`[]}>()
    const {getPoolAddress, getLatestPoolInfo} = useContextUtil() as IContextUtil

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }
    const handleRemovePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setRemovePercent(Number(e.target.value))
        } else {
            setRemovePercent('')
        } 
    }

    const handleRemovePercentOnBlur = () => {
        console.log('handleRemovePercentOnBlur')
        console.log('removePercent = ', removePercent)
        if (removePercent === 0 || removePercent === '') {
            setRemovePercent(50)
        }
    }

    const checkDisabled = () => {
        if (removePercent === '' || removePercent === 0) return true
        return false
    }

    const handleDecreaseLiquidity = async () => {
        try {
            const calldata = await generateCallData()
            const parsedCalldata = parseCalldata(calldata as `0x${string}`)
            if (!parsedCalldata) {
                throw new Error('Failed to parse calldata')
            }
            setData({calldata: calldata, parsedCalldata: parsedCalldata})
            setExecuted(true)
        } catch (error) {
            console.log(error)
        }
    }

    const generateCallData = async () => {
        const poolAddress = await getPoolAddress(dexPosition.token0.address, dexPosition.token1.address, dexPosition.fee)
        const curPoolInfo = await getLatestPoolInfo(poolAddress) // call backend api instead
        if (!curPoolInfo) throw new Error('Failed to get poolInfo')
        if (!address) throw new Error('Failed to get current wallet account')
        const token0 = new Token(dexPosition.token0.chainId, dexPosition.token0.address, dexPosition.token0.decimal, dexPosition.token0.symbol, dexPosition.token0.name)
        const token1 = new Token(dexPosition.token1.chainId, dexPosition.token1.address, dexPosition.token1.decimal, dexPosition.token1.symbol, dexPosition.token1.name)

        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const pool = new Pool(
            token0,
            token1,
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96.toString(),
            curPoolInfo.liquidity.toString(),
            curPoolInfo.tick
        )
        const position = new Position({ // reconstruct the position object
            pool,
            liquidity: dexPosition.liquidity.toString(),
            tickLower: dexPosition.lowerTick,
            tickUpper: dexPosition.upperTick
        })
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token0.decimal)).toDecimalPlaces(dexPosition.token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token1.decimal)).toDecimalPlaces(dexPosition.token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        
        const collectOptions: Omit<CollectOptions, 'tokenId'> = {
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(token0, maxUint128.toString()),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(token1, maxUint128.toString()),
            recipient: address,
        }
        const removeLiquidityOptions: RemoveLiquidityOptions = {
            deadline: Math.floor(Date.now() / 1000) + (deadline === '' ? 1800 : deadline * 60),
            slippageTolerance: new Percent(slipage * 100, 10_000),
            tokenId: dexPosition.id.toString(),
            // percentage of liquidity to remove
            liquidityPercentage: new Percent(removePercent, 100),
            collectOptions,
          }
          // get calldata for decreasing a position
        const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
            position,
            removeLiquidityOptions
        )
        console.log('calldata:', calldata)
        return calldata as `0x${string}`
    }

   const handleDecreaseLiquiditySuccess = useCallback((token0Deposited: string, token1Deposited: string) => {
        setShowSuccess(true)
        const removedLiquidity = new Percent(removePercent, 100).multiply(dexPosition.liquidity.toString()).quotient.toString()
        console.log('[DecreaseLiquidity] RemovedLiquidity=', removedLiquidity)
        setDeposited({token0: token0Deposited, token1: token1Deposited, removedLiquidity: removedLiquidity})
    }, [slipage])

    return (
        <DexModal 
            onClick={closeDexModal} 
            title="Decreasing liquidity"
            other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            {
                showSuccess
                ? <DecreaseLiquiditySuccess positionId={dexPosition.id} token0={dexPosition.token0} token1={dexPosition.token1} 
                    depositedToken0={deposited.token0} depositedToken1={deposited.token1} removedLiquidity={deposited.removedLiquidity}/>
                : 
                <div className="text-sm flex flex-col gap-3">
                    <div><span className="mr-2">PositionId:</span><span>{dexPosition.id.toString()}</span></div>
                    <div><span className="mr-2">Total liquidity:</span><span>{dexPosition.liquidity.toString()}</span></div>
                    <div className="flex items-center">
                        <span className="mr-2">Percentage to remove:</span>
                        <div className="flex items-center">
                            <input type="number"
                                    placeholder="50"
                                    min={0}
                                    max={100}
                                    className="border-[1px] border-zinc-500 rounded-md w-10 px-2 py-1 text-xs text-pink-600 font-semibold mr-1"
                                    value={removePercent}
                                    onChange={handleRemovePercentChange}
                                    onKeyDown={(event) => {
                                        const allow = (event?.key === 'Backspace' || event?.key === 'Delete')
                                                    || event?.key >= '0' && event?.key <= '9' && Number(`${removePercent}${event?.key}`) <= 100
                                        if (!allow) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onBlur={handleRemovePercentOnBlur}>
                            </input>
                            <span className="text-xs">% (0-100)</span>
                        </div>
                    
                    </div>
                    <div className='pt-4'>
                            <Button
                                className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                                disabled={executed || checkDisabled()}
                                onClick={handleDecreaseLiquidity}
                            > 
                            <span>Decrease Liquidity</span>
                            </Button>
                    </div>
                    <div>
                        {
                            data && <DecreaseLiquidityExecutor
                                    data={data}
                                    token0={dexPosition.token0} token1={dexPosition.token1}
                                    handleDecreaseLiquiditySuccess={handleDecreaseLiquiditySuccess}
                                    />
                        }
                    </div>
                </div>
            }  
        </DexModal>
    )
}

export default DecreaseLiquidity