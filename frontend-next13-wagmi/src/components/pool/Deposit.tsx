import type { TokenType, LocalChainIds } from "@/lib/types";
import { default as DexToken } from "../common/Token";
import { 
    FeeAmount,
    Position,
    Pool} from '@uniswap/v3-sdk'
import {Token} from '@uniswap/sdk-core'
import { fromReadableAmount } from "@/lib/utils";
import { Decimal } from 'decimal.js'
import { useEffect, useState } from "react";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import { PoolInfo } from "@/lib/tools/pool";


type DepositProps = {
    token0: TokenType;
    token1: TokenType;
    amount0: string,
    amount1: string;
    poolInfo: PoolInfo; 
    lowerTick: number;
    curTick: number;
    upperTick: number;
    handleDepositChanges: (amount0 : string, amount1: string) => void
}
const Deposit: React.FC<DepositProps> = ({amount0, amount1, token0, token1, 
                                        poolInfo, lowerTick, curTick, upperTick,
                                        handleDepositChanges}) => {

    const [burnAmount, setBurnAmount] = useState<{token0: string, token1: string}>({token0: '0', token1: '0'})
    const [tokensUSD, setTokensUSD] = useState<{token0: string, token1: string}>({token0: '0', token1: '0'})
    const [whoInput, setWhoInput] = useState(0) // indicate which token is as the major input: 0 for token0, 1 for token1

    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)

    useEffect(() => {
        console.log('[Deposit] lowerTick=', lowerTick, 'curTick=', curTick, 'upperTick=', upperTick)
        if (!poolInfo) return
        if (upperTick <= curTick) {
            console.log('token0 is hidden')
            handleDepositChanges('0', '0')
            setBurnAmount({token0: '0', token1: '0'})
        } else if (lowerTick >= curTick) {
            console.log('token1 is hidden')
            handleDepositChanges('0', '0')
            setBurnAmount({token0: '0', token1: '0'})
        } else {
            console.log('no tokens is hidden')
            if (whoInput === 0 && amount0) {
                const position = createPoistionFromToken0(amount0)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
                handleDepositChanges(amount0, burnAmount1)
            } else if (whoInput === 1 && amount1) {
                const position = createPoistionFromToken1(amount1)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
                handleDepositChanges(burnAmount0, amount1)
            }
        }
    }, [lowerTick, upperTick])

    useEffect(() => {
        console.log('update usd')
        updateUSD()
    }, [amount0, amount1])
    
    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price0 = tokenPrices[targetChainId]?.get(token0.address)
        const price1 = tokenPrices[targetChainId]?.get(token1.address)
        let token0USD = '0'
        let token1USD = '0'
        console.log('price0=', price0, 'price1=', price1, '  amount0=', amount0, ' amount1=',amount1)
        if (price0) {
            token0USD = new Decimal(price0).times(amount0 ? new Decimal(amount0) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        if (price1) {
            token1USD = new Decimal(price1).times(amount1 ? new Decimal(amount1) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        setTokensUSD({token0: token0USD, token1: token1USD})
    }

    const createPoistionFromToken0 = (value: string) => {
        const feeAmount_enum = Object.values(FeeAmount).includes(poolInfo.fee) ? poolInfo.fee as FeeAmount : FeeAmount.MEDIUM
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            poolInfo.sqrtPriceX96.toString(),
            poolInfo.liquidity.toString(),
            poolInfo.tick
        )
        const position = Position.fromAmount0({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount0: fromReadableAmount(Number(value), token0.decimal),
            useFullPrecision: true,
        })

        return position
    }

    const createPoistionFromToken1 = (value: string) => {
        const feeAmount_enum = Object.values(FeeAmount).includes(poolInfo.fee) ? poolInfo.fee as FeeAmount : FeeAmount.MEDIUM
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            poolInfo.sqrtPriceX96.toString(),
            poolInfo.liquidity.toString(),
            poolInfo.tick
        )
        const position = Position.fromAmount1({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount1: fromReadableAmount(Number(value), token1.decimal)
        })

        return position
    }

    const updateToken0Change = (value: string) => {
        if (!poolInfo) return
        const position = createPoistionFromToken0(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        console.log('value=', value)
        setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
        handleDepositChanges(value, burnAmount1)
        setWhoInput(0)
    }

    const updateToken1Change = (value: string) => {
        if (!poolInfo) return
        const position = createPoistionFromToken1(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
        handleDepositChanges(burnAmount0, value)
        setWhoInput(1)
    }

    return (
        <div className="py-5">
            <div className="pb-2">Deposit tokens</div>
            {
                upperTick > curTick &&
                <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center my-2">
                    <div className="grow basis-10">
                        <input 
                            type="text" 
                            className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                            value={amount0}
                            onChange={(e) => updateToken0Change(e.target.value)}
                            onKeyDown={(event) => {
                                const regex1 = new RegExp(`^[1-9]\\d{0,14}\\.\\d{0,${token0.decimal - 1}}$`);
                                const regex2 = new RegExp(`^0\\.\\d{0,${token0.decimal - 1}}$`);
                                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                            || (amount0 === '' && event?.key >= '0' && event?.key <= '9')
                                            || (amount0 === '0' && event?.key === '.')
                                            || (/^[1-9]\d{0,13}$/.test(amount0) && event?.key >= '0' && event?.key <= '9')
                                            || (/^[1-9]\d{0,14}$/.test(amount0) && event?.key === '.')
                                            || (regex1.test(amount0) && event?.key >= '0' && event?.key <= '9') //(/^[1-9]\d{0,14}\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                            || (regex2.test(amount0) && event?.key >= '0' && event?.key <= '9')  //(/^0\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                if (!allow) {
                                    event.preventDefault(); 
                                }
                            }}
                        />
                        <div className="text-xs text-zinc-400">${tokensUSD.token0}</div>
                    </div>
                    <DexToken token={token0} imageSize={30}/>
                </div>
            }
            {
                lowerTick < curTick &&
                <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center">
                    <div className="grow basis-10">
                        <input 
                            type="text" 
                            className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                            value={amount1}
                            onChange={(e) => updateToken1Change(e.target.value)}
                            onKeyDown={(event) => {

                                const regex1 = new RegExp(`^[1-9]\\d{0,14}\\.\\d{0,${token1.decimal - 1}}$`);
                                const regex2 = new RegExp(`^0\\.\\d{0,${token1.decimal - 1}}$`);
                                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                            || (amount1 === '' && event?.key >= '0' && event?.key <= '9')
                                            || (amount1 === '0' && event?.key === '.')
                                            || (/^[1-9]\d{0,13}$/.test(amount1) && event?.key >= '0' && event?.key <= '9')
                                            || (/^[1-9]\d{0,14}$/.test(amount1) && event?.key === '.')
                                            || (regex1.test(amount1) && event?.key >= '0' && event?.key <= '9') //(/^[1-9]\d{0,14}\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                            || (regex2.test(amount1) && event?.key >= '0' && event?.key <= '9')  //(/^0\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                if (!allow) {
                                    event.preventDefault(); 
                                }
                            }}
                        />
                        <div className="text-xs text-zinc-400">${tokensUSD.token1}</div>
                    </div>
                    <DexToken token={token1} imageSize={30}/>
                </div>
            }
        </div>
    )
}

export default Deposit