import { useEffect, useState } from "react"
import DexModal from "../common/DexModal"
import Setting from "../common/Setting"
import { useUpdateSetting } from "@/config/store"
import DepositInput from "./DepositInput"
import { IncreasePositionParamsType, PositionProps, TokenType } from "@/lib/types"
import { Button } from "../ui/button"
import { PoolInfo, isDataStale } from "@/lib/tools/pool"
import { 
    FeeAmount,
    Position,
    AddLiquidityOptions,
    NonfungiblePositionManager,
    Pool} from '@uniswap/v3-sdk';
import {Token, Percent} from '@uniswap/sdk-core';
import { toast } from "sonner"
import { fromReadableAmount2 } from "@/lib/utils"
import { Decimal } from 'decimal.js'
import {decodeFunctionData} from 'viem'
import { UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import IncreaseLiquidityExecutor from "./IncreaseLiquidityExecutor"
import IncreaseLiquiditySuccess from "./IncreaseLiquiditySuccess"

const parseCalldata = (calldata: `0x${string}`) => {
    try {
        console.log('calldata:', calldata)
        const decoded = decodeFunctionData({
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            data: calldata
        })
        console.log('decoded', decoded)
        const name = decoded['functionName']
        const args = decoded['args'][0] as IncreasePositionParamsType
        console.log('name=', name)
        console.log('args=', args)
      
        return  args
    } catch (error) {
        console.log('Failed to parse calldata due to:', error)
    }
}

type IncreaseLiquidityProps = {
    token0Balance: string;
    token1Balance: string;
    poolInfo: PoolInfo;
    dexPosition: PositionProps;
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({ token0Balance, token1Balance,
                                                              poolInfo, dexPosition,
                                                              closeDexModal}) => {
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const [deposit, setDeposit] = useState({amount0: '0', amount1: '0'})
    const [curPoolInfo, setCurPoolInfo] = useState(poolInfo)
    const [whoInput, setWhoInput] = useState(0)
    const [data, setData] = useState<{calldata: string, parsedCalldata: IncreasePositionParamsType}>()
    const [showSuccess, setShowSuccess] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [deposited, setDeposited] = useState<{token0: string, token1: string, liquidity: string}>({token0: '', token1: '', liquidity: '0'})
    const {getPoolAddress, getLatestPoolInfo} = useContextUtil() as IContextUtil
    const [executed, setExecuted] = useState(false)

    useEffect(() => {
        console.log('[IncreaseLiquidity] curPoolInfo=', curPoolInfo)
        console.log('[IncreaseLiquidity] dexPosition=', dexPosition)
        updateDeposit()
    }, [curPoolInfo])

    const updatePooInfo = async () => {
        console.log('[IncreaseLiquidity] updatePooInfo')
        const poolAddress = await getPoolAddress(dexPosition.token0.address, dexPosition.token1.address, curPoolInfo.fee)
        const latestPoolInfo = await getLatestPoolInfo(poolAddress)
        if (!latestPoolInfo) return // it shouldn't happen after we move websocket to backend
        setCurPoolInfo(latestPoolInfo)
        setShowDialog(false)
    }

    const updateDeposit = async () => {
        if (dexPosition.upperTick <= curPoolInfo.tick ) {
            console.log('token0 is hidden')
            handleDepositChanges('0', '0')
        } else if (dexPosition.lowerTick >=  curPoolInfo.tick) {
            console.log('token1 is hidden')
            handleDepositChanges('0', '0')
        } else {
            console.log('no tokens is hidden')
            if (whoInput === 0) {
                const position = createPoistionFromToken0(deposit.amount0)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token0.decimal)).toDecimalPlaces(dexPosition.token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token1.decimal)).toDecimalPlaces(dexPosition.token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(deposit.amount0, burnAmount1)
            } else if (whoInput === 1) {
                const position = createPoistionFromToken1(deposit.amount1)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token0.decimal)).toDecimalPlaces(dexPosition.token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token1.decimal)).toDecimalPlaces(dexPosition.token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(burnAmount0, deposit.amount1)
            }
        }
    }

    const closeDialog = () => {
        setShowDialog(false)
    }

    const updateCallData = () => {
        const callData = generateCallData()
        const parsedCalldata = parseCalldata(callData as `0x${string}`)
        console.log('parsedCalldata=', parsedCalldata)
        if (!parsedCalldata) {
            throw new Error('Failed to parse calldata')
        }
        setData({calldata: callData, parsedCalldata: parsedCalldata})
    }

    const generateCallData = () => {
        const positionToIncreaseBy = constructPosition()
        const addLiquidityOptions: AddLiquidityOptions = {
            tokenId: dexPosition.id.toString(),
            deadline: Math.floor(Date.now() / 1000) + (deadline === '' ? 1800 : deadline * 60),
            slippageTolerance: new Percent(slipage * 100, 10_000),
        }
        const { calldata } = NonfungiblePositionManager.addCallParameters(
            positionToIncreaseBy,
            addLiquidityOptions
        )
        return calldata
    }

    const constructPosition = () => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(dexPosition.token0.chainId, dexPosition.token0.address, dexPosition.token0.decimal, dexPosition.token0.symbol, dexPosition.token0.name),
            new Token(dexPosition.token1.chainId, dexPosition.token1.address, dexPosition.token1.decimal, dexPosition.token1.symbol, dexPosition.token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96,
            curPoolInfo.liquidity,
            curPoolInfo.tick
        )

        let position = undefined
        if (dexPosition.upperTick <= curPoolInfo.tick) { // token0 is hidden
            position = Position.fromAmount1({
                pool: configuredPool,
                tickLower: dexPosition.lowerTick,
                tickUpper: dexPosition.upperTick,
                amount1: fromReadableAmount2(deposit.amount1, dexPosition.token1.decimal)
            })
            console.log('[IncreaseLiquidity] token0 is hidden')
        } else if (dexPosition.lowerTick >= curPoolInfo.tick) { // token1 is hidden
            position = Position.fromAmount0({
                pool: configuredPool,
                tickLower: dexPosition.lowerTick,
                tickUpper: dexPosition.upperTick,
                amount0: fromReadableAmount2(deposit.amount0, dexPosition.token0.decimal),
                useFullPrecision: true,
            })
            console.log('[IncreaseLiquidity] token1 is hidden')
        } else {
            // no tokens hidden
            position = Position.fromAmounts({
                pool: configuredPool,
                tickLower: dexPosition.lowerTick,
                tickUpper: dexPosition.upperTick,
                amount0: fromReadableAmount2(deposit.amount0, dexPosition.token0.decimal),
                amount1: fromReadableAmount2(deposit.amount1, dexPosition.token1.decimal),
                useFullPrecision: true,
            })
            console.log('[IncreaseLiquidity] no tokens hidden')
        }
        return position 
    }

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }

    const handleDepositChanges = (amount0: string, amount1: string) => {
        setDeposit({amount0: amount0, amount1: amount1})
    }

    const updateToken0Change = (value: string) => {
        const position = createPoistionFromToken0(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token0.decimal)).toDecimalPlaces(dexPosition.token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token1.decimal)).toDecimalPlaces(dexPosition.token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        console.log('value=', value)
        handleDepositChanges(value, burnAmount1)
        setWhoInput(0)
    }

    const updateToken1Change = (value: string) => {
        const position = createPoistionFromToken1(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token0.decimal)).toDecimalPlaces(dexPosition.token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(dexPosition.token1.decimal)).toDecimalPlaces(dexPosition.token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        handleDepositChanges(burnAmount0, value)
        setWhoInput(1)
    }

    const checkDisabled = () => {
        let disabled = true
        const dec0 = new Decimal(deposit.amount0 ? deposit.amount0 : '0')
        const dec1 = new Decimal(deposit.amount1 ? deposit.amount1 : '0')
        if (dexPosition.upperTick <= curPoolInfo.tick) { // token0 is hidden
            //we check token1 only
            disabled = dec1.lessThanOrEqualTo(new Decimal(token1Balance)) && dec1.greaterThan(0) ? false : true
        } else if (dexPosition.lowerTick >= curPoolInfo.tick) { // token1 is hidden
            //we check token0 only
            disabled = dec0.lessThanOrEqualTo(new Decimal(token0Balance)) && dec0.greaterThan(0) ? false : true
        } else { // no tokens hidden
            // we check both of tokens
            disabled = dec0.lessThanOrEqualTo(new Decimal(token0Balance)) && dec0.greaterThan(0) && dec1.lessThanOrEqualTo(new Decimal(token1Balance)) && dec1.greaterThan(0)? false : true
        }
        return disabled
    }

    const handleIncreaseLiquidity = async () => {
        try {
            const poolAddress = await getPoolAddress(dexPosition.token0.address, dexPosition.token1.address, curPoolInfo.fee)
            const latestPoolInfo = await getLatestPoolInfo(poolAddress)
            if (!latestPoolInfo) {
                console.log('no latest poolInfo found')
                return // it shouldn't happen after we move websocket to backend
            } 
            const isStale = isDataStale(curPoolInfo, latestPoolInfo, slipage/100)
            console.log('[IncreaseLiquidity] isStale=', isStale)
            if (isStale) {
                setShowDialog(true)
            } else {
                updateCallData()
                setExecuted(true)
            }
        } catch (error) {
            toast.error('Failed to add liquidity. Please try again')
            console.log('Failed to add liquidity due to:', error)
        }
         
    }

    const createPoistionFromToken0 = (value: string) => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(dexPosition.token0.chainId, dexPosition.token0.address, dexPosition.token0.decimal, dexPosition.token0.symbol, dexPosition.token0.name),
            new Token(dexPosition.token1.chainId, dexPosition.token1.address, dexPosition.token1.decimal, dexPosition.token1.symbol, dexPosition.token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96,
            curPoolInfo.liquidity,
            curPoolInfo.tick
        )
        const position = Position.fromAmount0({
            pool: configuredPool,
            tickLower: dexPosition.lowerTick,
            tickUpper: dexPosition.upperTick,
            amount0: fromReadableAmount2(value, dexPosition.token0.decimal),
            useFullPrecision: true,
        })

        return position
    }

    const createPoistionFromToken1 = (value: string) => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(dexPosition.token0.chainId, dexPosition.token0.address, dexPosition.token0.decimal, dexPosition.token0.symbol, dexPosition.token0.name),
            new Token(dexPosition.token1.chainId, dexPosition.token1.address, dexPosition.token1.decimal, dexPosition.token1.symbol, dexPosition.token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96,
            curPoolInfo.liquidity,
            curPoolInfo.tick
        )
        const position = Position.fromAmount1({
            pool: configuredPool,
            tickLower: dexPosition.lowerTick,
            tickUpper: dexPosition.upperTick,
            amount1: fromReadableAmount2(value, dexPosition.token1.decimal)
        })

        return position
    }

    const handleIncreaseLiquiditySuccess = (token0Deposited: string, token1Deposited: string, liquidity: string) => {
        setShowSuccess(true)
        setDeposited({token0: token0Deposited, token1: token1Deposited, liquidity: liquidity})
    }

    return (
        <DexModal 
                onClick={closeDexModal} 
                title="Increasing liquidity" 
                other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            {
                showSuccess
                ? <IncreaseLiquiditySuccess positionId={dexPosition.id} token0={dexPosition.token0} token1={dexPosition.token1} 
                    depositedToken0={deposited.token0} depositedToken1={deposited.token1} liquidity={deposited.liquidity}/>
                :   <div>
                        <div className="text-sm"><span className="mr-2">Position ID:</span><span>{dexPosition.id}</span></div>
                        <div>
                            {
                                dexPosition.upperTick > curPoolInfo.tick &&
                                <div>  
                                    <DepositInput 
                                        token={dexPosition.token0} tokenBalance={token0Balance} amount={deposit.amount0}
                                        updateTokenChange={updateToken0Change}/>
                                </div>
                            }
                            {
                                dexPosition.lowerTick < curPoolInfo.tick &&
                                <div>  
                                    <DepositInput 
                                        token={dexPosition.token1} tokenBalance={token1Balance} amount={deposit.amount1}
                                        updateTokenChange={updateToken1Change}/>
                                </div>
                            }
                            <div className='pt-4'>
                                <Button
                                    className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                                    disabled={executed || checkDisabled()}
                                    onClick={handleIncreaseLiquidity}
                                > 
                                <span>Increase Liquidity</span>
                                </Button>
                            </div>
                            <div>
                                {
                                    data && <IncreaseLiquidityExecutor 
                                            data={data}
                                            token0={dexPosition.token0} token1={dexPosition.token1}
                                            token0Input={deposit.amount0} token1Input={deposit.amount1}
                                            handleIncreaseLiquiditySuccess={handleIncreaseLiquiditySuccess}/>
                                }
                            </div>
                        </div>
                        <div>
                            {
                                showDialog && <DexModal title={'Update deposits'} onClick={closeDialog}>
                                                <div className="w-80 text-sm text-zinc-400 text-center">
                                                    <div>
                                                        <span>You have to adjust your inputs based on the latest uniswap pool data otherwise you may fail to increase the liquidity </span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3 my-5">
                                                        <Button className='px-2 py-1 w-20 rounded-full bg-pink-600 hover:bg-pink-700 active:bg-pink-700/80' onClick={updatePooInfo}>OK</Button>
                                                        <Button className="px-2 py-1 w-20 rounded-full bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-600" onClick={closeDialog}>Cancel</Button>
                                                    </div>   
                                                </div>          
                                            </DexModal>
                            }
                        </div>
                    </div>
            } 
        </DexModal>
    )
}

export default IncreaseLiquidity