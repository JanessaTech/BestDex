import { useEffect, useState } from "react"
import DexModal from "../common/DexModal"
import Setting from "../common/Setting"
import { useUpdateSetting } from "@/config/store"
import DepositInput from "./DepositInput"
import { MintPositionParamsType, TokenType } from "@/lib/types"
import { Button } from "../ui/button"
import { PoolInfo } from "@/lib/tools/pool"
import { 
    FeeAmount,
    Position,
    MintOptions,
    NonfungiblePositionManager,
    Pool} from '@uniswap/v3-sdk';
import {Token, Percent} from '@uniswap/sdk-core';
import { toast } from "sonner"
import { fromReadableAmount2 } from "@/lib/utils"
import { Decimal } from 'decimal.js'
import { useAccount} from 'wagmi'
import {decodeFunctionData} from 'viem'
import { UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"

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

type IncreaseLiquidityProps = {
    token0: TokenType;
    token1: TokenType;
    token0Balance: string;
    token1Balance: string;
    poolInfo: PoolInfo;
    lowerTick: number;
    upperTick: number;
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({token0, token1, token0Balance, token1Balance,
                                                              poolInfo, lowerTick, upperTick,
                                                              closeDexModal}) => {
    
    const { address} = useAccount()                                                         
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const [deposit, setDeposit] = useState({amount0: '0', amount1: '0'})
    const [whoInput, setWhoInput] = useState(0)
    const [data, setData] = useState<{calldata: string, parsedCalldata: MintPositionParamsType}>()
    const [showSuccess, setShowSuccess] = useState(false)
    const [deposited, setDeposited] = useState<{token0: string, token1: string}>({token0: '', token1: ''})

    useEffect(() => {
        updateCallData()
    }, [])

    const updateCallData = () => {
        try {
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
        if (upperTick <= poolInfo.tick) { // token0 is hidden
            position = Position.fromAmount1({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount1: fromReadableAmount2(deposit.amount1, token1.decimal)
            })
            const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
            const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
            console.log('[token0 is hidden] burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        } else if (lowerTick >= poolInfo.tick) { // token1 is hidden
            position = Position.fromAmount0({
                pool: configuredPool,
                tickLower: lowerTick,
                tickUpper: upperTick,
                amount0: fromReadableAmount2(deposit.amount0, token0.decimal),
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
                amount0: fromReadableAmount2(deposit.amount0, token0.decimal),
                amount1: fromReadableAmount2(deposit.amount1, token1.decimal),
                useFullPrecision: true,
            })
            const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
            const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
            console.log('[no tokens hidden]burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        }
        return position 
    }

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }

    const handleDepositChanges = (amount0: string, amount1: string) => {
        setDeposit({...deposit, amount0: amount0, amount1: amount1})
    }

    const updateToken0Change = (value: string) => {
        handleDepositChanges(value, '')
        setWhoInput(0)
    }

    const updateToken1Change = (value: string) => {
        handleDepositChanges('', value)
        setWhoInput(1)
    }

    const checkDisabled = () => {
        return false
    }

    const handleIncreaseLiquidity = () => {

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
                <div className="text-sm"><span className="mr-2">Position ID:</span><span>123456</span></div>
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
            </div>
        </DexModal>
    )
}

export default IncreaseLiquidity