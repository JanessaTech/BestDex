import { useEffect, useState } from "react"
import DexModal from "../common/DexModal"
import Setting from "../common/Setting"
import { useUpdateSetting } from "@/config/store"
import DepositInput from "./DepositInput"
import { MintPositionParamsType, TokenType } from "@/lib/types"
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
import { useAccount} from 'wagmi'
import {decodeFunctionData} from 'viem'
import { UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"

const parseCalldata = (calldata: `0x${string}`) => {
    try {
        console.log('calldata:', calldata)
        const decoded = decodeFunctionData({
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            data: calldata
        })
        console.log('decoded', decoded)
        const name = decoded['functionName']
        // const args = decoded['args'][0] as MintPositionParamsType
        // console.log('name=', name)
        // console.log('args=', args)
      
        //return  args
    } catch (error) {
        console.log('Failed to parse calldata due to:', error)
    }
}

type IncreaseLiquidityProps = {
    token0: TokenType;
    token1: TokenType;
    token0Balance: string;
    token1Balance: string;
    poolInfo: PoolInfo;
    positionId: number;
    lowerTick: number;
    upperTick: number;
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({token0, token1, token0Balance, token1Balance,
                                                              poolInfo, positionId, lowerTick, upperTick,
                                                              closeDexModal}) => {

    const { address} = useAccount()   
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const [deposit, setDeposit] = useState({amount0: '0', amount1: '0'})
    const [curPoolInfo, setCurPoolInfo] = useState(poolInfo)
    const [whoInput, setWhoInput] = useState(0)
    const [data, setData] = useState<{calldata: string, parsedCalldata: MintPositionParamsType}>()
    const [showSuccess, setShowSuccess] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [deposited, setDeposited] = useState<{token0: string, token1: string}>({token0: '', token1: ''})
    const {getPoolAddress, getLatestPoolInfo} = useContextUtil() as IContextUtil

    useEffect(() => {
        console.log('[IncreaseLiquidity] curPoolInfo=', curPoolInfo)
        console.log('[IncreaseLiquidity] positionId=', positionId, ' lowerTick=', lowerTick, ' curTick=', curPoolInfo.tick, ' upperTick=', upperTick)
        updateDeposit()
        setShowDialog(false)
    }, [curPoolInfo])

    const updatePooInfo = async () => {
        console.log('[IncreaseLiquidity] updatePooInfo')
        const poolAddress = await getPoolAddress(token0.address, token1.address, curPoolInfo.fee)
        const latestPoolInfo = await getLatestPoolInfo(poolAddress)
        if (!latestPoolInfo) return // it shouldn't happen after we move websocket to backend
        setCurPoolInfo(latestPoolInfo)
    }

    const updateDeposit = async () => {
        if (upperTick <= curPoolInfo.tick ) {
            console.log('token0 is hidden')
            handleDepositChanges('0', '0')
        } else if (lowerTick >=  curPoolInfo.tick) {
            console.log('token1 is hidden')
            handleDepositChanges('0', '0')
        } else {
            console.log('no tokens is hidden')
            if (whoInput === 0) {
                const position = createPoistionFromToken0(deposit.amount0)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(deposit.amount0, burnAmount1)
            } else if (whoInput === 1) {
                const position = createPoistionFromToken1(deposit.amount1)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(burnAmount0, deposit.amount1)
            }
        }
    }

    const checkRefresh = async () => {
        const poolAddress = await getPoolAddress(token0.address, token1.address, curPoolInfo.fee)
        const latestPoolInfo = await getLatestPoolInfo(poolAddress)
        if (!latestPoolInfo) return // it shouldn't happen after we move websocket to backend
        const isStale = isDataStale(curPoolInfo, latestPoolInfo, slipage/100)
        console.log('[IncreaseLiquidity] isStale=', isStale)
        if (isStale) {
            setShowDialog(true)
        } else {
            updateCallData()
        }
    }

    const closeDialog = () => {
        setShowDialog(false)
    }

    const updateCallData = () => {
        try {
            const callData = generateCallData()
            console.log('callData=', callData)
            // const parsedCalldata = parseCalldata(callData as `0x${string}`)
            // console.log('parsedCalldata=', parsedCalldata)
            // if (!parsedCalldata) {
            //     throw new Error('Failed to parse calldata')
            // }
            // setData({calldata: callData, parsedCalldata: parsedCalldata})
        } catch (error) {
            console.log('We failed to get calldata or parse calldata:', error)
            toast.error('There is something wrong. Please try again')
        }
    }

    const generateCallData = () => {
        const positionToIncrease = constructPosition()
        const mintOptions: AddLiquidityOptions = {
            tokenId: positionId,
            deadline: Math.floor(Date.now() / 1000) + (deadline === '' ? 1800 : deadline * 60),
            slippageTolerance: new Percent(slipage * 100, 10_000),
        }
        const { calldata } = NonfungiblePositionManager.addCallParameters(
            positionToIncrease,
            mintOptions
        )
        return calldata
    }

    const constructPosition = () => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96.toString(),
            curPoolInfo.liquidity.toString(),
            curPoolInfo.tick
        )

        let position = undefined
        if (upperTick <= curPoolInfo.tick) { // token0 is hidden
            position = Position.fromAmount1({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount1: fromReadableAmount2(deposit.amount1, token1.decimal)
            })
            console.log('[IncreaseLiquidity] token0 is hidden')
        } else if (lowerTick >= curPoolInfo.tick) { // token1 is hidden
            position = Position.fromAmount0({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount0: fromReadableAmount2(deposit.amount0, token0.decimal),
                useFullPrecision: true,
            })
            console.log('[IncreaseLiquidity] token1 is hidden')
        } else {
            // no tokens hidden
            position = Position.fromAmounts({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount0: fromReadableAmount2(deposit.amount0, token0.decimal),
                amount1: fromReadableAmount2(deposit.amount1, token1.decimal),
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
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        console.log('value=', value)
        handleDepositChanges(value, burnAmount1)
        setWhoInput(0)
    }

    const updateToken1Change = (value: string) => {
        const position = createPoistionFromToken1(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        handleDepositChanges(burnAmount0, value)
        setWhoInput(1)
    }

    const checkDisabled = () => {
        let disabled = true
        const dec0 = new Decimal(deposit.amount0 ? deposit.amount0 : '0')
        const dec1 = new Decimal(deposit.amount1 ? deposit.amount1 : '0')
        if (upperTick <= curPoolInfo.tick) { // token0 is hidden
            //we check token1 only
            disabled = dec1.lessThanOrEqualTo(new Decimal(token1Balance)) && dec1.greaterThan(0) ? false : true
        } else if (lowerTick >= curPoolInfo.tick) { // token1 is hidden
            //we check token0 only
            disabled = dec0.lessThanOrEqualTo(new Decimal(token0Balance)) && dec0.greaterThan(0) ? false : true
        } else { // no tokens hidden
            // we check both of tokens
            disabled = dec0.lessThanOrEqualTo(new Decimal(token0Balance)) && dec0.greaterThan(0) && dec1.lessThanOrEqualTo(new Decimal(token1Balance)) && dec1.greaterThan(0)? false : true
        }
        return disabled
    }

    const handleIncreaseLiquidity = async () => {
        await checkRefresh()
    }

    const createPoistionFromToken0 = (value: string) => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96.toString(),
            curPoolInfo.liquidity.toString(),
            curPoolInfo.tick
        )
        const position = Position.fromAmount0({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount0: fromReadableAmount2(value, token0.decimal),
            useFullPrecision: true,
        })

        return position
    }

    const createPoistionFromToken1 = (value: string) => {
        const feeAmount_enum = curPoolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            curPoolInfo.sqrtPriceX96.toString(),
            curPoolInfo.liquidity.toString(),
            curPoolInfo.tick
        )
        const position = Position.fromAmount1({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount1: fromReadableAmount2(value, token1.decimal)
        })

        return position
    }

    const handleAddSuccess = (token0Deposited: string, token1Deposited: string) => {
        setShowSuccess(true)
        setDeposited({token0: token0Deposited, token1: token1Deposited})
    }

    return (
        <DexModal 
                onClick={closeDexModal} 
                title="Increasing liquidity" 
                other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            <div>
                <div className="text-sm"><span className="mr-2">Position ID:</span><span>{positionId}</span></div>
                <div>
                    <div>  
                        <DepositInput 
                            token={token0} tokenBalance={token0Balance} amount={deposit.amount0}
                            updateTokenChange={updateToken0Change}/>
                    </div>
                    <div>  
                        <DepositInput 
                            token={token1} tokenBalance={token1Balance} amount={deposit.amount1}
                            updateTokenChange={updateToken1Change}/>
                    </div>
                    <div className='pt-4'>
                        <Button
                            className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                            disabled={checkDisabled()}
                            onClick={handleIncreaseLiquidity}
                        > 
                        <span>Increase Liquidity</span>
                        </Button>
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
        </DexModal>
    )
}

export default IncreaseLiquidity