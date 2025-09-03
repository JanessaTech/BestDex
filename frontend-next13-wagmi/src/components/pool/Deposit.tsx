import type { TokenType } from "@/lib/types";
import { default as DexToken } from "../common/Token";
import { PoolInfo } from "@/hooks/usePoolHook";
import { 
    FeeAmount,
    Position,
    Pool} from '@uniswap/v3-sdk'
import {Token} from '@uniswap/sdk-core'
import { fromReadableAmount } from "@/lib/utils";
import { Decimal } from 'decimal.js'
import { useState } from "react";


type DepositProps = {
    token0: TokenType;
    token1: TokenType;
    amount0: string,
    amount1: string;
    poolInfo: PoolInfo; 
    lowerTick: number;
    upperTick: number;
    depositVisible: {token0: boolean, token1: boolean};
    handleDepositChanges: (amount0 : string, amount1: string) => void
}
const Deposit: React.FC<DepositProps> = ({amount0, amount1, token0, token1, 
                                        poolInfo, lowerTick, upperTick, depositVisible,
                                        handleDepositChanges}) => {

    const [burnAmount, setBurnAmount] = useState<{token0: string, token1: string}>({token0: '0', token1: '0'})


    console.log('[Deposit] lowerTick=', lowerTick, 'upperTick=', upperTick)

    const updateToken0Change = (value: string) => {
        if (!poolInfo) return
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
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        console.log('value=', value)
        setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
        handleDepositChanges(value, burnAmount1)
    }

    const updateToken1Change = (value: string) => {
        if (!poolInfo) return
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
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        setBurnAmount({token0: position.amount0.quotient.toString(), token1: position.amount1.quotient.toString()})
        handleDepositChanges(burnAmount0, value)
    }

    return (
        <div className="py-5">
            <div className="pb-2">Deposit tokens</div>
            {
                depositVisible.token0 &&
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
                        <div className="text-xs text-zinc-400">$0</div>
                    </div>
                    <DexToken token={token0} imageSize={30}/>
                </div>
            }
            {
                depositVisible.token1 &&
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
                        <div className="text-xs text-zinc-400">$0</div>
                    </div>
                    <DexToken token={token1} imageSize={30}/>
                </div>
            }
        </div>
    )
}

export default Deposit